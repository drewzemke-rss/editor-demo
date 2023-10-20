import { useEffect, useState } from "react";
import {
  LexicalComposer,
  InitialConfigType,
} from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { LinkNode } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { BLUR_COMMAND, COMMAND_PRIORITY_LOW } from "lexical";
import {
  $convertToMarkdownString,
  LINK,
  TEXT_FORMAT_TRANSFORMERS,
} from "@lexical/markdown";

const TRANSFORMERS = [...TEXT_FORMAT_TRANSFORMERS, LINK];

function handleError(error: Error) {
  console.error(error);
}

function OnBlurPlugin({ onBlur }: { onBlur: (text: string) => void }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      BLUR_COMMAND,
      () => {
        editor.update(() => {
          const markdown = $convertToMarkdownString(TRANSFORMERS);
          onBlur(markdown);
        });
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, onBlur]);

  return null;
}

function Editor({ setContent }: { setContent: (content: string) => void }) {
  const initialConfig: InitialConfigType = {
    namespace: "Editor",
    theme: { paragraph: "bg-white", link: "text-blue-500" },
    onError: handleError,
    nodes: [LinkNode, HeadingNode, QuoteNode],
  };

  const onBlur = (text: string) => {
    setContent(text);
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="bg-white p-2 text-slate-900 rounded-sm" />
        }
        placeholder={null}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <HistoryPlugin />
      <OnBlurPlugin onBlur={onBlur} />
      <LinkPlugin />
    </LexicalComposer>
  );
}

function App() {
  const [content, setContent] = useState<string>();

  return (
    <div className="flex w-full h-screen bg-slate-800 text-slate-50 font-base items-center justify-center">
      <div className="flex flex-col gap-2 w-[700px]">
        <h1 className="text-3xl">Lexical Demo!</h1>
        <p className="text-slate-400 mb-4">
          Type something (using markdown if you like) and then click elsewhere
          to trigger a blur.
        </p>
        <Editor setContent={setContent} />
        {content && (
          <div className="mt-4">
            <h2 className="text-slate-200">Most recent output:</h2>
            <div className="font-mono px-2">{content}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
