import { CodeExample, SupportedLanguage } from './types';

export const CODE_EXAMPLES: Record<SupportedLanguage, CodeExample[]> = {
  python: [
    {
      id: 'py-1-valid',
      title: 'Caso 1: Código válido y contexto (@ en matriz y cadenas)',
      badge: '0 Errores',
      language: 'python',
      description: 'Demuestra que @ es un operador matricial/decorador válido en Python y que símbolos como § o $ dentro de cadenas y comentarios # no generan errores léxicos.',
      expectedBehavior: '0 errores léxicos. Reconoce palabras reservadas, operador @, cadena con símbolos y comentario.',
      code: `# Comentario con símbolos especiales ignorados: @ § $ ¿ ¡
@decorador_vice
def calcular_tensor(edad: int):
    factor = 20 @ 5
    mensaje = "Hola @ § $ mundo desde Vice"
    hex_val = 0x1A_F0
    return factor + hex_val`
    },
    {
      id: 'py-2-illegal',
      title: 'Caso 2: Caracteres ilegales ($ y §)',
      badge: '2 Errores',
      language: 'python',
      description: 'Introduce los símbolos $ y § fuera de cadenas o comentarios. En Python ninguno de los dos pertenece al alfabeto léxico de código.',
      expectedBehavior: 'Detecta 2 errores léxicos exactos por carácter ilegal ($ y §).',
      code: `# En Python '$' y '§' fuera de comillas son errores léxicos
edad = 20
precio$ = 20 § 5
total = edad + 10`
    },
    {
      id: 'py-3-malformed',
      title: 'Caso 3: Identificador y flotante mal formados (Maximal Munch)',
      badge: '3 Errores',
      language: 'python',
      description: 'Prueba el principio de Maximal Munch con identificadores que inician con dígito (10var), números con doble punto decimal (3.14.16) y hexadecimal inválido (0xG1).',
      expectedBehavior: 'Detecta 3 errores léxicos: 10var, 3.14.16 y 0xG1 sin partirlos en tokens falsos.',
      code: `# Violación de fronteras de token (Maximal Munch)
10var = 3.14.16
 máscara_hex = 0xG1`
    },
    {
      id: 'py-4-unclosed',
      title: 'Caso 4: Cadena de texto sin cerrar',
      badge: '1 Error',
      language: 'python',
      description: 'Evalúa la detección de literales de cadena simples que llegan al salto de línea o fin de archivo sin comilla de cierre.',
      expectedBehavior: 'Detecta 1 error léxico por cadena de texto sin cerrar en la línea 2.',
      code: `usuario = "Enderman_Vice"
mensaje = "Hola mundo sin comilla de cierre
activo = True`
    },
    {
      id: 'py-5-syntactic-trap',
      title: 'Caso 5: Trampa Sintáctica (20 + * 5;)',
      badge: '0 Errores Léxicos',
      language: 'python',
      description: 'Secuencia gramaticalmente inválida (dos operadores seguidos + *), pero donde cada unidad léxica individual es 100% válida.',
      expectedBehavior: '0 errores léxicos (5 tokens válidos) + Aviso Didáctico explicando Léxico vs. Sintáctico.',
      code: `20 + * 5;`
    }
  ],

  cpp: [
    {
      id: 'cpp-1-valid',
      title: 'Caso 1: Código C++ válido con #include y contexto',
      badge: '0 Errores',
      language: 'cpp',
      description: 'Demuestra el reconocimiento de directivas #include, comentarios // y /* */, literales char simples y cadenas con símbolos encapsulados.',
      expectedBehavior: '0 errores léxicos. Reconoce directiva #include <iostream>, palabras reservadas y cadenas.',
      code: `#include <iostream>
// Comentario con símbolos encapsulados: @ § $ ¿
int main() {
    int edad = 20;
    char inicial = 'V';
    std::string msg = "Portal Enderman @ § activo";
    return 0;
}`
    },
    {
      id: 'cpp-2-illegal',
      title: 'Caso 2: Carácter ilegal (@ y $ en C++)',
      badge: '2 Errores',
      language: 'cpp',
      description: 'A diferencia de Python, en C++ estándar el símbolo @ y el símbolo $ fuera de cadenas son errores léxicos inmediatos.',
      expectedBehavior: 'Detecta errores léxicos en @ y $ indicando su posición exacta.',
      code: `#include <iostream>

int main() {
    int correo@ = 20;
    double costo$ = 150.5f;
    return 0;
}`
    },
    {
      id: 'cpp-3-malformed',
      title: 'Caso 3: Número e identificador mal formados',
      badge: '2 Errores',
      language: 'cpp',
      description: 'Evalúa un identificador que comienza con números (99variable) y un flotante con múltiples puntos decimales (12.34.56).',
      expectedBehavior: 'Detecta 2 errores léxicos aplicando Maximal Munch.',
      code: `int 99variable = 100;
float pi_erroneo = 12.34.56;`
    },
    {
      id: 'cpp-4-char-comment',
      title: 'Caso 4: Char multicarácter (\'ab\') y comentario /* sin cerrar',
      badge: '2 Errores',
      language: 'cpp',
      description: 'En C++, las comillas simples solo aceptan un carácter (\'a\'). Además, un comentario /* que llega a EOF sin */ es un error léxico.',
      expectedBehavior: 'Detecta literal de carácter inválido (\'ab\') y comentario multilínea sin cerrar.',
      code: `char c = 'ab';
int x = 10;
/* Comentario multilínea que nunca se cierra...`
    },
    {
      id: 'cpp-5-syntactic-trap',
      title: 'Caso 5: Trampa Sintáctica (20 + * 5;)',
      badge: '0 Errores Léxicos',
      language: 'cpp',
      description: 'Expresión con error sintáctico de operadores consecutivos (+ *), pero cuyos lexemas pertenecen todos al alfabeto de C++.',
      expectedBehavior: '0 errores léxicos (5 tokens válidos) + Aviso Didáctico sobre Parser vs. Scanner.',
      code: `20 + * 5;`
    }
  ],

  java: [
    {
      id: 'java-1-valid',
      title: 'Caso 1: Código Java válido (@Override y $ en identificador)',
      badge: '0 Errores',
      language: 'java',
      description: 'En Java, @ seguido de un identificador forma una Anotación válida (@Override) y $ es legal dentro de identificadores.',
      expectedBehavior: '0 errores léxicos. Clasifica @Override como ANNOTATION y $valor_base como IDENTIFIER.',
      code: `// Comentario en Java con símbolos ignorados: # § ¿
public class AnalizadorVice {
    @Override
    public String toString() {
        int edad = 20;
        double $valor_base = 3.1416D;
        char letra = 'J';
        return "Estado @ § OK: " + $valor_base;
    }
}`
    },
    {
      id: 'java-2-illegal',
      title: 'Caso 2: @ suelto como operador y símbolo # ilegal',
      badge: '2 Errores',
      language: 'java',
      description: 'En Java, @ suelto (sin identificador de anotación) y el símbolo # (fuera de cadenas) son errores léxicos.',
      expectedBehavior: 'Detecta 2 errores léxicos: @ suelto en expresión aritmética y # ilegal.',
      code: `public class Main {
    int x = 20 @ 5;
    int y = #100;
}`
    },
    {
      id: 'java-3-malformed',
      title: 'Caso 3: Identificador 10var y literal 3.14.16 mal formados',
      badge: '2 Errores',
      language: 'java',
      description: 'Comprueba la detección de secuencias alfanuméricas que inician con dígito y literales con doble punto decimal.',
      expectedBehavior: 'Detecta 2 errores léxicos mediante emparejamiento más largo (Maximal Munch).',
      code: `int 10var = 50;
double medida = 3.14.16;`
    },
    {
      id: 'java-4-char-error',
      title: 'Caso 4: Literal de carácter inválido (\'ab\' y \'\')',
      badge: '2 Errores',
      language: 'java',
      description: 'En Java el tipo char con comillas simples no puede contener múltiples caracteres (\'ab\') ni estar vacío (\'\').',
      expectedBehavior: 'Detecta 2 errores léxicos de tipo Literal de carácter inválido.',
      code: `char letra = 'ab';
char vacio = '';`
    },
    {
      id: 'java-5-syntactic-trap',
      title: 'Caso 5: Trampa Sintáctica (20 + * 5;)',
      badge: '0 Errores Léxicos',
      language: 'java',
      description: 'Demuestra que el analizador léxico valida tokens individuales y no reglas gramaticales del Parser.',
      expectedBehavior: '0 errores léxicos (5 tokens válidos) + Aviso Didáctico.',
      code: `20 + * 5;`
    }
  ]
};
