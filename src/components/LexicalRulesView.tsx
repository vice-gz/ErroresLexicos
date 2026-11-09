import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Code2,
  ShieldAlert,
  Play
} from 'lucide-react';
import { SupportedLanguage } from '../lexer/types';
import {
  PYTHON_KEYWORDS,
  PYTHON_OPERATORS,
  CPP_KEYWORDS,
  CPP_OPERATORS,
  CPP_PREPROCESSOR_DIRECTIVES,
  JAVA_KEYWORDS,
  JAVA_OPERATORS,
  LANGUAGE_LABELS
} from '../lexer/scanner';

interface LexicalRulesViewProps {
  onTestSnippetInAnalyzer: (lang: SupportedLanguage, snippet: string) => void;
}

export const LexicalRulesView: React.FC<LexicalRulesViewProps> = ({
  onTestSnippetInAnalyzer
}) => {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('python');

  const keywordsList =
    selectedLang === 'python'
      ? Array.from(PYTHON_KEYWORDS)
      : selectedLang === 'cpp'
      ? Array.from(CPP_KEYWORDS)
      : Array.from(JAVA_KEYWORDS);

  const operatorsList =
    selectedLang === 'python'
      ? PYTHON_OPERATORS
      : selectedLang === 'cpp'
      ? CPP_OPERATORS
      : JAVA_OPERATORS;

  return (
    <div className="space-y-6">
      {/* Section 1: Key Conceptual Questions ("Fundamentos de Análisis Léxico") */}
      <div className="bg-[#211B2B] border border-[#40334F] rounded-xl p-6 shadow-xl">
        <div className="flex items-center gap-2 text-[#A875F5] text-xs font-mono uppercase tracking-wider mb-1">
          <HelpCircle className="w-4 h-4" />
          <span>Fundamentos de Análisis Léxico y Compiladores</span>
        </div>
        <h2 className="text-xl font-bold text-[#F3ECFA] mb-4">
          Preguntas Conceptuales Clave
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Q1 */}
          <div className="p-4 rounded-xl bg-[#191521] border border-[#40334F] space-y-2">
            <h3 className="text-sm font-bold text-[#C4A1FF] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#8053C8]/30 text-[#C4A1FF] font-mono text-xs flex items-center justify-center border border-[#8053C8]/50">
                01
              </span>
              ¿Qué es un error léxico?
            </h3>
            <p className="text-xs text-[#A99DB5] leading-relaxed">
              Un <strong className="text-[#F3ECFA]">error léxico</strong> ocurre durante la primera fase de un compilador (<em>Scanner / Lexer</em>) cuando una secuencia de caracteres en el código fuente no puede asociarse con ningún patrón o expresión regular del alfabeto formal del lenguaje. Ejemplos clásicos son caracteres ilegales (<code className="text-[#FCA5A5]">§</code>, <code className="text-[#FCA5A5]">¿</code>), identificadores que inician con dígito (<code className="text-[#FCA5A5]">10var</code>), números con múltiples puntos decimales (<code className="text-[#FCA5A5]">3.14.16</code>) o cadenas/comentarios sin cerrar.
            </p>
          </div>

          {/* Q2 */}
          <div className="p-4 rounded-xl bg-[#191521] border border-[#40334F] space-y-2">
            <h3 className="text-sm font-bold text-[#C4A1FF] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#8053C8]/30 text-[#C4A1FF] font-mono text-xs flex items-center justify-center border border-[#8053C8]/50">
                02
              </span>
              ¿Por qué `@` es error en C++ (o suelto en Java), pero válido en Python o en `"hola @ mundo"`?
            </h3>
            <p className="text-xs text-[#A99DB5] leading-relaxed">
              Porque la validez léxica depende tanto del <strong className="text-[#F3ECFA]">alfabeto del lenguaje</strong> como del <strong className="text-[#F3ECFA]">estado contextual del autómata</strong>:
              <br />• En <strong className="text-[#F3ECFA]">Python</strong>, <code className="text-[#C4A1FF]">@</code> es un operador oficial (multiplicación matricial PEP 465 y decoradores).
              <br />• En <strong className="text-[#F3ECFA]">C++</strong>, <code className="text-[#FCA5A5]">@</code> no pertenece al conjunto de caracteres básicos del lenguaje fuera de literales.
              <br />• En <strong className="text-[#F3ECFA]">Java</strong>, <code className="text-[#C4A1FF]">@</code> solo es válido si va unido a un identificador de anotación (<code className="text-[#C4A1FF]">@Override</code>).
              <br />• Dentro de <code className="text-emerald-300">"hola @ mundo"</code> o un comentario, el escáner se encuentra en el estado <em>IN_STRING / IN_COMMENT</em>, donde cualquier carácter Unicode es parte del texto literal.
            </p>
          </div>

          {/* Q3 */}
          <div className="p-4 rounded-xl bg-[#191521] border border-[#40334F] space-y-2">
            <h3 className="text-sm font-bold text-[#C4A1FF] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#8053C8]/30 text-[#C4A1FF] font-mono text-xs flex items-center justify-center border border-[#8053C8]/50">
                03
              </span>
              ¿Por qué `20 + * 5;` NO contiene ningún error léxico?
            </h3>
            <p className="text-xs text-[#A99DB5] leading-relaxed">
              El analizador léxico verifica que cada palabra o símbolo individual sea un token válido, sin evaluar el orden gramatical entre ellos. En <code className="text-[#F3ECFA]">20 + * 5;</code> existen 5 tokens 100% legales: <code className="text-amber-300">20</code> (INTEGER), <code className="text-purple-300">+</code> (OPERATOR), <code className="text-purple-300">*</code> (OPERATOR), <code className="text-amber-300">5</code> (INTEGER) y <code className="text-slate-300">;</code> (DELIMITER). El hecho de que dos operadores binarios no puedan ir juntos es un <strong className="text-[#F59E0B]">error sintáctico</strong> que detecta la segunda fase del compilador (<em>Parser</em> mediante una gramática libre de contexto).
            </p>
          </div>

          {/* Q4 */}
          <div className="p-4 rounded-xl bg-[#191521] border border-[#40334F] space-y-2">
            <h3 className="text-sm font-bold text-[#C4A1FF] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#8053C8]/30 text-[#C4A1FF] font-mono text-xs flex items-center justify-center border border-[#8053C8]/50">
                04
              </span>
              ¿Qué reglas determinan si un lexema pertenece al lenguaje?
            </h3>
            <p className="text-xs text-[#A99DB5] leading-relaxed">
              La pertenencia está regida por <strong className="text-[#F3ECFA]">Lenguajes Regulares</strong> (definidos mediante Expresiones Regulares y Autómatas Finitos Deterministas, AFD), junto con tres principios de escaneo:
              <br />1. <strong className="text-[#F3ECFA]">Alfabeto ($\Sigma$):</strong> Conjunto de símbolos admitidos.
              <br />2. <strong className="text-[#F3ECFA]">Maximal Munch (Emparejamiento más largo):</strong> El escáner consume la secuencia más larga posible antes de decidir el token (evitando partir <code className="text-[#FCA5A5]">10var</code> en <code className="text-amber-300">10</code> y <code className="text-sky-300">var</code>).
              <br />3. <strong className="text-[#F3ECFA]">Prioridad de Palabras Reservadas:</strong> Si un identificador coincide con una palabra clave del lenguaje, se clasifica como <code className="text-[#C4A1FF]">KEYWORD</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Interactive Language Specifications (Python, C++, Java) */}
      <div className="bg-[#211B2B] border border-[#40334F] rounded-xl p-6 shadow-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#40334F] pb-4">
          <div>
            <div className="flex items-center gap-2 text-[#A875F5] text-xs font-mono uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Especificación Formal por Lenguaje</span>
            </div>
            <h2 className="text-lg font-bold text-[#F3ECFA]">
              Gramática Regular y Autómata de {LANGUAGE_LABELS[selectedLang]}
            </h2>
          </div>

          <div className="inline-flex rounded-xl bg-[#111019] p-1 border border-[#40334F]">
            {(['python', 'cpp', 'java'] as SupportedLanguage[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedLang === lang
                    ? 'bg-[#8053C8] text-[#F3ECFA]'
                    : 'text-[#A99DB5] hover:text-[#F3ECFA]'
                }`}
              >
                {LANGUAGE_LABELS[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* Comparative Matrix Across Languages */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#191521] font-mono uppercase text-[#A99DB5] border-b border-[#40334F]">
              <tr>
                <th className="py-3 px-4">Elemento / Símbolo</th>
                <th className="py-3 px-4">Python</th>
                <th className="py-3 px-4">C++</th>
                <th className="py-3 px-4">Java</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#40334F]/50">
              <tr className="hover:bg-[#292136]/40">
                <td className="py-3 px-4 font-mono font-semibold text-[#F3ECFA]">Símbolo `@`</td>
                <td className="py-3 px-4 text-[#22C55E]">Válido (Operador matricial / Decorador)</td>
                <td className="py-3 px-4 text-[#EF4444]">Error Léxico (Fuera del alfabeto)</td>
                <td className="py-3 px-4 text-[#F59E0B]">Válido en `@Anotacion` / Error si está suelto</td>
              </tr>
              <tr className="hover:bg-[#292136]/40">
                <td className="py-3 px-4 font-mono font-semibold text-[#F3ECFA]">Símbolo `#`</td>
                <td className="py-3 px-4 text-[#22C55E]">Válido (Inicia comentario de una línea)</td>
                <td className="py-3 px-4 text-[#22C55E]">Válido en directivas (`#include`, `#define`)</td>
                <td className="py-3 px-4 text-[#EF4444]">Error Léxico (Carácter ilegal)</td>
              </tr>
              <tr className="hover:bg-[#292136]/40">
                <td className="py-3 px-4 font-mono font-semibold text-[#F3ECFA]">Símbolo `$`</td>
                <td className="py-3 px-4 text-[#EF4444]">Error Léxico (Carácter ilegal)</td>
                <td className="py-3 px-4 text-[#EF4444]">Error Léxico en C++ estándar</td>
                <td className="py-3 px-4 text-[#22C55E]">Válido dentro de identificadores (`$var`)</td>
              </tr>
              <tr className="hover:bg-[#292136]/40">
                <td className="py-3 px-4 font-mono font-semibold text-[#F3ECFA]">Comillas simples `'ab'`</td>
                <td className="py-3 px-4 text-[#22C55E]">Válido (Cadena de texto `'ab'`)</td>
                <td className="py-3 px-4 text-[#EF4444]">Error Léxico (Literal `char` multicarácter)</td>
                <td className="py-3 px-4 text-[#EF4444]">Error Léxico (Literal `char` multicarácter)</td>
              </tr>
              <tr className="hover:bg-[#292136]/40">
                <td className="py-3 px-4 font-mono font-semibold text-[#F3ECFA]">Comentarios</td>
                <td className="py-3 px-4 font-mono text-[#C4A1FF]"># hasta fin de línea</td>
                <td className="py-3 px-4 font-mono text-[#C4A1FF]">// y /* ... */</td>
                <td className="py-3 px-4 font-mono text-[#C4A1FF]">// y /* ... */</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Regex & Automata Rules for Selected Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#191521] border border-[#40334F] space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#C4A1FF] flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-[#A875F5]" />
              Patrones Regulares de {LANGUAGE_LABELS[selectedLang]}
            </h3>
            <ul className="space-y-2 text-xs text-[#A99DB5] font-mono">
              <li>
                <strong className="text-[#F3ECFA]">Identificadores:</strong>{' '}
                {selectedLang === 'python' && <code>^[A-Za-z_\u00C0-\u024F][A-Za-z0-9_\u00C0-\u024F]*$</code>}
                {selectedLang === 'cpp' && <code>^[a-zA-Z_][a-zA-Z0-9_]*$</code>}
                {selectedLang === 'java' && <code>^[a-zA-Z_$][a-zA-Z0-9_$]*$</code>}
              </li>
              <li>
                <strong className="text-[#F3ECFA]">Enteros / Bases:</strong>{' '}
                <code>0[xX][0-9a-fA-F_]+ | 0[bB][01_]+ | [0-9][0-9_]*</code>
              </li>
              <li>
                <strong className="text-[#F3ECFA]">Flotantes:</strong>{' '}
                <code>[0-9]+\.[0-9]+([eE][+-]?[0-9]+)?</code>
              </li>
              {selectedLang === 'cpp' && (
                <li>
                  <strong className="text-[#F3ECFA]">Directivas:</strong>{' '}
                  <code>^#\s*(include|define|ifdef|ifndef|endif|pragma)$</code>
                </li>
              )}
              {selectedLang === 'java' && (
                <li>
                  <strong className="text-[#F3ECFA]">Anotaciones:</strong>{' '}
                  <code>^@[a-zA-Z_$][a-zA-Z0-9_$]*$</code>
                </li>
              )}
            </ul>
          </div>

          {/* Valid vs Invalid interactive quick testers */}
          <div className="p-4 rounded-xl bg-[#191521] border border-[#40334F] space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#C4A1FF] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#A875F5]" />
              Ejemplos Válidos vs. Inválidos ({LANGUAGE_LABELS[selectedLang]})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 space-y-1.5">
                <div className="flex items-center justify-between text-[#22C55E] font-semibold">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Léxicamente Válido
                  </span>
                  <button
                    onClick={() =>
                      onTestSnippetInAnalyzer(
                        selectedLang,
                        selectedLang === 'python'
                          ? 'edad = 20 @ 5\nmensaje = "Hola @ §"'
                          : selectedLang === 'cpp'
                          ? '#include <iostream>\nint edad = 20;'
                          : '@Override\nint $edad = 20;'
                      )
                    }
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#111019] text-[#22C55E] hover:bg-[#22C55E] hover:text-[#111019] transition-colors text-[10px] font-mono"
                  >
                    <Play className="w-2.5 h-2.5" /> Probar
                  </button>
                </div>
                <pre className="font-mono text-[11px] text-[#F3ECFA] bg-[#111019] p-2 rounded">
                  {selectedLang === 'python' && `edad = 20 @ 5\nmensaje = "Hola @ §"`}
                  {selectedLang === 'cpp' && `#include <iostream>\nint edad = 20;`}
                  {selectedLang === 'java' && `@Override\nint $edad = 20;`}
                </pre>
              </div>

              <div className="p-2.5 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 space-y-1.5">
                <div className="flex items-center justify-between text-[#EF4444] font-semibold">
                  <span className="flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Léxicamente Inválido
                  </span>
                  <button
                    onClick={() =>
                      onTestSnippetInAnalyzer(
                        selectedLang,
                        selectedLang === 'python'
                          ? 'precio$ = 20 § 5\n10var = 3.14.16'
                          : selectedLang === 'cpp'
                          ? "int correo@ = 20;\nchar c = 'ab';"
                          : "int x = 20 @ 5;\nchar letra = 'ab';"
                      )
                    }
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#111019] text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-colors text-[10px] font-mono"
                  >
                    <Play className="w-2.5 h-2.5" /> Probar
                  </button>
                </div>
                <pre className="font-mono text-[11px] text-[#FCA5A5] bg-[#111019] p-2 rounded">
                  {selectedLang === 'python' && `precio$ = 20 § 5\n10var = 3.14.16`}
                  {selectedLang === 'cpp' && `int correo@ = 20;\nchar c = 'ab';`}
                  {selectedLang === 'java' && `int x = 20 @ 5;\nchar letra = 'ab';`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Keywords & Operators Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#191521] border border-[#40334F]">
            <h4 className="text-xs font-mono font-semibold uppercase text-[#C4A1FF] mb-2.5">
              Palabras Reservadas ({keywordsList.length})
            </h4>
            <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
              {keywordsList.map((kw) => (
                <code
                  key={kw}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#292136] text-[#C4A1FF] border border-[#40334F]"
                >
                  {kw}
                </code>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#191521] border border-[#40334F] space-y-3">
            <div>
              <h4 className="text-xs font-mono font-semibold uppercase text-[#C4A1FF] mb-2.5">
                Operadores Reconocidos ({operatorsList.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {operatorsList.map((op) => (
                  <code
                    key={op}
                    className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#111019] text-purple-300 border border-[#40334F]"
                  >
                    {op}
                  </code>
                ))}
              </div>
            </div>

            {selectedLang === 'cpp' && (
              <div className="pt-2 border-t border-[#40334F]/60">
                <h4 className="text-xs font-mono font-semibold uppercase text-cyan-300 mb-2 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Directivas de Preprocesador C++
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from(CPP_PREPROCESSOR_DIRECTIVES).map((dir) => (
                    <code
                      key={dir}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/40"
                    >
                      #{dir}
                    </code>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
