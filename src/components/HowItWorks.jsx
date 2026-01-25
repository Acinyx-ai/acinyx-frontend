export default function HowItWorks() {
  const steps = [
    "Describe what you want using text or images",
    "Acinyx.AI analyzes and generates results",
    "Download, refine, or deploy instantly",
  ];

  return (
    <section className="px-8 py-24 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">
        How It Works
      </h2>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        {steps.map((s, i) => (
          <div
            key={i}
            className="p-6 bg-[#0d1b2a] border border-white/10 rounded-xl"
          >
            <span className="text-green-400 font-bold text-xl">
              Step {i + 1}
            </span>
            <p className="mt-3 text-gray-300">{s}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
