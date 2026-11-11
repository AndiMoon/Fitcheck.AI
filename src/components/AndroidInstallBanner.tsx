import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface AndroidInstallBannerProps {
  canPrompt: boolean;
  isInstalled: boolean;
  onInstall: () => Promise<boolean>;
}

export const AndroidInstallBanner: React.FC<AndroidInstallBannerProps> = ({
  canPrompt,
  isInstalled,
  onInstall,
}) => {
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('fitcheck_android_banner_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const [installing, setInstalling] = useState(false);
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);

  useEffect(() => {
    if (isInstalled) {
      setDismissed(true);
    }
  }, [isInstalled]);

  if (dismissed || isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    triggerHaptic('medium');
    if (canPrompt) {
      setInstalling(true);
      const success = await onInstall();
      setInstalling(false);
      if (success) {
        setDismissed(true);
      }
    } else {
      setShowAndroidGuide(true);
    }
  };

  const handleDismiss = () => {
    triggerHaptic('light');
    setDismissed(true);
    try {
      sessionStorage.setItem('fitcheck_android_banner_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-rose-950/70 via-neutral-900 to-violet-950/70 border-b border-rose-500/20 px-3 py-2.5 sm:px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 shadow-md shadow-rose-500/20 border border-neutral-800">
              <img src="/app-icon.png" alt="FitCheck App Icon" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 font-bold text-white truncate">
                <span>FitCheck for Android</span>
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[10px] uppercase tracking-wide">
                  PWA Ready
                </span>
              </div>
              <p className="text-neutral-400 text-[11px] truncate hidden sm:block">
                Install directly to your Android Home Screen & App Drawer for full-screen mirror scanning.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              disabled={installing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-bold text-xs shadow-md shadow-rose-500/25 active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{installing ? 'Installing...' : 'Install App'}</span>
            </button>
            <button
              onClick={handleDismiss}
              aria-label="Dismiss banner"
              className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Manual Android Chrome Instructions Modal if automatic prompt is deferred by browser */}
      {showAndroidGuide && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <h4 className="text-sm font-bold text-white font-display">Install on Android</h4>
              </div>
              <button
                onClick={() => setShowAndroidGuide(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-300 mb-4 leading-relaxed">
              To install <strong className="text-white">FitCheck</strong> on your Android phone:
            </p>

            <ol className="space-y-3 text-xs text-neutral-300 mb-6">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-neutral-800 text-rose-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <span>
                  Tap the <strong className="text-white">three dots (⋮)</strong> menu in Chrome or your browser.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-neutral-800 text-rose-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <span>
                  Select <strong className="text-white">"Install app"</strong> or <strong className="text-white">"Add to Home screen"</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-neutral-800 text-rose-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <span>
                  Tap <strong className="text-white">Install</strong>. FitCheck will appear in your Android app drawer!
                </span>
              </li>
            </ol>

            <button
              onClick={() => {
                triggerHaptic('light');
                setShowAndroidGuide(false);
              }}
              className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs border border-neutral-700 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
