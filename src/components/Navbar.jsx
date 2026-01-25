import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("acinyx_token"));
  }, []);

  function logout() {
    localStorage.removeItem("acinyx_token");
    localStorage.removeItem("acinyx_plan");
    navigate("/login");
    window.location.reload();
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#050b18]/90 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-wide">
          Acinyx<span className="text-green-400">.AI</span>
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link to="/features" className="hover:text-green-400">Features</Link>
          <Link to="/how-it-works" className="hover:text-green-400">How it works</Link>
          <Link to="/pricing" className="hover:text-green-400">Pricing</Link>

          {loggedIn ? (
            <>
              <Link to="/dashboard" className="hover:text-green-400">Dashboard</Link>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500/90 hover:bg-red-500 text-black rounded-md font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-green-400">Login</Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black rounded-md font-semibold"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
