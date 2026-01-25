import Navbar from "../components/Navbar.jsx";
import FeaturesSection from "../components/Features.jsx";
import Footer from "../components/Footer.jsx";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#050b18] text-white flex flex-col">
      {/* Navigation */}
      <Navbar />

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-20">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Powerful Features Built for Creators
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Acinyx.AI combines multimodal intelligence, cinematic generation,
            and real productivity tools — all in one platform.
          </p>
        </header>

        <FeaturesSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
