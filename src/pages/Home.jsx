import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Pricing from "../components/Pricing";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050b18] text-white flex flex-col">
      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1">
        <Hero />

        <section className="mt-24">
          <Features />
        </section>

        <section className="mt-24">
          <HowItWorks />
        </section>

        <section className="mt-24">
          <Pricing />
        </section>

        <section className="mt-24">
          <CTA />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
