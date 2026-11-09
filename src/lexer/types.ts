export type SupportedLanguage = 'python' | 'cpp' | 'java';

export type TokenCategory =
  | 'KEYWORD'
  | 'IDENTIFIER'
  | 'INTEGER'
  | 'FLOAT'
  | 'STRING'
  | 'CHAR'
  | 'PREPROCESSOR'
  | 'ANNOTATION'
  | 'OPERATOR'
  | 'DELIMITER'
  | 'COMMENT';

export type LexicalErrorType =
  | 'Carácter ilegal / no reconocido'
  | 'Identificador mal formado'
  | 'Literal numérico mal formado'
  | 'Cadena de texto sin cerrar'
  | 'Literal de carácter inválido'
  | 'Comentario multilínea sin cerrar'
  | 'Secuencia de escape inválida';

export interface Token {
  index: number;
  lexeme: string;
  category: TokenCategory;
  categoryLabel: string;
  line: number;       // 1-indexed
  column: number;     // 1-indexed
  startOffset: number; // 0-indexed character offset for editor decorations
  endOffset: number;   // 0-indexed character offset (exclusive) for editor decorations
  description: string;
}

export interface LexicalError {
  errorNumber: number;
  errorType: LexicalErrorType;
  language: SupportedLanguage;
  lexeme: string;
  line: number;       // 1-indexed
  column: number;     // 1-indexed
  startOffset: number; // 0-indexed character offset for CodeMirror decoration
  endOffset: number;   // 0-indexed character offset (exclusive) for CodeMirror decoration
  explanation: string;
}

export interface DidacticNote {
  title: string;
  message: string;
  detectedSequence?: string;
  line?: number;
}

export interface AnalysisStatistics {
  totalTokens: number;
  totalErrors: number;
  linesAnalyzed: number;
  identifiersCount: number;
  keywordsCount: number;
  operatorsCount: number;
  numericLiteralsCount: number;
  stringLiteralsCount: number;
  delimitersCount: number;
  commentsCount: number;
  specialTokensCount: number; // Preprocessor / Annotations / Char literals
  status: 'SUCCESS' | 'ERROR';
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  language: SupportedLanguage;
  sourceCode: string;
  tokens: Token[];
  errors: LexicalError[];
  statistics: AnalysisStatistics;
  didacticNotes: DidacticNote[];
  durationMs: number;
}

export interface CodeExample {
  id: string;
  title: string;
  badge: string;
  language: SupportedLanguage;
  description: string;
  code: string;
  expectedBehavior: string;
}
