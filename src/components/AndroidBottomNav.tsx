import React from 'react';
import { ActiveTab } from '../types';
import { Camera, TrendingUp, Shirt, Calendar } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface AndroidBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  closetCount: number;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({
  activeTab,
  setActiveTab,
  closetCount,
}) => {
  const tabs = [
    {
      id: 'scanner' as ActiveTab,
      label: 'Scanner',
      icon: Camera,
    },
    {
      id: 'trending' as ActiveTab,
      label: 'Trends',
      icon: TrendingUp,
    },
    {
      id: 'closet' as ActiveTab,
      label: 'Closet',
      icon: Shirt,
      badge: closetCount > 0 ? closetCount : undefined,
    },
    {
      id: 'history' as ActiveTab,
      label: 'Daily Log',
      icon: Calendar,
    },
  ];

  const handleTabClick = (tabId: ActiveTab) => {
    triggerHaptic('light');
    setActiveTab(tabId);
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-2xl border-t border-neutral-800/80 px-2 pt-1 pb-safe select-none shadow-[0_-8px_30px_rgba(0,0,0,0.7)]"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)' }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto h-14">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className="relative flex-1 flex flex-col items-center justify-center py-1 transition-transform active:scale-95 text-center group"
            >
              {/* Active pill indicator Material-style */}
              <div
                className={`relative px-4 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                  isActive
                    ? 'bg-rose-500/20 text-rose-400'
                    : 'text-neutral-400 group-hover:text-neutral-200'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'scale-100 stroke-[1.8]'
                  }`}
                />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 px-1.5 min-w-[16px] h-4 rounded-full bg-rose-500 text-white font-mono text-[9px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-semibold mt-0.5 tracking-tight transition-colors ${
                  isActive ? 'text-rose-400 font-bold' : 'text-neutral-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
