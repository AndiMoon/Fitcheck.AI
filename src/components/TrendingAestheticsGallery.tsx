import React, { useState, useEffect } from 'react';
import { TrendingAesthetic } from '../types';
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ArrowRight,
  ExternalLink,
  MapPin,
  Globe2,
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface TrendingAestheticsGalleryProps {
  onStyleAesthetic: (aesthetic: TrendingAesthetic) => void;
}

const CITY_FILTERS = [
  { id: 'all', label: 'All Capitals' },
  { id: 'milan', label: '🇮🇹 Milano' },
  { id: 'paris', label: '🇫🇷 Paris' },
  { id: 'london', label: '🇬🇧 London' },
  { id: 'nyc', label: '🇺🇸 New York' },
];

export const TrendingAestheticsGallery: React.FC<TrendingAestheticsGalleryProps> = ({
  onStyleAesthetic,
}) => {
  const [trends, setTrends] = useState<TrendingAesthetic[]>([]);
  const [sources, setSources] = useState<{ title: string; url: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [copiedHashtagsId, setCopiedHashtagsId] = useState<string | null>(null);

  const fetchFashionNews = async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/trending-aesthetics${forceRefresh ? '?refresh=true' : ''}`);
      const data = await res.json();
      if (data && Array.isArray(data.trends)) {
        setTrends(data.trends);
        setSources(data.sources || []);
      }
    } catch {
      // Graceful fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFashionNews();
  }, []);

  const handleCopyHashtags = (trend: TrendingAesthetic) => {
    triggerHaptic('light');
    const text = trend.viralHashtags.join(' ');
    navigator.clipboard.writeText(text);
    setCopiedHashtagsId(trend.id);
    setTimeout(() => setCopiedHashtagsId(null), 2000);
  };

  const getCityFromTrend = (trend: TrendingAesthetic): string => {
    if (trend.city) return trend.city.toLowerCase();
    const str = `${trend.name} ${trend.category} ${trend.summary}`.toLowerCase();
    if (str.includes('milan') || str.includes('ital')) return 'milan';
    if (str.includes('paris') || str.includes('french')) return 'paris';
    if (str.includes('london') || str.includes('brit')) return 'london';
    if (str.includes('new york') || str.includes('nyc') || str.includes('soho')) return 'nyc';
    return 'global';
  };

  const filteredTrends = selectedCity === 'all'
    ? trends
    : trends.filter((t) => {
        const cityKey = getCityFromTrend(t);
        if (selectedCity === 'milan') return cityKey === 'milan' || t.name.toLowerCase().includes('milan');
        if (selectedCity === 'paris') return cityKey === 'paris' || t.name.toLowerCase().includes('paris');
        if (selectedCity === 'london') return cityKey === 'london' || t.name.toLowerCase().includes('london');
        if (selectedCity === 'nyc') return cityKey === 'nyc' || t.name.toLowerCase().includes('nyc') || t.name.toLowerCase().includes('new york');
        return true;
      });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-2">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Global Fashion News</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
            Milano · Paris · London · NYC
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-400 max-w-xl">
            Recent runway highlights and viral street style trends from the fashion capitals.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => fetchFashionNews(true)}
            disabled={isLoading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold border border-neutral-800 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-rose-400' : ''}`} />
            <span>{isLoading ? 'Updating...' : 'Refresh News'}</span>
          </button>
        </div>
      </div>

      {/* City Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {CITY_FILTERS.map((city) => (
          <button
            key={city.id}
            onClick={() => {
              triggerHaptic('light');
              setSelectedCity(city.id);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCity === city.id
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            {city.label}
          </button>
        ))}
      </div>

      {/* News Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 animate-pulse h-64"
            >
              <div className="w-24 h-4 bg-neutral-800 rounded mb-3"></div>
              <div className="w-3/4 h-5 bg-neutral-800 rounded mb-2"></div>
              <div className="w-full h-12 bg-neutral-800/60 rounded mb-4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTrends.map((trend) => {
            const cityName = trend.cityName || (
              trend.city === 'Milan' ? 'Milano 🇮🇹' :
              trend.city === 'Paris' ? 'Paris 🇫🇷' :
              trend.city === 'London' ? 'London 🇬🇧' :
              trend.city === 'New York' ? 'New York 🇺🇸' : 'Capital Dispatch'
            );

            return (
              <div
                key={trend.id}
                className="group relative p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800/80 hover:border-neutral-700/80 transition-all flex flex-col justify-between shadow-lg"
              >
                <div>
                  {/* City Pill & Growth index */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/25 text-rose-300 text-[11px] font-bold">
                      <MapPin className="w-3 h-3" />
                      {cityName}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 truncate">
                      {trend.growthIndex}
                    </span>
                  </div>

                  {/* Headline */}
                  <h3 className="text-base font-bold text-white font-display tracking-tight leading-snug mb-2 group-hover:text-rose-200 transition-colors">
                    {trend.name}
                  </h3>

                  {/* Short summary */}
                  <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                    {trend.summary}
                  </p>

                  {/* Key Pieces Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {trend.keyPieces.slice(0, 3).map((piece, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium text-neutral-300 bg-neutral-800/80 px-2 py-0.5 rounded-md border border-neutral-700/50"
                      >
                        {piece}
                      </span>
                    ))}
                  </div>

                  {/* Color Palette Dots */}
                  {trend.colorPalette && trend.colorPalette.length > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[10px] text-neutral-500 font-medium">Palette:</span>
                      <div className="flex items-center gap-1">
                        {trend.colorPalette.map((col, idx) => (
                          <div
                            key={idx}
                            title={col.name}
                            className="w-3.5 h-3.5 rounded-full border border-neutral-700 shadow-sm"
                            style={{ backgroundColor: col.hex }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 1-Line Styling Rule */}
                  <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 text-[11px] text-neutral-300 mb-4">
                    <span className="text-rose-400 font-bold mr-1">Rule:</span>
                    <span>{trend.stylingRule}</span>
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      triggerHaptic('medium');
                      onStyleAesthetic(trend);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition-all active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Style this Look</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleCopyHashtags(trend)}
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors border border-neutral-700/80 shrink-0"
                    title="Copy viral hashtags"
                  >
                    {copiedHashtagsId === trend.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Clean Footer Sources */}
      {sources.length > 0 && (
        <div className="mt-8 pt-4 border-t border-neutral-900 flex flex-wrap items-center justify-between gap-3 text-[11px] text-neutral-500">
          <span>Fashion Dispatches Grounded via Google Search</span>
          <div className="flex flex-wrap items-center gap-3">
            {sources.slice(0, 3).map((src, i) => (
              <a
                key={i}
                href={src.url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-rose-400 transition-colors flex items-center gap-1 truncate max-w-[200px]"
              >
                <span>{src.title}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
