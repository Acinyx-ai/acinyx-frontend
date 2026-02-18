import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import PosterImageUpload from "../components/PosterImageUpload.jsx";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";


export default function Poster() {

const navigate = useNavigate();


const [loading, setLoading] = useState(false);
const [posterUrl, setPosterUrl] = useState("");
const [error, setError] = useState("");
const [image, setImage] = useState(null);


const [form, setForm] = useState({

title: "",
description: "",
style: "cinematic",
size: "portrait"

});



useEffect(() => {

const token = localStorage.getItem("acinyx_token");

if (!token) navigate("/login");

}, [navigate]);



function update(e) {

setForm({
...form,
[e.target.name]: e.target.value
});

}



async function generatePoster() {


const token = localStorage.getItem("acinyx_token");

if (!token) {

navigate("/login");
return;

}



if (!form.title) {

setError("Enter title");
return;

}



setLoading(true);
setError("");
setPosterUrl("");


try {

const data = new FormData();

data.append("title", form.title);

data.append("description", form.description);

data.append("style", form.style);

data.append("size", form.size);


if (image)
data.append("image", image);



const res = await fetch(`${API}/ai/poster`, {

method: "POST",

headers: {
Authorization: `Bearer ${token}`
},

body: data

});



if (res.status === 401) {

localStorage.removeItem("acinyx_token");
navigate("/login");
return;

}



if (res.status === 403) {

setError("Poster limit reached");
return;

}



const result = await res.json();


if (!res.ok)
throw new Error(result.detail || "Generation failed");


setPosterUrl(`${API}/${result.image}`);

}


catch (err) {

setError(err.message);

}


finally {

setLoading(false);

}

}





return (


<div className="bg-[#050b18] min-h-screen text-white">

<Navbar />


<main className="max-w-4xl mx-auto px-4 py-12">



<h1 className="text-3xl font-bold mb-2">

AI Poster Generator

</h1>



<p className="text-gray-400 mb-8">

Describe any image and generate cinematic poster

</p>




<div className="bg-[#0b1226] p-6 rounded-xl border border-white/10 space-y-4">




<PosterImageUpload

image={image}

setImage={setImage}

/>




{/* Title */}

<input

name="title"

placeholder="Poster title"

value={form.title}

onChange={update}

className="w-full p-3 rounded bg-white text-black"

/>





{/* Description */}

<textarea

name="description"

placeholder="Describe your poster (hero, cyberpunk, anime, movie etc)"

value={form.description}

onChange={update}

className="w-full p-3 rounded bg-white text-black h-24"

/>





{/* Style */}

<select

name="style"

value={form.style}

onChange={update}

className="w-full p-3 rounded bg-white text-black"

>

<option value="cinematic">Cinematic</option>

<option value="anime">Anime</option>

<option value="realistic">Realistic</option>

<option value="fantasy">Fantasy</option>

<option value="cyberpunk">Cyberpunk</option>

</select>





{/* Size */}

<select

name="size"

value={form.size}

onChange={update}

className="w-full p-3 rounded bg-white text-black"

>

<option value="portrait">

Portrait (2:3)

</option>

<option value="square">

Square (1:1)

</option>

<option value="landscape">

Landscape (16:9)

</option>

</select>






<button

onClick={generatePoster}

disabled={loading}

className="w-full py-3 rounded bg-gradient-to-r from-green-400 to-blue-500 text-black font-bold"

>

{loading ? "Generating..." : "Generate Poster"}

</button>




</div>




{error &&

<p className="mt-4 text-red-400">

{error}

</p>

}





{posterUrl && (

<div className="mt-10 text-center">



<img

src={posterUrl}

alt="poster"

className="mx-auto max-w-md rounded-xl border border-white/10"

/>




<div className="mt-4 flex gap-3 justify-center">



<a

href={posterUrl}

download

className="px-6 py-2 bg-green-600 rounded"

>

Download

</a>




<a

href={posterUrl}

target="_blank"

rel="noreferrer"

className="px-6 py-2 bg-blue-600 rounded"

>

Open

</a>



</div>


</div>

)}



</main>


<Footer />


</div>

);

}
