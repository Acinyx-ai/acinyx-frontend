import React from "react";

/* Convert links into clickable */
function linkify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.split(urlRegex).map((part, i) =>
    urlRegex.test(part) ? (
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

/* Copy code */
function copy(text) {
  navigator.clipboard.writeText(text);
}

/* Split code blocks */
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

/* Render headings properly */
function renderFormattedText(block, key) {
  const lines = block.split("\n");

  return (
    <div key={key} className="space-y-2">
      {lines.map((line, i) => {
        if (!line.trim()) {
          return <div key={i} className="h-2" />;
        }

        /* H1 */
        if (line.startsWith("# ")) {
          return (
            <h1
              key={i}
              className="text-2xl font-bold mt-4 mb-2"
            >
              {line.replace("# ", "")}
            </h1>
          );
        }

        /* H2 */
        if (line.startsWith("## ")) {
          return (
            <h2
              key={i}
              className="text-xl font-bold mt-3 mb-1"
            >
              {line.replace("## ", "")}
            </h2>
          );
        }

        /* H3 */
        if (line.startsWith("### ")) {
          return (
            <h3
              key={i}
              className="text-lg font-semibold mt-2"
            >
              {line.replace("### ", "")}
            </h3>
          );
        }

        /* Normal text */
        return (
          <p
            key={i}
            className="whitespace-pre-wrap leading-relaxed text-sm md:text-base"
          >
            {linkify(line)}
          </p>
        );
      })}
    </div>
  );
}

export default function MessageBubble({
  role,
  text,
  image,
  loading,
}) {
  const isUser = role === "user";
  const blocks = text ? parseBlocks(text) : [];

  return (
    <div className={`max-w-[85%] ${isUser ? "ml-auto" : ""}`}>
      <div
        className={`
          px-4 py-3
          rounded-xl
          space-y-3
          ${
            isUser
              ? "bg-blue-500 text-white"
              : "bg-white/10 text-white border border-white/10"
          }
        `}
      >
        {/* Image */}
        {image && (
          <img
            src={image}
            alt="generated"
            className="rounded-lg max-w-full cursor-pointer hover:opacity-90"
          />
        )}

        {/* Loading */}
        {loading && (
          <div className="opacity-60 animate-pulse">
            Thinking…
          </div>
        )}

        {/* Content */}
        {!loading &&
          blocks.map((b, i) => {
            if (b.type === "code") {
              return (
                <div
                  key={i}
                  className="
                    relative
                    rounded-lg
                    bg-[#060b18]
                    border border-indigo-400/30
                    p-3
                    font-mono
                    text-sm
                    text-indigo-100
                    overflow-x-auto
                  "
                >
                  <button
                    onClick={() => copy(b.value)}
                    className="
                      absolute
                      top-2
                      right-2
                      px-2
                      py-1
                      text-xs
                      rounded
                      bg-indigo-500
                      text-black
                      hover:bg-indigo-400
                    "
                  >
                    Copy
                  </button>

                  <pre className="whitespace-pre-wrap">
                    {b.value}
                  </pre>
                </div>
              );
            }

            return renderFormattedText(b.value, i);
          })}
      </div>
    </div>
  );
}
