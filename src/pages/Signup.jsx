import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Signup() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("acinyx_token");
    if (token) navigate("/dashboard");
  }, [navigate]);


  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }


  function validate() {

    if (!form.username || !form.email || !form.password)
      return "All fields are required";

    if (form.username.length < 3)
      return "Username must be at least 3 characters";

    if (!form.email.includes("@"))
      return "Enter valid email";

    if (form.password.length < 6)
      return "Password must be at least 6 characters";

    if (!accepted)
      return "Accept Terms and Privacy Policy";

    return null;
  }


  async function submit(e) {

    e.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {

      const res = await fetch(`${API}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.detail || "Signup failed");

      navigate("/login");

    }

    catch (err) {

      setError(err.message);

    }

    finally {

      setLoading(false);

    }

  }



  return (

<div className="min-h-screen flex items-center justify-center bg-gray-100">

<form
onSubmit={submit}
className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
>


<h2 className="text-2xl font-bold mb-6 text-center text-gray-800">

Create Account

</h2>



{/* Username */}

<label className="block text-sm font-medium text-gray-700">

Username

</label>

<input
name="username"
value={form.username}
onChange={update}
className="w-full mt-1 mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
placeholder="Enter username"
/>



{/* Email */}

<label className="block text-sm font-medium text-gray-700">

Email

</label>

<input
name="email"
type="email"
value={form.email}
onChange={update}
className="w-full mt-1 mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
placeholder="Enter email"
/>




{/* Password */}

<label className="block text-sm font-medium text-gray-700">

Password

</label>


<div className="relative mb-4">

<input
type={showPassword ? "text" : "password"}
name="password"
value={form.password}
onChange={update}
className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
placeholder="Enter password"
/>


<button
type="button"
onClick={() => setShowPassword(!showPassword)}
className="absolute right-3 top-2 text-sm text-gray-500"
>

{showPassword ? "Hide" : "Show"}

</button>

</div>




{/* Terms */}

<label className="flex items-center gap-2 mb-4 text-sm text-gray-700">

<input
type="checkbox"
checked={accepted}
onChange={(e) => setAccepted(e.target.checked)}
/>


<span>

I agree to the

<Link
to="/terms"
className="text-green-600 ml-1"
>

Terms

</Link>

and

<Link
to="/privacy"
className="text-green-600 ml-1"
>

Privacy Policy

</Link>

</span>

</label>




{/* Error */}

{error && (

<p className="text-red-500 mb-3 text-sm">

{error}

</p>

)}






{/* Button */}

<button
type="submit"
disabled={loading}
className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
>

{loading ? "Creating..." : "Sign Up"}

</button>





<p className="text-sm mt-4 text-center">

Already have account?

<Link
to="/login"
className="text-green-600 ml-1"
>

Login

</Link>

</p>



</form>

</div>

);

}
