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

/* ADMIN DASHBOARD */
import Acinyxdata from "./pages/Acinyxdata";



/* ================= PROTECTED ROUTE ================= */

function Protected({ children }) {

  const token = localStorage.getItem("acinyx_token");

  if (!token) {

    return <Navigate to="/login" replace />;

  }

  return children;

}



/* ================= PUBLIC ONLY ================= */

function PublicOnly({ children }) {

  const token = localStorage.getItem("acinyx_token");

  if (token) {

    return <Navigate to="/dashboard" replace />;

  }

  return children;

}



/* ================= APP ================= */

export default function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* DEFAULT */}

        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />


        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />


        {/* LOGIN */}

        <Route
          path="/login"
          element={
            <PublicOnly>
              <Login />
            </PublicOnly>
          }
        />


        {/* SIGNUP */}

        <Route
          path="/signup"
          element={
            <PublicOnly>
              <Signup />
            </PublicOnly>
          }
        />


        {/* CHAT */}

        <Route
          path="/chat"
          element={
            <Protected>
              <Chat />
            </Protected>
          }
        />


        {/* POSTER */}

        <Route
          path="/poster"
          element={
            <Protected>
              <Poster />
            </Protected>
          }
        />


        {/* CHECKOUT */}

        <Route
          path="/checkout"
          element={
            <Protected>
              <Checkout />
            </Protected>
          }
        />


        {/* ADMIN DASHBOARD (HIDDEN) */}

        <Route
          path="/acinyxdata"
          element={
            <Protected>
              <Acinyxdata />
            </Protected>
          }
        />


        {/* PUBLIC */}

        <Route path="/pricing" element={<Pricing />} />

        <Route path="/features" element={<Features />} />

        <Route path="/how-it-works" element={<HowItWorks />} />

        <Route path="/terms" element={<Terms />} />

        <Route path="/privacy" element={<Privacy />} />


        {/* FALLBACK */}

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />


      </Routes>

    </BrowserRouter>

  );

}