import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PLAN_DETAILS = {
  free: {
    name: "Free",
    price: "$0",
    description: "Limited access for testing the platform.",
  },
  basic: {
    name: "Basic",
    price: "$5 / month",
    description: "Perfect for starters. No watermark on posters.",
  },
  pro: {
    name: "Pro",
    price: "$15 / month",
    description: "For professionals and growing businesses.",
  },
  mega: {
    name: "Mega",
    price: "$30 / month",
    description: "Unlimited power for teams and agencies.",
  },
};

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const plan = searchParams.get("plan") || "free";
  const planData = PLAN_DETAILS[plan];

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
          You are about to subscribe to the <strong>{planData.name}</strong> plan.
        </p>

        <div className="bg-[#0b1226] border border-white/10 rounded-xl p-6 space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">{planData.name}</h2>
            <p className="text-green-400 text-xl mt-1">{planData.price}</p>
          </div>

          <p className="text-gray-300">{planData.description}</p>

          <button
            className="w-full mt-6 py-3 rounded bg-green-500 hover:bg-green-400 text-black font-bold"
            onClick={() => alert("Paystack integration comes next")}
          >
            Proceed to Payment
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
