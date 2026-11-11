import React from 'react';
import { FitCheckResult } from '../types';
import { Calendar, Flame, Sparkles, TrendingUp, ArrowRight, Eye, Trash2 } from 'lucide-react';

interface DailyLogViewProps {
  savedFits: FitCheckResult[];
  onSelectFit: (fit: FitCheckResult) => void;
  onDeleteFit: (id: string) => void;
  onNewScan: () => void;
}

export const DailyLogView: React.FC<DailyLogViewProps> = ({
  savedFits,
  onSelectFit,
  onDeleteFit,
  onNewScan,
}) => {
  const avgScore = savedFits.length > 0
    ? Math.round(savedFits.reduce((acc, f) => acc + f.overallScore, 0) / savedFits.length)
    : 0;

  // Calculate top aesthetic tags across history
  const tagCounts: { [key: string]: number } = {};
  savedFits.forEach((f) => {
    f.aestheticTags.forEach((t) => {
      tagCounts[t.name] = (tagCounts[t.name] || 0) + 1;
    });
  });

  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Daily Fit Progression</span>
          </div>
          <h1 className="text-3xl font-black text-white font-display tracking-tight">
            Daily Fit Tracker & History
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Review your daily outfit ratings, aesthetic evolution, and past 1-Swap recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onNewScan}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-bold text-xs shadow-lg shadow-rose-500/25 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>New Fit Check</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Metric 1 */}
        <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-sm">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium">Logged Fits</span>
            <Calendar className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono tabular-nums">
            {savedFits.length}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Saved outfit analyses</p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-sm">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium">Average Fit Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono tabular-nums">
            {avgScore > 0 ? `${avgScore}/100` : '--'}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Styling consistency index</p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-sm">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium">Top Aesthetic Signatures</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {sortedTags.length > 0 ? (
              sortedTags.map(([tag]) => (
                <span
                  key={tag}
                  className="text-[10px] font-bold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20"
                >
                  #{tag}
                </span>
              ))
            ) : (
              <span className="text-xs text-neutral-500">Log fits to discover your style DNA</span>
            )}
          </div>
        </div>
      </div>

      {/* Daily Challenge Streak Trophies & Milestones */}
      <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                Engagement & Milestones
              </span>
              <span className="text-neutral-600">·</span>
              <span className="text-xs text-neutral-400">Streak Trophies</span>
            </div>
            <h3 className="text-lg font-black text-white font-display mt-0.5">
              Daily Challenge Trophies & Style Badges
            </h3>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-mono text-amber-300">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Active Streak: {savedFits.length > 0 ? '5 Days' : '0 Days'}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-amber-500/30 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-base shrink-0">
              🔥
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">5-Day Streaker</p>
              <p className="text-[10px] text-amber-400 font-mono">Unlocked</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-rose-500/30 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold text-base shrink-0">
              👖
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">Cargo Prodigy</p>
              <p className="text-[10px] text-rose-400 font-mono">Challenge Master</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-pink-500/30 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center font-bold text-base shrink-0">
              👟
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">Chrome Kicks</p>
              <p className="text-[10px] text-pink-400 font-mono">Footwear Drop</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-center gap-3 opacity-60">
            <div className="w-9 h-9 rounded-xl bg-neutral-800 text-neutral-400 flex items-center justify-center font-bold text-base shrink-0">
              👑
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-neutral-400 truncate">7-Day Icon</p>
              <p className="text-[10px] text-neutral-500 font-mono">2 Days to go</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fits Chronological Timeline / Cards */}
      {savedFits.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-neutral-800 p-12 text-center bg-neutral-900/30">
          <Calendar className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Fit Checks Saved Yet</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-4">
            Perform a fit check scan using the mirror orb to save your daily outfits to your timeline.
          </p>
          <button
            onClick={onNewScan}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold border border-neutral-700"
          >
            Start Your First Fit Check
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {savedFits.map((fit) => (
            <div
              key={fit.id}
              className="group p-4 sm:p-5 rounded-3xl bg-neutral-900/70 border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xl"
            >
              {/* Left thumbnail & basic info */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-16 h-20 rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shrink-0 relative">
                  <img
                    src={fit.imageUrl}
                    alt={fit.vibeTitle}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-neutral-500">{fit.timestamp}</span>
                    <span className="text-neutral-700">·</span>
                    <span className="text-xs font-bold text-rose-400 font-display">
                      {fit.verdict}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white truncate font-display">
                    {fit.vibeTitle}
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {fit.aestheticTags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.name}
                        className="text-[9px] font-medium text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-md"
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Score & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-800/80">
                {/* Score Pill */}
                <div className="text-right">
                  <span className="text-2xl font-black font-mono text-white tabular-nums">
                    {fit.overallScore}
                  </span>
                  <span className="text-[10px] text-neutral-500 block font-mono">/ 100</span>
                </div>

                {/* View Details Button */}
                <button
                  onClick={() => onSelectFit(fit)}
                  className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs border border-neutral-700 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-rose-400" />
                  <span>View</span>
                  <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => onDeleteFit(fit.id)}
                  className="p-2 rounded-xl text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                  title="Remove from history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
