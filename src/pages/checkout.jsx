import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// 🔒 VALID PAID PLANS
const VALID_PLANS = ["basic", "pro", "mega"];

const PLAN_PRICES = {
  basic: "$5 / month",
  pro: "$15 / month",
  mega: "$30 / month",
};

export default function Checkout() {
  const [params] = useSearchParams();
  const plan = params.get("plan");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("acinyx_token");

  // --------------------------------------------
  // GUARDS
  // --------------------------------------------
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // FREE PLAN NEVER GOES TO PAYSTACK
    if (plan === "free") {
      localStorage.setItem("acinyx_plan", "free");
      navigate("/dashboard");
      return;
    }

    // INVALID PLAN PROTECTION
    if (!VALID_PLANS.includes(plan)) {
      navigate("/pricing");
    }
  }, [plan, token, navigate]);

  if (!plan) {
    return <Centered>No plan selected</Centered>;
  }

  // --------------------------------------------
  // PAYSTACK INIT
  // --------------------------------------------
  async function startPayment() {
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(`${API}/paystack/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (!res.ok || !data?.data?.authorization_url) {
        throw new Error(data?.message || "Payment initialization failed");
      }

      // 🚀 REDIRECT TO PAYSTACK
      window.location.href = data.data.authorization_url;
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment initialization failed. Please try again.");
      setLoading(false);
    }
  }

  // --------------------------------------------
  // UI
  // --------------------------------------------
  return (
    <div className="min-h-screen bg-[#0b1220] text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full bg-[#0d1b2a] p-8 rounded-xl border border-white/10 text-center">
        <h1 className="text-3xl font-bold mb-3 capitalize">
          {plan} Plan Checkout
        </h1>

        <p className="text-gray-400 mb-2">
          Price: <span className="text-white">{PLAN_PRICES[plan]}</span>
        </p>

        <p className="text-gray-400 mb-6">
          You’re upgrading to the <span className="capitalize">{plan}</span> plan.
        </p>

        <button
          onClick={startPayment}
          disabled={loading}
          className="w-full py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded transition"
        >
          {loading ? "Redirecting to Paystack…" : "Continue to Payment"}
        </button>

        <button
          onClick={() => navigate("/pricing")}
          className="mt-4 text-sm text-gray-400 hover:text-white transition"
        >
          ← Back to Pricing
        </button>
      </div>
    </div>
  );
}

// --------------------------------------------
// HELPER
// --------------------------------------------
function Centered({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      {children}
    </div>
  );
}
