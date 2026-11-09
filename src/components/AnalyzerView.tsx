import React, { useState } from 'react';
import {
  Play,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Code2,
  Layers,
  Crosshair,
  Lightbulb,
  Sparkles,
  FileCode,
  Filter,
  Clock
} from 'lucide-react';
import {
  AnalysisResult,
  SupportedLanguage,
  TokenCategory,
  LexicalError,
  Token
} from '../lexer/types';
import { CODE_EXAMPLES } from '../lexer/examples';
import { CATEGORY_LABELS, LANGUAGE_LABELS } from '../lexer/scanner';
import { ViceCodeEditor, CodeEditorHandle } from './ViceCodeEditor';
import { EndermanMascot } from './EndermanMascot';
import { TokenBadge } from './TokenBadge';

interface AnalyzerViewProps {
  code: string;
  language: SupportedLanguage;
  result: AnalysisResult;
  onCodeChange: (code: string) => void;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onRunAnalysis: () => void;
  onClearEditor: () => void;
  onLoadExample: (exampleCode: string) => void;
  editorRef: React.MutableRefObject<CodeEditorHandle | null>;
}

export const AnalyzerView: React.FC<AnalyzerViewProps> = ({
  code,
  language,
  result,
  onCodeChange,
  onLanguageChange,
  onRunAnalysis,
  onClearEditor,
  onLoadExample,
  editorRef
}) => {
  const [resultsSubTab, setResultsSubTab] = useState<'errors' | 'tokens'>('errors');
  const [categoryFilter, setCategoryFilter] = useState<TokenCategory | 'ALL'>('ALL');
  const [showComments, setShowComments] = useState<boolean>(true);

  const examplesForLang = CODE_EXAMPLES[language];
  const hasErrors = result.errors.length > 0;

  const filteredTokens = result.tokens.filter((t) => {
    if (!showComments && t.category === 'COMMENT') return false;
    if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;
    return true;
  });

  const handleJumpToError = (err: LexicalError) => {
    editorRef.current?.focusLocation(err.startOffset, err.endOffset);
  };

  const handleJumpToToken = (tok: Token) => {
    editorRef.current?.focusLocation(tok.startOffset, tok.endOffset);
  };

  return (
    <div className="space-y-5">
      {/* Top Action & Language Bar */}
      <div className="bg-[#211B2B] border border-[#40334F] rounded-xl p-4 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Language Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#A99DB5] flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-[#A875F5]" />
              Lenguaje activo:
            </span>
            <div className="inline-flex rounded-xl bg-[#111019] p-1 border border-[#40334F]">
              {(['python', 'cpp', 'java'] as SupportedLanguage[]).map((lang) => {
                const active = language === lang;
                return (
                  <button
                    key={lang}
                    onClick={() => onLanguageChange(lang)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                      active
                        ? 'bg-[#8053C8] text-[#F3ECFA] shadow-[0_0_12px_rgba(128,83,200,0.5)]'
                        : 'text-[#A99DB5] hover:text-[#F3ECFA] hover:bg-[#191521]'
                    }`}
                  >
                    {LANGUAGE_LABELS[lang]}
                  </button>
                );
              })}
            </div>

            {/* Contextual Language Rule Quick Pill */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#191521] border border-[#40334F] text-xs text-[#A99DB5]">
              <Sparkles className="w-3.5 h-3.5 text-[#A875F5] shrink-0" />
              {language === 'python' && (
                <span>
                  En <strong className="text-[#F3ECFA]">Python</strong>: <code className="text-[#C4A1FF]">@</code> es operador/decorador válido y <code className="text-[#C4A1FF]">#</code> inicia comentario; <code className="text-[#EF4444]">$</code> y <code className="text-[#EF4444]">§</code> son errores léxicos.
                </span>
              )}
              {language === 'cpp' && (
                <span>
                  En <strong className="text-[#F3ECFA]">C++</strong>: <code className="text-[#C4A1FF]">#include</code> es directiva de preprocesador; <code className="text-[#EF4444]">@</code> y <code className="text-[#EF4444]">$</code> fuera de cadenas son errores léxicos.
                </span>
              )}
              {language === 'java' && (
                <span>
                  En <strong className="text-[#F3ECFA]">Java</strong>: <code className="text-[#C4A1FF]">@Identificador</code> es anotación y <code className="text-[#C4A1FF]">$</code> es válido en ID; <code className="text-[#EF4444]">@</code> suelto y <code className="text-[#EF4444]">#</code> son errores léxicos.
                </span>
              )}
            </div>
          </div>

          {/* Mascot Status Card */}
          <EndermanMascot variant="card" hasErrors={hasErrors} />
        </div>

        {/* Interactive Test Cases Bar */}
        <div className="mt-4 pt-3.5 border-t border-[#40334F]/70 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-[#A99DB5] flex items-center gap-1.5 mr-1">
            <FileCode className="w-3.5 h-3.5 text-[#C4A1FF]" />
            Casos de prueba ({LANGUAGE_LABELS[language]}):
          </span>
          {examplesForLang.map((ex) => (
            <button
              key={ex.id}
              onClick={() => onLoadExample(ex.code)}
              title={ex.description}
              className="group flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs bg-[#191521] hover:bg-[#292136] text-[#F3ECFA] border border-[#40334F] hover:border-[#8053C8] transition-all"
            >
              <span className="truncate max-w-[230px]">{ex.title}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
                  ex.badge.includes('0')
                    ? 'bg-[#22C55E]/15 text-[#22C55E]'
                    : 'bg-[#EF4444]/15 text-[#EF4444]'
                }`}
              >
                {ex.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column IDE Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: CodeMirror 6 Source Editor (7 cols on large screens) */}
        <div className="lg:col-span-6 flex flex-col bg-[#211B2B] border border-[#40334F] rounded-xl shadow-xl overflow-hidden">
          {/* Editor Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-[#191521] border-b border-[#40334F]">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/80" />
              </div>
              <span className="text-xs font-mono font-semibold text-[#F3ECFA] ml-1">
                source_buffer.{language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : 'java'}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#292136] text-[#C4A1FF] border border-[#40334F]">
                {result.statistics.linesAnalyzed} líneas · {code.length} chars
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClearEditor}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#292136] hover:bg-[#40334F] text-[#F3ECFA] border border-[#40334F] transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-[#A99DB5]" />
                Limpiar editor
              </button>
              <button
                onClick={onRunAnalysis}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#8053C8] hover:bg-[#A875F5] text-[#F3ECFA] shadow-[0_0_15px_rgba(128,83,200,0.45)] transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Ejecutar análisis léxico
              </button>
            </div>
          </div>

          {/* CodeMirror 6 Editor Container */}
          <div className="h-[420px] w-full relative">
            <ViceCodeEditor
              code={code}
              language={language}
              errors={result.errors}
              onChange={onCodeChange}
              editorRef={editorRef}
            />
          </div>

          {/* Editor Footer / Status Bar */}
          <div className="px-4 py-2 bg-[#191521] border-t border-[#40334F] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#A99DB5]">
            <div className="flex items-center gap-3">
              <span>Motor: Autómata Carácter por Carácter (Maximal Munch)</span>
              <span className="hidden sm:inline text-[#40334F]">|</span>
              <span className="hidden sm:inline flex items-center gap-1">
                <Clock className="w-3 h-3 inline mr-1 text-[#A875F5]" />
                Tiempo: {result.durationMs} ms
              </span>
            </div>
            <div>
              {hasErrors ? (
                <span className="text-[#EF4444] font-semibold">
                  ● {result.errors.length} {result.errors.length === 1 ? 'error léxico marcado' : 'errores léxicos marcados'}
                </span>
              ) : (
                <span className="text-[#22C55E] font-semibold">
                  ● 0 errores léxicos
                </span>
              )}
            </div>
          </div>

          {/* Pedagogical / Didactic Card: Lexical vs Syntactic Error Distinction */}
          <div className="p-4 bg-[#191521]/90 border-t border-[#40334F] space-y-2.5">
            {result.didacticNotes.length > 0 ? (
              result.didacticNotes.map((note, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/40 text-xs leading-relaxed"
                >
                  <div className="flex items-center gap-2 font-semibold text-[#F59E0B] mb-1">
                    <Lightbulb className="w-4 h-4 shrink-0" />
                    <span>{note.title}</span>
                    {note.detectedSequence && (
                      <code className="px-1.5 py-0.5 rounded bg-[#111019] text-[#F3ECFA] font-mono text-[11px]">
                        {note.detectedSequence}
                      </code>
                    )}
                  </div>
                  <p className="text-[#F3ECFA]/90">{note.message}</p>
                </div>
              ))
            ) : (
              <div className="p-3 rounded-xl bg-[#292136]/60 border border-[#40334F] text-xs leading-relaxed">
                <div className="flex items-center gap-2 font-semibold text-[#C4A1FF] mb-1">
                  <Lightbulb className="w-4 h-4 text-[#A875F5] shrink-0" />
                  <span>Nota Pedagógica: Diferencia entre Error Léxico y Error Sintáctico</span>
                </div>
                <p className="text-[#A99DB5]">
                  ¿Por qué <code className="text-[#F3ECFA] bg-[#111019] px-1.5 py-0.5 rounded">20 + * 5;</code> no marca error léxico? Porque cada unidad individual (<code className="text-[#C4A1FF]">20</code>, <code className="text-[#C4A1FF]">+</code>, <code className="text-[#C4A1FF]">*</code>, <code className="text-[#C4A1FF]">5</code>, <code className="text-[#C4A1FF]">;</code>) pertenece al alfabeto y forma un token válido del lenguaje. El problema de tener dos operadores seguidos (<code className="text-[#F59E0B]">+ *</code>) es un <strong className="text-[#F3ECFA]">error sintáctico</strong> (de gramática/estructura), el cual corresponde a la segunda fase del compilador (<em>Parser</em>), no al analizador léxico (<em>Scanner</em>).
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Results Dashboard, Metrics, Lexical Errors & Tokens Table */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Status Banner + Summary Cards */}
          <div className="bg-[#211B2B] border border-[#40334F] rounded-xl p-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 mb-3.5 border-b border-[#40334F]">
              <div className="flex items-center gap-2.5">
                {hasErrors ? (
                  <div className="p-2 rounded-lg bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444]">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="p-2 rounded-lg bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#22C55E]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h2 className="text-sm font-bold text-[#F3ECFA]">
                    Estado del Análisis Léxico
                  </h2>
                  <p className="text-xs text-[#A99DB5]">
                    Lenguaje evaluado: <strong className="text-[#C4A1FF]">{LANGUAGE_LABELS[language]}</strong>
                  </p>
                </div>
              </div>

              <span
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border ${
                  hasErrors
                    ? 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/40'
                    : 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/40'
                }`}
              >
                {hasErrors ? 'ERRORES LÉXICOS DETECTADOS' : 'SIN ERRORES LÉXICOS'}
              </span>
            </div>

            {/* 8 Summary Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2.5 rounded-lg bg-[#191521] border border-[#40334F]">
                <span className="text-[11px] text-[#A99DB5] block">Total Tokens</span>
                <span className="text-lg font-mono font-bold text-[#F3ECFA]">
                  {result.statistics.totalTokens}
                </span>
              </div>
              <div
                className={`p-2.5 rounded-lg border ${
                  hasErrors
                    ? 'bg-[#EF4444]/10 border-[#EF4444]/40'
                    : 'bg-[#22C55E]/10 border-[#22C55E]/30'
                }`}
              >
                <span className="text-[11px] text-[#A99DB5] block">Errores Léxicos</span>
                <span
                  className={`text-lg font-mono font-bold ${
                    hasErrors ? 'text-[#EF4444]' : 'text-[#22C55E]'
                  }`}
                >
                  {result.statistics.totalErrors}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#191521] border border-[#40334F]">
                <span className="text-[11px] text-[#A99DB5] block">Líneas Analizadas</span>
                <span className="text-lg font-mono font-bold text-[#C4A1FF]">
                  {result.statistics.linesAnalyzed}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#191521] border border-[#40334F]">
                <span className="text-[11px] text-[#A99DB5] block">Identificadores</span>
                <span className="text-lg font-mono font-bold text-sky-300">
                  {result.statistics.identifiersCount}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#191521] border border-[#40334F]">
                <span className="text-[11px] text-[#A99DB5] block">Palabras Reservadas</span>
                <span className="text-lg font-mono font-bold text-[#A875F5]">
                  {result.statistics.keywordsCount}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#191521] border border-[#40334F]">
                <span className="text-[11px] text-[#A99DB5] block">Operadores</span>
                <span className="text-lg font-mono font-bold text-purple-300">
                  {result.statistics.operatorsCount}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#191521] border border-[#40334F]">
                <span className="text-[11px] text-[#A99DB5] block">Literales Numéricos</span>
                <span className="text-lg font-mono font-bold text-amber-300">
                  {result.statistics.numericLiteralsCount}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#191521] border border-[#40334F]">
                <span className="text-[11px] text-[#A99DB5] block">Cadenas / Char</span>
                <span className="text-lg font-mono font-bold text-emerald-300">
                  {result.statistics.stringLiteralsCount + result.statistics.specialTokensCount}
                </span>
              </div>
            </div>
          </div>

          {/* Tabbed Results Panel: Lexical Errors vs Tokens Table */}
          <div className="bg-[#211B2B] border border-[#40334F] rounded-xl shadow-xl overflow-hidden flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-[#191521] border-b border-[#40334F]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setResultsSubTab('errors')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    resultsSubTab === 'errors'
                      ? 'bg-[#8053C8] text-[#F3ECFA]'
                      : 'text-[#A99DB5] hover:text-[#F3ECFA] hover:bg-[#292136]'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Errores Léxicos</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      hasErrors
                        ? 'bg-[#EF4444] text-white'
                        : 'bg-[#22C55E]/20 text-[#22C55E]'
                    }`}
                  >
                    {result.errors.length}
                  </span>
                </button>

                <button
                  onClick={() => setResultsSubTab('tokens')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    resultsSubTab === 'tokens'
                      ? 'bg-[#8053C8] text-[#F3ECFA]'
                      : 'text-[#A99DB5] hover:text-[#F3ECFA] hover:bg-[#292136]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Tabla de Tokens</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[#292136] text-[#C4A1FF]">
                    {result.tokens.length}
                  </span>
                </button>
              </div>

              {resultsSubTab === 'tokens' && (
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-[#A875F5]" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as TokenCategory | 'ALL')}
                    className="bg-[#111019] text-[#F3ECFA] text-xs rounded-lg px-2.5 py-1 border border-[#40334F] focus:outline-none focus:border-[#A875F5]"
                  >
                    <option value="ALL">Todas las categorías</option>
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <label className="flex items-center gap-1.5 text-xs text-[#A99DB5] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={showComments}
                      onChange={(e) => setShowComments(e.target.checked)}
                      className="rounded border-[#40334F] bg-[#111019] text-[#8053C8]"
                    />
                    <span>Comentarios</span>
                  </label>
                </div>
              )}
            </div>

            {/* Subtab Content */}
            <div className="max-h-[410px] overflow-y-auto">
              {resultsSubTab === 'errors' ? (
                result.errors.length === 0 ? (
                  <div className="p-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#22C55E] flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#F3ECFA]">
                        Reconocimiento Léxico Exitoso (0 Errores Léxicos)
                      </h3>
                      <p className="text-xs text-[#A99DB5] max-w-md mx-auto mt-1">
                        Todos los lexemas del código fuente pertenecen al alfabeto formal de{' '}
                        <strong className="text-[#C4A1FF]">{LANGUAGE_LABELS[language]}</strong> y
                        fueron clasificados en {result.tokens.length} tokens válidos.
                      </p>
                    </div>
                    <button
                      onClick={() => setResultsSubTab('tokens')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#292136] hover:bg-[#8053C8] text-[#F3ECFA] border border-[#40334F] transition-colors"
                    >
                      Ver los {result.tokens.length} tokens reconocidos →
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-[#40334F]/60">
                    {result.errors.map((err) => (
                      <div
                        key={err.errorNumber}
                        onClick={() => handleJumpToError(err)}
                        className="p-4 hover:bg-[#292136]/70 transition-colors cursor-pointer group"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40">
                              Error #{err.errorNumber}
                            </span>
                            <span className="text-xs font-bold text-[#F3ECFA]">
                              {err.errorType}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-mono">
                            <span className="px-2 py-0.5 rounded bg-[#191521] text-[#C4A1FF] border border-[#40334F]">
                              Línea {err.line}, Col {err.column}
                            </span>
                            <span className="text-[11px] text-[#A99DB5] flex items-center gap-1 group-hover:text-[#A875F5]">
                              <Crosshair className="w-3.5 h-3.5" />
                              Enfocar
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 my-2">
                          <span className="text-xs text-[#A99DB5]">Lexema problemático:</span>
                          <code className="px-2 py-0.5 rounded bg-[#111019] text-[#FCA5A5] border border-[#EF4444]/40 font-mono text-xs font-semibold">
                            {err.lexeme}
                          </code>
                          <span className="text-[11px] font-mono text-[#A99DB5]">
                            (offset {err.startOffset}–{err.endOffset})
                          </span>
                        </div>

                        <p className="text-xs text-[#A99DB5] leading-relaxed">
                          {err.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                )
              ) : filteredTokens.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#A99DB5]">
                  No hay tokens que coincidan con el filtro seleccionado.
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#191521] sticky top-0 z-10 text-[11px] font-mono uppercase text-[#A99DB5] border-b border-[#40334F]">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Lexema</th>
                      <th className="py-2.5 px-3">Categoría</th>
                      <th className="py-2.5 px-3">Posición</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#40334F]/50 text-xs font-mono">
                    {filteredTokens.map((tok) => (
                      <tr
                        key={tok.index}
                        onClick={() => handleJumpToToken(tok)}
                        className="hover:bg-[#292136]/75 cursor-pointer transition-colors"
                        title="Haz clic para seleccionar este token en el editor"
                      >
                        <td className="py-2 px-3 text-[#A99DB5]">{tok.index}</td>
                        <td className="py-2 px-3">
                          <code className="px-2 py-0.5 rounded bg-[#111019] text-[#F3ECFA] border border-[#40334F]">
                            {tok.lexeme.length > 36
                              ? `${tok.lexeme.slice(0, 33)}...`
                              : tok.lexeme}
                          </code>
                        </td>
                        <td className="py-2 px-3 font-sans">
                          <TokenBadge category={tok.category} />
                        </td>
                        <td className="py-2 px-3 text-[#C4A1FF]">
                          L{tok.line}:C{tok.column}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
