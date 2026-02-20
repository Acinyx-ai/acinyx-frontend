import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API =
  import.meta.env.VITE_API_URL ||
  "https://acinyx-backend.onrender.com";

export default function Login() {
  const navigate = useNavigate();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("acinyx_token");

    if (token) navigate("/dashboard");
  }, [navigate]);

  async function login(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const body = new URLSearchParams();

      body.append("username", loginId);
      body.append("password", password);

      const res = await fetch(`${API}/token`, {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body,
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.detail);

      localStorage.setItem(
        "acinyx_token",
        data.access_token
      );

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050b18] text-white">
      <form
        onSubmit={login}
        className="w-full max-w-md p-8 bg-[#0d1b2a] rounded-xl"
      >
        <h1 className="text-2xl font-bold mb-4">
          Login
        </h1>

        <input
          value={loginId}
          onChange={(e) =>
            setLoginId(e.target.value)
          }
          placeholder="Username"
          className="w-full p-3 mb-3 text-black rounded"
        />

        <div className="relative mb-3">
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Password"
            className="w-full p-3 text-black rounded"
          />

          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-3 text-black"
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>

        {error && (
          <p className="text-red-400">{error}</p>
        )}

        <button
          disabled={loading}
          className="w-full mt-3 py-3 bg-green-500 text-black font-bold rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}