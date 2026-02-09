import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";

import Pricing from "./pages/Pricing";
import Checkout from "./pages/Checkout";
import Features from "./pages/Features";
import HowItWorks from "./pages/HowItWorks";
import Poster from "./pages/Poster";   // ✅ added

import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/chat" element={<Chat />} />

        {/* ✅ poster page */}
        <Route path="/poster" element={<Poster />} />

        <Route path="/pricing" element={<Pricing />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route path="/features" element={<Features />} />
        <Route path="/how-it-works" element={<HowItWorks />} />

        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

      </Routes>
    </BrowserRouter>
  );
}
