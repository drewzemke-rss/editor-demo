import { useEffect, useRef } from "react";

type LinkEditorProps = {
  defaultValue?: string;
  onChange?: (link?: string) => void;
  onClear?: () => void;
};

export function LinkEditor(props: LinkEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  return (
    <div className="bg-slate-100 flex gap-2 items-center z-50 p-1 rounded-md">
      <input
        type="text"
        ref={inputRef}
        defaultValue={props.defaultValue}
        className="border rounded px-2 py-1"
      />
      <button
        type="button"
        onClick={() => {
          props.onChange?.(inputRef.current?.value ?? "");
        }}
      >
        Ship
      </button>
      <button type="button" onClick={props.onClear}>
        Del
      </button>
    </div>
  );
}
