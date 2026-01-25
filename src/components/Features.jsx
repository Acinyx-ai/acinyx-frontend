export default function Features() {
  const items = [
    "Multimodal AI Chat (text + image)",
    "Cinematic AI Poster Generation",
    "Usage-based plans for real businesses",
    "Fast, secure & cloud-ready",
  ];

  return (
    <section className="px-8 py-24 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Everything You Need in One AI Platform
      </h2>

      <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
        Acinyx.AI combines creativity, automation, and intelligence into a single powerful workflow.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {items.map((f) => (
          <div
            key={f}
            className="p-6 rounded-xl bg-[#0d1b2a] border border-white/10"
          >
            ✔ {f}
          </div>
        ))}
      </div>
    </section>
  );
}
