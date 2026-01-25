function linkify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, i) =>
    part.match(urlRegex) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 underline break-words"
      >
        {part}
      </a>
    ) : (
      part
    )
  );
}

export default function MessageBubble({ role, text, image, loading }) {
  const isUser = role === "user";

  return (
    <div className={`max-w-[75%] ${isUser ? "ml-auto" : ""}`}>
      <div
        className={`px-4 py-3 rounded-xl space-y-2 ${
          isUser ? "bg-blue-500 text-white" : "bg-white/10 text-white"
        }`}
      >
        {image && (
          <img
            src={image}
            alt="uploaded"
            className="rounded-lg max-w-full"
          />
        )}

        {loading ? (
          <span className="opacity-60 animate-pulse">Thinking…</span>
        ) : (
          text && (
            <p className="whitespace-pre-wrap leading-relaxed">
              {linkify(text)}
            </p>
          )
        )}
      </div>
    </div>
  );
}
