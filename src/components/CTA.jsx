import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="px-8 py-28 text-center bg-gradient-to-r from-green-400 to-blue-500 text-black">
      <h2 className="text-4xl font-bold mb-4">
        Start Creating with AI Today
      </h2>

      <p className="mb-10 text-lg">
        No credit card. No learning curve. Just results.
      </p>

      <button
        onClick={() => navigate("/signup")}
        className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90"
      >
        Get Started Free
      </button>
    </section>
  );
}
