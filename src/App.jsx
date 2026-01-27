import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public pages
import Home from "./pages/Home";
import Features from "./pages/Features";
import HowItWorks from "./pages/HowItWorks";
import Pricing from "./pages/Pricing";

// Auth pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// App pages
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Poster from "./pages/Poster";
import Checkout from "./pages/Checkout"; // MUST MATCH FILE NAME EXACTLY

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Marketing */}
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* App */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/poster" element={<Poster />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </BrowserRouter>
  );
}
