import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TopNavbar, ActiveTab } from './components/TopNavbar';
import { AnalyzerView } from './components/AnalyzerView';
import { TokensExplorerView } from './components/TokensExplorerView';
import { HistoryView } from './components/HistoryView';
import { LexicalRulesView } from './components/LexicalRulesView';
import { AboutView } from './components/AboutView';
import { CodeEditorHandle } from './components/ViceCodeEditor';
import { analyzeSourceCode } from './lexer/scanner';
import { CODE_EXAMPLES } from './lexer/examples';
import { AnalysisResult, SupportedLanguage, Token } from './lexer/types';

const HISTORY_STORAGE_KEY = 'jvvg_vice_lexical_history_v1';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('analyzer');
  const [language, setLanguage] = useState<SupportedLanguage>('python');
  const [code, setCode] = useState<string>(CODE_EXAMPLES.python[0].code);
  const [result, setResult] = useState<AnalysisResult>(() =>
    analyzeSourceCode(CODE_EXAMPLES.python[0].code, 'python')
  );

  const [history, setHistory] = useState<AnalysisResult[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const editorRef = useRef<CodeEditorHandle | null>(null);

  // Persist history in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history.slice(0, 35)));
    } catch {
      // Ignore storage quota errors
    }
  }, [history]);

  // Real-time lexical analysis as code or language changes so editor decorations stay synchronized
  useEffect(() => {
    const newRes = analyzeSourceCode(code, language);
    setResult(newRes);
  }, [code, language]);

  // Explicit "Ejecutar análisis léxico" button also logs the execution to history
  const handleRunAnalysis = useCallback(() => {
    const freshRes = analyzeSourceCode(code, language);
    setResult(freshRes);
    if (code.trim().length > 0) {
      setHistory((prev) => [freshRes, ...prev.slice(0, 34)]);
    }
  }, [code, language]);

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    const defaultExample = CODE_EXAMPLES[newLang][0].code;
    setCode(defaultExample);
    const freshRes = analyzeSourceCode(defaultExample, newLang);
    setResult(freshRes);
  };

  const handleLoadExample = (exampleCode: string) => {
    setCode(exampleCode);
    const freshRes = analyzeSourceCode(exampleCode, language);
    setResult(freshRes);
    setHistory((prev) => [freshRes, ...prev.slice(0, 34)]);
  };

  const handleClearEditor = () => {
    setCode('');
    setResult(analyzeSourceCode('', language));
  };

  const handleJumpToTokenFromExplorer = (tok: Token) => {
    setActiveTab('analyzer');
    setTimeout(() => {
      editorRef.current?.focusLocation(tok.startOffset, tok.endOffset);
    }, 60);
  };

  const handleRestoreHistoryItem = (item: AnalysisResult) => {
    setLanguage(item.language);
    setCode(item.sourceCode);
    setResult(analyzeSourceCode(item.sourceCode, item.language));
    setActiveTab('analyzer');
  };

  const handleTestSnippetFromDocs = (lang: SupportedLanguage, snippet: string) => {
    setLanguage(lang);
    setCode(snippet);
    const freshRes = analyzeSourceCode(snippet, lang);
    setResult(freshRes);
    setHistory((prev) => [freshRes, ...prev.slice(0, 34)]);
    setActiveTab('analyzer');
  };

  return (
    <div className="min-h-screen bg-[#111019] text-[#F3ECFA] flex flex-col relative selection:bg-[#8053C8]/40">
      {/* Subtle Ambient Enderman Purple Particles Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-20 left-[8%] w-1.5 h-1.5 bg-[#A875F5]/25 animate-particle-slow" />
        <div className="absolute top-48 right-[12%] w-2 h-2 bg-[#8053C8]/20 animate-particle-fast" />
        <div className="absolute bottom-24 left-[18%] w-1.5 h-1.5 bg-[#C4A1FF]/20 animate-particle-fast" />
        <div className="absolute bottom-36 right-[22%] w-2 h-2 bg-[#A875F5]/20 animate-particle-slow" />
      </div>

      {/* Top Navigation Bar */}
      <TopNavbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        totalTokens={result.tokens.length}
        totalErrors={result.errors.length}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-6 relative z-10">
        {activeTab === 'analyzer' && (
          <AnalyzerView
            code={code}
            language={language}
            result={result}
            onCodeChange={setCode}
            onLanguageChange={handleLanguageChange}
            onRunAnalysis={handleRunAnalysis}
            onClearEditor={handleClearEditor}
            onLoadExample={handleLoadExample}
            editorRef={editorRef}
          />
        )}

        {activeTab === 'tokens' && (
          <TokensExplorerView
            result={result}
            onJumpToTokenInAnalyzer={handleJumpToTokenFromExplorer}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            history={history}
            onRestoreHistoryItem={handleRestoreHistoryItem}
            onClearHistory={() => setHistory([])}
          />
        )}

        {activeTab === 'rules' && (
          <LexicalRulesView onTestSnippetInAnalyzer={handleTestSnippetFromDocs} />
        )}

        {activeTab === 'about' && (
          <AboutView onLoadTestInAnalyzer={handleTestSnippetFromDocs} />
        )}
      </main>

      {/* Minimalist IDE Status Footer */}
      <footer className="border-t border-[#40334F] bg-[#191521] py-3 px-6 text-xs text-[#A99DB5] relative z-10">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono">
            <span className="inline-block w-2 h-2 rounded-none bg-[#A875F5]" />
            <span className="text-[#F3ECFA] font-semibold">JVVG (Vice) v1.0.0</span>
            <span>—</span>
            <span>Lexical Error Analyzer</span>
          </div>
          <div className="font-mono text-[11px]">
            Compiladores y Lenguajes Formales · Autómata Determinista (Python, C++, Java)
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
