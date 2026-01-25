import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="text-center py-32 px-6">
      <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
        Create Stunning AI Posters <br />
        <span className="text-green-400">In Seconds</span>
      </h1>

      <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
        Generate cinematic posters, analyze images, and chat with AI — all from one powerful platform.
      </p>

      <div className="flex justify-center gap-4 flex-wrap">
        <button
          onClick={() => navigate("/poster")}
          className="bg-green-500 hover:bg-green-400 px-8 py-4 rounded-lg text-black font-semibold"
        >
          Generate a Poster
        </button>

        <button
          onClick={() => navigate("/chat")}
          className="border border-white/20 hover:border-green-400 px-8 py-4 rounded-lg"
        >
          Try AI Chat
        </button>
      </div>
    </section>
  );
}
