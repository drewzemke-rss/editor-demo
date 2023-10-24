import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import {
  $getSelection,
  COMMAND_PRIORITY_LOW,
  RangeSelection,
  createCommand,
  GridSelection,
  NodeSelection,
  $setSelection,
} from "lexical";
import { toggleLink } from "@lexical/link";
import { mergeRegister } from "@lexical/utils";

export const STORE_SELECTION_COMMAND = createCommand("STORE_SELECTION_COMMAND");
export const SET_LINK_COMMAND = createCommand("SET_LINK_COMMAND");

export function CustomLinkPlugin() {
  const [editor] = useLexicalComposerContext();

  const [selection, setSelection] = useState<
    RangeSelection | GridSelection | NodeSelection | null
  >(null);

  useEffect(
    () =>
      mergeRegister(
        editor.registerCommand(
          STORE_SELECTION_COMMAND,
          () => {
            setSelection($getSelection());
            return false;
          },
          COMMAND_PRIORITY_LOW
        ),
        editor.registerCommand(
          SET_LINK_COMMAND,
          (payload) => {
            $setSelection(selection);
            toggleLink(payload as string | null);
            return false;
          },
          COMMAND_PRIORITY_LOW
        )
      ),
    [editor, selection]
  );

  return null;
}
