import { useRef, useState } from "react";

export default function PosterImageUpload({ image, setImage }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  function clear() {
    setImage(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      {preview && (
        <div className="relative w-40">
          <img
            src={preview}
            alt="preview"
            className="rounded-lg border border-white/20"
          />
          <button
            onClick={clear}
            className="absolute -top-2 -right-2 bg-black/70 text-white rounded-full w-6 h-6"
          >
            ×
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
      >
        📷 Upload reference image
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
