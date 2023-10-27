import Link from "@tiptap/extension-link";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import { LinkEditor } from "../lexical/LinkEditor";
import { useState } from "react";

function Divider() {
  return <span>|</span>;
}

const TipTapMenuBar = () => {
  const { editor } = useCurrentEditor();
  const [showLinkEditor, setShowLinkEditor] = useState(false);

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full bg-white text-slate-500 rounded-t p-2 flex gap-2 border-b">
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        Undo
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        Redo
      </button>

      <Divider />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "font-bold" : ""}
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "font-bold" : ""}
      >
        Italics
      </button>

      <Divider />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "font-bold" : ""}
      >
        Bullets
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "font-bold" : ""}
      >
        Numbers
      </button>
      <Divider />

      <div className="relative">
        <button
          onClick={() => setShowLinkEditor((show) => !show)}
          className={editor.isActive("link") ? "font-bold" : ""}
          aria-label="Insert Link"
        >
          Link
        </button>
        {showLinkEditor && (
          <div className="absolute bottom-10 -right-10">
            <LinkEditor
              defaultValue={editor.getAttributes("link").href ?? undefined}
              onChange={(link) => {
                if (link) {
                  editor
                    .chain()
                    .focus()
                    .extendMarkRange("link")
                    .setLink({ href: link })
                    .run();
                }
                setShowLinkEditor(false);
                editor.commands.focus();
              }}
              onClear={() => {
                editor
                  .chain()
                  .focus()
                  .extendMarkRange("link")
                  .unsetLink()
                  .run();
                setShowLinkEditor(false);
                editor.commands.focus();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const extensions = [
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      HTMLAttributes: { class: "list-disc ml-4" },
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      HTMLAttributes: { class: "list-decimal ml-4" },
    },
  }),
  Markdown,
  Link.configure({
    HTMLAttributes: { class: "text-blue-700" },
    openOnClick: false,
    autolink: true,
    linkOnPaste: true,
  }),
];

type TipTapEditorProps = {
  initialValue?: string;
  onChange: (content: string) => void;
};

export function TipTapEditor(props: TipTapEditorProps) {
  return (
    <div className="rounded-b bg-white p-2 text-slate-900">
      <EditorProvider
        slotBefore={<TipTapMenuBar />}
        extensions={extensions}
        onBlur={({ editor }) =>
          props.onChange(editor.storage.markdown.getMarkdown())
        }
      >
        {null}
      </EditorProvider>
    </div>
  );
}
