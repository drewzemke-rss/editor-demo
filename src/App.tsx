import { useState } from "react";

import { MarkdownEditor } from "./lexical/MarkdownEditor";
import { TipTapEditor } from "./tiptap/TipTapEditor";

function App() {
  const [content, setContent] = useState<string>();

  return (
    <div className="flex flex-col gap-10 content-center w-full h-screen bg-slate-800 text-slate-50 font-base items-center pt-20">
      <div className="flex flex-col gap-2 w-[700px]">
        <h1 className="text-3xl">Lexical Demo!</h1>
        <p className="text-slate-400 mb-4">
          Type something (using markdown if you like) and then click elsewhere
          to trigger a blur.
        </p>
        <MarkdownEditor onChange={setContent} />
      </div>
      <div className="flex flex-col gap-2 w-[700px]">
        <h1 className="text-3xl">Tiptap Demo!</h1>
        <p className="text-slate-400 mb-4">Same deal but with Tiptap!</p>
        <TipTapEditor onChange={setContent} />
      </div>
      {content && (
        <div className="mt-4 w-[700px]">
          <h2 className="text-slate-200">Most recent output:</h2>
          <div className="font-mono px-2">{content}</div>
        </div>
      )}
    </div>
  );
}

export default App;
