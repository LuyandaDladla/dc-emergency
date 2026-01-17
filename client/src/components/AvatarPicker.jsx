import { useRef, useState } from "react";

export default function AvatarPicker({ initialUrl, onChange }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(initialUrl || "");

  function pick() {
    fileRef.current?.click();
  }

  function onFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPreview(url);
    onChange?.(f, url);
  }

  return (
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 rounded-full bg-white/10 border border-white/15 overflow-hidden flex items-center justify-center">
        {preview ? (
          <img src={preview} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="text-white/50 text-2xl">â˜º</div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={pick}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-sm"
        >
          Change photo
        </button>
        <div className="text-xs text-white/50">PNG/JPG. Preview only for now.</div>
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
    </div>
  );
}