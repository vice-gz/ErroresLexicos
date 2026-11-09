import React from 'react';
import {
  History,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileCode
} from 'lucide-react';
import { AnalysisResult } from '../lexer/types';
import { LANGUAGE_LABELS } from '../lexer/scanner';

interface HistoryViewProps {
  history: AnalysisResult[];
  onRestoreHistoryItem: (item: AnalysisResult) => void;
  onClearHistory: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onRestoreHistoryItem,
  onClearHistory
}) => {
  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-[#211B2B] border border-[#40334F] rounded-xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#A875F5] text-xs font-mono uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            <span>Persistencia en LocalStorage</span>
          </div>
          <h2 className="text-lg font-bold text-[#F3ECFA]">
            Historial de Ejecuciones Léxicas ({history.length})
          </h2>
          <p className="text-xs text-[#A99DB5] mt-0.5">
            Cada ejecución del analizador se guarda automáticamente con su código fuente, lenguaje y métricas para que puedas restaurarla en un clic.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#EF4444]/15 hover:bg-[#EF4444]/25 text-[#EF4444] border border-[#EF4444]/40 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Limpiar historial</span>
          </button>
        )}
      </div>

      {/* History Cards List */}
      {history.length === 0 ? (
        <div className="bg-[#211B2B] border border-[#40334F] rounded-xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#292136] border border-[#40334F] text-[#A875F5] flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#F3ECFA]">
            Aún no hay ejecuciones registradas en el historial
          </h3>
          <p className="text-xs text-[#A99DB5] max-w-md mx-auto">
            Presiona el botón <strong>"Ejecutar análisis léxico"</strong> o selecciona un ejemplo de prueba en la pestaña Analizador para almacenar registros aquí.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((item) => {
            const hasErrors = item.errors.length > 0;
            return (
              <div
                key={item.id}
                className="bg-[#211B2B] border border-[#40334F] hover:border-[#8053C8] rounded-xl p-4 shadow-lg flex flex-col justify-between gap-3 transition-all"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#8053C8]/25 text-[#C4A1FF] border border-[#8053C8]/50">
                        {LANGUAGE_LABELS[item.language]}
                      </span>
                      <span className="text-xs font-mono text-[#A99DB5] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#A875F5]" />
                        {item.timestamp}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border ${
                        hasErrors
                          ? 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/40'
                          : 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/40'
                      }`}
                    >
                      {hasErrors ? (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{item.errors.length} errores léxicos</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>0 errores léxicos</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Code Snippet Preview */}
                  <div className="relative rounded-lg bg-[#111019] border border-[#40334F] p-3 font-mono text-xs text-[#F3ECFA] overflow-x-auto max-h-28">
                    <pre className="leading-relaxed">
                      {item.sourceCode.length > 220
                        ? `${item.sourceCode.slice(0, 220)}...`
                        : item.sourceCode}
                    </pre>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#40334F]/60">
                  <div className="flex items-center gap-3 text-xs font-mono text-[#A99DB5]">
                    <span className="flex items-center gap-1">
                      <FileCode className="w-3.5 h-3.5 text-[#C4A1FF]" />
                      {item.tokens.length} tokens
                    </span>
                    <span>·</span>
                    <span>{item.statistics.linesAnalyzed} líneas</span>
                    <span>·</span>
                    <span>{item.durationMs} ms</span>
                  </div>

                  <button
                    onClick={() => onRestoreHistoryItem(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#8053C8] hover:bg-[#A875F5] text-[#F3ECFA] transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Recargar en el editor</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
