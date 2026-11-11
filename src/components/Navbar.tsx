import React from 'react';
import { ActiveTab } from '../types';
import { Sparkles, Shirt, Calendar, Flame, Camera, TrendingUp, Smartphone } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onNewScan: () => void;
  closetCount: number;
  streakCount: number;
  dailyChallengeGarment?: string;
  isChallengeCompleted?: boolean;
  onOpenDailyChallenge?: () => void;
  canInstall?: boolean;
  onInstall?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onNewScan,
  closetCount,
  streakCount,
  dailyChallengeGarment,
  isChallengeCompleted,
  onOpenDailyChallenge,
  canInstall,
  onInstall,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-neutral-950/85 backdrop-blur-xl border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden shadow-lg shadow-rose-500/20 border border-neutral-800 shrink-0">
            <img src="/app-icon.png" alt="FitCheck" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-black tracking-wider text-white font-display">
              FITCHECK<span className="text-rose-500">.AI</span>
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links / Segmented Control (Desktop / Tablet only) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 p-1 bg-neutral-900/90 border border-neutral-800/80 rounded-xl">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
              activeTab === 'scanner'
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/25'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fit Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab('trending')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
              activeTab === 'trending'
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/25'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Trending</span>
          </button>

          <button
            onClick={() => setActiveTab('closet')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
              activeTab === 'closet'
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/25'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>Digital Closet</span>
            {closetCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-800 text-neutral-300 font-mono">
                {closetCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/25'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Daily Log</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action, Challenge & Streak */}
        <div className="flex items-center gap-2.5 shrink-0">
          {dailyChallengeGarment && (
            <button
              onClick={onOpenDailyChallenge}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                isChallengeCompleted
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/25 text-amber-300'
              }`}
              title="Today's Garment Challenge"
            >
              <span>{isChallengeCompleted ? '✓' : '🎯'}</span>
              <span className="truncate max-w-[120px]">{dailyChallengeGarment.split(' ')[0]} Drop</span>
            </button>
          )}

          {canInstall && onInstall && (
            <button
              onClick={onInstall}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all active:scale-95"
              title="Install FitCheck on Android"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install Android</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-medium text-amber-300">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-mono font-bold">{streakCount}d</span>
            <span className="text-neutral-400 text-[11px] hidden sm:inline">streak</span>
          </div>

          <button
            onClick={onNewScan}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-colors whitespace-nowrap active:scale-[0.98]"
          >
            <Camera className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">New Fit Check</span>
          </button>
        </div>
      </div>
    </header>
  );
};
