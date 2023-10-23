import { $convertToMarkdownString } from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { BLUR_COMMAND, COMMAND_PRIORITY_LOW } from "lexical";
import { useEffect } from "react";

import { MARKDOWN_TRANSFORMERS } from "./transformers";

export function OnBlurPlugin({ onBlur }: { onBlur: (text: string) => void }) {
  const [editor] = useLexicalComposerContext();

  useEffect(
    () =>
      editor.registerCommand(
        BLUR_COMMAND,
        () => {
          editor.update(() => {
            const markdown = $convertToMarkdownString(MARKDOWN_TRANSFORMERS);
            onBlur(markdown);
          });
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
    [editor, onBlur]
  );

  return null;
}
