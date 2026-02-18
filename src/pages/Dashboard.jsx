import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";


export default function Dashboard() {


  const navigate = useNavigate();


  const [plan, setPlan] = useState("free");

  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(true);



  useEffect(() => {


    const token = localStorage.getItem("acinyx_token");


    if (!token) {

      navigate("/login");

      return;

    }



    const savedPlan = localStorage.getItem("acinyx_plan");

    const savedLogin = localStorage.getItem("acinyx_login_id");



    if (savedPlan) {

      setPlan(savedPlan);

    }


    if (savedLogin) {

      setUsername(savedLogin);

    }



    setLoading(false);


  }, []);



  function logout() {


    localStorage.removeItem("acinyx_token");

    localStorage.removeItem("acinyx_plan");

    localStorage.removeItem("acinyx_login_id");


    navigate("/login");

  }



  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-[#050b18] text-white">

        Loading...

      </div>

    );

  }



  return (


    <div className="bg-[#050b18] min-h-screen text-white">


      <Navbar />


      <main className="max-w-6xl mx-auto px-6 py-12">


        <h1 className="text-3xl font-bold mb-2">

          Welcome{username && `, ${username}`}

        </h1>


        <p className="text-gray-400 mb-8">

          Your control center for Acinyx.AI

        </p>



        {/* PLAN CARD */}


        <div className="bg-[#0b1226] p-6 rounded-xl border border-white/10 mb-10">


          <p className="text-sm text-gray-400">

            Current Plan

          </p>


          <h2 className="text-2xl font-bold capitalize">

            {plan}

          </h2>



          {plan === "free" && (

            <p className="text-yellow-400 text-sm mt-2">

              Free plan — upgrade to unlock full power.

            </p>

          )}


        </div>



        {/* TOOLS */}


        <div className="grid md:grid-cols-3 gap-6">


          <ToolCard

            title="AI Chat"

            desc="Chat with AI and generate answers"

            btn="Open Chat"

            color="bg-green-500"

            onClick={() => navigate("/chat")}

          />


          <ToolCard

            title="AI Poster"

            desc="Create posters instantly"

            btn="Generate Poster"

            color="bg-blue-500"

            onClick={() => navigate("/poster")}

          />


          <ToolCard

            title="Upgrade Plan"

            desc="Unlock full power"

            btn="View Pricing"

            color="bg-purple-500"

            onClick={() => navigate("/pricing")}

          />


        </div>



        {/* LOGOUT */}


        <div className="mt-10">


          <button

            onClick={logout}

            className="bg-red-500 px-6 py-3 rounded font-bold text-black"

          >

            Logout

          </button>


        </div>


      </main>


      <Footer />


    </div>

  );

}



function ToolCard({ title, desc, btn, onClick, color }) {


  return (


    <div className="bg-[#0d1b2a] p-6 rounded-xl border border-white/10">


      <h3 className="text-xl font-bold mb-2">

        {title}

      </h3>


      <p className="text-gray-400 text-sm mb-4">

        {desc}

      </p>


      <button

        onClick={onClick}

        className={`w-full py-3 ${color} text-black font-bold rounded`}

      >

        {btn}

      </button>


    </div>


  );

}
