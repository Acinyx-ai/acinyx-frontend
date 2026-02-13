import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API = import.meta.env.VITE_API_URL;

/*
  IMPORTANT (your current backend logic):

  Display -> KES
  Send to backend -> KES (NO *100)
*/

const PLAN_DETAILS = {
  free: {
    name: "Free",
    price: "KES 0",
    description: "Limited access for testing the platform.",
  },
  basic: {
    name: "Basic",
    price: "KES 500 / month",
    description: "Perfect for starters. No watermark on posters.",
  },
  pro: {
    name: "Pro",
    price: "KES 1500 / month",
    description: "For professionals and growing businesses.",
  },
  mega: {
    name: "Mega",
    price: "KES 3000 / month",
    description: "Unlimited power for teams and agencies.",
  },
};

/*
  Amounts sent exactly as KES
*/
const PLAN_AMOUNTS = {
  basic: 500,
  pro: 1500,
  mega: 3000,
};

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const plan = searchParams.get("plan") || "free";
  const planData = PLAN_DETAILS[plan];

  async function pay() {
    const token = localStorage.getItem("acinyx_token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (plan === "free") {
      alert("Free plan does not require payment.");
      return;
    }

    const amount = PLAN_AMOUNTS[plan];

    if (!amount) {
      alert("Invalid plan amount");
      return;
    }

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

      if (!res.ok) {
        alert(data?.detail || "Payment initialization failed");
        return;
      }

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        alert("Paystack did not return a checkout URL");
      }

    } catch {
      alert("Unable to start payment");
    }
  }

  if (!planData) {
    return (
      <div className="min-h-screen bg-[#050b18] text-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid plan</h1>
          <button
            onClick={() => navigate("/pricing")}
            className="px-6 py-3 bg-green-500 text-black rounded"
          >
            Go back to Pricing
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050b18] text-white">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold mb-4">Checkout</h1>

        <p className="text-gray-400 mb-10">
          You are about to subscribe to the{" "}
          <strong>{planData.name}</strong> plan.
        </p>

        <div className="bg-[#0b1226] border border-white/10 rounded-xl p-6 space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">
              {planData.name}
            </h2>
            <p className="text-green-400 text-xl mt-1">
              {planData.price}
            </p>
          </div>

          <p className="text-gray-300">
            {planData.description}
          </p>

          <button
            className="w-full mt-6 py-3 rounded bg-green-500 hover:bg-green-400 text-black font-bold"
            onClick={pay}
          >
            Proceed to Payment
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
