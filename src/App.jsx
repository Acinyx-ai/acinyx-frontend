import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";

import Pricing from "./pages/Pricing";
import Checkout from "./pages/Checkout";
import Features from "./pages/Features";
import HowItWorks from "./pages/HowItWorks";
import Poster from "./pages/Poster";

import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

/* simple route guard */
function Protected({ children }) {
  const token = localStorage.getItem("acinyx_token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />

        <Route
          path="/dashboard"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/chat"
          element={
            <Protected>
              <Chat />
            </Protected>
          }
        />

        <Route
          path="/poster"
          element={
            <Protected>
              <Poster />
            </Protected>
          }
        />

        <Route path="/pricing" element={<Pricing />} />

        <Route
          path="/checkout"
          element={
            <Protected>
              <Checkout />
            </Protected>
          }
        />

        <Route path="/features" element={<Features />} />
        <Route path="/how-it-works" element={<HowItWorks />} />

        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

      </Routes>
    </BrowserRouter>
  );
}
