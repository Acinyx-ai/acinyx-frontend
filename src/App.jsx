import { BrowserRouter, Routes, Route } from "react-router-dom";

import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* main routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* legal pages (Paystack requirement) */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
    </BrowserRouter>
  );
}
