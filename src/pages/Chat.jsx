import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import ChatSidebar from "../components/ChatSidebar";
import ChatInput from "../components/ChatInput";
import MessageBubble from "../components/MessageBubble";
import ThemeToggle from "../components/ThemeToggle";

import logo from "../assets/logo.png";

const API = (path) => `${import.meta.env.VITE_API_URL}${path}`;


export default function Chat() {

const navigate = useNavigate();
const bottomRef = useRef(null);

const [messages, setMessages] = useState([]);
const [loading, setLoading] = useState(false);
const [showUpgradeNotice, setShowUpgradeNotice] = useState(false);



/* Format markdown-style text into real headings */

function formatText(text) {

if (!text) return "";

let html = text;


// Header 3

html = html.replace(
/^### (.*$)/gim,
"<h3 class='text-lg font-bold mt-3 mb-1'>$1</h3>"
);


// Header 2

html = html.replace(
/^## (.*$)/gim,
"<h2 class='text-xl font-bold mt-4 mb-2'>$1</h2>"
);


// Header 1

html = html.replace(
/^# (.*$)/gim,
"<h1 class='text-2xl font-bold mt-4 mb-2'>$1</h1>"
);


// Bold

html = html.replace(
/\*\*(.*?)\*\*/gim,
"<strong>$1</strong>"
);


// Line breaks

html = html.replace(/\n/g, "<br/>");

return html;

}



/* Load chat history */

useEffect(() => {

const token = localStorage.getItem("acinyx_token");

if (!token) {

navigate("/login");
return;

}

const historyKey = `acinyx_chat_history_${token}`;

const saved = localStorage.getItem(historyKey);

if (saved) {

try {

setMessages(JSON.parse(saved));

}

catch {

localStorage.removeItem(historyKey);

}

}

}, [navigate]);



/* Save chat history */

useEffect(() => {

const token = localStorage.getItem("acinyx_token");

if (!token) return;

const historyKey = `acinyx_chat_history_${token}`;

localStorage.setItem(historyKey, JSON.stringify(messages));

}, [messages]);



/* Auto scroll */

useEffect(() => {

bottomRef.current?.scrollIntoView({
behavior: "smooth"
});

}, [messages, loading, showUpgradeNotice]);



/* Send message */

async function sendMessage(text, image, mode = "chat") {

if ((!text || !text.trim()) && !image) return;

if (loading) return;


const token = localStorage.getItem("acinyx_token");

if (!token) {

navigate("/login");
return;

}



const userMessage = {

id: Date.now(),
role: "user",
text,
image: image ? URL.createObjectURL(image) : null,

};


setMessages(prev => [...prev, userMessage]);

setLoading(true);



try {

const form = new FormData();

if (text) form.append("message", text);

if (image) form.append("image", image);

form.append("mode", mode);



const res = await fetch(API("/ai/chat"), {

method: "POST",

headers: {
Authorization: `Bearer ${token}`
},

body: form

});



if (res.status === 401) {

localStorage.removeItem("acinyx_token");

navigate("/login");

return;

}


if (res.status === 403) {

setShowUpgradeNotice(true);

return;

}



const data = await res.json();

if (!res.ok) throw new Error();



setShowUpgradeNotice(false);



const assistantMessage = {

id: Date.now() + 1,

role: "assistant",

text: data.reply ? formatText(data.reply) : null,

image: data.image
? `${import.meta.env.VITE_API_URL}/${data.image}`
: null,

};


setMessages(prev => [...prev, assistantMessage]);

}


catch {

setMessages(prev => [

...prev,

{

id: Date.now(),

role: "assistant",

text: "⚠️ Error. Try again."

}

]);

}


finally {

setLoading(false);

}

}




return (

<div className="flex h-screen bg-[#0b0f1a] text-white">


<div className="hidden md:block">

<ChatSidebar />

</div>



<main className="flex flex-col flex-1">



<header className="flex items-center justify-between px-6 py-3 border-b border-white/10">


<div
className="flex items-center gap-3 cursor-pointer"
onClick={() => navigate("/")}
>

<img src={logo} className="w-8 h-8" />

<h1 className="text-lg font-semibold">

Acinyx<span className="text-blue-400">.AI</span>

</h1>

</div>


<ThemeToggle />

</header>



{showUpgradeNotice && (

<div className="mx-6 mt-4 border border-yellow-400/40 bg-yellow-400/10 px-4 py-3 flex justify-between rounded">

<span>

Chat limit reached

</span>

<button
onClick={() => navigate("/pricing")}
className="bg-yellow-400 text-black px-3 py-1 rounded"
>

Upgrade

</button>

</div>

)}




<section className="flex-1 overflow-y-auto px-6 py-4 space-y-4">


{messages.map(msg => (

<MessageBubble
key={msg.id}
role={msg.role}
text={msg.text}
image={msg.image}
/>

))}


{loading && (

<MessageBubble role="assistant" loading />

)}


<div ref={bottomRef} />

</section>




<ChatInput
onSend={sendMessage}
disabled={loading}
/>



</main>

</div>

);

}
