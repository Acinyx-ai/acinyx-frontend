import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API =
  import.meta.env.VITE_API_URL ||
  "https://acinyx-backend.onrender.com";


/* ================= PLAN DETAILS ================= */

const PLAN_DETAILS = {

  free: {
    name: "Free",
    price: "KES 0 / month",
    description:
      "20 chats, 3 posters, 3 images, 20 humaniser. Watermarked posters, standard speed.",
  },

  basic: {
    name: "Basic",
    price: "KES 250 / month",
    description:
      "Unlimited chats, 50 posters, 50 images, 100 humaniser. No watermark. HD output.",
  },

  pro: {
    name: "Pro",
    price: "KES 500 / month",
    description:
      "Unlimited chats, 200 posters, 200 images, unlimited humaniser. Faster priority generation.",
  },

  mega: {
    name: "Mega",
    price: "KES 1500 / month",
    description:
      "Unlimited everything. Ultra HD output. Commercial license. Dedicated support.",
  },

};


/* ================= PLAN AMOUNTS ================= */

const PLAN_AMOUNTS = {

  basic: 250,
  pro: 500,
  mega: 1500,

};


export default function Checkout() {

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const plan =
    searchParams.get("plan") || "free";

  const planData =
    PLAN_DETAILS[plan];

  const token =
    localStorage.getItem("acinyx_token");



  /* ================= PAYMENT ================= */

  async function pay() {

    if (!token) {

      alert("Login required");

      navigate("/login");

      return;

    }


    /* FREE PLAN */

    if (plan === "free") {

      alert("Free plan activated");

      navigate("/dashboard");

      return;

    }


    const baseAmount =
      PLAN_AMOUNTS[plan];


    if (!baseAmount) {

      alert("Invalid plan");

      return;

    }


    /* PAYSTACK USES KOBO / CENTS */

    const amount =
      baseAmount * 100;


    try {

      const res =
        await fetch(
          `${API}/payments/paystack/init`,
          {

            method: "POST",

            headers: {

              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",

            },

            body: JSON.stringify({

              plan,
              amount,

            }),

          }
        );


      const data =
        await res.json();


      if (res.status === 401) {

        localStorage.removeItem(
          "acinyx_token"
        );

        alert("Session expired");

        navigate("/login");

        return;

      }


      if (!res.ok) {

        alert(
          data.detail ||
          "Payment failed"
        );

        return;

      }


      if (data.authorization_url) {

        window.location.href =
          data.authorization_url;

      }

      else {

        alert(
          "Payment link failed"
        );

      }

    }

    catch {

      alert(
        "Payment server error"
      );

    }

  }



  /* ================= INVALID PLAN ================= */

  if (!planData)

    return (

      <div className="min-h-screen bg-[#050b18] text-white">

        <Navbar />

        <div className="max-w-3xl mx-auto py-24 text-center">

          Invalid plan

        </div>

        <Footer />

      </div>

    );



  /* ================= UI ================= */

  return (

    <div className="min-h-screen bg-[#050b18] text-white">

      <Navbar />


      <main className="max-w-3xl mx-auto px-6 py-24">


        <h1 className="text-4xl font-bold mb-6">

          Checkout

        </h1>


        <div className="bg-[#0b1226] border border-white/10 rounded-xl p-8 space-y-6">


          <div>

            <h2 className="text-3xl font-bold">

              {planData.name}

            </h2>


            <p className="text-green-400 text-xl">

              {planData.price}

            </p>

          </div>


          <p className="text-gray-300">

            {planData.description}

          </p>



          <button

            onClick={pay}

            className="

              w-full
              py-3
              rounded
              bg-green-500
              hover:bg-green-400
              text-black
              font-bold
              transition

            "

          >

            {plan === "free"

              ? "Activate Free Plan"

              : "Proceed to Payment"}

          </button>


          <button

            onClick={() =>
              navigate("/pricing")
            }

            className="

              w-full
              py-3
              rounded
              border
              border-white/20

            "

          >

            Back

          </button>


        </div>


      </main>


      <Footer />

    </div>

  );

}