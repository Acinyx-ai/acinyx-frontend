import Navbar from "../components/Navbar.jsx";
import HowItWorksSection from "../components/HowItWorks.jsx";
import Footer from "../components/Footer.jsx";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#050b18] text-white flex flex-col">
      {/* Navigation */}
      <Navbar />

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-20">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            How Acinyx<span className="text-blue-400">.AI</span> Works
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            From idea to cinematic output in seconds. Here’s how Acinyx turns
            your prompts into professional AI creations.
          </p>
        </header>

        <HowItWorksSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
