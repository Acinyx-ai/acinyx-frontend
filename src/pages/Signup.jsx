import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🚫 Prevent signup if already logged in
  useEffect(() => {
    const token = localStorage.getItem("acinyx_token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    if (!form.username || !form.email || !form.password) {
      return "All fields are required";
    }
    if (form.username.length < 3) {
      return "Username must be at least 3 characters";
    }
    if (!form.email.includes("@")) {
      return "Enter a valid email address";
    }
    if (form.password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return null;
  }

  async function submit() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Signup failed");

      // ✅ Redirect to login (clean flow)
      navigate("/login");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050b18] text-white">
      <div className="w-full max-w-md p-8 bg-[#0d1b2a] rounded-xl shadow-lg border border-white/10">
        <h1 className="text-2xl font-bold mb-1">Create Account</h1>
        <p className="text-sm text-gray-400 mb-6">
          Access AI chat, posters, and automation
        </p>

        <label className="text-sm text-gray-300">Username</label>
        <input
          name="username"
          value={form.username}
          onChange={update}
          className="w-full p-3 mb-4 rounded text-black"
          placeholder="Choose a username"
        />

        <label className="text-sm text-gray-300">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={update}
          className="w-full p-3 mb-4 rounded text-black"
          placeholder="you@email.com"
        />

        <label className="text-sm text-gray-300">Password</label>
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={update}
            className="w-full p-3 rounded text-black pr-16"
            placeholder="Create a strong password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-sm text-gray-600"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-3">
            ❌ {error}
          </p>
        )}

        <button
          onClick={submit}
          disabled={loading}
          className={`w-full py-3 font-bold rounded ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-500 text-black"
          }`}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-sm text-gray-400 mt-4 text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-green-400 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
