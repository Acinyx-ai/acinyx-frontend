import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import ChatSidebar from "../components/ChatSidebar";
import ChatInput from "../components/ChatInput";
import MessageBubble from "../components/MessageBubble";
import ThemeToggle from "../components/ThemeToggle";

import logo from "../assets/logo.png";


/* ================= API HELPER ================= */

const BASE_URL = import.meta.env.VITE_API_URL || "";

const API = (path) => `${BASE_URL}${path}`;


/* ================= COMPONENT ================= */

export default function Chat() {

const navigate = useNavigate();

const bottomRef = useRef(null);

const [messages, setMessages] = useState([]);

const [loading, setLoading] = useState(false);

const [showUpgradeNotice, setShowUpgradeNotice] = useState(false);



/* ================= AUTH CHECK ================= */

useEffect(() => {

const token = localStorage.getItem("acinyx_token");

if (!token) navigate("/login");

}, [navigate]);



/* ================= LOAD HISTORY ================= */

useEffect(() => {

const token = localStorage.getItem("acinyx_token");

if (!token) return;

const key = `acinyx_chat_history_${token}`;

try {

const saved = localStorage.getItem(key);

if (saved) setMessages(JSON.parse(saved));

}

catch {

localStorage.removeItem(key);

}

}, []);



/* ================= SAVE HISTORY ================= */

useEffect(() => {

const token = localStorage.getItem("acinyx_token");

if (!token) return;

const key = `acinyx_chat_history_${token}`;

localStorage.setItem(key, JSON.stringify(messages));

}, [messages]);



/* ================= AUTO SCROLL ================= */

useEffect(() => {

bottomRef.current?.scrollIntoView({

behavior: "smooth"

});

}, [messages, loading]);



/* ================= SEND MESSAGE ================= */

async function sendMessage(text, image, mode = "chat") {

if (loading) return;

if (!text && !image) return;

const token = localStorage.getItem("acinyx_token");

if (!token) {

navigate("/login");

return;

}



/* USER MESSAGE */

const userMessage = {

id: Date.now(),

role: "user",

text: text || "",

image: image ? URL.createObjectURL(image) : null

};

setMessages(prev => [...prev, userMessage]);

setLoading(true);



try {

//////////////////////////////////////////////////
// BUILD REQUEST BASED ON MODE
//////////////////////////////////////////////////

const form = new FormData();

let endpoint = "/ai/chat";


if (mode === "image") {

endpoint = "/ai/image";

form.append("prompt", text);

}

else if (mode === "humanize") {

endpoint = "/ai/humanize";

form.append("message", text);

}

else {

endpoint = "/ai/chat";

form.append("message", text);

}


if (image) {

form.append("image", image);

}



//////////////////////////////////////////////////
// SEND REQUEST
//////////////////////////////////////////////////

const res = await fetch(

API(endpoint),

{

method: "POST",

headers: {

Authorization: `Bearer ${token}`

},

body: form

}

);



//////////////////////////////////////////////////
// HANDLE AUTH ERRORS
//////////////////////////////////////////////////

if (res.status === 401) {

localStorage.removeItem("acinyx_token");

navigate("/login");

return;

}



//////////////////////////////////////////////////
// HANDLE LIMIT
//////////////////////////////////////////////////

if (res.status === 403) {

setShowUpgradeNotice(true);

return;

}



const data = await res.json();

if (!res.ok) throw new Error();



setShowUpgradeNotice(false);



//////////////////////////////////////////////////
// ASSISTANT MESSAGE
//////////////////////////////////////////////////

const assistantMessage = {

id: Date.now() + 1,

role: "assistant",

text: data.reply || "",

image: data.image

? `${BASE_URL}/${data.image}`

: null

};

setMessages(prev => [...prev, assistantMessage]);



}

catch {

setMessages(prev => [

...prev,

{

id: Date.now(),

role: "assistant",

text: "⚠️ Server error. Try again."

}

]);

}

finally {

setLoading(false);

}

}



/* ================= UI ================= */

return (

<div className="flex h-screen bg-[#0b0f1a] text-white">


{/* SIDEBAR */}

<div className="hidden md:block">

<ChatSidebar />

</div>



{/* MAIN */}

<main className="flex flex-col flex-1">


{/* HEADER */}

<header className="flex items-center justify-between px-6 py-3 border-b border-white/10">

<div

className="flex items-center gap-3 cursor-pointer"

onClick={() => navigate("/")}

>

<img src={logo} className="w-8 h-8" alt="logo"/>

<h1 className="text-lg font-semibold">

Acinyx

<span className="text-blue-400">.AI</span>

</h1>

</div>

<ThemeToggle />

</header>



{/* LIMIT NOTICE */}

{showUpgradeNotice && (

<div className="mx-6 mt-4 border border-yellow-400/40 bg-yellow-400/10 px-4 py-3 flex justify-between rounded">

<span>Plan limit reached</span>

<button

onClick={() => navigate("/pricing")}

className="bg-yellow-400 text-black px-3 py-1 rounded"

>

Upgrade

</button>

</div>

)}



{/* CHAT AREA */}

<section className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

{messages.map(msg => (

<MessageBubble

key={msg.id}

role={msg.role}

text={msg.text}

image={msg.image}

/>

))}

{loading && <MessageBubble role="assistant" loading />}

<div ref={bottomRef} />

</section>



{/* INPUT */}

<ChatInput

onSend={sendMessage}

disabled={loading}

/>


</main>

</div>

);

}