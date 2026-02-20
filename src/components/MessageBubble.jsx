import React from "react";

/* ---------- LINKIFY ---------- */

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

/* ---------- COPY ---------- */

function copy(text) {
  navigator.clipboard.writeText(text);
}

/* ---------- PARSE CODE BLOCKS ---------- */
/* FIXED: triple backticks */

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

/* ---------- HTML RENDER ---------- */

function renderHTML(text, key) {
  return (
    <div
      key={key}
      className="
        prose
        prose-invert
        max-w-none
        text-sm
        md:text-base
        leading-relaxed
        break-words
      "
      dangerouslySetInnerHTML={{
        __html: text,
      }}
    />
  );
}

/* ---------- MARKDOWN RENDER ---------- */

function renderMarkdown(block, key) {
  const lines = block.split("\n");

  return (
    <div key={key} className="space-y-2">
      {lines.map((line, i) => {
        if (!line.trim())
          return <div key={i} className="h-2" />;

        if (line.startsWith("# "))
          return (
            <h1 key={i} className="text-2xl font-bold mt-4">
              {line.replace("# ", "")}
            </h1>
          );

        if (line.startsWith("## "))
          return (
            <h2 key={i} className="text-xl font-bold mt-3">
              {line.replace("## ", "")}
            </h2>
          );

        if (line.startsWith("### "))
          return (
            <h3 key={i} className="text-lg font-semibold mt-2">
              {line.replace("### ", "")}
            </h3>
          );

        return (
          <p key={i} className="whitespace-pre-wrap">
            {linkify(line)}
          </p>
        );
      })}
    </div>
  );
}

/* ---------- MAIN COMPONENT ---------- */

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
          px-4
          py-3
          rounded-xl
          space-y-3
          ${
            isUser
              ? "bg-blue-500 text-white"
              : "bg-white/10 text-white border border-white/10"
          }
        `}
      >

        {/* IMAGE */}

        {image && (
          <img
            src={image}
            alt="generated"
            className="rounded-lg max-w-full"
          />
        )}

        {/* LOADING */}

        {loading && (
          <div className="animate-pulse opacity-60">
            Thinking...
          </div>
        )}

        {/* CONTENT */}

        {!loading &&
          blocks.map((b, i) => {

            /* CODE BLOCK */

            if (b.type === "code")
              return (
                <div
                  key={i}
                  className="
                    relative
                    bg-[#060b18]
                    border
                    border-indigo-400/30
                    rounded-lg
                    p-3
                    font-mono
                    text-sm
                    overflow-x-auto
                  "
                >

                  <button
                    onClick={() => copy(b.value)}
                    className="
                      absolute
                      right-2
                      top-2
                      text-xs
                      px-2
                      py-1
                      rounded
                      bg-indigo-500
                      text-black
                    "
                  >
                    Copy
                  </button>

                  <pre>{b.value}</pre>

                </div>
              );

            /* HTML DETECT */

            if (
              b.value.includes("<br") ||
              b.value.includes("<strong") ||
              b.value.includes("<h")
            )
              return renderHTML(b.value, i);

            /* MARKDOWN */

            return renderMarkdown(b.value, i);

          })}

      </div>

    </div>
  );
}