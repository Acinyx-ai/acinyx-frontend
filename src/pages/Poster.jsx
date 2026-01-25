import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import PosterImageUpload from "../components/PosterImageUpload.jsx";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Poster() {
  const [loading, setLoading] = useState(false);
  const [posterUrl, setPosterUrl] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    style: "cinematic",
    size: "portrait",
  });

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function generatePoster() {
    if (!form.title && !form.description && !image) {
      setError("Provide text or upload a reference image.");
      return;
    }

    setLoading(true);
    setError("");
    setPosterUrl("");

    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("style", form.style);
      data.append("size", form.size);
      if (image) data.append("image", image);

      const res = await fetch(`${API}/ai/poster/ai-generate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("acinyx_token")}`,
        },
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.detail || "Generation failed");

      setPosterUrl(`${API}${result.poster_url}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#050b18] min-h-screen text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">
          AI Poster Generator
        </h1>
        <p className="text-gray-400 mb-8">
          Create cinematic posters with optional image reference and size control.
        </p>

        <div className="bg-[#0b1226] p-6 rounded-xl border border-white/10 space-y-4">
          <PosterImageUpload image={image} setImage={setImage} />

          <input
            name="title"
            placeholder="Poster title"
            value={form.title}
            onChange={update}
            className="w-full p-3 rounded text-black"
          />

          <textarea
            name="description"
            placeholder="Describe the scene, mood, lighting, realism..."
            value={form.description}
            onChange={update}
            className="w-full p-4 rounded text-black min-h-[120px]"
          />

          <select
            name="style"
            value={form.style}
            onChange={update}
            className="w-full p-3 rounded text-black"
          >
            <option value="cinematic">Cinematic</option>
            <option value="modern">Modern</option>
            <option value="luxury">Luxury</option>
            <option value="minimal">Minimal</option>
          </select>

          <select
            name="size"
            value={form.size}
            onChange={update}
            className="w-full p-3 rounded text-black"
          >
            <option value="portrait">Portrait (1024 × 1536)</option>
            <option value="square">Square (1024 × 1024)</option>
            <option value="landscape">Landscape (1536 × 1024)</option>
            <option value="instagram">Instagram Story (1080 × 1920)</option>
          </select>

          <button
            onClick={generatePoster}
            disabled={loading}
            className="w-full px-8 py-3 rounded bg-gradient-to-r from-green-400 to-blue-500 text-black font-bold"
          >
            {loading ? "Generating..." : "Generate Poster"}
          </button>
        </div>

        {error && <p className="mt-4 text-red-400">❌ {error}</p>}

        {posterUrl && (
          <div className="mt-10 text-center">
            <img
              src={posterUrl}
              alt="Generated poster"
              className="mx-auto w-full max-w-md rounded-xl border border-white/10"
            />

            <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3">
              <a
                href={posterUrl}
                download
                className="px-6 py-2 bg-green-600 rounded"
              >
                Download
              </a>
              <a
                href={posterUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-2 bg-blue-600 rounded"
              >
                Open
              </a>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
