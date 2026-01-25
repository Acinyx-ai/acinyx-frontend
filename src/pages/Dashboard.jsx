import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

export default function Dashboard() {
  const navigate = useNavigate();

  const [plan, setPlan] = useState("free");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("acinyx_token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (token.startsWith("demo-token-")) {
      setUsername(token.replace("demo-token-", ""));
    }

    const savedPlan = localStorage.getItem("acinyx_plan");
    if (savedPlan) setPlan(savedPlan);
  }, [navigate]);

  return (
    <div className="bg-[#050b18] min-h-screen text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">
          Welcome{username && `, ${username}`}
        </h1>
        <p className="text-gray-400 mb-8">
          Your control center for everything Acinyx.AI
        </p>

        {/* Plan */}
        <div className="bg-[#0b1226] p-6 rounded-xl border border-white/10 mb-10">
          <p className="text-sm text-gray-400">Current Plan</p>
          <h2 className="text-2xl font-bold capitalize">{plan}</h2>

          {plan === "free" && (
            <p className="text-yellow-400 text-sm mt-2">
              Free plan — upgrade to unlock full power.
            </p>
          )}
        </div>

        {/* Tools */}
        <div className="grid md:grid-cols-3 gap-6">
          <ToolCard
            title="AI Chat"
            desc="Chat with AI, generate ideas, get answers."
            btn="Open Chat"
            onClick={() => navigate("/chat")}
            color="bg-green-500"
          />

          <ToolCard
            title="AI Poster"
            desc="Create posters, flyers and designs instantly."
            btn="Generate Poster"
            onClick={() => navigate("/poster")}
            color="bg-blue-500"
          />

          <ToolCard
            title="Upgrade Plan"
            desc="Unlock more chats and posters."
            btn="View Pricing"
            onClick={() => navigate("/pricing")}
            color="bg-purple-500"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ToolCard({ title, desc, btn, onClick, color }) {
  return (
    <div className="bg-[#0d1b2a] p-6 rounded-xl border border-white/10">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-4">{desc}</p>
      <button
        onClick={onClick}
        className={`w-full py-3 ${color} text-black font-bold rounded`}
      >
        {btn}
      </button>
    </div>
  );
}
