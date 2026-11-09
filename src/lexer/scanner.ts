import {
  SupportedLanguage,
  Token,
  TokenCategory,
  LexicalError,
  LexicalErrorType,
  AnalysisResult,
  AnalysisStatistics,
  DidacticNote
} from './types';

// ============================================================================
// LANGUAGE SPECIFICATIONS (KEYWORDS, OPERATORS, DELIMITERS, DIRECTIVES)
// ============================================================================

export const PYTHON_KEYWORDS = new Set<string>([
  'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await',
  'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except',
  'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is',
  'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return',
  'try', 'while', 'with', 'yield', 'match', 'case'
]);

export const PYTHON_OPERATORS = [
  '**=', '//=', '>>=', '<<=',
  '**', '//', '<<', '>>', ':=', '->',
  '<=', '>=', '==', '!=',
  '+=', '-=', '*=', '/=', '%=', '@=', '&=', '|=', '^=',
  '+', '-', '*', '/', '%', '@', '&', '|', '^', '~', '<', '>', '='
];

export const PYTHON_DELIMITERS = new Set<string>([
  '(', ')', '[', ']', '{', '}', ',', ':', '.', ';'
]);

export const CPP_KEYWORDS = new Set<string>([
  'alignas', 'alignof', 'and', 'asm', 'auto', 'bool', 'break', 'case',
  'catch', 'char', 'class', 'const', 'constexpr', 'continue', 'default',
  'delete', 'do', 'double', 'dynamic_cast', 'else', 'enum', 'explicit',
  'export', 'extern', 'false', 'float', 'for', 'friend', 'goto', 'if',
  'inline', 'int', 'long', 'mutable', 'namespace', 'new', 'noexcept',
  'nullptr', 'operator', 'or', 'private', 'protected', 'public', 'register',
  'reinterpret_cast', 'return', 'short', 'signed', 'sizeof', 'static',
  'static_assert', 'static_cast', 'struct', 'switch', 'template', 'this',
  'thread_local', 'throw', 'true', 'try', 'typedef', 'typeid', 'typename',
  'union', 'unsigned', 'using', 'virtual', 'void', 'volatile', 'wchar_t',
  'while', 'std', 'string', 'cout', 'cin', 'endl'
]);

export const CPP_PREPROCESSOR_DIRECTIVES = new Set<string>([
  'include', 'define', 'undef', 'ifdef', 'ifndef', 'if', 'elif',
  'else', 'endif', 'pragma', 'error', 'warning', 'line'
]);

export const CPP_OPERATORS = [
  '<=>', '<<=', '>>=',
  '++', '--', '==', '!=', '<=', '>=', '&&', '||', '<<', '>>',
  '+=', '-=', '*=', '/=', '%=', '&=', '^=', '|=', '->', '::',
  '+', '-', '*', '/', '%', '!', '&', '|', '^', '~', '<', '>', '=', '?', ':'
];

export const CPP_DELIMITERS = new Set<string>([
  '(', ')', '[', ']', '{', '}', ',', '.', ';'
]);

export const JAVA_KEYWORDS = new Set<string>([
  'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch',
  'char', 'class', 'const', 'continue', 'default', 'do', 'double',
  'else', 'enum', 'extends', 'final', 'finally', 'float', 'for',
  'goto', 'if', 'implements', 'import', 'instanceof', 'int', 'interface',
  'long', 'native', 'new', 'package', 'private', 'protected', 'public',
  'return', 'short', 'static', 'strictfp', 'super', 'switch', 'synchronized',
  'this', 'throw', 'throws', 'transient', 'try', 'void', 'volatile',
  'while', 'true', 'false', 'null', 'var', 'record', 'yield'
]);

export const JAVA_OPERATORS = [
  '>>>=', '<<=', '>>=', '>>>',
  '++', '--', '==', '!=', '<=', '>=', '&&', '||', '<<', '>>',
  '+=', '-=', '*=', '/=', '%=', '&=', '^=', '|=', '->', '::',
  '+', '-', '*', '/', '%', '!', '&', '|', '^', '~', '<', '>', '=', '?', ':'
];

export const JAVA_DELIMITERS = new Set<string>([
  '(', ')', '[', ']', '{', '}', ',', '.', ';'
]);

export const CATEGORY_LABELS: Record<TokenCategory, string> = {
  KEYWORD: 'Palabra reservada',
  IDENTIFIER: 'Identificador',
  INTEGER: 'Literal entero',
  FLOAT: 'Literal flotante',
  STRING: 'Literal de cadena',
  CHAR: 'Literal de carácter',
  PREPROCESSOR: 'Directiva preprocesador',
  ANNOTATION: 'Anotación',
  OPERATOR: 'Operador',
  DELIMITER: 'Delimitador',
  COMMENT: 'Comentario'
};

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  python: 'Python',
  cpp: 'C++',
  java: 'Java'
};

// ============================================================================
// CHARACTER HELPER FUNCTIONS
// ============================================================================

function isAsciiDigit(ch: string): boolean {
  return ch.length === 1 && ch >= '0' && ch <= '9';
}

function isHexDigit(ch: string): boolean {
  return (
    (ch >= '0' && ch <= '9') ||
    (ch >= 'a' && ch <= 'f') ||
    (ch >= 'A' && ch <= 'F')
  );
}

function isAsciiLetter(ch: string): boolean {
  return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
}

function isUnicodeLetter(ch: string): boolean {
  if (!ch) return false;
  if (isAsciiLetter(ch)) return true;
  // Support Spanish/Unicode letters (á, é, í, ó, ú, ñ, ü, etc.) while excluding symbols like §, ¿, ¡
  return /^\p{L}$/u.test(ch);
}

function isPythonIdStart(ch: string): boolean {
  return ch === '_' || isUnicodeLetter(ch);
}

function isPythonIdPart(ch: string): boolean {
  return ch === '_' || isUnicodeLetter(ch) || isAsciiDigit(ch);
}

function isCppIdStart(ch: string): boolean {
  return ch === '_' || isAsciiLetter(ch);
}

function isCppIdPart(ch: string): boolean {
  return ch === '_' || isAsciiLetter(ch) || isAsciiDigit(ch);
}

function isJavaIdStart(ch: string): boolean {
  return ch === '_' || ch === '$' || isUnicodeLetter(ch);
}

function isJavaIdPart(ch: string): boolean {
  return ch === '_' || ch === '$' || isUnicodeLetter(ch) || isAsciiDigit(ch);
}

function isValidNumberSuffix(language: SupportedLanguage, suffix: string, isFloat: boolean): boolean {
  if (!suffix) return true;
  if (language === 'python') {
    // Python allows imaginary suffix j or J
    return suffix === 'j' || suffix === 'J';
  }
  if (language === 'cpp') {
    if (isFloat) {
      return /^(f|F|l|L)$/.test(suffix);
    }
    return /^([uU]([lL]{1,2})?|([lL]{1,2})[uU]?|[fF])$/.test(suffix);
  }
  if (language === 'java') {
    if (isFloat) {
      return /^(f|F|d|D)$/.test(suffix);
    }
    return /^(l|L|f|F|d|D)$/.test(suffix);
  }
  return false;
}

// ============================================================================
// STATEFUL CHARACTER-BY-CHARACTER SCANNER (AUTOMATON)
// ============================================================================

export class LexicalScanner {
  private source: string;
  private language: SupportedLanguage;
  private length: number;
  private offset: number = 0;
  private line: number = 1;
  private column: number = 1;

  private tokens: Token[] = [];
  private errors: LexicalError[] = [];

  constructor(sourceCode: string, language: SupportedLanguage) {
    this.source = sourceCode;
    this.language = language;
    this.length = sourceCode.length;
  }

  private isEOF(): boolean {
    return this.offset >= this.length;
  }

  private peek(ahead: number = 0): string {
    const pos = this.offset + ahead;
    return pos < this.length ? this.source[pos] : '';
  }

  private matchSlice(str: string): boolean {
    return this.source.startsWith(str, this.offset);
  }

  private advance(steps: number = 1): string {
    let consumed = '';
    for (let i = 0; i < steps && this.offset < this.length; i++) {
      const ch = this.source[this.offset];
      consumed += ch;
      this.offset++;
      if (ch === '\n') {
        this.line++;
        this.column = 1;
      } else if (ch === '\r') {
        if (this.offset < this.length && this.source[this.offset] === '\n') {
          consumed += this.source[this.offset];
          this.offset++;
        }
        this.line++;
        this.column = 1;
      } else {
        this.column++;
      }
    }
    return consumed;
  }

  private addToken(
    lexeme: string,
    category: TokenCategory,
    line: number,
    column: number,
    startOffset: number,
    endOffset: number,
    description: string
  ): void {
    this.tokens.push({
      index: this.tokens.length + 1,
      lexeme,
      category,
      categoryLabel: CATEGORY_LABELS[category],
      line,
      column,
      startOffset,
      endOffset,
      description
    });
  }

  private addError(
    errorType: LexicalErrorType,
    lexeme: string,
    line: number,
    column: number,
    startOffset: number,
    endOffset: number,
    explanation: string
  ): void {
    this.errors.push({
      errorNumber: this.errors.length + 1,
      errorType,
      language: this.language,
      lexeme,
      line,
      column,
      startOffset,
      endOffset,
      explanation
    });
  }

  public scan(): AnalysisResult {
    const startTime = performance.now();

    while (!this.isEOF()) {
      const ch = this.peek();

      // 1. Whitespace handling
      if (ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n') {
        this.advance();
        continue;
      }

      // 2. Comments handling
      if (this.language === 'python' && ch === '#') {
        this.scanSingleLineComment('#');
        continue;
      }

      if ((this.language === 'cpp' || this.language === 'java') && this.matchSlice('//')) {
        this.scanSingleLineComment('//');
        continue;
      }

      if ((this.language === 'cpp' || this.language === 'java') && this.matchSlice('/*')) {
        this.scanMultiLineComment();
        continue;
      }

      // 3. C++ Preprocessor Directives (#include, #define, etc.)
      if (this.language === 'cpp' && ch === '#') {
        this.scanCppPreprocessor();
        continue;
      }

      // 4. Java Annotations (@Override, @Deprecated, etc.)
      if (this.language === 'java' && ch === '@') {
        this.scanJavaAnnotation();
        continue;
      }

      // 5. Python String Prefixes (f"...", r'...', b"...", fr"...", etc.)
      if (this.language === 'python' && this.isPythonStringPrefixStart()) {
        this.scanPythonPrefixedString();
        continue;
      }

      // 6. Strings & Character Literals
      if (ch === '"' || ch === "'") {
        this.scanStringOrCharLiteral();
        continue;
      }

      // 7. Numeric Literals (and Malformed Numbers / Identifiers starting with digits via Maximal Munch)
      if (isAsciiDigit(ch) || (ch === '.' && isAsciiDigit(this.peek(1)))) {
        this.scanNumberOrMalformedToken();
        continue;
      }

      // 8. Identifiers & Keywords
      if (this.isIdentifierStartForCurrentLanguage(ch)) {
        this.scanIdentifierOrKeyword();
        continue;
      }

      // 9. Operators (Maximal Munch order)
      const matchedOperator = this.matchOperator();
      if (matchedOperator) {
        const startLine = this.line;
        const startCol = this.column;
        const startOff = this.offset;
        this.advance(matchedOperator.length);
        this.addToken(
          matchedOperator,
          'OPERATOR',
          startLine,
          startCol,
          startOff,
          this.offset,
          `Operador válido de ${LANGUAGE_LABELS[this.language]} ('${matchedOperator}')`
        );
        continue;
      }

      // 10. Delimiters
      if (this.isDelimiterForCurrentLanguage(ch)) {
        const startLine = this.line;
        const startCol = this.column;
        const startOff = this.offset;
        this.advance(1);
        this.addToken(
          ch,
          'DELIMITER',
          startLine,
          startCol,
          startOff,
          this.offset,
          `Delimitador / signo de puntuación ('${ch}')`
        );
        continue;
      }

      // 11. Unrecognized / Illegal character in current language
      this.scanIllegalCharacter();
    }

    const durationMs = Math.max(0.1, Number((performance.now() - startTime).toFixed(2)));
    const statistics = this.computeStatistics();
    const didacticNotes = this.detectDidacticNotes();

    return {
      id: `vice-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toLocaleString('es-MX', {
        dateStyle: 'short',
        timeStyle: 'medium'
      }),
      language: this.language,
      sourceCode: this.source,
      tokens: this.tokens,
      errors: this.errors,
      statistics,
      didacticNotes,
      durationMs
    };
  }

  // --------------------------------------------------------------------------
  // COMMENTS
  // --------------------------------------------------------------------------

  private scanSingleLineComment(marker: string): void {
    const startLine = this.line;
    const startCol = this.column;
    const startOff = this.offset;

    let lexeme = this.advance(marker.length);
    while (!this.isEOF() && this.peek() !== '\n' && this.peek() !== '\r') {
      lexeme += this.advance(1);
    }

    this.addToken(
      lexeme,
      'COMMENT',
      startLine,
      startCol,
      startOff,
      this.offset,
      `Comentario de una línea (${marker}). Los símbolos internos son ignorados por el escáner de código.`
    );
  }

  private scanMultiLineComment(): void {
    const startLine = this.line;
    const startCol = this.column;
    const startOff = this.offset;

    let lexeme = this.advance(2); // Consume /*
    let closed = false;

    while (!this.isEOF()) {
      if (this.matchSlice('*/')) {
        lexeme += this.advance(2);
        closed = true;
        break;
      }
      lexeme += this.advance(1);
    }

    if (!closed) {
      this.addError(
        'Comentario multilínea sin cerrar',
        lexeme.length > 40 ? `${lexeme.slice(0, 37)}...` : lexeme,
        startLine,
        startCol,
        startOff,
        this.offset,
        `Comentario multilínea iniciado con '/*' en la línea ${startLine}, columna ${startCol} llegó al final del archivo (EOF) sin encontrar el delimitador de cierre '*/'.`
      );
      return;
    }

    this.addToken(
      lexeme,
      'COMMENT',
      startLine,
      startCol,
      startOff,
      this.offset,
      `Comentario multilínea cerrado correctamente (/* ... */).`
    );
  }

  // --------------------------------------------------------------------------
  // C++ PREPROCESSOR DIRECTIVES
  // --------------------------------------------------------------------------

  private scanCppPreprocessor(): void {
    const startLine = this.line;
    const startCol = this.column;
    const startOff = this.offset;

    let lexeme = this.advance(1); // '#'
    // Optional horizontal spaces between # and directive name in C++
    while (!this.isEOF() && (this.peek() === ' ' || this.peek() === '\t')) {
      lexeme += this.advance(1);
    }

    let directiveName = '';
    while (!this.isEOF() && (isAsciiLetter(this.peek()) || isAsciiDigit(this.peek()) || this.peek() === '_')) {
      const c = this.advance(1);
      directiveName += c;
      lexeme += c;
    }

    if (!directiveName) {
      // Check if followed immediately by illegal symbols on same token
      this.addError(
        'Carácter ilegal / no reconocido',
        lexeme.trim() || '#',
        startLine,
        startCol,
        startOff,
        this.offset,
        `En C++, el símbolo '#' solo es válido al iniciar una directiva de preprocesador reconocida (como #include, #define, #ifdef). Un '#' suelto es un error léxico.`
      );
      return;
    }

    if (!CPP_PREPROCESSOR_DIRECTIVES.has(directiveName)) {
      this.addError(
        'Carácter ilegal / no reconocido',
        lexeme,
        startLine,
        startCol,
        startOff,
        this.offset,
        `Directiva de preprocesador '${lexeme}' inválida en C++. Se esperaba una directiva estándar como #include, #define, #ifdef, #ifndef, #endif o #pragma.`
      );
      return;
    }

    this.addToken(
      lexeme,
      'PREPROCESSOR',
      startLine,
      startCol,
      startOff,
      this.offset,
      `Directiva de preprocesador de C++ ('${lexeme}').`
    );

    // If the directive is #include, check for <header> right after spaces so <iostream> is properly tokenized
    if (directiveName === 'include') {
      while (!this.isEOF() && (this.peek() === ' ' || this.peek() === '\t')) {
        this.advance(1);
      }
      if (this.peek() === '<') {
        const hdrLine = this.line;
        const hdrCol = this.column;
        const hdrStart = this.offset;
        let hdrLexeme = this.advance(1); // '<'
        let closed = false;
        while (!this.isEOF() && this.peek() !== '\n' && this.peek() !== '\r') {
          const c = this.advance(1);
          hdrLexeme += c;
          if (c === '>') {
            closed = true;
            break;
          }
        }
        if (closed && hdrLexeme.length > 2) {
          this.addToken(
            hdrLexeme,
            'STRING',
            hdrLine,
            hdrCol,
            hdrStart,
            this.offset,
            `Ruta de cabecera estándar de C++ (${hdrLexeme}).`
          );
        } else {
          this.addError(
            'Cadena de texto sin cerrar',
            hdrLexeme,
            hdrLine,
            hdrCol,
            hdrStart,
            this.offset,
            `Cabecera de #include '${hdrLexeme}' mal formada o sin cerrar con '>'.`
          );
        }
      }
    }
  }

  // --------------------------------------------------------------------------
  // JAVA ANNOTATIONS
  // --------------------------------------------------------------------------

  private scanJavaAnnotation(): void {
    const startLine = this.line;
    const startCol = this.column;
    const startOff = this.offset;

    let lexeme = this.advance(1); // '@'

    if (!this.isEOF() && isJavaIdStart(this.peek())) {
      while (!this.isEOF() && isJavaIdPart(this.peek())) {
        lexeme += this.advance(1);
      }
      this.addToken(
        lexeme,
        'ANNOTATION',
        startLine,
        startCol,
        startOff,
        this.offset,
        `Anotación válida de Java ('${lexeme}').`
      );
    } else {
      this.addError(
        'Carácter ilegal / no reconocido',
        lexeme,
        startLine,
        startCol,
        startOff,
        this.offset,
        `En Java, el símbolo '@' solo es válido cuando va seguido inmediatamente de un identificador de anotación (ej. @Override). Un '@' suelto o como operador no pertenece a la gramática léxica de Java.`
      );
    }
  }

  // --------------------------------------------------------------------------
  // STRINGS & CHARACTER LITERALS
  // --------------------------------------------------------------------------

  private isPythonStringPrefixStart(): boolean {
    const c1 = this.peek(0).toLowerCase();
    const c2 = this.peek(1).toLowerCase();
    const c3 = this.peek(2);

    if ('frbu'.includes(c1) && (c2 === '"' || c2 === "'")) {
      return true;
    }
    if (
      ('fr'.includes(c1) && 'fr'.includes(c2) && c1 !== c2 ||
       'br'.includes(c1) && 'br'.includes(c2) && c1 !== c2) &&
      (c3 === '"' || c3 === "'")
    ) {
      return true;
    }
    return false;
  }

  private scanPythonPrefixedString(): void {
    const startLine = this.line;
    const startCol = this.column;
    const startOff = this.offset;

    let prefix = '';
    while (!this.isEOF() && this.peek() !== '"' && this.peek() !== "'") {
      prefix += this.advance(1);
    }
    this.scanStringBody(prefix, startLine, startCol, startOff);
  }

  private scanStringOrCharLiteral(): void {
    const startLine = this.line;
    const startCol = this.column;
    const startOff = this.offset;
    const quote = this.peek();

    // C++ and Java single quotes are CHAR literals, whereas Python single quotes are STRING literals
    if (quote === "'" && (this.language === 'cpp' || this.language === 'java')) {
      this.scanCharLiteral(startLine, startCol, startOff);
      return;
    }

    this.scanStringBody('', startLine, startCol, startOff);
  }

  private scanStringBody(
    prefix: string,
    startLine: number,
    startCol: number,
    startOff: number
  ): void {
    const quoteChar = this.peek();
    const tripleQuote = quoteChar.repeat(3);

    // Check for multiline string: Python ''' or """, Java """
    const supportsTriple =
      (this.language === 'python' && (this.matchSlice('"""') || this.matchSlice("'''"))) ||
      (this.language === 'java' && this.matchSlice('"""'));

    if (supportsTriple) {
      let lexeme = prefix + this.advance(3);
      let closed = false;

      while (!this.isEOF()) {
        if (this.peek() === '\\') {
          lexeme += this.advance(1);
          if (!this.isEOF()) {
            lexeme += this.advance(1);
          }
          continue;
        }
        if (this.matchSlice(tripleQuote)) {
          lexeme += this.advance(3);
          closed = true;
          break;
        }
        lexeme += this.advance(1);
      }

      if (!closed) {
        this.addError(
          'Cadena de texto sin cerrar',
          lexeme.length > 45 ? `${lexeme.slice(0, 42)}...` : lexeme,
          startLine,
          startCol,
          startOff,
          this.offset,
          `Cadena multilínea (${tripleQuote}) abierta en la línea ${startLine}, columna ${startCol} llegó al final del archivo sin encontrar las comillas triples de cierre.`
        );
        return;
      }

      this.addToken(
        lexeme,
        'STRING',
        startLine,
        startCol,
        startOff,
        this.offset,
        `Literal de cadena multilínea válido en ${LANGUAGE_LABELS[this.language]}.`
      );
      return;
    }

    // Standard single-line string literal
    let lexeme = prefix + this.advance(1); // opening quote
    let closed = false;
    let invalidEscape: string | null = null;
    const isRawString = prefix.toLowerCase().includes('r');

    while (!this.isEOF()) {
      const ch = this.peek();

      if (ch === '\n' || ch === '\r') {
        break; // Unclosed before end of line!
      }

      if (ch === '\\') {
        const escStart = this.advance(1);
        if (this.isEOF() || this.peek() === '\n' || this.peek() === '\r') {
          lexeme += escStart;
          break;
        }
        const escChar = this.advance(1);
        lexeme += escStart + escChar;

        if (!isRawString && !this.isValidEscapeChar(escChar)) {
          invalidEscape = `\\${escChar}`;
        }
        continue;
      }

      if (ch === quoteChar) {
        lexeme += this.advance(1);
        closed = true;
        break;
      }

      lexeme += this.advance(1);
    }

    if (!closed) {
      this.addError(
        'Cadena de texto sin cerrar',
        lexeme,
        startLine,
        startCol,
        startOff,
        this.offset,
        `Literal de cadena iniciado con ${quoteChar} en la línea ${startLine}, columna ${startCol} no fue cerrado antes del final de la línea o del archivo.`
      );
      return;
    }

    if (invalidEscape && (this.language === 'cpp' || this.language === 'java')) {
      this.addError(
        'Secuencia de escape inválida',
        lexeme,
        startLine,
        startCol,
        startOff,
        this.offset,
        `La cadena ${lexeme} contiene una secuencia de escape inválida ('${invalidEscape}') no reconocida en ${LANGUAGE_LABELS[this.language]}.`
      );
      return;
    }

    this.addToken(
      lexeme,
      'STRING',
      startLine,
      startCol,
      startOff,
      this.offset,
      `Literal de cadena de texto cerrado correctamente (${quoteChar}...${quoteChar}). Cualquier símbolo especial en su interior forma parte del texto.`
    );
  }

  private scanCharLiteral(startLine: number, startCol: number, startOff: number): void {
    let lexeme = this.advance(1); // opening '
    let closed = false;
    let charUnits = 0;
    let invalidEscape: string | null = null;

    while (!this.isEOF()) {
      const ch = this.peek();
      if (ch === '\n' || ch === '\r') {
        break;
      }
      if (ch === '\\') {
        lexeme += this.advance(1);
        if (!this.isEOF() && this.peek() !== '\n' && this.peek() !== '\r') {
          const esc = this.advance(1);
          lexeme += esc;
          if (!this.isValidEscapeChar(esc)) {
            invalidEscape = `\\${esc}`;
          }
          // Handle unicode escape \uXXXX in Java/C++
          if (esc === 'u') {
            for (let i = 0; i < 4 && !this.isEOF() && isHexDigit(this.peek()); i++) {
              lexeme += this.advance(1);
            }
          }
        }
        charUnits++;
        continue;
      }
      if (ch === "'") {
        lexeme += this.advance(1);
        closed = true;
        break;
      }
      lexeme += this.advance(1);
      charUnits++;
    }

    if (!closed) {
      this.addError(
        'Literal de carácter inválido',
        lexeme,
        startLine,
        startCol,
        startOff,
        this.offset,
        `Literal de carácter '${lexeme}' sin cerrar en ${LANGUAGE_LABELS[this.language]}. Las comillas simples deben cerrarse en la misma línea.`
      );
      return;
    }

    if (charUnits === 0) {
      this.addError(
        'Literal de carácter inválido',
        lexeme,
        startLine,
        startCol,
        startOff,
        this.offset,
        `Literal de carácter vacío ('') inválido en ${LANGUAGE_LABELS[this.language]}. Un tipo char debe contener exactamente un carácter o una secuencia de escape.`
      );
      return;
    }

    if (invalidEscape) {
      this.addError(
        'Secuencia de escape inválida',
        lexeme,
        startLine,
        startCol,
        startOff,
        this.offset,
        `El literal de carácter ${lexeme} contiene la secuencia de escape inválida '${invalidEscape}'.`
      );
      return;
    }

    if (charUnits > 1) {
      this.addError(
        'Literal de carácter inválido',
        lexeme,
        startLine,
        startCol,
        startOff,
        this.offset,
        `Literal de carácter multicarácter inválido (${lexeme}) en ${LANGUAGE_LABELS[this.language]}. Las comillas simples (' ') solo admiten un único carácter; para cadenas de texto utilice comillas dobles (" ").`
      );
      return;
    }

    this.addToken(
      lexeme,
      'CHAR',
      startLine,
      startCol,
      startOff,
      this.offset,
      `Literal de carácter válido en ${LANGUAGE_LABELS[this.language]} (${lexeme}).`
    );
  }

  private isValidEscapeChar(ch: string): boolean {
    return 'ntr0bfrv\\\'"?uxXo01234567'.includes(ch);
  }

  // --------------------------------------------------------------------------
  // NUMBERS & MAXIMAL MUNCH VALIDATION (e.g., 10var, 3.14.16, 0xZZ)
  // --------------------------------------------------------------------------

  private scanNumberOrMalformedToken(): void {
    const startLine = this.line;
    const startCol = this.column;
    const startOff = this.offset;

    let lexeme = '';

    // Check for base prefix: 0x / 0X, 0b / 0B, 0o / 0O
    if (this.peek(0) === '0' && 'xXbBoO'.includes(this.peek(1)) && this.peek(1) !== '') {
      const basePrefix = this.advance(2);
      lexeme += basePrefix;
      const baseType = basePrefix[1].toLowerCase();

      // Consume all contiguous alphanumeric, underscore, or dot characters to validate Maximal Munch
      while (
        !this.isEOF() &&
        (isAsciiDigit(this.peek()) ||
          isUnicodeLetter(this.peek()) ||
          this.peek() === '_' ||
          this.peek() === '.')
      ) {
        lexeme += this.advance(1);
      }

      const body = lexeme.slice(2);
      if (!body || body.startsWith('_') || body.endsWith('_') || body.includes('__') || body.includes('.')) {
        this.addError(
          'Literal numérico mal formado',
          lexeme,
          startLine,
          startCol,
          startOff,
          this.offset,
          `Literal numérico en base especial ('${lexeme}') mal formado en ${LANGUAGE_LABELS[this.language]}. Debe contener dígitos válidos para el prefijo '${basePrefix}'.`
        );
        return;
      }

      // Extract optional valid suffix (for C++ / Java)
      let digitsPart = body;
      let suffixPart = '';

      if (this.language === 'cpp' || this.language === 'java') {
        const suffixMatch = body.match(/([uUlL]+)$/);
        if (suffixMatch && baseType !== 'x') {
          digitsPart = body.slice(0, -suffixMatch[1].length);
          suffixPart = suffixMatch[1];
        } else if (baseType === 'x') {
          const hexSuffixMatch = body.match(/([uUlL]+)$/);
          if (hexSuffixMatch) {
            digitsPart = body.slice(0, -hexSuffixMatch[1].length);
            suffixPart = hexSuffixMatch[1];
          }
        }
      }

      const validDigitRegex =
        baseType === 'x'
          ? /^[0-9a-fA-F_]+$/
          : baseType === 'b'
          ? /^[01_]+$/
          : /^[0-7_]+$/;

      if (!digitsPart || !validDigitRegex.test(digitsPart) || !isValidNumberSuffix(this.language, suffixPart, false)) {
        this.addError(
          'Literal numérico mal formado',
          lexeme,
          startLine,
          startCol,
          startOff,
          this.offset,
          `Literal numérico '${lexeme}' contiene dígitos o sufijos fuera de rango para la base '${basePrefix}' en ${LANGUAGE_LABELS[this.language]}.`
        );
        return;
      }

      this.addToken(
        lexeme,
        'INTEGER',
        startLine,
        startCol,
        startOff,
        this.offset,
        `Literal entero en base '${basePrefix}' válido (${lexeme}).`
      );
      return;
    }

    // Standard decimal / float / scientific / malformed identifier starting with number
    let dotCount = 0;
    let hasExponent = false;
    let malformedReason: string | null = null;

    while (!this.isEOF()) {
      const ch = this.peek();

      if (isAsciiDigit(ch)) {
        lexeme += this.advance(1);
        continue;
      }

      if (ch === '_') {
        lexeme += this.advance(1);
        continue;
      }

      if (ch === '.') {
        dotCount++;
        lexeme += this.advance(1);
        continue;
      }

      if ((ch === 'e' || ch === 'E') && !hasExponent && dotCount <= 1) {
        // Check if scientific notation
        const next1 = this.peek(1);
        const next2 = this.peek(2);
        if (isAsciiDigit(next1) || ((next1 === '+' || next1 === '-') && isAsciiDigit(next2))) {
          hasExponent = true;
          lexeme += this.advance(1); // consume e/E
          if (this.peek() === '+' || this.peek() === '-') {
            lexeme += this.advance(1); // consume sign
          }
          continue;
        }
      }

      // If attached directly to letters or $ (Maximal Munch boundary check!)
      if (isUnicodeLetter(ch) || ch === '$') {
        while (
          !this.isEOF() &&
          (isUnicodeLetter(this.peek()) ||
            isAsciiDigit(this.peek()) ||
            this.peek() === '_' ||
            this.peek() === '$' ||
            this.peek() === '.')
        ) {
          if (this.peek() === '.') dotCount++;
          lexeme += this.advance(1);
        }
        break;
      }

      break;
    }

    // Validate underscores
    if (
      lexeme.startsWith('_') ||
      lexeme.endsWith('_') ||
      lexeme.includes('__') ||
      lexeme.includes('._') ||
      lexeme.includes('_.')
    ) {
      malformedReason = `Uso inválido del separador '_' en el literal numérico '${lexeme}'.`;
    }

    // Validate multiple decimal points (e.g. 3.14.16)
    if (dotCount > 1) {
      this.addError(
        'Literal numérico mal formado',
        lexeme,
        startLine,
        startCol,
        startOff,
        this.offset,
        `El literal '${lexeme}' contiene múltiples puntos decimales (${dotCount} puntos). Un número flotante solo puede contener un punto decimal.`
      );
      return;
    }

    // Extract any trailing letters to check if it's a valid numeric suffix or an invalid identifier like 10var
    const trailingMatch = lexeme.match(/([a-zA-Z$\u00C0-\u024F_]+)$/);
    const isFloat = dotCount === 1 || hasExponent;

    if (trailingMatch) {
      const suffix = trailingMatch[1];
      const numericPrefix = lexeme.slice(0, -suffix.length);

      // In scientific notation, make sure we didn't accidentally match the 'e' if it had no digits
      if (!isValidNumberSuffix(this.language, suffix, isFloat) || !numericPrefix) {
        // Decide whether to classify as "Identificador mal formado" (e.g., 10var, 1variable, 99_temp)
        // or "Literal numérico mal formado" (if it contains decimal point like 3.14abc)
        if (dotCount === 0 && !hasExponent) {
          this.addError(
            'Identificador mal formado',
            lexeme,
            startLine,
            startCol,
            startOff,
            this.offset,
            `En ${LANGUAGE_LABELS[this.language]}, los identificadores no pueden iniciar con un dígito ('${lexeme}'). Por el principio de Maximal Munch, la secuencia contigua se rechaza como un único token inválido.`
          );
        } else {
          this.addError(
            'Literal numérico mal formado',
            lexeme,
            startLine,
            startCol,
            startOff,
            this.offset,
            `El literal numérico '${lexeme}' posee caracteres o sufijos inválidos ('${suffix}') pegados sin separador en ${LANGUAGE_LABELS[this.language]}.`
          );
        }
        return;
      }
    }

    if (malformedReason) {
      this.addError(
        'Literal numérico mal formado',
        lexeme,
        startLine,
        startCol,
        startOff,
        this.offset,
        malformedReason
      );
      return;
    }

    const category: TokenCategory = isFloat ? 'FLOAT' : 'INTEGER';
    this.addToken(
      lexeme,
      category,
      startLine,
      startCol,
      startOff,
      this.offset,
      isFloat
        ? `Literal numérico de punto flotante válido (${lexeme}).`
        : `Literal numérico entero válido (${lexeme}).`
    );
  }

  // --------------------------------------------------------------------------
  // IDENTIFIERS & KEYWORDS
  // --------------------------------------------------------------------------

  private isIdentifierStartForCurrentLanguage(ch: string): boolean {
    if (this.language === 'python') return isPythonIdStart(ch);
    if (this.language === 'cpp') return isCppIdStart(ch);
    return isJavaIdStart(ch);
  }

  private isIdentifierPartForCurrentLanguage(ch: string): boolean {
    if (this.language === 'python') return isPythonIdPart(ch);
    if (this.language === 'cpp') return isCppIdPart(ch);
    return isJavaIdPart(ch);
  }

  private scanIdentifierOrKeyword(): void {
    const startLine = this.line;
    const startCol = this.column;
    const startOff = this.offset;

    let lexeme = '';
    while (!this.isEOF() && this.isIdentifierPartForCurrentLanguage(this.peek())) {
      lexeme += this.advance(1);
    }

    const isKeyword =
      (this.language === 'python' && PYTHON_KEYWORDS.has(lexeme)) ||
      (this.language === 'cpp' && CPP_KEYWORDS.has(lexeme)) ||
      (this.language === 'java' && JAVA_KEYWORDS.has(lexeme));

    if (isKeyword) {
      this.addToken(
        lexeme,
        'KEYWORD',
        startLine,
        startCol,
        startOff,
        this.offset,
        `Palabra reservada del lenguaje ${LANGUAGE_LABELS[this.language]} ('${lexeme}').`
      );
    } else {
      this.addToken(
        lexeme,
        'IDENTIFIER',
        startLine,
        startCol,
        startOff,
        this.offset,
        `Identificador válido en ${LANGUAGE_LABELS[this.language]} ('${lexeme}').`
      );
    }
  }

  // --------------------------------------------------------------------------
  // OPERATORS & DELIMITERS
  // --------------------------------------------------------------------------

  private matchOperator(): string | null {
    const ops =
      this.language === 'python'
        ? PYTHON_OPERATORS
        : this.language === 'cpp'
        ? CPP_OPERATORS
        : JAVA_OPERATORS;

    for (const op of ops) {
      if (this.matchSlice(op)) {
        return op;
      }
    }
    return null;
  }

  private isDelimiterForCurrentLanguage(ch: string): boolean {
    if (this.language === 'python') return PYTHON_DELIMITERS.has(ch);
    if (this.language === 'cpp') return CPP_DELIMITERS.has(ch);
    return JAVA_DELIMITERS.has(ch);
  }

  // --------------------------------------------------------------------------
  // ILLEGAL / UNRECOGNIZED CHARACTERS
  // --------------------------------------------------------------------------

  private scanIllegalCharacter(): void {
    const startLine = this.line;
    const startCol = this.column;
    const startOff = this.offset;
    const ch = this.advance(1);

    let specificReason = `El símbolo '${ch}' (U+${ch.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}) no pertenece al alfabeto léxico válido de ${LANGUAGE_LABELS[this.language]} fuera de cadenas de texto o comentarios.`;

    if (ch === '@' && this.language === 'cpp') {
      specificReason = `El carácter '@' es un error léxico en C++ porque no forma parte del alfabeto estándar del lenguaje (a diferencia de Python donde es operador matricial/decorador o Java donde inicia anotaciones).`;
    } else if (ch === '$' && this.language === 'python') {
      specificReason = `El símbolo '$' no es un operador ni está permitido dentro de identificadores en Python.`;
    } else if (ch === '$' && this.language === 'cpp') {
      specificReason = `El símbolo '$' no pertenece al alfabeto estándar de C++ para identificadores ni operadores.`;
    } else if (ch === '#' && this.language === 'java') {
      specificReason = `En Java, el carácter '#' es un error léxico porque Java no utiliza preprocesador (como C++) ni comentarios con '#' (como Python).`;
    } else if (ch === '?' && this.language === 'python') {
      specificReason = `El carácter '?' no es un operador válido en Python (Python no emplea el operador ternario '? :' de C++/Java).`;
    } else if (ch === '`' && (this.language === 'python' || this.language === 'cpp' || this.language === 'java')) {
      specificReason = `El acento grave ('\`') no es un delimitador de cadena válido en ${LANGUAGE_LABELS[this.language]}.`;
    } else if (ch === '§' || ch === '¿' || ch === '¡') {
      specificReason = `El símbolo '${ch}' no forma parte del alfabeto ASCII/léxico de ${LANGUAGE_LABELS[this.language]} en código ejecutable.`;
    }

    this.addError(
      'Carácter ilegal / no reconocido',
      ch,
      startLine,
      startCol,
      startOff,
      this.offset,
      specificReason
    );
  }

  // --------------------------------------------------------------------------
  // STATISTICS & DIDACTIC NOTES (LEXICAL VS SYNTACTIC DISTINCTION)
  // --------------------------------------------------------------------------

  private computeStatistics(): AnalysisStatistics {
    const linesAnalyzed = this.source.length === 0 ? 0 : this.source.split(/\r\n|\r|\n/).length;

    let identifiersCount = 0;
    let keywordsCount = 0;
    let operatorsCount = 0;
    let numericLiteralsCount = 0;
    let stringLiteralsCount = 0;
    let delimitersCount = 0;
    let commentsCount = 0;
    let specialTokensCount = 0;

    for (const token of this.tokens) {
      switch (token.category) {
        case 'IDENTIFIER':
          identifiersCount++;
          break;
        case 'KEYWORD':
          keywordsCount++;
          break;
        case 'OPERATOR':
          operatorsCount++;
          break;
        case 'INTEGER':
        case 'FLOAT':
          numericLiteralsCount++;
          break;
        case 'STRING':
          stringLiteralsCount++;
          break;
        case 'DELIMITER':
          delimitersCount++;
          break;
        case 'COMMENT':
          commentsCount++;
          break;
        case 'CHAR':
        case 'PREPROCESSOR':
        case 'ANNOTATION':
          specialTokensCount++;
          break;
      }
    }

    return {
      totalTokens: this.tokens.length,
      totalErrors: this.errors.length,
      linesAnalyzed,
      identifiersCount,
      keywordsCount,
      operatorsCount,
      numericLiteralsCount,
      stringLiteralsCount,
      delimitersCount,
      commentsCount,
      specialTokensCount,
      status: this.errors.length === 0 ? 'SUCCESS' : 'ERROR'
    };
  }

  private detectDidacticNotes(): DidacticNote[] {
    const notes: DidacticNote[] = [];
    const nonCommentTokens = this.tokens.filter((t) => t.category !== 'COMMENT');

    // Check for consecutive binary operators like `+ *` or `* /` (e.g., `20 + * 5;`)
    const binaryOnlyOps = new Set(['+', '-', '*', '/', '%', '==', '!=', '<', '>', '<=', '>=', '=', '&&', '||']);
    for (let i = 0; i < nonCommentTokens.length - 1; i++) {
      const current = nonCommentTokens[i];
      const next = nonCommentTokens[i + 1];

      if (
        current.category === 'OPERATOR' &&
        next.category === 'OPERATOR' &&
        binaryOnlyOps.has(current.lexeme) &&
        binaryOnlyOps.has(next.lexeme) &&
        !(next.lexeme === '-' || next.lexeme === '+') // allow unary sign unless it's `+ *`
      ) {
        notes.push({
          title: 'Distinción Clave: ¿Por qué esta secuencia de operadores NO marca Error Léxico?',
          detectedSequence: `${current.lexeme} ${next.lexeme}`,
          line: current.line,
          message: `¿Por qué expresiones como "20 ${current.lexeme} ${next.lexeme} 5;" no marcan error léxico? Porque cada unidad individual pertenece al alfabeto de ${LANGUAGE_LABELS[this.language]} y forma un token válido reconocido por el escáner. El problema de colocar dos operadores consecutivos ('${current.lexeme} ${next.lexeme}') es un error sintáctico (de gramática/estructura), el cual corresponde a la segunda fase del compilador (Parser), no al analizador léxico (Scanner).`
        });
        break;
      }
    }

    // Check for strings or comments containing symbols like @, §, $, # to highlight contextual awareness
    for (const token of this.tokens) {
      if (
        (token.category === 'STRING' || token.category === 'COMMENT') &&
        /[@§$¿¡#]/.test(token.lexeme.slice(1))
      ) {
        notes.push({
          title: 'Sensibilidad al Contexto del Escáner (Autómata de Estados)',
          detectedSequence: token.lexeme.length > 32 ? `${token.lexeme.slice(0, 29)}...` : token.lexeme,
          line: token.line,
          message: `Se detectaron caracteres especiales (como '@', '§', '$' o '#') dentro de un ${token.category === 'STRING' ? 'literal de cadena cerrado' : 'comentario'}. El motor léxico mantiene el estado contextual y encapsula estos caracteres sin reportar falsos errores léxicos.`
        });
        break;
      }
    }

    return notes;
  }
}

export function analyzeSourceCode(
  sourceCode: string,
  language: SupportedLanguage
): AnalysisResult {
  const scanner = new LexicalScanner(sourceCode, language);
  return scanner.scan();
}
