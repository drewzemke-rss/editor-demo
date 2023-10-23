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
import { $convertFromMarkdownString } from "@lexical/markdown";
import { MARKDOWN_TRANSFORMERS } from "./transformers";
import { OnBlurPlugin } from "./OnBlurPlugin";

function handleError(error: Error) {
  // eslint-disable-next-line no-console
  console.error(error);
}

type MarkdownEditorProps = {
  initialValue?: string;
  onChange: (content: string) => void;
};

export function MarkdownEditor(props: MarkdownEditorProps) {
  const initialConfig: InitialConfigType = {
    namespace: "Editor",
    theme: { paragraph: "bg-white", link: "text-blue-500" },
    onError: handleError,
    nodes: [LinkNode, HeadingNode, QuoteNode],
    editorState: () =>
      $convertFromMarkdownString(
        props.initialValue ?? "",
        MARKDOWN_TRANSFORMERS
      ),
  };

  const onBlur = (text: string) => {
    props.onChange(text);
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="rounded-sm bg-white p-2 text-slate-900" />
        }
        placeholder={null}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <MarkdownShortcutPlugin transformers={MARKDOWN_TRANSFORMERS} />
      <HistoryPlugin />
      <OnBlurPlugin onBlur={onBlur} />
      <LinkPlugin />
    </LexicalComposer>
  );
}
