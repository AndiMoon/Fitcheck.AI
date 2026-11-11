import React, { useRef, useState, useEffect } from 'react';
import { FitCheckResult } from '../types';
import { X, Download, Copy, Check, EyeOff, Sparkles, Smile, Star, Heart, Share2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { triggerHaptic } from '../utils/haptics';

interface ShareStoryCardModalProps {
  result: FitCheckResult;
  onClose: () => void;
}

type PrivacyFilter = 'none' | 'blur' | 'smiley' | 'star' | 'heart';

export const ShareStoryCardModal: React.FC<ShareStoryCardModalProps> = ({
  result,
  onClose,
}) => {
  const [privacyFilter, setPrivacyFilter] = useState<PrivacyFilter>('none');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownloadPng = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
      });
      const link = document.createElement('a');
      link.download = `fitcheck_${result.vibeTitle.toLowerCase().replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
      });
    } catch (err) {
      console.error('Error generating story card PNG:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyImage = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
      });
    } catch (err) {
      console.error('Error copying story card:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleAndroidNativeShare = async () => {
    if (!cardRef.current) return;
    triggerHaptic('medium');
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
      });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const filename = `fitcheck_${result.vibeTitle.toLowerCase().replace(/\s+/g, '_')}.png`;
      const file = new File([blob], filename, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `FitCheck: ${result.verdict} (${result.overallScore}/100)`,
          text: `My FitCheck Score: ${result.overallScore}/100 🔥 Vibe: ${result.vibeTitle}`,
          files: [file],
        });
        triggerHaptic('success');
      } else if (navigator.share) {
        await navigator.share({
          title: `FitCheck: ${result.verdict} (${result.overallScore}/100)`,
          text: `My FitCheck Score: ${result.overallScore}/100 🔥 Vibe: ${result.vibeTitle}`,
          url: window.location.href,
        });
        triggerHaptic('success');
      } else {
        await handleCopyImage();
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        console.warn('Native share cancelled or failed, falling back to download:', err);
        handleDownloadPng();
      }
    } finally {
      setIsExporting(false);
    }
  };

  const hasNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <h3 className="text-base font-bold text-white font-display">
              TikTok & IG Story Card
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Privacy Selector Controls */}
        <div className="mb-4 flex items-center justify-between bg-neutral-950 p-2 rounded-2xl border border-neutral-800 text-xs">
          <span className="text-neutral-400 font-medium flex items-center gap-1.5 pl-1">
            <EyeOff className="w-3.5 h-3.5" />
            <span>Face Privacy Overlay:</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPrivacyFilter('none')}
              className={`px-2 py-1 rounded-lg font-semibold text-[11px] ${
                privacyFilter === 'none' ? 'bg-neutral-800 text-white' : 'text-neutral-400'
              }`}
            >
              Off
            </button>
            <button
              onClick={() => setPrivacyFilter('blur')}
              className={`px-2 py-1 rounded-lg font-semibold text-[11px] ${
                privacyFilter === 'blur' ? 'bg-rose-500 text-white' : 'text-neutral-400'
              }`}
            >
              Blur
            </button>
            <button
              onClick={() => setPrivacyFilter('smiley')}
              className={`p-1 rounded-lg ${
                privacyFilter === 'smiley' ? 'bg-amber-400 text-neutral-950' : 'text-neutral-400'
              }`}
            >
              <Smile className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPrivacyFilter('star')}
              className={`p-1 rounded-lg ${
                privacyFilter === 'star' ? 'bg-rose-500 text-white' : 'text-neutral-400'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
            </button>
            <button
              onClick={() => setPrivacyFilter('heart')}
              className={`p-1 rounded-lg ${
                privacyFilter === 'heart' ? 'bg-pink-500 text-white' : 'text-neutral-400'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>

        {/* The 9:16 Story Card Container (Styled for Instagram / TikTok Stories) */}
        <div className="flex justify-center mb-6">
          <div
            ref={cardRef}
            className="w-[320px] aspect-[9/16] rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-700/80 p-4 flex flex-col justify-between shadow-2xl relative"
            style={{
              background: 'linear-gradient(180deg, #121316 0%, #0a0a0c 100%)',
            }}
          >
            {/* Top Branding Strip */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10 z-10">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="text-[10px] font-black tracking-widest text-white uppercase font-display">
                  FITCHECK.AI
                </span>
              </div>
              <span className="text-[9px] font-mono text-neutral-400 tracking-wider">
                STORY VERIFIED
              </span>
            </div>

            {/* Central Photo with Frame */}
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-900 border border-white/15 my-2 shadow-lg">
              <img
                src={result.imageUrl}
                alt="Fit check story"
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
              />

              {/* Privacy Overlay on Story Card */}
              {privacyFilter === 'blur' && (
                <div
                  className="absolute top-[8%] left-[40%] w-[20%] aspect-square rounded-full backdrop-blur-2xl bg-white/20 border border-white/30 shadow-lg"
                  style={{ backdropFilter: 'blur(20px)' }}
                />
              )}
              {privacyFilter === 'smiley' && (
                <div className="absolute top-[8%] left-[40%] w-[20%] aspect-square rounded-full bg-amber-400 flex items-center justify-center shadow-lg border border-black">
                  <Smile className="w-4/5 h-4/5 text-neutral-950" />
                </div>
              )}
              {privacyFilter === 'star' && (
                <div className="absolute top-[8%] left-[40%] w-[20%] aspect-square rounded-full bg-rose-500 flex items-center justify-center shadow-lg border border-white">
                  <Star className="w-3/5 h-3/5 text-white fill-white" />
                </div>
              )}
              {privacyFilter === 'heart' && (
                <div className="absolute top-[8%] left-[40%] w-[20%] aspect-square rounded-full bg-pink-500 flex items-center justify-center shadow-lg border border-white">
                  <Heart className="w-3/5 h-3/5 text-white fill-white" />
                </div>
              )}

              {/* Daily Challenge Trophy Stamp */}
              {result.completedChallenge && (
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-amber-400 text-neutral-950 flex items-center gap-1 shadow-lg font-mono text-[8px] font-black uppercase tracking-wider z-20">
                  <span>★ DAILY DROP: {result.completedChallenge.garmentType.split(' ')[0]}</span>
                </div>
              )}

              {/* Score Stamp Badge */}
              <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-xl">
                <span className="text-xs font-black font-mono text-rose-400 tabular-nums">
                  {result.overallScore}
                </span>
                <span className="text-[9px] font-mono text-white/60">/100</span>
              </div>

              {/* Vibe Title Stamp */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 px-2.5 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/15">
                <p className="text-[11px] font-black text-white truncate font-display">
                  {result.verdict}
                </p>
                <p className="text-[9px] text-neutral-300 truncate">
                  {result.vibeTitle}
                </p>
              </div>
            </div>

            {/* Bottom Story Breakdown: Tags, Palette & The One Swap */}
            <div className="space-y-2 z-10">
              {/* Aesthetic Tags */}
              <div className="flex items-center gap-1.5 overflow-hidden">
                {result.aestheticTags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.name}
                    className="text-[9px] font-semibold text-neutral-200 bg-white/10 px-2 py-0.5 rounded-md truncate"
                  >
                    #{tag.name.replace(/\s+/g, '')}
                  </span>
                ))}
              </div>

              {/* Color Story Palette Swatches Bar */}
              <div className="flex items-center gap-1.5">
                {result.colorStory.palette.slice(0, 5).map((color) => (
                  <div
                    key={color.hex}
                    className="h-3 flex-1 rounded-md border border-white/10 shadow-sm"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>

              {/* One Swap Callout on Card */}
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-[9px]">
                <div className="truncate mr-2">
                  <span className="text-rose-400 font-bold uppercase mr-1">1-Swap:</span>
                  <span className="text-neutral-300">{result.oneSwapRule.suggestedPiece}</span>
                </div>
                <span className="text-[8px] font-mono text-neutral-400 shrink-0">
                  {result.timestamp.split('at')[0]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {hasNativeShare && (
            <button
              onClick={handleAndroidNativeShare}
              disabled={isExporting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-rose-500 via-pink-500 to-violet-600 hover:from-rose-400 hover:to-violet-500 text-white shadow-lg shadow-rose-500/25 active:scale-95 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>{isExporting ? 'Preparing Story...' : 'Share Fit Card (Instagram / TikTok / Android Sheet)'}</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleDownloadPng}
              disabled={isExporting}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 active:scale-95 transition-all"
            >
              <Download className="w-4 h-4 text-rose-400" />
              <span>{isExporting ? 'Generating...' : 'Save PNG'}</span>
            </button>

            <button
              onClick={handleCopyImage}
              disabled={isExporting}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 active:scale-95 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-neutral-300" />}
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
