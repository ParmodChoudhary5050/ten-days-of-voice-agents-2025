'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Track } from 'livekit-client';
import { AnimatePresence, motion } from 'motion/react';
import {
  type TrackReference,
  VideoTrack,
  useLocalParticipant,
  useTracks,
  useVoiceAssistant,
} from '@livekit/components-react';
import { cn } from '@/lib/utils';

const MotionContainer = motion.create('div');

const ANIMATION_TRANSITION = {
  type: 'spring',
  stiffness: 800,
  damping: 50,
  mass: 1,
};

const classNames = {
  grid: [
    'h-full w-full',
    'grid gap-x-4 place-content-center',
    'grid-cols-[1fr_1fr] grid-rows-[60px_1fr_60px]',
  ],
  agentChatOpenWithSecondTile: ['col-start-1 row-start-1', 'self-center justify-self-end'],
  agentChatOpenWithoutSecondTile: ['col-start-1 row-start-1', 'col-span-2', 'place-content-center'],
  agentChatClosed: ['col-start-1 row-start-1', 'col-span-2 row-span-3', 'place-content-center'],
  secondTileChatOpen: ['col-start-2 row-start-1', 'self-center justify-self-start'],
  secondTileChatClosed: ['col-start-2 row-start-3', 'place-content-end'],
};

export function useLocalTrackRef(source: Track.Source) {
  const { localParticipant } = useLocalParticipant();
  const publication = localParticipant.getTrackPublication(source);
  const trackRef = useMemo<TrackReference | undefined>(
    () => (publication ? { source, participant: localParticipant, publication } : undefined),
    [source, publication, localParticipant]
  );
  return trackRef;
}

/**
 * Custom Visualizer
 * Renders the audio waveform as a continuous line graph with a modern gradient.
 */
const ECGVisualizer = ({
  trackRef,
  className,
}: {
  trackRef?: TrackReference;
  className?: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !trackRef?.publication?.track) return;

    const track = trackRef.publication.track;
    if (!track.mediaStreamTrack) return;

    const stream = new MediaStream([track.mediaStreamTrack]);
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContextClass();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);

    analyser.fftSize = 2048;
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let animationId: number;

    const draw = () => {
      animationId = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(192, 132, 252, 0.5)'; // Purple glow

      // Create Gradient
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, '#c084fc'); // Purple-400
      gradient.addColorStop(0.5, '#e879f9'); // Pink-400
      gradient.addColorStop(1, '#22d3ee'); // Cyan-400
      ctx.strokeStyle = gradient;

      ctx.beginPath();

      const sliceWidth = (width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      source.disconnect();
      analyser.disconnect();
      audioContext.close();
    };
  }, [trackRef]);

  return <canvas ref={canvasRef} className={className} width={300} height={150} />;
};

interface TileLayoutProps {
  chatOpen: boolean;
}

export function TileLayout({ chatOpen }: TileLayoutProps) {
  const {
    state: agentState,
    audioTrack: agentAudioTrack,
    videoTrack: agentVideoTrack,
  } = useVoiceAssistant();
  const [screenShareTrack] = useTracks([Track.Source.ScreenShare]);
  const cameraTrack: TrackReference | undefined = useLocalTrackRef(Track.Source.Camera);

  const isCameraEnabled = cameraTrack && !cameraTrack.publication.isMuted;
  const isScreenShareEnabled = screenShareTrack && !screenShareTrack.publication.isMuted;
  const hasSecondTile = isCameraEnabled || isScreenShareEnabled;

  const animationDelay = chatOpen ? 0 : 0.15;
  const isAvatar = agentVideoTrack !== undefined;
  const videoWidth = agentVideoTrack?.publication.dimensions?.width ?? 0;
  const videoHeight = agentVideoTrack?.publication.dimensions?.height ?? 0;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-8 bottom-32 z-50 md:top-12 md:bottom-40">
      <div className="relative mx-auto h-full max-w-4xl px-4 md:px-0">
        <div className={cn(classNames.grid)}>
          {/* Agent */}
          <div
            className={cn([
              'grid transition-all duration-500 ease-spring',
              !chatOpen && classNames.agentChatClosed,
              chatOpen && hasSecondTile && classNames.agentChatOpenWithSecondTile,
              chatOpen && !hasSecondTile && classNames.agentChatOpenWithoutSecondTile,
            ])}
          >
            <AnimatePresence mode="popLayout">
              {!isAvatar && (
                // Audio Agent
                <MotionContainer
                  key="agent"
                  layoutId="agent"
                  initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: chatOpen ? 1 : 1.2, filter: 'blur(0px)' }}
                  transition={{ ...ANIMATION_TRANSITION, delay: animationDelay }}
                  className={cn(
                    'relative overflow-hidden',
                    // Modern Glassmorphism
                    'bg-white/5 backdrop-blur-2xl',
                    'border border-white/10',
                    'shadow-[0_0_40px_-10px_rgba(124,58,237,0.3)]', // Purple glow
                    chatOpen ? 'h-[80px] w-[80px] rounded-2xl' : 'h-[160px] w-[160px] rounded-3xl'
                  )}
                >
                  {/* Subtle Grid Background */}
                  <div className="absolute inset-0 z-0 opacity-10" style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                  }}></div>

                  {/* Inner Glow */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 pointer-events-none" />

                  <ECGVisualizer
                    trackRef={agentAudioTrack}
                    className="relative z-10 h-full w-full opacity-90"
                  />
                </MotionContainer>
              )}

              {isAvatar && (
                // Avatar Agent
                <MotionContainer
                  key="avatar"
                  layoutId="avatar"
                  initial={{
                    scale: 1,
                    opacity: 1,
                    maskImage: 'radial-gradient(circle, black 0%, transparent 0%)',
                  }}
                  animate={{
                    maskImage: chatOpen
                      ? 'radial-gradient(circle, black 100%, transparent 100%)'
                      : 'radial-gradient(circle, black 60%, transparent 70%)',
                    borderRadius: chatOpen ? 16 : 24,
                  }}
                  transition={{
                    ...ANIMATION_TRANSITION,
                    delay: animationDelay,
                    maskImage: { duration: 0.8 },
                  }}
                  className={cn(
                    'relative overflow-hidden bg-black/50 backdrop-blur-md',
                    'border border-white/10 shadow-[0_0_30px_-5px_rgba(0,0,0,0.5)]',
                    chatOpen
                      ? 'h-[80px] w-[80px]'
                      : 'h-auto w-full max-w-[500px] aspect-video'
                  )}
                >
                  <VideoTrack
                    width={videoWidth}
                    height={videoHeight}
                    trackRef={agentVideoTrack}
                    className={cn(
                      'h-full w-full object-cover opacity-100',
                      chatOpen ? 'scale-110' : 'scale-100'
                    )}
                  />
                </MotionContainer>
              )}
            </AnimatePresence>
          </div>

          <div
            className={cn([
              'grid transition-all duration-500',
              chatOpen && classNames.secondTileChatOpen,
              !chatOpen && classNames.secondTileChatClosed,
            ])}
          >
            {/* Camera & Screen Share */}
            <AnimatePresence>
              {(cameraTrack && isCameraEnabled || screenShareTrack && isScreenShareEnabled) && (
                <MotionContainer
                  key="camera"
                  layout="position"
                  layoutId="camera"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  transition={{ ...ANIMATION_TRANSITION, delay: animationDelay }}
                  className={cn(
                    'relative overflow-hidden',
                    'shadow-2xl shadow-black/50',
                    'border border-white/10 bg-white/5 backdrop-blur-xl',
                    'h-[80px] w-[80px] rounded-2xl'
                  )}
                >
                  <VideoTrack
                    trackRef={cameraTrack || screenShareTrack}
                    width={(cameraTrack || screenShareTrack)?.publication.dimensions?.width ?? 0}
                    height={(cameraTrack || screenShareTrack)?.publication.dimensions?.height ?? 0}
                    className="h-full w-full object-cover opacity-90"
                  />
                  {/* Status Indicator */}
                  <div className="absolute bottom-2 right-2 h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                </MotionContainer>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
