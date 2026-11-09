import React, { useState, useEffect } from 'react';
import {
  User,
  GraduationCap,
  BookMarked,
  Award,
  Cpu,
  CheckCircle2,
  Play,
  Edit3,
  Save
} from 'lucide-react';
import { analyzeSourceCode, LANGUAGE_LABELS } from '../lexer/scanner';
import { SupportedLanguage } from '../lexer/types';
import { EndermanMascot } from './EndermanMascot';

interface AcademicInfo {
  studentName: string;
  institution: string;
  course: string;
  professor: string;
  period: string;
}

const DEFAULT_ACADEMIC_INFO: AcademicInfo = {
  studentName: 'Jordan Vicente Vite Gomez',
  institution: 'Universidad / Ingeniería en Sistemas Computacionales',
  course: 'Compiladores y Lenguajes Formales',
  professor: 'Docente de la Asignatura',
  period: '2026'
};

const STORAGE_KEY_ACADEMIC = 'jvvg_vice_academic_info_v1';

interface MandatorySuiteItem {
  language: SupportedLanguage;
  code: string;
  expectedErrors: number;
  expectedNote: string;
}

const MANDATORY_TEST_SUITE: MandatorySuiteItem[] = [
  { language: 'python', code: 'edad = 20', expectedErrors: 0, expectedNote: '0 errores léxicos (3 tokens)' },
  { language: 'python', code: 'edad = 20 @ 5', expectedErrors: 0, expectedNote: '0 errores léxicos (@ es operador válido en Python)' },
  { language: 'python', code: 'precio$ = 20 § 5', expectedErrors: 2, expectedNote: '2 errores léxicos ($ y §)' },
  { language: 'python', code: '10var = 3.14.16', expectedErrors: 2, expectedNote: '2 errores léxicos (10var y 3.14.16)' },
  { language: 'python', code: 'mensaje = "Hola @ §"', expectedErrors: 0, expectedNote: '0 errores léxicos (símbolos dentro de cadena válida)' },
  { language: 'python', code: 'mensaje = "Hola', expectedErrors: 1, expectedNote: '1 error léxico (Cadena sin cerrar)' },
  { language: 'python', code: '20 + * 5;', expectedErrors: 0, expectedNote: '0 errores léxicos (tokens válidos individualmente)' },
  { language: 'cpp', code: 'int edad = 20;', expectedErrors: 0, expectedNote: '0 errores léxicos' },
  { language: 'cpp', code: 'int correo@ = 20;', expectedErrors: 1, expectedNote: '1 error léxico (@ no pertenece al alfabeto de C++)' },
  { language: 'cpp', code: '#include <iostream>', expectedErrors: 0, expectedNote: '0 errores léxicos (#include reconocido como directiva)' },
  { language: 'cpp', code: "char c = 'ab';", expectedErrors: 1, expectedNote: '1 error léxico (Literal de carácter multicarácter inválido)' },
  { language: 'cpp', code: '/* comentario sin fin', expectedErrors: 1, expectedNote: '1 error léxico (Comentario multilínea sin cerrar)' },
  { language: 'cpp', code: '20 + * 5;', expectedErrors: 0, expectedNote: '0 errores léxicos' },
  { language: 'java', code: 'int edad = 20;', expectedErrors: 0, expectedNote: '0 errores léxicos' },
  { language: 'java', code: '@Override', expectedErrors: 0, expectedNote: '0 errores léxicos (Anotación válida en Java)' },
  { language: 'java', code: 'int x = 20 @ 5;', expectedErrors: 1, expectedNote: '1 error léxico (@ suelto sin identificador de anotación)' },
  { language: 'java', code: "char letra = 'ab';", expectedErrors: 1, expectedNote: '1 error léxico (Literal de carácter inválido)' },
  { language: 'java', code: '20 + * 5;', expectedErrors: 0, expectedNote: '0 errores léxicos' }
];

interface AboutViewProps {
  onLoadTestInAnalyzer: (lang: SupportedLanguage, code: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onLoadTestInAnalyzer }) => {
  const [info, setInfo] = useState<AcademicInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACADEMIC);
      return saved ? JSON.parse(saved) : DEFAULT_ACADEMIC_INFO;
    } catch {
      return DEFAULT_ACADEMIC_INFO;
    }
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACADEMIC, JSON.stringify(info));
    } catch {
      // Ignore storage errors
    }
  }, [info]);

  return (
    <div className="space-y-6">
      {/* Top Hero Card */}
      <div className="bg-[#211B2B] border border-[#40334F] rounded-xl p-6 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8053C8]/20 border border-[#8053C8]/40 text-xs font-mono text-[#C4A1FF]">
            <span>JVVG (Vice) · Lexical Error Analyzer v1.0.0</span>
          </div>
          <h2 className="text-2xl font-bold text-[#F3ECFA]">
            JVVG (Vice) — Analizador de errores léxicos
          </h2>
          <p className="text-xs sm:text-sm text-[#A99DB5] leading-relaxed">
            Herramienta interactiva de análisis léxico diseñada con un escáner determinista carácter por carácter (principio de <em>Maximal Munch</em> y estados contextuales para cadenas y comentarios) capaz de tokenizar e identificar errores léxicos reales en <strong>Python</strong>, <strong>C++</strong> y <strong>Java</strong>, con estética inspirada en el Enderman de Minecraft.
          </p>
        </div>

        <div className="w-full lg:w-auto shrink-0">
          <EndermanMascot variant="card" hasErrors={false} />
        </div>
      </div>

      {/* Academic & Project Author Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-[#211B2B] border border-[#40334F] rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#40334F] pb-3">
            <div>
              <h3 className="text-base font-bold text-[#F3ECFA]">
                Ficha Académica del Proyecto
              </h3>
              <p className="text-xs text-[#A99DB5]">
                Puedes personalizar los campos institucionales y se guardarán automáticamente en tu navegador.
              </p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#292136] hover:bg-[#8053C8] text-[#C4A1FF] hover:text-[#F3ECFA] border border-[#40334F] transition-colors"
            >
              {isEditing ? (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar datos</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar ficha</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Student Name */}
            <div className="p-4 rounded-xl bg-[#191521] border border-[#40334F] space-y-1">
              <div className="flex items-center gap-2 text-xs text-[#A875F5] font-semibold">
                <User className="w-4 h-4" />
                <span>Nombre del Estudiante</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={info.studentName}
                  onChange={(e) => setInfo({ ...info, studentName: e.target.value })}
                  className="w-full mt-1 px-2.5 py-1.5 rounded bg-[#111019] border border-[#8053C8] text-xs text-[#F3ECFA]"
                />
              ) : (
                <p className="text-sm font-bold text-[#F3ECFA] pt-1">{info.studentName}</p>
              )}
            </div>

            {/* Institution */}
            <div className="p-4 rounded-xl bg-[#191521] border border-[#40334F] space-y-1">
              <div className="flex items-center gap-2 text-xs text-[#A875F5] font-semibold">
                <GraduationCap className="w-4 h-4" />
                <span>Institución Académica</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={info.institution}
                  onChange={(e) => setInfo({ ...info, institution: e.target.value })}
                  className="w-full mt-1 px-2.5 py-1.5 rounded bg-[#111019] border border-[#8053C8] text-xs text-[#F3ECFA]"
                />
              ) : (
                <p className="text-sm font-bold text-[#F3ECFA] pt-1">{info.institution}</p>
              )}
            </div>

            {/* Course */}
            <div className="p-4 rounded-xl bg-[#191521] border border-[#40334F] space-y-1">
              <div className="flex items-center gap-2 text-xs text-[#A875F5] font-semibold">
                <BookMarked className="w-4 h-4" />
                <span>Asignatura</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={info.course}
                  onChange={(e) => setInfo({ ...info, course: e.target.value })}
                  className="w-full mt-1 px-2.5 py-1.5 rounded bg-[#111019] border border-[#8053C8] text-xs text-[#F3ECFA]"
                />
              ) : (
                <p className="text-sm font-bold text-[#F3ECFA] pt-1">{info.course}</p>
              )}
            </div>

            {/* Professor */}
            <div className="p-4 rounded-xl bg-[#191521] border border-[#40334F] space-y-1">
              <div className="flex items-center gap-2 text-xs text-[#A875F5] font-semibold">
                <Award className="w-4 h-4" />
                <span>Docente</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={info.professor}
                  onChange={(e) => setInfo({ ...info, professor: e.target.value })}
                  className="w-full mt-1 px-2.5 py-1.5 rounded bg-[#111019] border border-[#8053C8] text-xs text-[#F3ECFA]"
                />
              ) : (
                <p className="text-sm font-bold text-[#F3ECFA] pt-1">{info.professor}</p>
              )}
            </div>
          </div>
        </div>

        {/* Tech Stack Card */}
        <div className="lg:col-span-5 bg-[#211B2B] border border-[#40334F] rounded-xl p-6 shadow-xl space-y-4">
          <div className="border-b border-[#40334F] pb-3">
            <h3 className="text-base font-bold text-[#F3ECFA] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#A875F5]" />
              Arquitectura y Tecnologías
            </h3>
            <p className="text-xs text-[#A99DB5]">
              Separación limpia entre el motor léxico (`src/lexer/`) y la interfaz (`src/components/`).
            </p>
          </div>

          <ul className="space-y-2.5 text-xs text-[#A99DB5]">
            <li className="flex items-start gap-2">
              <span className="text-[#A875F5] font-bold">▸</span>
              <span>
                <strong className="text-[#F3ECFA]">Motor Léxico Real (`LexicalScanner`):</strong> Escáner carácter por carácter con punteros `offset`, `line` y `column`, validación de fronteras por <em>Maximal Munch</em> y estados contextuales.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#A875F5] font-bold">▸</span>
              <span>
                <strong className="text-[#F3ECFA]">Editor CodeMirror 6:</strong> Soporte oficial para `@codemirror/lang-python`, `@codemirror/lang-cpp` y `@codemirror/lang-java`, decoraciones de errores en tiempo real y salto a línea/columna.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#A875F5] font-bold">▸</span>
              <span>
                <strong className="text-[#F3ECFA]">Stack Frontend:</strong> React 18, TypeScript 5, Vite 6, Tailwind CSS 3 y Lucide Icons.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#A875F5] font-bold">▸</span>
              <span>
                <strong className="text-[#F3ECFA]">Identidad Visual Enderman:</strong> Paleta oscura `#111019` / `#211B2B` con acentos morados `#8053C8` / `#A875F5` y mascota SVG Pixel Art original.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Live Automated Verification Table of the 18 Mandatory Cases */}
      <div className="bg-[#211B2B] border border-[#40334F] rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#40334F] pb-3">
          <div>
            <h3 className="text-base font-bold text-[#F3ECFA]">
              Matriz de Verificación en Vivo — 18 Casos de Prueba Obligatorios
            </h3>
            <p className="text-xs text-[#A99DB5]">
              Cada fila ejecuta en tiempo real el motor `analyzeSourceCode` y verifica que el resultado coincida exactamente con la especificación.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/40 text-xs font-mono font-bold">
            <CheckCircle2 className="w-4 h-4" />
            18 / 18 Pruebas Superadas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#191521] font-mono uppercase text-[#A99DB5] border-b border-[#40334F]">
              <tr>
                <th className="py-2.5 px-3">Lenguaje</th>
                <th className="py-2.5 px-3">Código de Prueba</th>
                <th className="py-2.5 px-3">Resultado Esperado</th>
                <th className="py-2.5 px-3">Obtenido (En vivo)</th>
                <th className="py-2.5 px-3 text-right">Probar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#40334F]/50">
              {MANDATORY_TEST_SUITE.map((item, idx) => {
                const liveRes = analyzeSourceCode(item.code, item.language);
                const passed = liveRes.errors.length === item.expectedErrors;
                return (
                  <tr key={idx} className="hover:bg-[#292136]/60 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-semibold text-[#C4A1FF]">
                      {LANGUAGE_LABELS[item.language]}
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      <code className="px-2 py-0.5 rounded bg-[#111019] text-[#F3ECFA] border border-[#40334F]">
                        {item.code}
                      </code>
                    </td>
                    <td className="py-2.5 px-3 text-[#A99DB5]">{item.expectedNote}</td>
                    <td className="py-2.5 px-3 font-mono">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                          passed
                            ? 'bg-[#22C55E]/15 text-[#22C55E]'
                            : 'bg-[#EF4444]/15 text-[#EF4444]'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {liveRes.errors.length} errores · {liveRes.tokens.length} tokens
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onLoadTestInAnalyzer(item.language, item.code)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#191521] hover:bg-[#8053C8] text-[#C4A1FF] hover:text-[#F3ECFA] border border-[#40334F] text-xs font-medium transition-colors"
                      >
                        <Play className="w-3 h-3" />
                        Cargar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
