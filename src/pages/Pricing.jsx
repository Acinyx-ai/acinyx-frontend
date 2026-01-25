import Navbar from "../components/Navbar.jsx";
import PricingSection from "../components/Pricing.jsx";
import Footer from "../components/Footer.jsx";

export default function PricingPage() {
  return (
    <div className="bg-[#050b18] min-h-screen text-white">
      <Navbar />
      <PricingSection />
      <Footer />
    </div>
  );
}
