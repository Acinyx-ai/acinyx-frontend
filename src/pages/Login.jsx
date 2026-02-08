import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();

  const [loginId, setLoginId] = useState(""); // username OR email
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, go to dashboard
  useEffect(() => {
    const token = localStorage.getItem("acinyx_token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  async function login() {
    if (!loginId || !password) {
      setError("Enter your username/email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const body = new URLSearchParams();
      body.append("username", loginId); // IMPORTANT (backend expects this key)
      body.append("password", password);

      const res = await fetch(`${API}/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });

      let data = null;
      const ct = res.headers.get("content-type") || "";

      if (ct.includes("application/json")) {
        data = await res.json();
      }

      if (!res.ok) {
        throw new Error(data?.detail || "Login failed");
      }

      localStorage.setItem("acinyx_token", data.access_token);
      localStorage.setItem("acinyx_plan", data.plan);

      navigate("/dashboard");
    } catch (e) {
      setError(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050b18] text-white">
      <div className="w-full max-w-md p-8 bg-[#0d1b2a] rounded-xl border border-white/10">

        <button
          onClick={() => navigate("/")}
          className="mb-4 text-sm text-blue-400 hover:underline"
        >
          ← Back to home
        </button>

        <h1 className="text-2xl font-bold mb-4">Login</h1>

        <input
          className="w-full p-3 mb-3 text-black rounded"
          placeholder="Username or email"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
        />

        <div className="relative mb-3">
          <input
            type={show ? "text" : "password"}
            className="w-full p-3 text-black rounded pr-14"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600"
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>

        {error && (
          <p className="text-red-400 mb-3 text-sm">
            {error}
          </p>
        )}

        <button
          onClick={login}
          disabled={loading}
          className="w-full py-3 bg-green-500 text-black font-bold rounded disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
