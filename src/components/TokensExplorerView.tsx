import React, { useState } from 'react';
import { Search, Filter, Cpu, ArrowUpRight, Layers } from 'lucide-react';
import { AnalysisResult, Token, TokenCategory } from '../lexer/types';
import { CATEGORY_LABELS, LANGUAGE_LABELS } from '../lexer/scanner';
import { TokenBadge } from './TokenBadge';

interface TokensExplorerViewProps {
  result: AnalysisResult;
  onJumpToTokenInAnalyzer: (token: Token) => void;
}

export const TokensExplorerView: React.FC<TokensExplorerViewProps> = ({
  result,
  onJumpToTokenInAnalyzer
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TokenCategory | 'ALL'>('ALL');

  const categoriesCount = result.tokens.reduce<Record<string, number>>((acc, tok) => {
    acc[tok.category] = (acc[tok.category] || 0) + 1;
    return acc;
  }, {});

  const filteredTokens = result.tokens.filter((tok) => {
    const matchesCategory = selectedCategory === 'ALL' || tok.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      tok.lexeme.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tok.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tok.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-[#211B2B] border border-[#40334F] rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#A875F5] text-xs font-mono uppercase tracking-wider mb-1">
              <Cpu className="w-4 h-4" />
              <span>Explorador Detallado de Flujo de Tokens</span>
            </div>
            <h2 className="text-lg font-bold text-[#F3ECFA]">
              Tokens Reconocidos en {LANGUAGE_LABELS[result.language]} ({result.tokens.length} unidades)
            </h2>
            <p className="text-xs text-[#A99DB5] mt-0.5">
              Inspecciona cada lexema clasificado por el escáner, su categoría gramatical, línea/columna y offsets exactos.
            </p>
          </div>

          {/* Search & Category Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-[#A99DB5] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar lexema o descripción..."
                className="pl-9 pr-3 py-2 rounded-xl bg-[#111019] border border-[#40334F] text-xs text-[#F3ECFA] placeholder-[#A99DB5] focus:outline-none focus:border-[#A875F5] w-60"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-[#111019] px-3 py-2 rounded-xl border border-[#40334F]">
              <Filter className="w-3.5 h-3.5 text-[#A875F5]" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as TokenCategory | 'ALL')}
                className="bg-transparent text-xs text-[#F3ECFA] focus:outline-none"
              >
                <option value="ALL" className="bg-[#111019]">
                  Todas las categorías ({result.tokens.length})
                </option>
                {(Object.keys(CATEGORY_LABELS) as TokenCategory[]).map((cat) => (
                  <option key={cat} value={cat} className="bg-[#111019]">
                    {CATEGORY_LABELS[cat]} ({categoriesCount[cat] || 0})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quick Category Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-[#40334F]/70">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-[#8053C8] text-[#F3ECFA]'
                : 'bg-[#191521] text-[#A99DB5] hover:text-[#F3ECFA] border border-[#40334F]'
            }`}
          >
            Todos ({result.tokens.length})
          </button>
          {(Object.keys(CATEGORY_LABELS) as TokenCategory[]).map((cat) => {
            const count = categoriesCount[cat] || 0;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#8053C8] text-[#F3ECFA]'
                    : 'bg-[#191521] text-[#A99DB5] hover:text-[#F3ECFA] border border-[#40334F]'
                }`}
              >
                {CATEGORY_LABELS[cat]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Full Width Tokens Table */}
      <div className="bg-[#211B2B] border border-[#40334F] rounded-xl shadow-xl overflow-hidden">
        {filteredTokens.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Layers className="w-8 h-8 text-[#A875F5] mx-auto opacity-60" />
            <p className="text-sm font-semibold text-[#F3ECFA]">
              No se encontraron tokens con los criterios actuales
            </p>
            <p className="text-xs text-[#A99DB5]">
              Prueba limpiando el filtro de búsqueda o ejecutando un análisis en la vista principal.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#191521] text-[11px] font-mono uppercase text-[#A99DB5] border-b border-[#40334F]">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Lexema</th>
                  <th className="py-3 px-4">Categoría Léxica</th>
                  <th className="py-3 px-4">Línea</th>
                  <th className="py-3 px-4">Columna</th>
                  <th className="py-3 px-4">Offsets</th>
                  <th className="py-3 px-4">Descripción Técnica</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#40334F]/50 text-xs">
                {filteredTokens.map((tok) => (
                  <tr
                    key={tok.index}
                    className="hover:bg-[#292136]/70 transition-colors"
                  >
                    <td className="py-2.5 px-4 font-mono text-[#A99DB5]">{tok.index}</td>
                    <td className="py-2.5 px-4 font-mono">
                      <code className="px-2 py-0.5 rounded bg-[#111019] text-[#F3ECFA] border border-[#40334F] break-all">
                        {tok.lexeme}
                      </code>
                    </td>
                    <td className="py-2.5 px-4">
                      <TokenBadge category={tok.category} />
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[#C4A1FF]">{tok.line}</td>
                    <td className="py-2.5 px-4 font-mono text-[#C4A1FF]">{tok.column}</td>
                    <td className="py-2.5 px-4 font-mono text-[#A99DB5]">
                      [{tok.startOffset}, {tok.endOffset})
                    </td>
                    <td className="py-2.5 px-4 text-[#A99DB5] max-w-md">
                      {tok.description}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={() => onJumpToTokenInAnalyzer(tok)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#191521] hover:bg-[#8053C8] text-[#C4A1FF] hover:text-[#F3ECFA] border border-[#40334F] transition-colors"
                      >
                        <span>Ver en editor</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
