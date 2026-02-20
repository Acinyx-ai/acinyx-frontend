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
        AI chat, image generation & poster creation for real business use.
      </p>

      <div className="grid md:grid-cols-4 gap-8">

        {/* FREE */}

        <Plan
          title="Free"
          price="KES 0"
          features={[
            "50 AI chats",
            "5 AI posters",
            "5 AI images",
            "Watermarked posters",
            "Standard speed",
          ]}
          button="Current Plan"
          disabled
        />

        {/* BASIC */}

        <Plan
          title="Basic"
          price="KES 500 / month"
          highlight
          features={[
            "Unlimited AI chats",
            "50 AI posters",
            "50 AI images",
            "No watermark",
            "HD downloads",
            "Email support",
          ]}
          button="Upgrade to Basic"
          onClick={() => select("basic")}
        />

        {/* PRO */}

        <Plan
          title="Pro"
          price="KES 1500 / month"
          features={[
            "Unlimited AI chats",
            "200 AI posters",
            "200 AI images",
            "No watermark",
            "Priority generation",
            "Faster speed",
          ]}
          button="Go Pro"
          onClick={() => select("pro")}
        />

        {/* MEGA */}

        <Plan
          title="Mega"
          price="KES 3000 / month"
          mega
          features={[
            "Unlimited AI chats",
            "Unlimited AI posters",
            "Unlimited AI images",
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


/* PLAN COMPONENT */

function Plan({
  title,
  price,
  features,
  button,
  onClick,
  disabled,
  highlight,
  mega,
}) {

  return (
    <div
      className={`p-8 rounded-xl border transition hover:scale-105 ${
        mega
          ? "border-yellow-400 bg-[#1a1400]"
          : highlight
          ? "border-green-400 bg-[#0d1b2a]"
          : "border-white/10 bg-[#0d1b2a]"
      }`}
    >

      <h3 className="text-2xl font-bold mb-2">
        {title}
      </h3>

      <p className="text-3xl mb-6">
        {price}
      </p>

      <ul className="space-y-2 text-sm text-gray-300 mb-8">

        {features.map((f, i) => (
          <li key={i}>✔ {f}</li>
        ))}

      </ul>

      <button
        disabled={disabled}
        onClick={onClick}
        className={`w-full py-3 font-bold rounded transition ${
          disabled
            ? "bg-gray-500 text-black cursor-not-allowed"
            : mega
            ? "bg-yellow-400 hover:bg-yellow-300 text-black"
            : "bg-green-500 hover:bg-green-400 text-black"
        }`}
      >

        {button}

      </button>

    </div>
  );
}