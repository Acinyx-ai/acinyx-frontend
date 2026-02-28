import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import PosterImageUpload from "../components/PosterImageUpload.jsx";

/* ================= API ================= */

const BASE_URL = import.meta.env.VITE_API_URL || "";
const API = (path) => `${BASE_URL}${path}`;

export default function Poster() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [posterUrl, setPosterUrl] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    microscopic_details: "",
    lighting: "cinematic",
    style: "cinematic",
    size: "portrait",
    quality: "ultra",
    creativity: "balanced"
  });

  /* ================= AUTH CHECK ================= */

  useEffect(() => {
    const token = localStorage.getItem("acinyx_token");
    if (!token) navigate("/login");
  }, [navigate]);


  /* ================= UPDATE FORM ================= */

  function update(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }


  /* ================= GENERATE POSTER ================= */

  async function generatePoster() {
    const token = localStorage.getItem("acinyx_token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!form.title.trim()) {
      setError("Enter poster title");
      return;
    }

    setLoading(true);
    setError("");
    setPosterUrl("");

    try {
      const formData = new FormData();

      //////////////////////////////////////////////////
      // CORE DATA - Using prompt field as backend expects
      //////////////////////////////////////////////////
      
      // Combine all text fields into a single prompt
      const fullPrompt = `
        Title: ${form.title}
        Description: ${form.description}
        Microscopic Details: ${form.microscopic_details}
        Style: ${form.style}
        Lighting: ${form.lighting}
        Quality: ${form.quality}
      `.trim();
      
      formData.append("prompt", fullPrompt);
      formData.append("style", form.style);

      //////////////////////////////////////////////////
      // REFERENCE IMAGE
      //////////////////////////////////////////////////

      if (image) {
        formData.append("image", image);
      }

      //////////////////////////////////////////////////
      // CALL BACKEND
      //////////////////////////////////////////////////

      const res = await fetch(
        API("/ai/poster"),
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: formData
        }
      );

      //////////////////////////////////////////////////
      // AUTH ERROR
      //////////////////////////////////////////////////

      if (res.status === 401) {
        localStorage.removeItem("acinyx_token");
        navigate("/login");
        return;
      }

      //////////////////////////////////////////////////
      // LIMIT ERROR - Fixed status code from 403 to 429
      //////////////////////////////////////////////////

      if (res.status === 429) {  // FIXED: Changed from 403 to 429
        setError("Poster limit reached. Please upgrade your plan.");
        return;
      }

      //////////////////////////////////////////////////
      // SERVER RESPONSE
      //////////////////////////////////////////////////

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.detail || "Generation failed");
      }

      //////////////////////////////////////////////////
      // FIXED: Using result.poster instead of result.image
      //////////////////////////////////////////////////

      if (result.poster) {  // FIXED: Changed from result.image to result.poster
        if (result.poster.startsWith("http")) {
          setPosterUrl(result.poster);
        } else {
          // FIXED: Remove extra slash to prevent double slashes
          setPosterUrl(`${BASE_URL}${result.poster}`);
        }
      } else {
        throw new Error("Invalid response from server");
      }

    } catch (err) {
      console.error("Poster generation error:", err);
      setError(err.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  }


  /* ================= DOWNLOAD ================= */

  async function downloadPoster() {
    try {
      const response = await fetch(posterUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${form.title || "poster"}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Download failed. Please try again.");
    }
  }


  /* ================= UI ================= */

  return (
    <div className="bg-[#050b18] min-h-screen text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">
          Extreme Precision AI Poster Generator
        </h1>
        <p className="text-gray-400 mb-8">
          Generate ultra-detailed cinematic images with atomic-level precision
        </p>

        <div className="bg-[#0b1226] p-6 rounded-xl border border-white/10 space-y-4">
          <PosterImageUpload
            image={image}
            setImage={setImage}
          />

          <input
            name="title"
            placeholder="Core subject"
            value={form.title}
            onChange={update}
            className="w-full p-3 rounded bg-white text-black"
          />

          <textarea
            name="description"
            placeholder="Full scene description"
            value={form.description}
            onChange={update}
            className="w-full p-3 rounded bg-white text-black h-24"
          />

          <textarea
            name="microscopic_details"
            placeholder="Atomic / molecular / microscopic details"
            value={form.microscopic_details}
            onChange={update}
            className="w-full p-3 rounded bg-white text-black h-24"
          />

          <select
            name="style"
            value={form.style}
            onChange={update}
            className="w-full p-3 rounded bg-white text-black"
          >
            <option value="cinematic">Cinematic</option>
            <option value="anime">Anime</option>
            <option value="photorealistic">Photorealistic</option>
            <option value="hyperrealistic">Hyperrealistic</option>
            <option value="scientific">Scientific</option>
          </select>

          <select
            name="quality"
            value={form.quality}
            onChange={update}
            className="w-full p-3 rounded bg-white text-black"
          >
            <option value="standard">Standard</option>
            <option value="high">High</option>
            <option value="ultra">Ultra</option>
          </select>

          <button
            onClick={generatePoster}
            disabled={loading}
            className="w-full py-3 rounded bg-gradient-to-r from-green-400 to-blue-500 text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Generating Extreme Detail..." : "Generate Poster"}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        {posterUrl && (
          <div className="mt-10 text-center">
            <div className="bg-[#0b1226] p-4 rounded-xl border border-white/10">
              <img
                src={posterUrl}
                alt="Generated poster"
                className="mx-auto max-w-md rounded-lg"
                onError={() => setError("Failed to load image")}
              />
              <div className="mt-4 flex gap-3 justify-center">
                <button
                  onClick={downloadPoster}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
                >
                  Download
                </button>
                <a
                  href={posterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                >
                  Open
                </a>
                <button
                  onClick={() => {
                    setPosterUrl("");
                    setForm({
                      title: "",
                      description: "",
                      microscopic_details: "",
                      lighting: "cinematic",
                      style: "cinematic",
                      size: "portrait",
                      quality: "ultra",
                      creativity: "balanced"
                    });
                    setImage(null);
                  }}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
                >
                  Create New
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
