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

function copy(text) {
  navigator.clipboard.writeText(text);
}

// Split text into normal text + fenced code blocks
function parseBlocks(text) {
  const regex = /```([\s\S]*?)```/g;
  const parts = [];
  let last = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push({
        type: "text",
        value: text.slice(last, match.index),
      });
    }

    parts.push({
      type: "code",
      value: match[1].trim(),
    });

    last = regex.lastIndex;
  }

  if (last < text.length) {
    parts.push({
      type: "text",
      value: text.slice(last),
    });
  }

  return parts;
}

export default function MessageBubble({ role, text, image, loading }) {
  const isUser = role === "user";

  const blocks = text ? parseBlocks(text) : [];

  return (
    <div className={`max-w-[75%] ${isUser ? "ml-auto" : ""}`}>
      <div
        className={`px-4 py-3 rounded-xl space-y-3 ${
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
          blocks.map((b, i) => {
            if (b.type === "code") {
              return (
                <div
                  key={i}
                  className="relative rounded-lg bg-[#0b1226] border border-indigo-400/20 p-3 font-mono text-sm overflow-x-auto"
                >
                  <button
                    onClick={() => copy(b.value)}
                    className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-indigo-500 text-black hover:bg-indigo-400"
                    title="Copy"
                  >
                    Copy
                  </button>

                  <pre className="whitespace-pre-wrap leading-relaxed">
                    {b.value}
                  </pre>
                </div>
              );
            }

            return (
              <p
                key={i}
                className="whitespace-pre-wrap leading-relaxed"
              >
                {linkify(b.value)}
              </p>
            );
          })
        )}
      </div>
    </div>
  );
}
