import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {

  const navigate = useNavigate();

  const [loggedIn,setLoggedIn]=useState(
    !!localStorage.getItem("acinyx_token")
  );

  const [username,setUsername]=useState("");

  useEffect(()=>{

    function sync(){

      const token=localStorage.getItem("acinyx_token");

      setLoggedIn(!!token);

      const savedUsername=localStorage.getItem("acinyx_username");

      if(savedUsername) setUsername(savedUsername);

    }

    sync();

    window.addEventListener("storage",sync);

    return()=>window.removeEventListener("storage",sync);

  },[]);


  function logout(){

    localStorage.removeItem("acinyx_token");

    localStorage.removeItem("acinyx_plan");

    localStorage.removeItem("acinyx_username");

    navigate("/login");

  }


  return(

    <nav className="sticky top-0 z-50 bg-[#050b18]/90 backdrop-blur border-b border-white/10">

      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">

        <Link to="/" className="text-xl font-bold tracking-wide">
          Acinyx<span className="text-green-400">.AI</span>
        </Link>


        <div className="flex items-center gap-6 text-sm">

          <Link to="/features" className="hover:text-green-400">Features</Link>

          <Link to="/how-it-works" className="hover:text-green-400">How it works</Link>

          <Link to="/pricing" className="hover:text-green-400">Pricing</Link>

          <Link to="/terms" className="hover:text-green-400">Terms</Link>

          <Link to="/privacy" className="hover:text-green-400">Privacy</Link>


          {loggedIn?(
            <>

              <Link to="/dashboard" className="hover:text-green-400">
                {username||"Dashboard"}
              </Link>

              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 hover:bg-red-400 text-black rounded font-semibold"
              >
                Logout
              </button>

            </>
          ):(
            <>

              <Link to="/login" className="hover:text-green-400">
                Login
              </Link>

              <Link
                to="/signup"
                className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black rounded font-semibold"
              >
                Sign up
              </Link>

            </>
          )}

        </div>

      </div>

    </nav>

  );

}
