import React, { useEffect, useRef } from 'react';
import {
  EditorState,
  Compartment,
  StateEffect,
  StateField,
  RangeSetBuilder
} from '@codemirror/state';
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
  drawSelection,
  Decoration,
  DecorationSet
} from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { syntaxHighlighting, HighlightStyle, bracketMatching } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { LexicalError, SupportedLanguage } from '../lexer/types';

export interface CodeEditorHandle {
  focusLocation: (startOffset: number, endOffset: number) => void;
}

interface ViceCodeEditorProps {
  code: string;
  language: SupportedLanguage;
  errors: LexicalError[];
  onChange: (newCode: string) => void;
  editorRef?: React.MutableRefObject<CodeEditorHandle | null>;
}

// Custom state effect to push lexical errors into CodeMirror decorations
const setLexicalErrorsEffect = StateEffect.define<LexicalError[]>();

const errorMarkDecoration = Decoration.mark({
  class: 'cm-lexical-error-mark'
});

const lexicalErrorField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(decorations, tr) {
    decorations = decorations.map(tr.changes);
    for (const effect of tr.effects) {
      if (effect.is(setLexicalErrorsEffect)) {
        const builder = new RangeSetBuilder<Decoration>();
        const docLength = tr.state.doc.length;
        const sortedErrors = [...effect.value].sort((a, b) => a.startOffset - b.startOffset);

        for (const err of sortedErrors) {
          const from = Math.max(0, Math.min(err.startOffset, docLength));
          const to = Math.max(from, Math.min(err.endOffset, docLength));
          if (to > from) {
            builder.add(from, to, errorMarkDecoration);
          }
        }
        decorations = builder.finish();
      }
    }
    return decorations;
  },
  provide: (f) => EditorView.decorations.from(f)
});

// Enderman / Vice Custom Syntax Highlighting Theme
const viceSyntaxStyle = HighlightStyle.define([
  { tag: tags.keyword, color: '#C4A1FF', fontWeight: '600' },
  { tag: [tags.controlKeyword, tags.moduleKeyword, tags.operatorKeyword], color: '#A875F5', fontWeight: '600' },
  { tag: [tags.typeName, tags.className, tags.namespace], color: '#E9D5FF' },
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: '#D8B4FE' },
  { tag: [tags.variableName, tags.propertyName], color: '#F3ECFA' },
  { tag: [tags.number, tags.integer, tags.float, tags.bool], color: '#F59E0B', fontWeight: '500' },
  { tag: [tags.string, tags.character, tags.special(tags.string)], color: '#4ADE80' },
  { tag: [tags.comment, tags.lineComment, tags.blockComment], color: '#7E728D', fontStyle: 'italic' },
  { tag: [tags.operator, tags.compareOperator, tags.arithmeticOperator, tags.logicOperator], color: '#A875F5' },
  { tag: [tags.punctuation, tags.separator, tags.bracket, tags.paren, tags.brace], color: '#A99DB5' },
  { tag: [tags.meta, tags.processingInstruction], color: '#38BDF8', fontWeight: '600' }
]);

const viceEditorTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: '#111019',
      color: '#F3ECFA',
      height: '100%'
    },
    '.cm-content': {
      caretColor: '#A875F5',
      padding: '12px 0'
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: '#A875F5',
      borderLeftWidth: '2px'
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
      backgroundColor: 'rgba(128, 83, 200, 0.35)'
    },
    '.cm-gutters': {
      backgroundColor: '#191521',
      color: '#A99DB5',
      borderRight: '1px solid #40334F',
      paddingRight: '4px'
    },
    '.cm-activeLineGutter': {
      backgroundColor: '#292136',
      color: '#C4A1FF'
    }
  },
  { dark: true }
);

function getLanguageExtension(lang: SupportedLanguage) {
  switch (lang) {
    case 'python':
      return python();
    case 'cpp':
      return cpp();
    case 'java':
      return java();
  }
}

export const ViceCodeEditor: React.FC<ViceCodeEditorProps> = ({
  code,
  language,
  errors,
  onChange,
  editorRef
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const languageCompartment = useRef(new Compartment());
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Initialize CodeMirror 6 instance once
  useEffect(() => {
    if (!containerRef.current) return;

    const state = EditorState.create({
      doc: code,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightActiveLine(),
        history(),
        drawSelection(),
        bracketMatching(),
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        languageCompartment.current.of(getLanguageExtension(language)),
        syntaxHighlighting(viceSyntaxStyle),
        viceEditorTheme,
        lexicalErrorField,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString());
          }
        })
      ]
    });

    const view = new EditorView({
      state,
      parent: containerRef.current
    });

    viewRef.current = view;

    if (editorRef) {
      editorRef.current = {
        focusLocation: (startOffset: number, endOffset: number) => {
          const docLen = view.state.doc.length;
          const anchor = Math.max(0, Math.min(startOffset, docLen));
          const head = Math.max(anchor, Math.min(endOffset, docLen));
          view.dispatch({
            selection: { anchor, head },
            effects: EditorView.scrollIntoView(anchor, { y: 'center' })
          });
          view.focus();
        }
      };
    }

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Synchronize external code updates (e.g. loading example or clearing)
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const currentDoc = view.state.doc.toString();
    if (currentDoc !== code) {
      view.dispatch({
        changes: { from: 0, to: currentDoc.length, insert: code }
      });
    }
  }, [code]);

  // Synchronize dynamic language syntax highlighting
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      effects: languageCompartment.current.reconfigure(getLanguageExtension(language))
    });
  }, [language]);

  // Synchronize lexical error decorations inside editor
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      effects: setLexicalErrorsEffect.of(errors)
    });
  }, [errors, code]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[340px] overflow-hidden rounded-b-xl bg-[#111019]"
    />
  );
};
