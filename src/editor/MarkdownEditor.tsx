import {
  LexicalComposer,
  InitialConfigType,
} from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { LinkNode } from "@lexical/link";
import { $convertFromMarkdownString } from "@lexical/markdown";
import { OnBlurPlugin } from "./OnBlurPlugin";
import { ListItemNode, ListNode } from "@lexical/list";
import { $createParagraphNode, $getRoot } from "lexical";

import { ToolbarPlugin } from "./ToolbarPlugin";
import { MARKDOWN_TRANSFORMERS } from "./transformers";
import { CustomLinkPlugin } from "./CustomLinkPlugin";

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
    theme: {
      paragraph: "bg-white",
      list: {
        ul: "list-disc ml-4",
        ol: "list-decimal ml-4",
      },
      link: "text-blue-500",
    },
    onError: handleError,
    nodes: [LinkNode, HeadingNode, QuoteNode, ListNode, ListItemNode],
    editorState: () => {
      if (props.initialValue) {
        return $convertFromMarkdownString(
          props.initialValue,
          MARKDOWN_TRANSFORMERS
        );
      } else {
        const paragraph = $createParagraphNode();
        $getRoot().append(paragraph);
        paragraph.select();
      }
    },
  };

  return (
    <div className="relative">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin onChange={props.onChange} />
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="rounded-b bg-white p-2 text-slate-900" />
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <MarkdownShortcutPlugin transformers={MARKDOWN_TRANSFORMERS} />
        <HistoryPlugin />
        <OnBlurPlugin onBlur={props.onChange} />
        <CustomLinkPlugin />
      </LexicalComposer>
    </div>
  );
}
