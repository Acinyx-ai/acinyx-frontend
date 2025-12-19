import React, { useEffect, useRef, useState } from "react";

const API = (path) =>
  `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${path}`;

// ---------------- ICONS ----------------
function IconChat() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconImage() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

function NeonBadge({ children }) {
  return (
    <span className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-[#00e6b8] to-[#ff4da6] text-black font-semibold">
      {children}
    </span>
  );
}

// ---------------- APP ----------------
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTool, setActiveTool] = useState("chat");
  const [username, setUsername] = useState(localStorage.getItem("acinyx_user") || "");
  const [token, setToken] = useState(localStorage.getItem("acinyx_token") || "");

  const [messages, setMessages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("acinyx_messages") || "[]");
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const [images, setImages] = useState([]);
  const [imgPrompt, setImgPrompt] = useState("");
  const [imgLoading, setImgLoading] = useState(false);

  const messagesRef = useRef(null);

  // ---------------- EFFECTS ----------------
  useEffect(() => {
    localStorage.setItem("acinyx_messages", JSON.stringify(messages));
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("acinyx_user", username);
    localStorage.setItem("acinyx_token", token);
  }, [username, token]);

  // ---------------- HELPERS ----------------
  function addMessage(role, text) {
    const m = { id: Date.now(), role, text };
    setMessages((prev) => [...prev, m]);
    return m;
  }

  async function login() {
    const data = new URLSearchParams();
    data.append("username", username);
    data.append("password", "password123");

    const res = await fetch(API("/token"), { method: "POST", body: data });
    const j = await res.json();

    if (j.access_token) {
      setToken(j.access_token);
      addMessage("system", "Welcome back.");
    } else {
      addMessage("system", "Login failed.");
    }
  }

  function logout() {
    setToken("");
    localStorage.removeItem("acinyx_token");
    addMessage("system", "Logged out.");
  }

  async function sendChat() {
    if (!input) return;

    const userMsg = addMessage("user", input);
    setInput("");
    setIsThinking(true);

    try {
      const res = await fetch(API("/ai/chat"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: userMsg.text }),
      });

      const j = await res.json();
      addMessage("assistant", j.response || "No response.");
    } catch {
      addMessage("assistant", "Error contacting AI.");
    }

    setIsThinking(false);
  }

  async function generateImage() {
    if (!imgPrompt) return;

    setImgLoading(true);

    try {
      const res = await fetch(API("/ai/image"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: imgPrompt }),
      });

      const j = await res.json();
      setImages((prev) => [
        { id: Date.now(), url: j.image_url, prompt: imgPrompt },
        ...prev,
      ]);
    } catch {
      addMessage("system", "Image generation failed.");
    }

    setImgLoading(false);
  }

  function Bubble({ m }) {
    return (
      <div
        className={`mb-3 max-w-[75%] p-3 rounded-lg ${
          m.role === "user"
            ? "bg-slate-700 self-end"
            : m.role === "assistant"
            ? "bg-[#081827] text-[#00e6b8]"
            : "text-gray-400 italic self-center"
        }`}
      >
        {m.text}
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <div className="flex min-h-screen text-white font-sans bg-[#050b18]">
      {/* SIDEBAR */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} transition-all bg-[#0b1221] border-r border-[#071029] p-4 relative`}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00e6b8] to-[#ff4da6] flex items-center justify-center text-black font-bold">
            A
          </div>
          {sidebarOpen && (
            <div>
              <div className="text-lg font-bold">Acinyx.AI</div>
              <div className="text-xs text-gray-400">Build • Think • Create</div>
            </div>
          )}
        </div>

        <button
          onClick={() => setActiveTool("chat")}
          className="w-full mb-2 p-2 rounded flex items-center gap-3 hover:bg-[#00e6b811]"
        >
          <IconChat /> {sidebarOpen && "AI Chat"}
        </button>

        <button
          onClick={() => setActiveTool("images")}
          className="w-full mb-2 p-2 rounded flex items-center gap-3 hover:bg-[#ff4da611]"
        >
          <IconImage /> {sidebarOpen && "Image Studio"}
        </button>

        <button
          onClick={() => setSidebarOpen((s) => !s)}
          className="absolute bottom-4 left-4 text-xs border px-2 py-1 rounded"
        >
          {sidebarOpen ? "<<" : ">>"}
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6">
        {/* PURPOSE / HERO SECTION */}
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold mb-3">
            Acinyx<span className="text-[#00e6b8]">.AI</span>
          </h1>

          <p className="text-lg text-gray-300 mb-2">
            AI agents for WhatsApp, websites, and institutions
          </p>

          <p className="text-sm text-gray-400 max-w-2xl">
            Build, test, and deploy intelligent assistants that automate
            communication, reduce workload, and operate 24/7 without supervision.
          </p>

          <div className="flex gap-4 items-center mt-6">
            <NeonBadge>ALPHA</NeonBadge>

            {token ? (
              <button
                onClick={logout}
                className="px-4 py-2 rounded bg-gradient-to-r from-[#ff4da6] to-[#00e6b8] text-black font-semibold"
              >
                Logout
              </button>
            ) : (
              <>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="p-2 rounded text-black"
                  placeholder="Username"
                />
                <button
                  onClick={login}
                  className="px-4 py-2 rounded bg-[#00e6b833]"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </header>

        {/* CHAT */}
        {activeTool === "chat" && (
          <div className="flex flex-col h-[70vh] bg-[#0d1b2a] p-4 rounded border border-[#00e6b822]">
            <div ref={messagesRef} className="flex-1 overflow-auto flex flex-col">
              {messages.length === 0 && (
                <div className="text-gray-400 italic">
                  Ask Acinyx anything to begin.
                </div>
              )}
              {messages.map((m) => (
                <Bubble key={m.id} m={m} />
              ))}
              {isThinking && (
                <div className="italic text-[#ff4da6]">Acinyx is thinking…</div>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-3 rounded bg-[#021022]"
                placeholder="Type your message…"
              />
              <button
                onClick={sendChat}
                className="px-5 py-2 rounded bg-gradient-to-r from-[#00e6b8] to-[#ff4da6] text-black font-semibold"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* IMAGES */}
        {activeTool === "images" && (
          <div className="flex flex-col h-[70vh] bg-[#0d1b2a] p-4 rounded border border-[#ff4da622]">
            <textarea
              value={imgPrompt}
              onChange={(e) => setImgPrompt(e.target.value)}
              rows={3}
              className="w-full p-3 rounded bg-[#021022]"
              placeholder="Describe the image you want to generate…"
            />

            <div className="flex gap-2 mt-3">
              <button
                onClick={generateImage}
                className="px-4 py-2 rounded bg-gradient-to-r from-[#ff4da6] to-[#00e6b8] text-black font-semibold"
              >
                {imgLoading ? "Generating…" : "Generate"}
              </button>
              <button
                onClick={() => setImages([])}
                className="px-4 py-2 rounded border"
              >
                Clear
              </button>
            </div>

            <div className="flex-1 mt-4 overflow-auto grid grid-cols-2 gap-4">
              {images.length === 0 && (
                <div className="col-span-2 text-gray-400 italic">
                  No images yet.
                </div>
              )}
              {images.map((img) => (
                <div key={img.id} className="bg-[#03111a] p-2 rounded">
                  <div className="text-xs text-gray-400 mb-1">{img.prompt}</div>
                  <img src={img.url} className="rounded max-h-48 object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
