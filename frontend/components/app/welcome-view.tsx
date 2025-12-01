import React, { useState, useEffect } from 'react';
import { Button } from '@/components/livekit/button';

function WelcomeImage() {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white mb-6 size-20 relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
      >
        <path
          d="M15 24V40C15 40.7957 14.6839 41.5587 14.1213 42.1213C13.5587 42.6839 12.7956 43 12 43C11.2044 43 10.4413 42.6839 9.87868 42.1213C9.31607 41.5587 9 40.7957 9 40V24C9 23.2044 9.31607 22.4413 9.87868 21.8787C10.4413 21.3161 11.2044 21 12 21C12.7956 21 13.5587 21.3161 14.1213 21.8787C14.6839 22.4413 15 23.2044 15 24ZM22 5C21.2044 5 20.4413 5.31607 19.8787 5.87868C19.3161 6.44129 19 7.20435 19 8V56C19 56.7957 19.3161 57.5587 19.8787 58.1213C20.4413 58.6839 21.2044 59 22 59C22.7956 59 23.5587 58.6839 24.1213 58.1213C24.6839 57.5587 25 56.7957 25 56V8C25 7.20435 24.6839 6.44129 24.1213 5.87868C23.5587 5.31607 22.7956 5 22 5ZM32 13C31.2044 13 30.4413 13.3161 29.8787 13.8787C29.3161 14.4413 29 15.2044 29 16V48C29 48.7957 29.3161 49.5587 29.8787 50.1213C30.4413 50.6839 31.2044 51 32 51C32.7956 51 33.5587 50.6839 34.1213 50.1213C34.6839 49.5587 35 48.7957 35 48V16C35 15.2044 34.6839 14.4413 34.1213 13.8787C33.5587 13.3161 32.7956 13 32 13ZM42 21C41.2043 21 40.4413 21.3161 39.8787 21.8787C39.3161 22.4413 39 23.2044 39 24V40C39 40.7957 39.3161 41.5587 39.8787 42.1213C40.4413 42.6839 41.2043 43 42 43C42.7957 43 43.5587 42.6839 44.1213 42.1213C44.6839 41.5587 45 40.7957 45 40V24C45 23.2044 44.6839 22.4413 44.1213 21.8787C43.5587 21.3161 42.7957 21 42 21ZM52 17C51.2043 17 50.4413 17.3161 49.8787 17.8787C49.3161 18.4413 49 19.2044 49 20V44C49 44.7957 49.3161 45.5587 49.8787 46.1213C50.4413 46.6839 51.2043 47 52 47C52.7957 47 53.5587 46.6839 54.1213 46.1213C54.6839 45.5587 55 44.7957 55 44V20C55 19.2044 54.6839 18.4413 54.1213 17.8787C53.5587 17.3161 52.7957 17 52 17Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

export const WelcomeView = React.forwardRef<HTMLDivElement, any>(
  ({ startButtonText, onStartCall }, ref) => {
    const [name, setName] = useState('');
    const [started, setStarted] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    async function handleStart() {
      setStarted(true);
      onStartCall?.(name.trim());
    }

    return (
      <div
        ref={ref}
        className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center md:justify-between px-4 md:px-12 lg:px-24
        bg-transparent text-white overflow-hidden relative"
      >
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -translate-x-1/4 translate-y-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Left Section: Branding */}
        <div className={`
          flex flex-col items-center md:items-start text-center md:text-left z-10 mb-12 md:mb-0
          transition-all duration-1000 ease-out transform
          ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}
        `}>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
              Voice Improv
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 drop-shadow-[0_0_30px_rgba(236,72,153,0.5)]">
              Battle
            </span>
          </h1>

          <div className="relative inline-block group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative px-6 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2">
              <span className="text-xs md:text-sm font-medium text-white/60 uppercase tracking-widest">
                Created by
              </span>
              <span className="text-sm md:text-base font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
                Parmod Choudhary
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Interaction Card */}
        {!started && (
          <section
            className={`
              relative flex flex-col items-center text-center p-10 
              bg-black/30 backdrop-blur-2xl
              rounded-3xl overflow-hidden
              border border-white/10
              shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]
              w-full max-w-sm
              transition-all duration-700 delay-300 ease-out transform
              ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
            `}
          >
            {/* Top Shine Effect */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <WelcomeImage />

            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight z-10 relative bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
              Ready to Play?
            </h2>
            <p className="text-sm font-medium text-white/60 mb-8 z-10 relative tracking-wide">
              ENTER YOUR NAME TO JOIN THE BATTLE
            </p>

            <div className="w-full z-10 relative space-y-4">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-focus-within:opacity-50 transition duration-500 blur-sm"></div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleStart();
                  }}
                  placeholder="Your Stage Name..."
                  className="relative w-full rounded-xl border border-white/10 px-4 py-4
                  bg-white/5 text-white placeholder:text-white/30 font-medium text-center
                  focus:outline-none focus:bg-white/10
                  transition-all duration-300"
                />
              </div>

              <Button
                variant="primary"
                size="default"
                onClick={handleStart}
                disabled={!name.trim()}
                className="w-full py-6 rounded-xl font-bold uppercase tracking-wider
                bg-gradient-to-r from-purple-600 to-pink-600 
                text-white border-none
                hover:from-purple-500 hover:to-pink-500
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]
                transform hover:scale-[1.02] active:scale-[0.98]
                transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Start Battle</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path fillRule="evenodd" d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </Button>
            </div>

            <div className="mt-6 text-[10px] text-white/30 font-mono uppercase tracking-[0.2em] z-10 relative">
              Press Enter to Start
            </div>
          </section>
        )}

        {started && (
          <div className="flex flex-col items-center justify-center animate-pulse w-full md:w-auto">
            <div className="size-16 rounded-full border-4 border-t-purple-500 border-white/10 animate-spin mb-4" />
            <div className="text-center text-white text-xl font-bold tracking-wider drop-shadow-lg">
              INITIALIZING BATTLE...
            </div>
          </div>
        )}
      </div>
    );
  }
);

WelcomeView.displayName = 'WelcomeView';
