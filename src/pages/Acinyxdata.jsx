import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Acinyxdata() {

const navigate = useNavigate();

const [data, setData] = useState(null);

const [loading, setLoading] = useState(true);


useEffect(() => {

loadData();

}, []);


async function loadData() {

const token = localStorage.getItem("acinyx_token");

if (!token) {

navigate("/login");

return;

}

try {

const res = await fetch(

`${API}/admin/data`,

{

headers: {

Authorization: `Bearer ${token}`

}

}

);

if (res.status === 403) {

alert("Not authorized");

navigate("/");

return;

}

const json = await res.json();

setData(json);

}

catch {

alert("Failed to load admin data");

}

finally {

setLoading(false);

}

}


if (loading)

return (

<div className="text-white p-10">

Loading dashboard...

</div>

);


return (

<div className="min-h-screen bg-[#0b0f1a] text-white p-10">


<h1 className="text-3xl font-bold mb-8">

Acinyx Admin Dashboard

</h1>


{/* STATS */}

<div className="grid grid-cols-1 md:grid-cols-4 gap-6">


<div className="bg-white/5 p-6 rounded">

<p>Total Users</p>

<h2 className="text-2xl font-bold">

{data.total_users}

</h2>

</div>


<div className="bg-white/5 p-6 rounded">

<p>Active Users</p>

<h2 className="text-2xl font-bold">

{data.active_users}

</h2>

</div>


<div className="bg-white/5 p-6 rounded">

<p>Total Messages</p>

<h2 className="text-2xl font-bold">

{data.total_messages}

</h2>

</div>


<div className="bg-white/5 p-6 rounded">

<p>Revenue ($)</p>

<h2 className="text-2xl font-bold">

{data.revenue}

</h2>

</div>


</div>


{/* USAGE */}

<div className="mt-10">


<h2 className="text-xl mb-4">

Usage

</h2>


<div className="bg-white/5 p-6 rounded">


{data.usage.length === 0 && (

<p>No usage yet</p>

)}


{data.usage.map(item => (

<div key={item.date}>

{item.date} : {item.count} messages

</div>

))}


</div>


</div>


</div>

);

}