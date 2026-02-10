// Chat.jsx
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

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ NEW
  const [activeSession, setActiveSession] = useState(null);

  // -----------------------------------------
  // Load chat history on page load
  // -----------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("acinyx_token");
    if (!token) {
      navigate("/login");
      return;
    }

    const historyKey = `acinyx_chat_history_${token}`;
    const saved = localStorage.getItem(historyKey);

    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        localStorage.removeItem(historyKey);
      }
    }
  }, [navigate]);

  // -----------------------------------------
  // Save chat history on every change
  // -----------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("acinyx_token");
    if (!token) return;

    const historyKey = `acinyx_chat_history_${token}`;
    localStorage.setItem(historyKey, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text, image) {
    if ((!text || !text.trim()) && !image) return;
    if (loading) return;

    const token = localStorage.getItem("acinyx_token");
    if (!token) {
      navigate("/login");
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: text || "",
      image: image ? URL.createObjectURL(image) : null,
    };

    setMessages((m) => [...m, userMessage]);
    setLoading(true);

    try {
      let sessionId = activeSession;

      if (!sessionId) {
        const sres = await fetch(API("/chat/sessions"), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (sres.status === 401) {
          localStorage.removeItem("acinyx_token");
          navigate("/login");
          return;
        }

        const s = await sres.json();
        sessionId = s.id;
        setActiveSession(s.id);
      }

      const form = new FormData();
      form.append("session_id", sessionId);

      if (text && text.trim()) form.append("message", text);
      if (image) form.append("image", image);

      const res = await fetch(API("/ai/chat"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (res.status === 401) {
        localStorage.removeItem("acinyx_token");
        navigate("/login");
        return;
      }

      const data = await res.json();

      if (!res.ok || !data?.reply) {
        throw new Error();
      }

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        text: data.reply,
      };

      setMessages((m) => [...m, assistantMessage]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 2,
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
      <div className="hidden md:block">
        <ChatSidebar />
      </div>

      <main className="flex flex-col flex-1">
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

        <ChatInput onSend={sendMessage} disabled={loading} />
      </main>
    </div>
  );
}
