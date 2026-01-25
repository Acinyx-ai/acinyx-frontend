import { useNavigate } from "react-router-dom";

export default function Pricing() {
  const navigate = useNavigate();

  function select(plan) {
    navigate(`/checkout?plan=${plan}`);
  }

  return (
    <section className="px-6 py-24 max-w-7xl mx-auto text-white">
      <h1 className="text-4xl font-bold text-center mb-4">
        Upgrade Your Plan
      </h1>
      <p className="text-center text-gray-400 mb-14">
        AI chat & AI-generated posters built for real business use.
      </p>

      <div className="grid md:grid-cols-4 gap-8">
        <Plan
          title="Free"
          price="$0"
          features={[
            "5 AI chats",
            "2 AI-generated posters",
            "Watermarked posters",
          ]}
          button="Current Plan"
          disabled
        />

        <Plan
          title="Basic"
          price="$5 / month"
          highlight
          features={[
            "100 AI chats",
            "20 AI posters",
            "No watermark",
            "HD downloads",
            "Email support",
          ]}
          button="Upgrade to Basic"
          onClick={() => select("basic")}
        />

        <Plan
          title="Pro"
          price="$15 / month"
          features={[
            "500 AI chats",
            "100 AI posters",
            "No watermark",
            "Priority generation",
          ]}
          button="Go Pro"
          onClick={() => select("pro")}
        />

        <Plan
          title="Mega"
          price="$30 / month"
          mega
          features={[
            "Unlimited AI chats",
            "Unlimited AI posters",
            "Ultra-HD output",
            "Commercial usage",
            "Dedicated support",
          ]}
          button="Get Mega"
          onClick={() => select("mega")}
        />
      </div>
    </section>
  );
}

function Plan({ title, price, features, button, onClick, disabled, highlight, mega }) {
  return (
    <div
      className={`p-8 rounded-xl border ${
        mega
          ? "border-yellow-400 bg-[#1a1400]"
          : highlight
          ? "border-green-400 bg-[#0d1b2a]"
          : "border-white/10 bg-[#0d1b2a]"
      }`}
    >
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-3xl mb-6">{price}</p>

      <ul className="space-y-2 text-sm text-gray-300 mb-8">
        {features.map((f) => (
          <li key={f}>✔ {f}</li>
        ))}
      </ul>

      <button
        disabled={disabled}
        onClick={onClick}
        className={`w-full py-3 font-bold rounded ${
          disabled
            ? "bg-gray-500 text-black"
            : mega
            ? "bg-yellow-400 text-black"
            : "bg-green-500 text-black"
        }`}
      >
        {button}
      </button>
    </div>
  );
}
