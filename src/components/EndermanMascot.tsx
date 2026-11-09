import React from 'react';

interface EndermanMascotProps {
  variant?: 'header' | 'card' | 'hero';
  hasErrors?: boolean;
}

export const EndermanMascot: React.FC<EndermanMascotProps> = ({
  variant = 'header',
  hasErrors = false
}) => {
  const eyeMainColor = hasErrors ? '#EF4444' : '#A875F5';
  const eyeCenterColor = hasErrors ? '#FCA5A5' : '#C4A1FF';
  const particleColor = hasErrors ? '#F87171' : '#A875F5';

  if (variant === 'header') {
    return (
      <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-[#191521] border border-[#40334F] shadow-inner overflow-hidden group select-none">
        {/* Subtle floating particles */}
        <span
          className="absolute top-1 left-1 w-1 h-1 rounded-none animate-particle-fast"
          style={{ backgroundColor: particleColor }}
        />
        <span
          className="absolute bottom-1.5 right-1 w-1 h-1 rounded-none animate-particle-slow"
          style={{ backgroundColor: '#C4A1FF' }}
        />

        {/* 16x16 Pixel Art Enderman Head SVG */}
        <svg
          viewBox="0 0 16 16"
          className="w-7 h-7 transition-transform duration-300 group-hover:scale-110"
          shapeRendering="crispEdges"
          aria-label="Mascota Enderman Vice"
        >
          {/* Head Base */}
          <rect x="2" y="2" width="12" height="12" fill="#0B0910" />
          {/* Subtle top/side dark texture pixels */}
          <rect x="2" y="2" width="12" height="1" fill="#191521" />
          <rect x="2" y="3" width="1" height="10" fill="#16121E" />
          <rect x="13" y="3" width="1" height="10" fill="#16121E" />
          <rect x="4" y="3" width="2" height="1" fill="#1F192B" />
          <rect x="10" y="4" width="2" height="1" fill="#1F192B" />

          {/* Glowing Eyes (Row 8-9) */}
          {/* Left Eye (3 pixels wide: outer, bright center, outer) */}
          <rect x="3" y="8" width="3" height="2" fill={eyeMainColor} />
          <rect x="4" y="8" width="1" height="2" fill={eyeCenterColor} />

          {/* Right Eye */}
          <rect x="10" y="8" width="3" height="2" fill={eyeMainColor} />
          <rect x="11" y="8" width="1" height="2" fill={eyeCenterColor} />

          {/* Mouth/jaw shadow hint */}
          <rect x="5" y="12" width="6" height="1" fill="#15111D" />
        </svg>
      </div>
    );
  }

  // Full stylized Enderman upper-body + floating Ender particles for sidebar/status card
  return (
    <div className="relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl bg-[#191521]/90 border border-[#40334F] overflow-hidden">
      {/* Ambient glow behind mascot */}
      <div
        className="absolute -left-3 -top-3 w-16 h-16 rounded-full blur-xl opacity-25 pointer-events-none"
        style={{ backgroundColor: eyeMainColor }}
      />

      <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
        <svg
          viewBox="0 0 24 24"
          className="w-12 h-12 animate-eye-glow"
          shapeRendering="crispEdges"
        >
          {/* Floating Ender Particles (Pixel blocks) */}
          <rect x="1" y="3" width="2" height="2" fill={particleColor} opacity="0.85" />
          <rect x="2" y="2" width="1" height="1" fill="#111019" />
          <rect x="20" y="4" width="2" height="2" fill="#C4A1FF" opacity="0.8" />
          <rect x="2" y="16" width="2" height="2" fill="#8053C8" opacity="0.75" />
          <rect x="21" y="15" width="1" height="2" fill={particleColor} opacity="0.9" />

          {/* Enderman Head */}
          <rect x="6" y="3" width="12" height="10" fill="#0A080E" />
          <rect x="6" y="3" width="12" height="1" fill="#211B2B" />
          <rect x="6" y="4" width="1" height="8" fill="#191521" />
          <rect x="17" y="4" width="1" height="8" fill="#191521" />

          {/* Glowing Eyes */}
          <rect x="7" y="8" width="4" height="2" fill={eyeMainColor} />
          <rect x="8" y="8" width="2" height="2" fill={eyeCenterColor} />

          <rect x="13" y="8" width="4" height="2" fill={eyeMainColor} />
          <rect x="14" y="8" width="2" height="2" fill={eyeCenterColor} />

          {/* Slender Neck & Shoulders */}
          <rect x="11" y="13" width="2" height="2" fill="#0A080E" />
          <rect x="7" y="15" width="10" height="7" fill="#0D0B12" />
          {/* Arms */}
          <rect x="5" y="15" width="2" height="9" fill="#09070D" />
          <rect x="17" y="15" width="2" height="9" fill="#09070D" />
          {/* Subtle Ender Core Chest detail */}
          <rect x="11" y="17" width="2" height="2" fill={eyeMainColor} opacity="0.55" />
        </svg>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C4A1FF]">
            Vice Scanner Core
          </span>
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              hasErrors ? 'bg-[#EF4444] animate-ping' : 'bg-[#22C55E]'
            }`}
          />
        </div>
        <p className="text-xs text-[#A99DB5] truncate mt-0.5">
          {hasErrors
            ? 'Anomalías léxicas detectadas en el código'
            : 'Autómata en vigilancia · Alfabeto íntegro'}
        </p>
      </div>
    </div>
  );
};
