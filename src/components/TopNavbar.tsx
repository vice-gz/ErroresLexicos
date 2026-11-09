import React from 'react';
import {
  Terminal,
  Cpu,
  History,
  BookOpen,
  Info,
  Sparkles
} from 'lucide-react';
import { EndermanMascot } from './EndermanMascot';

export type ActiveTab = 'analyzer' | 'tokens' | 'history' | 'rules' | 'about';

interface TopNavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  totalTokens: number;
  totalErrors: number;
  historyCount: number;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeTab,
  onSelectTab,
  totalTokens,
  totalErrors,
  historyCount
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'analyzer',
      label: 'Analizador',
      icon: <Terminal className="w-4 h-4" />
    },
    {
      id: 'tokens',
      label: 'Tokens',
      icon: <Cpu className="w-4 h-4" />,
      badge: totalTokens
    },
    {
      id: 'history',
      label: 'Historial',
      icon: <History className="w-4 h-4" />,
      badge: historyCount
    },
    {
      id: 'rules',
      label: 'Reglas léxicas',
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      id: 'about',
      label: 'Acerca de',
      icon: <Info className="w-4 h-4" />
    }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#191521]/95 backdrop-blur-md border-b border-[#40334F] shadow-lg">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left Brand: Vice Logo + Title + Subtitle */}
        <div className="flex items-center gap-3.5">
          <EndermanMascot variant="header" hasErrors={totalErrors > 0} />
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#F3ECFA] flex items-center gap-1.5">
                <span className="text-[#A875F5]">JVVG (Vice)</span>
                <span className="text-[#40334F]">—</span>
                <span>Analizador de errores léxicos</span>
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-[#292136] text-[#C4A1FF] border border-[#40334F]">
                <Sparkles className="w-3 h-3 text-[#A875F5]" />
                v1.0.0
              </span>
            </div>
            <p className="text-xs font-mono text-[#A99DB5] tracking-wider uppercase">
              Lexical Error Analyzer · Python · C++ · Java
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-1.5 bg-[#111019] p-1 rounded-xl border border-[#40334F] overflow-x-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#8053C8] text-[#F3ECFA] shadow-[0_0_14px_rgba(128,83,200,0.45)]'
                    : 'text-[#A99DB5] hover:text-[#F3ECFA] hover:bg-[#211B2B]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-semibold ${
                      isActive
                        ? 'bg-[#111019]/50 text-[#F3ECFA]'
                        : 'bg-[#292136] text-[#C4A1FF]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
