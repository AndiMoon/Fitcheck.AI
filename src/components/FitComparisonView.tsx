import React, { useState, useEffect } from 'react';
import { FitCheckResult, StyleEvolutionReport } from '../types';
import {
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  Calendar,
  Layers,
  Palette,
  CheckCircle2,
  RefreshCw,
  Eye,
  Shirt,
  Flame,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { triggerHaptic } from '../utils/haptics';

interface FitComparisonViewProps {
  savedFits: FitCheckResult[];
  initialFitAId?: string;
  initialFitBId?: string;
  onBackToHistory: () => void;
  onSelectFit: (fit: FitCheckResult) => void;
  onNewScan: () => void;
}

export const FitComparisonView: React.FC<FitComparisonViewProps> = ({
  savedFits,
  initialFitAId,
  initialFitBId,
  onBackToHistory,
  onSelectFit,
  onNewScan,
}) => {
  // Select initial A and B
  const [fitA, setFitA] = useState<FitCheckResult | null>(() => {
    if (initialFitAId) {
      const match = savedFits.find((f) => f.id === initialFitAId);
      if (match) return match;
    }
    // Default to the second fit or first fit
    return savedFits.length > 1 ? savedFits[1] : savedFits[0] || null;
  });

  const [fitB, setFitB] = useState<FitCheckResult | null>(() => {
    if (initialFitBId) {
      const match = savedFits.find((f) => f.id === initialFitBId);
      if (match) return match;
    }
    // Default to the latest fit
    return savedFits[0] || null;
  });

  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);
  const [evolutionReport, setEvolutionReport] = useState<StyleEvolutionReport | null>(null);
  const [selectorTarget, setSelectorTarget] = useState<'A' | 'B' | null>(null);

  // Auto-generate initial report when fitA and fitB change
  useEffect(() => {
    if (!fitA || !fitB) return;
    generateReport(fitA, fitB);
  }, [fitA?.id, fitB?.id]);

  const generateReport = async (a: FitCheckResult, b: FitCheckResult) => {
    setIsAiAnalyzing(true);
    try {
      const res = await fetch('/api/compare-fits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fitA: a, fitB: b }),
      });
      if (!res.ok) throw new Error('Comparison failed');
      const data: StyleEvolutionReport = await res.json();
      setEvolutionReport(data);

      if (data.scoreDelta > 0) {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#10b981', '#f59e0b'],
        });
      }
    } catch (err) {
      console.warn('Using client-side fallback evolution report:', err);
      const scoreDelta = b.overallScore - a.overallScore;
      const isImproved = scoreDelta >= 0;
      setEvolutionReport({
        progressSummary: isImproved
          ? `Evolution from ${a.vibeTitle} to ${b.vibeTitle} demonstrates sharper proportion control, elevated layering, and more cohesive tonal coordination.`
          : `Comparing ${a.vibeTitle} with ${b.vibeTitle} tests alternate silhouettes and distinctive color choices.`,
        evolutionVerdict: isImproved ? 'Major Silhouette & Cohesion Upgrade 🔥' : 'Distinct Aesthetic Exploration ⚡',
        scoreDelta,
        keyImprovements: [
          `Proportions: ${b.scoreBreakdown?.silhouetteAndProportions?.comment || 'Intentional silhouette line flowing into footwear break.'}`,
          `Color Story: Transitioned into ${b.colorStory?.harmonyType || 'a harmonious palette'} with ${b.colorStory?.palette?.map((c) => c.name).slice(0, 3).join(', ')}.`,
          `Styling Intent: ${b.verdictDescription || 'Crisper piece-to-piece synergy.'}`,
        ],
        colorEvolution: `Shifted from ${a.colorStory?.harmonyType} (${a.colorStory?.harmonyScore}/100) to ${b.colorStory?.harmonyType} (${b.colorStory?.harmonyScore}/100).`,
        silhouetteEvolution: `Silhouette evolved from ${a.outfitBreakdown?.lower?.detail || 'baseline'} to ${b.outfitBreakdown?.lower?.detail || 'curated modern drape'}.`,
        nextLevelTip: `Carry over the sneaker synergy from ${b.vibeTitle} and add a layered metallic accessory for an easy 95+ score.`,
      });
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleSwapFits = () => {
    triggerHaptic('medium');
    const temp = fitA;
    setFitA(fitB);
    setFitB(temp);
  };

  const handleSelectSlot = (target: 'A' | 'B', fit: FitCheckResult) => {
    triggerHaptic('light');
    if (target === 'A') {
      setFitA(fit);
    } else {
      setFitB(fit);
    }
    setSelectorTarget(null);
  };

  if (savedFits.length < 2) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-4 text-rose-500 shadow-xl">
          <ArrowLeftRight className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white font-display mb-2">
          Need at Least 2 Fits to Compare
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto mb-6 leading-relaxed">
          Log at least two outfit checks to unlock the Side-by-Side Stylistic Evolution analyzer. Compare proportion upgrades, color harmony shifts, and aesthetic growth!
        </p>
        <button
          onClick={onNewScan}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-500/25 active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Perform a New Fit Check</span>
        </button>
      </div>
    );
  }

  if (!fitA || !fitB) return null;

  const scoreDelta = fitB.overallScore - fitA.overallScore;
  const isPositiveDelta = scoreDelta >= 0;

  // Comparison metrics
  const pillars = [
    {
      name: 'Silhouette & Proportions',
      icon: Shirt,
      scoreA: fitA.scoreBreakdown?.silhouetteAndProportions?.score || 85,
      scoreB: fitB.scoreBreakdown?.silhouetteAndProportions?.score || 88,
      commentA: fitA.scoreBreakdown?.silhouetteAndProportions?.comment,
      commentB: fitB.scoreBreakdown?.silhouetteAndProportions?.comment,
    },
    {
      name: 'Color Story Harmony',
      icon: Palette,
      scoreA: fitA.colorStory?.harmonyScore || 84,
      scoreB: fitB.colorStory?.harmonyScore || 88,
      commentA: `${fitA.colorStory?.harmonyType} (${fitA.colorStory?.palette?.map((c) => c.name).slice(0, 2).join(', ')})`,
      commentB: `${fitB.colorStory?.harmonyType} (${fitB.colorStory?.palette?.map((c) => c.name).slice(0, 2).join(', ')})`,
    },
    {
      name: 'Layering & Depth',
      icon: Layers,
      scoreA: fitA.scoreBreakdown?.layeringAndDepth?.score || 80,
      scoreB: fitB.scoreBreakdown?.layeringAndDepth?.score || 85,
      commentA: fitA.scoreBreakdown?.layeringAndDepth?.comment,
      commentB: fitB.scoreBreakdown?.layeringAndDepth?.comment,
    },
    {
      name: 'Vibe & Aesthetic Cohesion',
      icon: Flame,
      scoreA: fitA.scoreBreakdown?.vibeCohesion?.score || 88,
      scoreB: fitB.scoreBreakdown?.vibeCohesion?.score || 92,
      commentA: fitA.aestheticTags?.map((t) => `#${t.name}`).join(' '),
      commentB: fitB.aestheticTags?.map((t) => `#${t.name}`).join(' '),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              triggerHaptic('light');
              onBackToHistory();
            }}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            title="Back to Fit History"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-rose-400 font-bold">
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Style Evolution Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
              Side-by-Side Fit Progress
            </h1>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSwapFits}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold transition-all active:scale-95"
            title="Swap Baseline and Comparison"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-rose-400" />
            <span>Swap A ↔ B</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('medium');
              generateReport(fitA, fitB);
            }}
            disabled={isAiAnalyzing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-bold text-xs shadow-md shadow-rose-500/25 active:scale-95 transition-all"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAiAnalyzing ? 'Analyzing Progress...' : 'AI Stylist Re-Scan'}</span>
          </button>
        </div>
      </div>

      {/* Main Dual Stage (Side-by-Side Visuals) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-8">
        {/* FIT A (Baseline / Before) - 5 cols */}
        <div className="lg:col-span-5 bg-neutral-900/60 rounded-3xl border border-neutral-800 p-5 sm:p-6 backdrop-blur-sm flex flex-col justify-between relative shadow-xl">
          {/* Card Header & Slot Picker Button */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                  Fit A · Baseline
                </span>
              </div>
              <button
                onClick={() => setSelectorTarget('A')}
                className="text-[11px] font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 px-2.5 py-1 rounded-lg border border-neutral-700/60 transition-colors"
              >
                Change Fit A ▾
              </button>
            </div>

            {/* Photo & Overlays */}
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 mb-4 shadow-lg group">
              <img
                src={fitA.imageUrl}
                alt={fitA.vibeTitle}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              {/* Score pill */}
              <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-xl">
                <span className="text-sm font-black font-mono text-white tabular-nums">
                  {fitA.overallScore}
                </span>
                <span className="text-[10px] font-mono text-neutral-400">/100</span>
              </div>

              {/* Timestamp & Verdict Bottom Overlay */}
              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-[10px] font-mono text-amber-300 block mb-0.5">
                  {fitA.timestamp}
                </span>
                <p className="text-xs font-bold text-white font-display truncate">
                  {fitA.verdict}
                </p>
                <p className="text-[11px] text-neutral-300 truncate">
                  {fitA.vibeTitle}
                </p>
              </div>
            </div>

            {/* Color Story Palette Swatches */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1.5">
                <span className="font-semibold">Color Story</span>
                <span className="font-mono text-[10px] text-neutral-500">
                  {fitA.colorStory?.harmonyType} ({fitA.colorStory?.harmonyScore}/100)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {fitA.colorStory?.palette?.slice(0, 5).map((c) => (
                  <div
                    key={c.hex + c.name}
                    className="h-4 flex-1 rounded-md border border-white/10 shadow-sm relative group/color"
                    style={{ backgroundColor: c.hex }}
                    title={`${c.name} (${c.hex})`}
                  />
                ))}
              </div>
            </div>

            {/* Aesthetic Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {fitA.aestheticTags?.map((tag) => (
                <span
                  key={tag.name}
                  className="text-[10px] font-semibold text-neutral-300 bg-neutral-800/80 px-2 py-0.5 rounded-md border border-neutral-700/60"
                >
                  #{tag.name}
                </span>
              ))}
            </div>

            {/* Garments Quick Spec */}
            <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 text-[11px] space-y-1 text-neutral-300">
              <div className="truncate">
                <span className="text-neutral-500 font-mono text-[10px] uppercase mr-1.5">Top:</span>
                <span>{fitA.outfitBreakdown?.upper?.name || 'Upper piece'}</span>
              </div>
              <div className="truncate">
                <span className="text-neutral-500 font-mono text-[10px] uppercase mr-1.5">Bottom:</span>
                <span>{fitA.outfitBreakdown?.lower?.name || 'Lower piece'}</span>
              </div>
              <div className="truncate">
                <span className="text-neutral-500 font-mono text-[10px] uppercase mr-1.5">Kicks:</span>
                <span>{fitA.outfitBreakdown?.shoes?.name || 'Footwear piece'}</span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="mt-4 pt-3 border-t border-neutral-800/80">
            <button
              onClick={() => onSelectFit(fitA)}
              className="w-full py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs border border-neutral-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-neutral-400" />
              <span>Inspect Full Fit A Breakdown</span>
            </button>
          </div>
        </div>

        {/* CENTER EVOLUTION BRIDGE - 2 cols */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center py-4 lg:py-0 text-center gap-4">
          {/* Delta Pill */}
          <div
            className={`px-4 py-3 rounded-2xl border shadow-xl flex flex-col items-center justify-center transition-all ${
              isPositiveDelta
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-emerald-500/10'
                : 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-amber-500/10'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xl font-black font-mono">
              {isPositiveDelta ? (
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-amber-400" />
              )}
              <span>
                {isPositiveDelta ? `+${scoreDelta}` : scoreDelta} pts
              </span>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold mt-0.5 opacity-80">
              {isPositiveDelta ? 'Style Upgrade' : 'Shift Delta'}
            </span>
          </div>

          {/* Connecting VS Badge */}
          <div className="relative flex items-center justify-center w-full my-2">
            <div className="absolute inset-x-0 h-px bg-neutral-800 hidden lg:block" />
            <div className="relative z-10 w-10 h-10 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center shadow-lg">
              <span className="text-xs font-black font-display text-rose-400">VS</span>
            </div>
          </div>

          {/* Quick Stylist Pill */}
          <div className="text-[11px] text-neutral-400 max-w-[140px] leading-tight">
            <span>Stylistic Trajectory</span>
          </div>
        </div>

        {/* FIT B (Comparison / Latest) - 5 cols */}
        <div className="lg:col-span-5 bg-neutral-900/60 rounded-3xl border border-neutral-800 p-5 sm:p-6 backdrop-blur-sm flex flex-col justify-between relative shadow-xl">
          {/* Card Header & Slot Picker Button */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-300">
                  Fit B · Comparison
                </span>
              </div>
              <button
                onClick={() => setSelectorTarget('B')}
                className="text-[11px] font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 px-2.5 py-1 rounded-lg border border-neutral-700/60 transition-colors"
              >
                Change Fit B ▾
              </button>
            </div>

            {/* Photo & Overlays */}
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 mb-4 shadow-lg group">
              <img
                src={fitB.imageUrl}
                alt={fitB.vibeTitle}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              {/* Score pill */}
              <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-xl">
                <span className="text-sm font-black font-mono text-rose-400 tabular-nums">
                  {fitB.overallScore}
                </span>
                <span className="text-[10px] font-mono text-neutral-400">/100</span>
              </div>

              {/* Timestamp & Verdict Bottom Overlay */}
              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-[10px] font-mono text-rose-300 block mb-0.5">
                  {fitB.timestamp}
                </span>
                <p className="text-xs font-bold text-white font-display truncate">
                  {fitB.verdict}
                </p>
                <p className="text-[11px] text-neutral-300 truncate">
                  {fitB.vibeTitle}
                </p>
              </div>
            </div>

            {/* Color Story Palette Swatches */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1.5">
                <span className="font-semibold">Color Story</span>
                <span className="font-mono text-[10px] text-neutral-500">
                  {fitB.colorStory?.harmonyType} ({fitB.colorStory?.harmonyScore}/100)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {fitB.colorStory?.palette?.slice(0, 5).map((c) => (
                  <div
                    key={c.hex + c.name}
                    className="h-4 flex-1 rounded-md border border-white/10 shadow-sm relative group/color"
                    style={{ backgroundColor: c.hex }}
                    title={`${c.name} (${c.hex})`}
                  />
                ))}
              </div>
            </div>

            {/* Aesthetic Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {fitB.aestheticTags?.map((tag) => (
                <span
                  key={tag.name}
                  className="text-[10px] font-semibold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20"
                >
                  #{tag.name}
                </span>
              ))}
            </div>

            {/* Garments Quick Spec */}
            <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 text-[11px] space-y-1 text-neutral-300">
              <div className="truncate">
                <span className="text-neutral-500 font-mono text-[10px] uppercase mr-1.5">Top:</span>
                <span>{fitB.outfitBreakdown?.upper?.name || 'Upper piece'}</span>
              </div>
              <div className="truncate">
                <span className="text-neutral-500 font-mono text-[10px] uppercase mr-1.5">Bottom:</span>
                <span>{fitB.outfitBreakdown?.lower?.name || 'Lower piece'}</span>
              </div>
              <div className="truncate">
                <span className="text-neutral-500 font-mono text-[10px] uppercase mr-1.5">Kicks:</span>
                <span>{fitB.outfitBreakdown?.shoes?.name || 'Footwear piece'}</span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="mt-4 pt-3 border-t border-neutral-800/80">
            <button
              onClick={() => onSelectFit(fitB)}
              className="w-full py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs border border-neutral-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-rose-400" />
              <span>Inspect Full Fit B Breakdown</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Stylistic Evolution Report Card */}
      {evolutionReport && (
        <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-neutral-900/90 via-neutral-900/80 to-neutral-950 border border-rose-500/25 shadow-2xl relative overflow-hidden backdrop-blur-md">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-neutral-800/80 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 p-[1.5px] flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-rose-400" />
                </div>
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400 font-bold block">
                  AI Stylistic Progress Analysis
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white font-display">
                  {evolutionReport.evolutionVerdict}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                Trajectory: {isPositiveDelta ? 'Upward Growth 🚀' : 'Creative Shift 🎨'}
              </span>
            </div>
          </div>

          {/* Progress Summary Narrative */}
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
            {evolutionReport.progressSummary}
          </p>

          {/* Key Improvements Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {evolutionReport.keyImprovements?.map((imp, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0 text-xs font-mono font-bold mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">{imp}</p>
              </div>
            ))}
          </div>

          {/* Evolution Deep Dive Grid: Palette vs Silhouette vs Next Goal */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-800/80 text-xs">
            <div className="p-3.5 rounded-xl bg-neutral-950/50 border border-neutral-800">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                Palette Trajectory
              </span>
              <p className="text-neutral-300 leading-snug">{evolutionReport.colorEvolution}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-neutral-950/50 border border-neutral-800">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                Silhouette Transition
              </span>
              <p className="text-neutral-300 leading-snug">{evolutionReport.silhouetteEvolution}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-neutral-950/50 border border-neutral-800">
              <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block mb-1">
                Next-Level Stylist Goal
              </span>
              <p className="text-neutral-300 leading-snug">{evolutionReport.nextLevelTip}</p>
            </div>
          </div>
        </div>
      )}

      {/* 4-Pillar Detailed Side-by-Side Breakdown Matrix */}
      <div className="bg-neutral-900/60 rounded-3xl border border-neutral-800 p-6 sm:p-8 backdrop-blur-sm shadow-xl mb-8">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
          <div>
            <h3 className="text-lg font-black text-white font-display">
              Pillar-by-Pillar Stylistic Breakdown
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Compare core aesthetics, silhouette flow, and depth across both fits.
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-500">0 – 100 Scale</span>
        </div>

        <div className="space-y-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            const diff = pillar.scoreB - pillar.scoreA;
            const isDiffPositive = diff >= 0;

            return (
              <div
                key={pillar.name}
                className="p-4 sm:p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 hover:border-neutral-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-rose-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white font-display">
                        {pillar.name}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400">Fit A:</span>
                      <span className="font-bold text-white tabular-nums">{pillar.scoreA}</span>
                    </div>
                    <span className="text-neutral-600">→</span>
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400">Fit B:</span>
                      <span className="font-bold text-rose-400 tabular-nums">{pillar.scoreB}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                        isDiffPositive
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : 'bg-amber-500/15 text-amber-300'
                      }`}
                    >
                      {isDiffPositive ? `+${diff}` : diff}
                    </span>
                  </div>
                </div>

                {/* Progress bar comparison */}
                <div className="grid grid-cols-2 gap-4 my-2">
                  <div>
                    <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${pillar.scoreA}%` }}
                      />
                    </div>
                    {pillar.commentA && (
                      <p className="text-[11px] text-neutral-400 mt-1.5 truncate">
                        {pillar.commentA}
                      </p>
                    )}
                  </div>
                  <div>
                    <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full transition-all duration-500"
                        style={{ width: `${pillar.scoreB}%` }}
                      />
                    </div>
                    {pillar.commentB && (
                      <p className="text-[11px] text-neutral-400 mt-1.5 truncate">
                        {pillar.commentB}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Fit Selector Drawer Strip */}
      <div className="p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
            All Saved Fits ({savedFits.length})
          </span>
          <span className="text-[11px] text-neutral-500">
            Tap 'Set as A' or 'Set as B' to compare any pair
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {savedFits.map((fit) => {
            const isSelectedA = fitA.id === fit.id;
            const isSelectedB = fitB.id === fit.id;

            return (
              <div
                key={fit.id}
                className={`relative rounded-2xl overflow-hidden border p-2 flex flex-col justify-between transition-all ${
                  isSelectedA
                    ? 'border-amber-400 bg-amber-500/10'
                    : isSelectedB
                    ? 'border-rose-500 bg-rose-500/10'
                    : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
                }`}
              >
                <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-neutral-900 mb-2 relative">
                  <img
                    src={fit.imageUrl}
                    alt={fit.vibeTitle}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {isSelectedA && (
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-amber-400 text-neutral-950 font-mono text-[9px] font-black uppercase">
                      Fit A
                    </span>
                  )}
                  {isSelectedB && (
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-rose-500 text-white font-mono text-[9px] font-black uppercase">
                      Fit B
                    </span>
                  )}
                  <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/80 font-mono text-[9px] text-white">
                    {fit.overallScore}
                  </span>
                </div>

                <p className="text-[11px] font-bold text-white truncate font-display mb-2">
                  {fit.vibeTitle}
                </p>

                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <button
                    onClick={() => handleSelectSlot('A', fit)}
                    disabled={isSelectedA}
                    className={`py-1 rounded-md font-semibold transition-colors ${
                      isSelectedA
                        ? 'bg-amber-400 text-neutral-950 font-bold'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                    }`}
                  >
                    Set A
                  </button>
                  <button
                    onClick={() => handleSelectSlot('B', fit)}
                    disabled={isSelectedB}
                    className={`py-1 rounded-md font-semibold transition-colors ${
                      isSelectedB
                        ? 'bg-rose-500 text-white font-bold'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                    }`}
                  >
                    Set B
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Target Fit Selector Modal */}
      {selectorTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-4">
              <h3 className="text-base font-bold text-white font-display">
                Select Fit for Slot {selectorTarget}
              </h3>
              <button
                onClick={() => setSelectorTarget(null)}
                className="text-neutral-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {savedFits.map((fit) => (
                <div
                  key={fit.id}
                  onClick={() => handleSelectSlot(selectorTarget, fit)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={fit.imageUrl}
                      alt={fit.vibeTitle}
                      className="w-12 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate font-display">
                        {fit.vibeTitle}
                      </p>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {fit.timestamp} · {fit.verdict}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className="text-sm font-black font-mono text-rose-400">
                      {fit.overallScore}/100
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
