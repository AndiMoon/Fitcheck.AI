import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  RefreshCw,
  X,
  ArrowRight,
  Flame,
  Zap,
  Coffee,
  GraduationCap,
  Briefcase,
  Shirt,
  MessageSquare,
  Timer,
  CheckCircle2,
} from 'lucide-react';
import { PresetOutfit } from '../data/presets';
import { ClosetItem, DailyChallenge } from '../types';
import { DailyChallengeBanner } from './DailyChallengeBanner';
import { triggerHaptic } from '../utils/haptics';
import mirrorSelfieBg from '../assets/images/fit_streetwear_y2k_1794248672804.jpg';
import closetFlatlayBg from '../assets/images/closet_silver_sambas_1794248674755.jpg';

interface ScannerViewProps {
  onAnalyze: (image: string, userNote: string, isChallenge?: boolean) => Promise<void>;
  onSelectPreset?: (preset: PresetOutfit) => void;
  isAnalyzing: boolean;
  closetItems: ClosetItem[];
  dailyChallenge: DailyChallenge;
  isChallengeCompleted: boolean;
  streakCount: number;
  initialNote?: string;
}

interface OccasionOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const OCCASIONS: OccasionOption[] = [
  { id: 'Daily Drop', label: 'Daily Drop', icon: Flame },
  { id: 'Streetwear', label: 'Street', icon: Zap },
  { id: 'Casual', label: 'Casual', icon: Coffee },
  { id: 'Campus', label: 'Campus', icon: GraduationCap },
  { id: 'Night Out', label: 'Night', icon: Sparkles },
  { id: 'Smart', label: 'Smart', icon: Briefcase },
];

export const ScannerView: React.FC<ScannerViewProps> = ({
  onAnalyze,
  isAnalyzing,
  closetItems,
  dailyChallenge,
  isChallengeCompleted,
  streakCount,
  initialNote,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userNote, setUserNote] = useState<string>(initialNote || '');
  const [selectedOccasion, setSelectedOccasion] = useState<string>(
    initialNote ? 'Daily Drop' : 'Streetwear'
  );
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isChallengeMode, setIsChallengeMode] = useState<boolean>(Boolean(initialNote));

  useEffect(() => {
    if (initialNote) {
      setUserNote(initialNote);
      setSelectedOccasion('Daily Drop');
      setIsChallengeMode(true);
    }
  }, [initialNote]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // File Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  // Live Mirror Camera Logic
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1080 },
          height: { ideal: 1440 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
      setSelectedImage(null);
    } catch {
      setCameraError('Camera unavailable. Upload a photo instead.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setCountdown(null);
  };

  const takePhotoWithTimer = () => {
    triggerHaptic('medium');
    let count = 3;
    setCountdown(count);
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        triggerHaptic('light');
        setCountdown(count);
      } else {
        clearInterval(interval);
        setCountdown(null);
        captureSnapshot();
      }
    }, 1000);
  };

  const captureSnapshot = () => {
    if (!videoRef.current) return;
    triggerHaptic('heavy');
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 720;
    canvas.height = videoRef.current.videoHeight || 960;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Mirror flip
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setSelectedImage(dataUrl);
      stopCamera();
    }
  };

  const handleAcceptChallenge = () => {
    setSelectedOccasion('Daily Drop');
    setUserNote(`Styling: ${dailyChallenge.garmentType}`);
    setIsChallengeMode(true);
    if (fileInputRef.current) {
      fileInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSubmit = () => {
    if (!selectedImage) return;
    triggerHaptic('medium');
    const combinedNote = `${selectedOccasion}${userNote ? ` - ${userNote}` : ''}`;
    onAnalyze(selectedImage, combinedNote, isChallengeMode || selectedOccasion.includes('Drop'));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Daily Challenge Drop Banner */}
      <DailyChallengeBanner
        challenge={dailyChallenge}
        isCompleted={isChallengeCompleted}
        streakCount={streakCount}
        closetItems={closetItems}
        onAcceptChallenge={handleAcceptChallenge}
      />

      {/* Main Grid: Upload & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Image Capture / Orb Area (7 cols) */}
        <div className="lg:col-span-7 bg-neutral-900/50 rounded-3xl border border-neutral-800/80 p-4 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-sm">
          {/* Active Scanning Animation Overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 z-30 bg-neutral-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
              <div className="relative w-20 h-20 mb-4">
                <div className="absolute inset-0 rounded-full border-2 border-neutral-800 animate-pulse"></div>
                <div className="absolute inset-0 rounded-full border-2 border-rose-500 border-t-transparent animate-spin"></div>
                <div className="absolute inset-2 rounded-full border border-pink-400 border-b-transparent animate-spin [animation-duration:1.2s]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-rose-400 animate-bounce" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white font-display mb-1">Checking fit</h3>
              <p className="text-xs text-neutral-400">Colors, proportions & vibes</p>
            </div>
          )}

          {/* Selected Image Preview Mode */}
          {selectedImage && !isCameraActive && (
            <div className="relative group">
              <div className="relative aspect-[3/4] w-full max-h-[540px] rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-xl">
                <img
                  src={selectedImage}
                  alt="Fit check"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

                {/* Minimal Ready Pill */}
                <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 bg-neutral-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-neutral-800 text-xs font-semibold text-emerald-400 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Ready</span>
                </div>

                {/* Close / Remove Icon Button */}
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-3.5 right-3.5 z-10 p-2 rounded-full bg-neutral-950/80 hover:bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 backdrop-blur-md transition-all active:scale-95 shadow-md"
                  title="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Minimal Replace Action */}
              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-neutral-800/60"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
                  <span>Retake</span>
                </button>
                <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-500">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>High-Res</span>
                </div>
              </div>
            </div>
          )}

          {/* Live Camera Mode */}
          {isCameraActive && (
            <div className="relative aspect-[3/4] w-full max-h-[540px] rounded-2xl overflow-hidden bg-black border border-neutral-800 shadow-xl">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />

              {/* Minimalist Corner Framing Brackets */}
              <div className="absolute inset-4 pointer-events-none">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white/40 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white/40 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white/40 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white/40 rounded-br-lg" />
              </div>

              {/* Countdown Overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 z-20 bg-black/40 flex items-center justify-center">
                  <span className="text-8xl font-black text-white font-display animate-ping">
                    {countdown}
                  </span>
                </div>
              )}

              {/* Bottom Camera Action Bar */}
              <div className="absolute bottom-5 inset-x-0 flex items-center justify-center gap-3 z-10 px-4">
                <button
                  onClick={stopCamera}
                  className="p-3 rounded-full bg-neutral-950/80 hover:bg-neutral-900 text-neutral-300 hover:text-white backdrop-blur-md border border-neutral-800 transition-all active:scale-95"
                  title="Close Camera"
                >
                  <X className="w-5 h-5" />
                </button>

                <button
                  onClick={takePhotoWithTimer}
                  disabled={countdown !== null}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-rose-500/30 active:scale-95 transition-all"
                >
                  <Timer className="w-4 h-4" />
                  <span>{countdown !== null ? countdown : '3s Pose'}</span>
                </button>

                <button
                  onClick={captureSnapshot}
                  className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all active:scale-95 border border-white/20"
                  title="Snap Now"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Futuristic 3D Split-Ball Orb */}
          {!selectedImage && !isCameraActive && (
            <div className="relative rounded-3xl overflow-hidden bg-neutral-950/60 border border-neutral-800/80 p-6 sm:p-10 flex flex-col items-center justify-center min-h-[440px]">
              {/* Subtle background ambient glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,63,94,0.06)_0%,transparent_70%)] pointer-events-none" />

              {/* The 3D Split Ball */}
              <div className="relative group/orb my-auto">
                {/* Ambient Outer Halo */}
                <div className="absolute -inset-4 sm:-inset-6 rounded-full bg-gradient-to-tr from-amber-500/10 via-rose-500/15 to-pink-500/10 blur-xl opacity-75 group-hover/orb:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Outer Ring / Bezel */}
                <div className="relative p-2 sm:p-2.5 rounded-full bg-gradient-to-b from-neutral-700 via-neutral-900 to-black shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.2)]">
                  {/* The Spherical Core (The Ball) */}
                  <div
                    className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-84 md:h-84 rounded-full overflow-hidden flex shadow-[inset_0_4px_16px_rgba(255,255,255,0.15),inset_0_-12px_24px_rgba(0,0,0,0.9)] select-none border border-neutral-700/60"
                    style={{
                      background: 'radial-gradient(circle at 50% 15%, #2a2b36 0%, #111217 65%, #070709 100%)',
                    }}
                  >
                    {/* Left Hemisphere: Snap (Camera) */}
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('medium');
                        startCamera();
                      }}
                      className="w-1/2 h-full relative cursor-pointer group/cam flex flex-col items-center justify-center p-3 sm:p-6 text-center transition-all duration-300 hover:bg-amber-500/15 active:scale-95 focus:outline-none overflow-hidden"
                    >
                      <img
                        src={mirrorSelfieBg}
                        alt="Mirror selfie preview"
                        className="absolute inset-0 w-full h-full object-cover object-center opacity-30 group-hover/cam:opacity-50 group-hover/cam:scale-110 transition-all duration-500 filter saturate-[0.85] contrast-[1.1]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/70 to-neutral-950/50 pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-transparent to-transparent opacity-70 group-hover/cam:opacity-100 transition-opacity pointer-events-none" />

                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-neutral-950/80 backdrop-blur-md border border-amber-500/40 group-hover/cam:border-amber-400 group-hover/cam:scale-110 group-hover/cam:bg-amber-500/25 flex items-center justify-center mb-2 transition-all duration-300 shadow-xl">
                          <Camera className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300 group-hover/cam:rotate-[-6deg] transition-transform" />
                        </div>
                        <span className="text-xs sm:text-sm font-black text-white font-display tracking-tight group-hover/cam:text-amber-200 transition-colors">
                          Snap
                        </span>
                        <span className="text-[10px] text-amber-300/80 font-mono mt-0.5">
                          Live
                        </span>
                      </div>
                    </button>

                    {/* Vertical Dividing Seam */}
                    <div className="relative w-[1.5px] h-full bg-gradient-to-b from-white/20 via-white/50 to-white/10 shadow-[0_0_8px_rgba(255,255,255,0.4)] z-20 shrink-0"></div>

                    {/* Right Hemisphere: Upload */}
                    <button
                      type="button"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => {
                        triggerHaptic('light');
                        fileInputRef.current?.click();
                      }}
                      className="w-1/2 h-full relative cursor-pointer group/up flex flex-col items-center justify-center p-3 sm:p-6 text-center transition-all duration-300 hover:bg-rose-500/15 active:scale-95 focus:outline-none overflow-hidden"
                    >
                      <img
                        src={closetFlatlayBg}
                        alt="Closet preview"
                        className="absolute inset-0 w-full h-full object-cover object-center opacity-30 group-hover/up:opacity-50 group-hover/up:scale-110 transition-all duration-500 filter saturate-[0.85] contrast-[1.1]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/70 to-neutral-950/50 pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-bl from-rose-500/20 via-transparent to-transparent opacity-70 group-hover/up:opacity-100 transition-opacity pointer-events-none" />

                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-neutral-950/80 backdrop-blur-md border border-rose-500/40 group-hover/up:border-rose-400 group-hover/up:scale-110 group-hover/up:bg-rose-500/25 flex items-center justify-center mb-2 transition-all duration-300 shadow-xl">
                          <Upload className="w-6 h-6 sm:w-7 sm:h-7 text-rose-400 group-hover/up:rotate-[6deg] transition-transform" />
                        </div>
                        <span className="text-xs sm:text-sm font-black text-white font-display tracking-tight group-hover/up:text-rose-200 transition-colors">
                          Upload
                        </span>
                        <span className="text-[10px] text-rose-300/80 font-mono mt-0.5">
                          Gallery
                        </span>
                      </div>
                    </button>

                    {/* Center Monogram Hub */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-950/95 border border-white/25 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center">
                        <span className="text-[10px] font-black tracking-tighter bg-gradient-to-br from-amber-300 via-rose-400 to-pink-400 bg-clip-text text-transparent">
                          FC
                        </span>
                      </div>
                    </div>

                    {/* Specular Highlight Arc */}
                    <div className="pointer-events-none absolute top-1 left-4 right-4 h-24 rounded-t-full bg-gradient-to-b from-white/10 via-white/2 to-transparent blur-[1px]" />
                  </div>
                </div>
              </div>

              {cameraError && (
                <div className="mt-4 px-3.5 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-center max-w-xs z-10">
                  <p className="text-xs text-rose-400 font-medium">
                    {cameraError}
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>

        {/* Right Column: Minimalist Control Panel (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-neutral-900/50 rounded-3xl border border-neutral-800/80 p-5 sm:p-6 backdrop-blur-sm">
            {/* Minimal Section Label */}
            <div className="flex items-center justify-between mb-3 text-xs text-neutral-400 font-medium">
              <span className="flex items-center gap-1.5 text-white font-bold">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>Vibe</span>
              </span>
              <span className="text-[11px] font-mono text-neutral-500">
                {selectedOccasion}
              </span>
            </div>

            {/* Occasion Icon Pills (2 x 3 Minimal Grid) */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {OCCASIONS.map((occ) => {
                const isSelected = selectedOccasion === occ.id;
                const Icon = occ.icon;

                return (
                  <button
                    key={occ.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setSelectedOccasion(occ.id);
                    }}
                    className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl border transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-rose-500/15 border-rose-500/60 text-white shadow-sm'
                        : 'bg-neutral-950/60 hover:bg-neutral-800/60 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-transform ${isSelected ? 'text-rose-400 scale-110' : 'text-neutral-500'}`} />
                    <span className="text-[11px] font-semibold tracking-tight">
                      {occ.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Minimalist Question / Note Input */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-500">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <input
                id="user-note-input"
                type="text"
                value={userNote}
                onChange={(e) => setUserNote(e.target.value)}
                placeholder="Question or styling note..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>

            {/* Wardrobe Indicator Strip */}
            <div className="py-2 px-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80 mb-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Shirt className="w-3.5 h-3.5 text-rose-400/80" />
                <span className="text-neutral-300 font-medium text-xs">Wardrobe</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                {closetItems.length} synced
              </span>
            </div>

            {/* Main Action Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!selectedImage || isAnalyzing}
              className={`w-full py-3.5 px-5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl active:scale-[0.98] ${
                selectedImage && !isAnalyzing
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-500/25 hover:from-rose-400 hover:to-pink-400'
                  : 'bg-neutral-800/80 text-neutral-500 cursor-not-allowed border border-neutral-700/30'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAnalyzing ? 'Checking...' : 'Check Fit'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
