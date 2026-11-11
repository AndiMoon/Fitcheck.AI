import React from 'react';
import { DailyChallenge, ClosetItem } from '../types';
import { Sparkles, Flame, CheckCircle2, ArrowRight } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface DailyChallengeBannerProps {
  challenge: DailyChallenge;
  isCompleted: boolean;
  streakCount: number;
  closetItems: ClosetItem[];
  onAcceptChallenge: () => void;
  onOpenClosetFilter?: (category: string) => void;
}

export const DailyChallengeBanner: React.FC<DailyChallengeBannerProps> = ({
  challenge,
  isCompleted,
  streakCount,
  closetItems,
  onAcceptChallenge,
}) => {
  // Check if user owns a matching piece
  const matchingCount = closetItems.filter((item) => {
    const nameLower = item.name.toLowerCase();
    const challengeGarmentLower = challenge.garmentType.toLowerCase();
    const categoryMatches = item.category === challenge.suggestedClosetCategory;
    return categoryMatches || nameLower.includes(challengeGarmentLower.split(' ')[0]);
  }).length;

  // 1 short sentence max
  const shortPrompt = challenge.stylingPrompt.split('.')[0] + '.';

  return (
    <div className="relative mb-6 rounded-2xl overflow-hidden bg-neutral-900/80 border border-neutral-800 shadow-lg backdrop-blur-sm">
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Punchy info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] font-bold">
              🎯 Daily Drop
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-bold font-mono">
              <Flame className="w-3 h-3 fill-amber-400" />
              {streakCount}d
            </span>
            {isCompleted && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[11px] font-bold">
                <CheckCircle2 className="w-3 h-3" />
                Done
              </span>
            )}
            {matchingCount > 0 && (
              <span className="text-[11px] text-emerald-400 font-medium">
                ✨ {matchingCount} in your closet
              </span>
            )}
          </div>

          <h2 className="text-lg sm:text-xl font-black text-white font-display tracking-tight flex items-center gap-2 flex-wrap">
            <span>Style:</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300">
              {challenge.garmentType}
            </span>
            <span className="text-xs font-normal text-neutral-400">
              ({challenge.aestheticTarget})
            </span>
          </h2>

          <p className="mt-1 text-xs text-neutral-400 line-clamp-1 sm:line-clamp-none">
            {shortPrompt}
          </p>
        </div>

        {/* Right: Clean Action Button */}
        <div className="shrink-0">
          <button
            onClick={() => {
              triggerHaptic('medium');
              onAcceptChallenge();
            }}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
              isCompleted
                ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white shadow-rose-500/25'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isCompleted ? 'Style Again' : 'Style This'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
