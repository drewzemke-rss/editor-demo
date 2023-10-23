import { useState } from "react";
import { MarkdownEditor } from "./editor/MarkdownEditor";

function App() {
  const [content, setContent] = useState<string>();

  return (
    <div className="flex w-full h-screen bg-slate-800 text-slate-50 font-base justify-center pt-20">
      <div className="flex flex-col gap-2 w-[700px]">
        <h1 className="text-3xl">Lexical Demo!</h1>
        <p className="text-slate-400 mb-4">
          Type something (using markdown if you like) and then click elsewhere
          to trigger a blur.
        </p>
        <MarkdownEditor onChange={setContent} />
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
