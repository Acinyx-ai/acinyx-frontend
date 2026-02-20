import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const API =
  import.meta.env.VITE_API_URL ||
  "https://acinyx-backend.onrender.com";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("acinyx_token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  function update(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function validate() {
    if (!form.username || !form.email || !form.password)
      return "All fields required";

    if (form.username.length < 3)
      return "Username must be at least 3 characters";

    if (!form.email.includes("@"))
      return "Invalid email";

    if (form.password.length < 6)
ereturn "Password must be at least 6 characters";

    if (!accepted) return "Accept Terms first";

    return null;
  }

  async function submit(e) {
    e.preventDefault();

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.detail || "Signup failed");

      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050b18] text-white">
      <form
        onSubmit={submit}
        className="w-full max-w-md p-8 bg-[#0d1b2a] rounded-xl shadow-lg border border-white/10"
      >
        <h1 className="text-2xl font-bold mb-1">
          Create Account
        </h1>

        <p className="text-sm text-gray-400 mb-6">
          Join Acinyx AI platform
        </p>

        <input
          name="username"
          value={form.username}
          onChange={update}
          placeholder="Username"
          className="w-full p-3 mb-3 text-black rounded"
        />

        <input
          name="email"
          value={form.email}
          onChange={update}
          placeholder="Email"
          className="w-full p-3 mb-3 text-black rounded"
        />

        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={update}
            placeholder="Password"
            className="w-full p-3 text-black rounded"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="absolute right-3 top-3 text-black"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <label className="text-sm">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) =>
              setAccepted(e.target.checked)
            }
          />
          Accept Terms
        </label>

        {error && (
          <p className="text-red-400 mt-2">{error}</p>
        )}

        <button
          disabled={loading}
          className="w-full mt-4 py-3 bg-green-500 text-black font-bold rounded"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="mt-4 text-sm text-center">
          Already have account?
          <Link
            to="/login"
            className="text-green-400 ml-2"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}