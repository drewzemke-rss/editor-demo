import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useState } from "react";
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  RangeSelection,
  TextNode,
} from "lexical";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
  insertList,
  removeList,
} from "@lexical/list";
import { $isHeadingNode } from "@lexical/rich-text";
import { $convertToMarkdownString } from "@lexical/markdown";
import { LinkEditor } from "./LinkEditor";
import { $isAtNodeEnd } from "@lexical/selection";
import { MARKDOWN_TRANSFORMERS } from "./transformers";

function Divider() {
  return <span>|</span>;
}

function getSelectedNode(selection: RangeSelection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode: TextNode = selection.anchor.getNode();
  const focusNode: TextNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

type ToolbarPluginProps = {
  onChange: (markdown: string) => void;
};

export function ToolbarPlugin({ onChange }: ToolbarPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  const [showLinkEditor, setShowLinkEditor] = useState(false);
  const [currentLink, setCurrentLink] = useState<string | null>(null);

  const triggerChange = useCallback(() => {
    editor.update(() => {
      const markdown = $convertToMarkdownString(MARKDOWN_TRANSFORMERS);
      onChange(markdown);
    });
  }, [editor, onChange]);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
        }
      }
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));

      // Update links
      const node = getSelectedNode(selection);
      const parent: TextNode | null = node.getParent();
      if ($isLinkNode(parent)) {
        setCurrentLink(parent.getURL());
      } else if ($isLinkNode(node)) {
        setCurrentLink(node.getURL());
      } else {
        setCurrentLink(null);
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        INSERT_UNORDERED_LIST_COMMAND,
        () => {
          insertList(editor, "bullet");
          triggerChange();
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        INSERT_ORDERED_LIST_COMMAND,
        () => {
          insertList(editor, "number");
          triggerChange();
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        REMOVE_LIST_COMMAND,
        () => {
          removeList(editor);
          triggerChange();
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        FORMAT_TEXT_COMMAND,
        () => {
          triggerChange();
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, triggerChange, updateToolbar]);

  const handleLinkChange = useCallback(
    (link?: string) => {
      if (link) {
        console.log(link);
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, link);
        triggerChange();
      }
      setShowLinkEditor(false);
    },
    [editor, triggerChange]
  );

  const handleLinkClear = useCallback(() => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    triggerChange();
    setShowLinkEditor(false);
  }, [editor, triggerChange]);

  return (
    <div className="w-full bg-white text-slate-500 rounded-t p-2 flex gap-2 border-b">
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="toolbar-item spaced"
        aria-label="Undo"
      >
        Undo
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="toolbar-item"
        aria-label="Redo"
      >
        Redo
      </button>

      <Divider />

      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={isBold ? "font-bold" : ""}
        aria-label="Bold"
      >
        Bold
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={isItalic ? "font-bold" : ""}
        aria-label="Italics"
      >
        Italics
      </button>

      <Divider />

      <button
        onClick={() => {
          if (blockType !== "ul") {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          }
        }}
        aria-label="Bulleted List"
      >
        Bullets
      </button>
      <button
        onClick={() => {
          if (blockType !== "ol") {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          }
        }}
        aria-label="Numbered List"
      >
        Numbers
      </button>

      <Divider />

      <div className="relative">
        <button
          onClick={() => setShowLinkEditor((show) => !show)}
          className={currentLink ? "font-bold" : ""}
          aria-label="Insert Link"
        >
          Link
        </button>
        {showLinkEditor && (
          <div className="absolute -bottom-10 -right-10">
            <LinkEditor
              defaultValue={currentLink ?? undefined}
              onChange={handleLinkChange}
              onClear={handleLinkClear}
            />
          </div>
        )}{" "}
      </div>
    </div>
  );
}
