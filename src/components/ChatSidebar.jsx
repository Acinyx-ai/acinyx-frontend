import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function ChatSidebar({ active, onSelect, onNew }) {
  const [sessions, setSessions] = useState([]);

  async function loadSessions() {
    const token = localStorage.getItem("acinyx_token");

    const res = await fetch(`${API}/chat/sessions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setSessions(data);
  }

  useEffect(() => {
    loadSessions();
  }, []);

  return (
    <aside className="w-64 bg-black/30 border-r border-white/10 p-4 flex flex-col">
      <button
        onClick={async () => {
          await onNew();
          await loadSessions();
        }}
        className="mb-4 px-3 py-2 rounded bg-blue-500 text-black font-semibold"
      >
        + New chat
      </button>

      <div className="space-y-1 overflow-y-auto">
        {sessions.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`w-full text-left px-3 py-2 rounded text-sm
              ${active === s.id ? "bg-white/20" : "hover:bg-white/10"}
            `}
          >
            {s.title || "New chat"}
          </button>
        ))}
      </div>
    </aside>
  );
}
