import { useRef, useState, useEffect } from "react";

export default function ChatInput({ onSend, disabled }) {

  const [value, setValue] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const fileRef = useRef(null);
  const textareaRef = useRef(null);


  // CLEANUP PREVIEW URL

  useEffect(() => {

    return () => {

      if (preview)
        URL.revokeObjectURL(preview);

    };

  }, [preview]);


  // RESET INPUT

  function reset() {

    setValue("");
    setImage(null);

    if (preview)
      URL.revokeObjectURL(preview);

    setPreview(null);

    if (fileRef.current)
      fileRef.current.value = "";

    if (textareaRef.current)
      textareaRef.current.style.height = "auto";

  }


  // SEND MESSAGE

  function send(mode = "chat") {

    if (!value.trim() && !image)
      return;

    onSend(value.trim(), image, mode);

    reset();

  }


  // IMAGE SELECT

  function handleFileChange(e) {

    const file = e.target.files?.[0];

    if (!file) return;

    if (preview)
      URL.revokeObjectURL(preview);

    setImage(file);
    setPreview(URL.createObjectURL(file));

  }


  // REMOVE IMAGE

  function removeImage() {

    if (preview)
      URL.revokeObjectURL(preview);

    setImage(null);
    setPreview(null);

    if (fileRef.current)
      fileRef.current.value = "";

  }


  // AUTO RESIZE

  function autoResize(e) {

    const el = e.target;

    el.style.height = "auto";

    el.style.height =
      Math.min(el.scrollHeight, 160) + "px";

  }


  // ENTER KEY SEND

  function handleKeyDown(e) {

    if (e.key === "Enter" && !e.shiftKey) {

      e.preventDefault();

      send("chat");

    }

  }


  // UI

  return (

    <div className="p-4 border-t border-white/10 space-y-3">


      {preview && (

        <div className="relative w-32">

          <img
            src={preview}
            alt="preview"
            className="rounded-lg border border-white/20"
          />

          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-black text-white w-6 h-6 rounded-full hover:bg-red-600"
          >
            ×
          </button>

        </div>

      )}


      <div className="flex items-end gap-2">


        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={disabled}
          className="h-11 w-11 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50"
        >
          📷
        </button>


        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />


        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          disabled={disabled}
          onChange={(e) => {

            setValue(e.target.value);

            autoResize(e);

          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask Acinyx anything…"
          className="
            flex-1
            resize-none
            rounded-lg
            bg-white/10
            p-3
            text-white
            outline-none
            focus:ring-1
            focus:ring-blue-400
            max-h-40
            overflow-y-auto
            disabled:opacity-50
          "
        />


        <button
          onClick={() => send("humanize")}
          disabled={disabled}
          className="h-11 px-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold disabled:opacity-50"
        >
          Humanize
        </button>


        <button
          onClick={() => send("image")}
          disabled={disabled}
          className="h-11 px-3 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-semibold disabled:opacity-50"
        >
          Image
        </button>


        <button
          onClick={() => send("chat")}
          disabled={disabled}
          className="h-11 px-5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold disabled:opacity-50"
        >
          Send
        </button>


      </div>


    </div>

  );

}