import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API =
  import.meta.env.VITE_API_URL ||
  "https://acinyx-backend.onrender.com";


/* ================= PLAN DETAILS ================= */

const PLAN_DETAILS = {
  free: {
    name: "Free",
    price: "KES 0 / month",
    description:
      "20 chats, 3 posters, 3 images, 20 humaniser. Watermarked posters, standard speed.",
  },
  basic: {
    name: "Basic",
    price: "KES 250 / month",
    description:
      "Unlimited chats, 50 posters, 50 images, 100 humaniser. No watermark. HD output.",
  },
  pro: {
    name: "Pro",
    price: "KES 500 / month",
    description:
      "Unlimited chats, 200 posters, 200 images, unlimited humaniser. Faster priority generation.",
  },
  mega: {
    name: "Mega",
    price: "KES 1500 / month",
    description:
      "Unlimited everything. Ultra HD output. Commercial license. Dedicated support.",
  },
};


/* ================= PLAN AMOUNTS (in KES) ================= */

const PLAN_AMOUNTS = {
  basic: 250,
  pro: 500,
  mega: 1500,
};


export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const plan = searchParams.get("plan") || "free";
  const reference = searchParams.get("reference");
  const planData = PLAN_DETAILS[plan];
  const token = localStorage.getItem("acinyx_token");

  // Check payment verification on mount
  useEffect(() => {
    if (reference) {
      verifyPayment(reference);
    }
  }, [reference]);

  /* ================= VERIFY PAYMENT ================= */
  async function verifyPayment(ref) {
    try {
      const res = await fetch(`${API}/payments/verify/${ref}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.status === 401) {
        localStorage.removeItem("acinyx_token");
        alert("Session expired");
        navigate("/login");
        return;
      }

      if (data.success) {
        if (data.status === "success") {
          setPaymentStatus("success");
          setTimeout(() => {
            navigate("/dashboard");
          }, 3000);
        } else {
          setPaymentStatus("failed");
        }
      }
    } catch (error) {
      console.error("Verification error:", error);
      setPaymentStatus("error");
    }
  }

  /* ================= PAYMENT ================= */
  async function pay() {
    if (!token) {
      alert("Login required");
      navigate("/login");
      return;
    }

    /* FREE PLAN */
    if (plan === "free") {
      alert("Free plan activated");
      navigate("/dashboard");
      return;
    }

    const baseAmount = PLAN_AMOUNTS[plan];

    if (!baseAmount) {
      alert("Invalid plan");
      return;
    }

    /* PAYSTACK USES KOBO / CENTS */
    const amount = baseAmount * 100;
    
    setLoading(true);

    try {
      const res = await fetch(`${API}/payments/paystack/init`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
          amount,
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        localStorage.removeItem("acinyx_token");
        alert("Session expired");
        navigate("/login");
        return;
      }

      if (!res.ok) {
        alert(data.detail || "Payment failed");
        setLoading(false);
        return;
      }

      if (data.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = data.authorization_url;
      } else {
        alert("Payment link failed");
        setLoading(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment server error");
      setLoading(false);
    }
  }

  /* ================= PAYMENT STATUS UI ================= */
  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-[#050b18] text-white">
        <Navbar />
        <div className="max-w-3xl mx-auto py-24 text-center">
          <div className="bg-green-500/20 border border-green-500 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-green-400 mb-4">
              Payment Successful! 🎉
            </h2>
            <p className="text-gray-300 mb-4">
              Your {planData.name} plan has been activated.
            </p>
            <p className="text-gray-400">
              Redirecting to dashboard...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (paymentStatus === "failed") {
    return (
      <div className="min-h-screen bg-[#050b18] text-white">
        <Navbar />
        <div className="max-w-3xl mx-auto py-24 text-center">
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-red-400 mb-4">
              Payment Failed
            </h2>
            <p className="text-gray-300 mb-4">
              Your payment could not be processed.
            </p>
            <button
              onClick={() => navigate("/pricing")}
              className="px-6 py-2 bg-blue-500 rounded hover:bg-blue-400 transition"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ================= INVALID PLAN ================= */
  if (!planData) {
    return (
      <div className="min-h-screen bg-[#050b18] text-white">
        <Navbar />
        <div className="max-w-3xl mx-auto py-24 text-center">
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Invalid Plan</h2>
            <button
              onClick={() => navigate("/pricing")}
              className="px-6 py-2 bg-blue-500 rounded hover:bg-blue-400 transition"
            >
              View Pricing
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#050b18] text-white">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold mb-6">Checkout</h1>

        <div className="bg-[#0b1226] border border-white/10 rounded-xl p-8 space-y-6">
          <div>
            <h2 className="text-3xl font-bold">{planData.name}</
