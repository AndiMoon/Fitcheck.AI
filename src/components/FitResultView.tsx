import React, { useState } from 'react';
import { FitCheckResult, ClosetItem } from '../types';
import {
  Sparkles,
  Share2,
  RefreshCw,
  Copy,
  Check,
  Eye,
  EyeOff,
  Flame,
  Shirt,
  Layers,
  Palette,
  Shuffle,
  Smile,
  Star,
  Heart,
  BookmarkCheck,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { triggerHaptic } from '../utils/haptics';

interface FitResultViewProps {
  result: FitCheckResult;
  onNewScan: () => void;
  onOpenShareModal: () => void;
  onSaveToLog: () => void;
  isSaved: boolean;
  closetItems: ClosetItem[];
}

type PrivacyFilter = 'none' | 'blur' | 'smiley' | 'star' | 'heart';

export const FitResultView: React.FC<FitResultViewProps> = ({
  result,
  onNewScan,
  onOpenShareModal,
  onSaveToLog,
  isSaved,
  closetItems,
}) => {
  const [privacyFilter, setPrivacyFilter] = useState<PrivacyFilter>('none');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [activePin, setActivePin] = useState<string | null>(null);
  const [simulatedSwapApplied, setSimulatedSwapApplied] = useState<boolean>(false);

  // Trigger celebratory confetti on high scores (>= 88)
  React.useEffect(() => {
    if (result.overallScore >= 88) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#f59e0b', '#3b82f6'],
      });
    }
  }, [result.overallScore]);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-rose-400 stroke-rose-500';
    if (score >= 80) return 'text-amber-400 stroke-amber-500';
    if (score >= 70) return 'text-emerald-400 stroke-emerald-500';
    return 'text-sky-400 stroke-sky-500';
  };

  // Virtual Swap Simulation
  const effectiveShoes = simulatedSwapApplied && result.oneSwapRule.action === 'swap'
    ? {
        name: result.oneSwapRule.suggestedPiece,
        detail: 'Virtually swapped in from One Swap recommendation',
        color: 'Upgraded Metallic / Accent',
      }
    : result.outfitBreakdown.shoes;

  const effectiveScore = simulatedSwapApplied ? Math.min(100, result.overallScore + 4) : result.overallScore;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-400">
            {result.timestamp}
          </div>
          {result.userNote && (
            <span className="text-xs text-neutral-300 italic">
              "{result.userNote}"
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              triggerHaptic('success');
              onSaveToLog();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
              isSaved
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>{isSaved ? 'Saved to Fit Log' : 'Save Fit'}</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('light');
              onOpenShareModal();
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white shadow-md shadow-rose-500/20 transition-all active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Story Card (TikTok/IG)</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('light');
              onNewScan();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-all active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Fit</span>
          </button>
        </div>
      </div>

      {/* Daily Challenge Bonus Achievement Callout */}
      {result.completedChallenge && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-rose-500/15 to-neutral-900 border border-amber-500/40 flex items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-bold shadow-lg shadow-amber-400/30">
              <Flame className="w-5 h-5 fill-neutral-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                  Daily Challenge Cleared! 🔥
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30 font-bold">
                  +1 Streak Bonus
                </span>
              </div>
              <p className="text-xs font-bold text-white mt-0.5">
                Successfully styled today's drop: {result.completedChallenge.garmentType}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenShareModal}
            className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold transition-all shadow-md shrink-0"
          >
            Share Trophy Card
          </button>
        </div>
      )}

      {/* Main Grid: Visual Outfit Mirror & Comprehensive AI Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Mirror Selfie with Interactive Overlays & Privacy Blur (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl">
            <img
              src={result.imageUrl}
              alt="Outfit mirror selfie"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />

            {/* Privacy Face Blur / Sticker Overlays */}
            {privacyFilter === 'blur' && (
              <div
                className="absolute top-[8%] left-[40%] w-[20%] aspect-square rounded-full backdrop-blur-2xl bg-white/10 border border-white/20 shadow-lg pointer-events-none"
                style={{ backdropFilter: 'blur(28px)' }}
              />
            )}

            {privacyFilter === 'smiley' && (
              <div className="absolute top-[8%] left-[40%] w-[20%] aspect-square rounded-full bg-amber-400 flex items-center justify-center shadow-xl border-2 border-neutral-950 pointer-events-none animate-bounce">
                <Smile className="w-4/5 h-4/5 text-neutral-950" />
              </div>
            )}

            {privacyFilter === 'star' && (
              <div className="absolute top-[8%] left-[40%] w-[20%] aspect-square rounded-full bg-rose-500 flex items-center justify-center shadow-xl border-2 border-white pointer-events-none animate-pulse">
                <Star className="w-3/5 h-3/5 text-white fill-white" />
              </div>
            )}

            {privacyFilter === 'heart' && (
              <div className="absolute top-[8%] left-[40%] w-[20%] aspect-square rounded-full bg-pink-500 flex items-center justify-center shadow-xl border-2 border-white pointer-events-none animate-pulse">
                <Heart className="w-3/5 h-3/5 text-white fill-white" />
              </div>
            )}

            {/* Interactive Hotspot Pins on Outfit */}
            {/* Upper Pin */}
            <button
              onClick={() => setActivePin(activePin === 'upper' ? null : 'upper')}
              className={`absolute top-[32%] left-[48%] -translate-x-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-lg transition-transform ${
                activePin === 'upper' ? 'bg-rose-500 scale-125' : 'bg-neutral-950/80 backdrop-blur-md hover:scale-110'
              }`}
              title="Upper body piece"
            >
              <Shirt className="w-3.5 h-3.5 text-white" />
            </button>

            {/* Lower Pin */}
            <button
              onClick={() => setActivePin(activePin === 'lower' ? null : 'lower')}
              className={`absolute top-[62%] left-[48%] -translate-x-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-lg transition-transform ${
                activePin === 'lower' ? 'bg-rose-500 scale-125' : 'bg-neutral-950/80 backdrop-blur-md hover:scale-110'
              }`}
              title="Lower body piece"
            >
              <Layers className="w-3.5 h-3.5 text-white" />
            </button>

            {/* Shoes Pin */}
            <button
              onClick={() => setActivePin(activePin === 'shoes' ? null : 'shoes')}
              className={`absolute top-[88%] left-[48%] -translate-x-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-lg transition-transform ${
                activePin === 'shoes' ? 'bg-rose-500 scale-125' : 'bg-neutral-950/80 backdrop-blur-md hover:scale-110'
              }`}
              title="Footwear"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </button>

            {/* Pin Detail Popup */}
            {activePin && (
              <div className="absolute bottom-4 inset-x-4 z-20 p-3.5 rounded-2xl bg-neutral-950/90 backdrop-blur-xl border border-neutral-700/80 text-white shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold">
                    {activePin === 'upper' && 'Upper Body'}
                    {activePin === 'lower' && 'Lower Body'}
                    {activePin === 'shoes' && 'Footwear Piece'}
                  </span>
                  <button
                    onClick={() => setActivePin(null)}
                    className="text-xs text-neutral-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs font-bold text-white">
                  {activePin === 'upper' && result.outfitBreakdown.upper.name}
                  {activePin === 'lower' && result.outfitBreakdown.lower.name}
                  {activePin === 'shoes' && effectiveShoes.name}
                </p>
                <p className="text-[11px] text-neutral-300 mt-0.5">
                  {activePin === 'upper' && result.outfitBreakdown.upper.detail}
                  {activePin === 'lower' && result.outfitBreakdown.lower.detail}
                  {activePin === 'shoes' && effectiveShoes.detail}
                </p>
              </div>
            )}

            {/* Top Vibe Badge Overlay */}
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1.5 rounded-xl bg-neutral-950/80 backdrop-blur-md border border-neutral-700/80 text-xs font-bold text-white shadow-lg">
                {result.vibeTitle}
              </span>
            </div>
          </div>

          {/* Face Privacy Overlay Toolbar */}
          <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-sm flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <EyeOff className="w-3.5 h-3.5 text-neutral-400" />
              <span>Face Privacy Filter</span>
            </span>

            <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
              <button
                onClick={() => setPrivacyFilter('none')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  privacyFilter === 'none' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Off
              </button>
              <button
                onClick={() => setPrivacyFilter('blur')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  privacyFilter === 'blur' ? 'bg-rose-500 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Blur
              </button>
              <button
                onClick={() => setPrivacyFilter('smiley')}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  privacyFilter === 'smiley' ? 'bg-amber-400 text-neutral-950' : 'text-neutral-400 hover:text-white'
                }`}
                title="Smiley sticker"
              >
                <Smile className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPrivacyFilter('star')}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  privacyFilter === 'star' ? 'bg-rose-500 text-white' : 'text-neutral-400 hover:text-white'
                }`}
                title="Star sticker"
              >
                <Star className="w-3.5 h-3.5 fill-current" />
              </button>
              <button
                onClick={() => setPrivacyFilter('heart')}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  privacyFilter === 'heart' ? 'bg-pink-500 text-white' : 'text-neutral-400 hover:text-white'
                }`}
                title="Heart sticker"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Deep Breakdown, Score, Color Story, The One Swap (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* 1. Verdict & Overall Score Hero Card */}
          <div className="bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-neutral-950 rounded-3xl border border-neutral-800 p-6 shadow-2xl relative overflow-hidden backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold">
                    Fit Check Verdict
                  </span>
                  <span className="text-neutral-600">·</span>
                  <span className="text-xs text-neutral-400 font-medium">Aesthetic Score</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
                  {result.verdict}
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-neutral-300 max-w-md">
                  {result.verdictDescription}
                </p>
              </div>

              {/* Animated Score Ring */}
              <div className="relative shrink-0 flex items-center justify-center">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-neutral-800"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    className={`${getScoreColor(effectiveScore)} transition-all duration-1000 ease-out`}
                    fill="transparent"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * effectiveScore) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black font-mono text-white tabular-nums">
                    {effectiveScore}
                  </span>
                  <span className="text-[10px] font-bold text-neutral-400 font-mono">
                    / 100
                  </span>
                </div>
              </div>
            </div>

            {/* Aesthetic Subculture Tags */}
            <div className="mt-6 pt-5 border-t border-neutral-800 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-neutral-400 mr-1">Vibe Tags:</span>
              {result.aestheticTags.map((tag) => (
                <div
                  key={tag.name}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-800/80 border border-neutral-700/80 text-xs font-medium text-neutral-200"
                >
                  <span className="text-rose-400 font-bold">#</span>
                  <span>{tag.name}</span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {tag.confidence}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. THE "ONE SWAP" RULE (High-Leverage Stylist Upgrade) */}
          <div className="relative rounded-3xl bg-gradient-to-br from-rose-950/40 via-neutral-900 to-amber-950/20 border-2 border-rose-500/40 p-6 shadow-2xl backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <Shuffle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white font-display uppercase tracking-wider">
                    The "One Swap" Rule
                  </h3>
                  <p className="text-[10px] text-neutral-400">Single highest-impact outfit elevation</p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white">
                {result.oneSwapRule.action}
              </span>
            </div>

            {/* Swap Visual Comparison */}
            <div className="my-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-neutral-950/70 border border-neutral-800/80">
                <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold block mb-1">
                  Current Element
                </span>
                <p className="text-xs font-bold text-neutral-300">
                  {result.oneSwapRule.currentPiece}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30">
                <span className="text-[10px] font-mono uppercase text-rose-400 font-bold block mb-1">
                  Suggested Upgrade
                </span>
                <p className="text-xs font-bold text-white">
                  {result.oneSwapRule.suggestedPiece}
                </p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed mb-4">
              {result.oneSwapRule.reasoning}
            </p>

            {/* Digital Closet Match Callout */}
            {result.oneSwapRule.closetMatch && (
              <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-700/80 flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-neutral-800 flex items-center justify-center text-emerald-400 shrink-0">
                    <Shirt className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
                      Found in Your Digital Closet
                    </span>
                    <span className="text-xs font-bold text-white">
                      {result.oneSwapRule.closetMatch.itemName}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSimulatedSwapApplied(!simulatedSwapApplied)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    simulatedSwapApplied
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
                  }`}
                >
                  {simulatedSwapApplied ? '✓ Swap Applied (+4)' : 'Simulate Swap'}
                </button>
              </div>
            )}
          </div>

          {/* 3. Color Story Harmony & Extracted Palette */}
          <div className="bg-neutral-900/60 rounded-3xl border border-neutral-800 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-pink-400" />
                <h3 className="text-sm font-bold text-white font-display">
                  Color Story & Harmony Detection
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-neutral-400">{result.colorStory.harmonyType}</span>
                <span className="text-neutral-600">·</span>
                <span className="text-pink-400 font-bold">{result.colorStory.harmonyScore}/100</span>
              </div>
            </div>

            {/* Palette Swatches */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5 mb-4">
              {result.colorStory.palette.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => handleCopyHex(color.hex)}
                  className="group p-2.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all text-left flex flex-col justify-between"
                  title="Click to copy hex code"
                >
                  <div
                    className="w-full h-10 rounded-xl mb-2 shadow-inner border border-white/10"
                    style={{ backgroundColor: color.hex }}
                  />
                  <p className="text-[11px] font-bold text-neutral-200 truncate">
                    {color.name}
                  </p>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-neutral-400 font-mono">
                    <span>{color.hex}</span>
                    {copiedHex === color.hex ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              {result.colorStory.notes}
            </p>
          </div>

          {/* 4. The 4 Pillars Score Breakdown */}
          <div className="bg-neutral-900/60 rounded-3xl border border-neutral-800 p-6 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-white font-display mb-4">
              4 Pillars Score Breakdown
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Silhouette & Proportions */}
              <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-neutral-200">
                    Proportions & Silhouette
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-400">
                    {result.scoreBreakdown.silhouetteAndProportions.score}/100
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden mb-2">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-700"
                    style={{ width: `${result.scoreBreakdown.silhouetteAndProportions.score}%` }}
                  />
                </div>
                <p className="text-[11px] text-neutral-400">
                  {result.scoreBreakdown.silhouetteAndProportions.comment}
                </p>
              </div>

              {/* Color Harmony */}
              <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-neutral-200">
                    Color Story Harmony
                  </span>
                  <span className="text-xs font-mono font-bold text-pink-400">
                    {result.scoreBreakdown.colorHarmony.score}/100
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden mb-2">
                  <div
                    className="h-full bg-pink-500 rounded-full transition-all duration-700"
                    style={{ width: `${result.scoreBreakdown.colorHarmony.score}%` }}
                  />
                </div>
                <p className="text-[11px] text-neutral-400">
                  {result.scoreBreakdown.colorHarmony.comment}
                </p>
              </div>

              {/* Layering & Depth */}
              <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-neutral-200">
                    Layering & Accessory Depth
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {result.scoreBreakdown.layeringAndDepth.score}/100
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden mb-2">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-700"
                    style={{ width: `${result.scoreBreakdown.layeringAndDepth.score}%` }}
                  />
                </div>
                <p className="text-[11px] text-neutral-400">
                  {result.scoreBreakdown.layeringAndDepth.comment}
                </p>
              </div>

              {/* Vibe Cohesion */}
              <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-neutral-200">
                    Vibe & Aesthetic Cohesion
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {result.scoreBreakdown.vibeCohesion.score}/100
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden mb-2">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                    style={{ width: `${result.scoreBreakdown.vibeCohesion.score}%` }}
                  />
                </div>
                <p className="text-[11px] text-neutral-400">
                  {result.scoreBreakdown.vibeCohesion.comment}
                </p>
              </div>
            </div>
          </div>

          {/* 5. Pro-Stylist Tweaks */}
          {result.proTips && result.proTips.length > 0 && (
            <div className="bg-neutral-900/60 rounded-3xl border border-neutral-800 p-5 backdrop-blur-sm">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold block mb-2">
                Stylist Quick Tweaks (30-Second Fixes)
              </span>
              <ul className="space-y-2">
                {result.proTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                    <span className="text-rose-400 font-bold mt-0.5">✦</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
