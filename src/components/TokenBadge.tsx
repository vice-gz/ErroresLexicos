import React from 'react';
import { TokenCategory } from '../lexer/types';
import { CATEGORY_LABELS } from '../lexer/scanner';

export const TOKEN_CATEGORY_STYLES: Record<TokenCategory, string> = {
  KEYWORD: 'bg-[#8053C8]/25 text-[#C4A1FF] border-[#8053C8]/60',
  IDENTIFIER: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
  INTEGER: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  FLOAT: 'bg-orange-500/15 text-orange-300 border-orange-500/40',
  STRING: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  CHAR: 'bg-teal-500/15 text-teal-300 border-teal-500/40',
  PREPROCESSOR: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
  ANNOTATION: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/50',
  OPERATOR: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  DELIMITER: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
  COMMENT: 'bg-zinc-700/30 text-zinc-400 border-zinc-600/40'
};

interface TokenBadgeProps {
  category: TokenCategory;
}

export const TokenBadge: React.FC<TokenBadgeProps> = ({ category }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-mono font-medium border ${TOKEN_CATEGORY_STYLES[category]}`}
    >
      <span>{CATEGORY_LABELS[category]}</span>
      <span className="opacity-60 text-[10px]">({category})</span>
    </span>
  );
};
