import { analyzeSourceCode } from './scanner';
import { SupportedLanguage } from './types';

interface TestCase {
  language: SupportedLanguage;
  code: string;
  expectedErrors: number;
  expectedTokens?: number;
  description: string;
}

const MANDATORY_TESTS: TestCase[] = [
  // Python
  { language: 'python', code: 'edad = 20', expectedErrors: 0, expectedTokens: 3, description: 'Python: asignación básica' },
  { language: 'python', code: 'edad = 20 @ 5', expectedErrors: 0, description: 'Python: @ es operador válido' },
  { language: 'python', code: 'precio$ = 20 § 5', expectedErrors: 2, description: 'Python: $ y § son errores léxicos' },
  { language: 'python', code: '10var = 3.14.16', expectedErrors: 2, description: 'Python: 10var y 3.14.16 mal formados' },
  { language: 'python', code: 'mensaje = "Hola @ §"', expectedErrors: 0, description: 'Python: símbolos dentro de cadena válida' },
  { language: 'python', code: 'mensaje = "Hola', expectedErrors: 1, description: 'Python: cadena sin cerrar' },
  { language: 'python', code: '20 + * 5;', expectedErrors: 0, description: 'Python: caso trampa sintáctico (0 errores léxicos)' },

  // C++
  { language: 'cpp', code: 'int edad = 20;', expectedErrors: 0, description: 'C++: declaración entera básica' },
  { language: 'cpp', code: 'int correo@ = 20;', expectedErrors: 1, description: 'C++: @ no pertenece al alfabeto' },
  { language: 'cpp', code: '#include <iostream>', expectedErrors: 0, description: 'C++: #include reconocido como directiva' },
  { language: 'cpp', code: "char c = 'ab';", expectedErrors: 1, description: 'C++: literal de carácter multicarácter inválido' },
  { language: 'cpp', code: '/* comentario sin fin', expectedErrors: 1, description: 'C++: comentario multilínea sin cerrar' },
  { language: 'cpp', code: '20 + * 5;', expectedErrors: 0, description: 'C++: caso trampa sintáctico (0 errores léxicos)' },

  // Java
  { language: 'java', code: 'int edad = 20;', expectedErrors: 0, description: 'Java: declaración entera básica' },
  { language: 'java', code: '@Override', expectedErrors: 0, description: 'Java: anotación válida' },
  { language: 'java', code: 'int x = 20 @ 5;', expectedErrors: 1, description: 'Java: @ suelto sin identificador de anotación' },
  { language: 'java', code: "char letra = 'ab';", expectedErrors: 1, description: 'Java: literal de carácter inválido' },
  { language: 'java', code: '20 + * 5;', expectedErrors: 0, description: 'Java: caso trampa sintáctico (0 errores léxicos)' },
];

let passed = 0;
let failed = 0;

console.log('======================================================================');
console.log('  JVVG (VICE) — SUITE DE PRUEBAS OBLIGATORIAS DEL MOTOR LÉXICO');
console.log('======================================================================');

for (const tc of MANDATORY_TESTS) {
  const res = analyzeSourceCode(tc.code, tc.language);
  const errorsMatch = res.errors.length === tc.expectedErrors;
  const tokensMatch = tc.expectedTokens === undefined || res.tokens.length === tc.expectedTokens;

  if (errorsMatch && tokensMatch) {
    passed++;
    console.log(`[PASS] [${tc.language.toUpperCase()}] ${tc.description}`);
    console.log(`       Código: ${tc.code} -> Errores: ${res.errors.length}, Tokens: ${res.tokens.length}`);
  } else {
    failed++;
    console.error(`[FAIL] [${tc.language.toUpperCase()}] ${tc.description}`);
    console.error(`       Código: ${tc.code}`);
    console.error(`       Esperado: ${tc.expectedErrors} errores${tc.expectedTokens !== undefined ? `, ${tc.expectedTokens} tokens` : ''}`);
    console.error(`       Obtenido: ${res.errors.length} errores, ${res.tokens.length} tokens`);
    console.error('       Errores detectados:', res.errors);
  }
}

console.log('----------------------------------------------------------------------');
console.log(`Total: ${passed}/${MANDATORY_TESTS.length} pruebas exitosas.`);
if (failed > 0) {
  throw new Error(`${failed} pruebas léxicas fallaron.`);
}
