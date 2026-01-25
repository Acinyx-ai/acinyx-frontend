import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import ChatSidebar from "../components/ChatSidebar";
import ChatInput from "../components/ChatInput";
import MessageBubble from "../components/MessageBubble";
import ThemeToggle from "../components/ThemeToggle";

import logo from "../assets/logo.png";

const API = (path) => `${import.meta.env.VITE_API_URL}${path}`;

export default function Chat() {
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  const [token, setToken] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Auth check
  useEffect(() => {
    const t = localStorage.getItem("acinyx_token");
    if (!t) return navigate("/login");
    setToken(t);
  }, [navigate]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text, image) {
    if ((!text || !text.trim()) && !image) return;
    if (loading) return;

    const id = Date.now();

    setMessages((m) => [
      ...m,
      {
        id,
        role: "user",
        text: text || "",
        image: image ? URL.createObjectURL(image) : null,
      },
    ]);

    setLoading(true);

    try {
      const form = new FormData();
      if (text) form.append("message", text);
      if (image) form.append("image", image);

      const res = await fetch(API("/ai/chat"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await res.json();
      if (!res.ok) throw new Error();

      setMessages((m) => [
        ...m,
        { id: id + 1, role: "assistant", text: data.reply },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: id + 2,
          role: "assistant",
          text: "⚠️ Something went wrong. Try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen bg-[#0b0f1a] text-white">
      {/* Sidebar – desktop only */}
      <div className="hidden md:block">
        <ChatSidebar />
      </div>

      <main className="flex flex-col flex-1">
        {/* Header */}
        <header className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-white/10">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="Acinyx AI" className="w-8 h-8" />
            <h1 className="text-lg font-semibold">
              Acinyx<span className="text-blue-400">.AI</span>
            </h1>
          </div>
          <ThemeToggle />
        </header>

        {/* Messages */}
        <section className="flex-1 overflow-y-auto px-3 md:px-6 py-4 space-y-4">
          {messages.map((m) => (
            <MessageBubble
              key={m.id}
              role={m.role}
              text={m.text}
              image={m.image}
            />
          ))}

          {loading && <MessageBubble role="assistant" loading />}
          <div ref={bottomRef} />
        </section>

        {/* Input */}
        <ChatInput onSend={sendMessage} disabled={loading} />
      </main>
    </div>
  );
}
