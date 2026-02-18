import { useState,useEffect } from "react";
import { useNavigate,Link } from "react-router-dom";

const API=import.meta.env.VITE_API_URL;

export default function Signup(){

const navigate=useNavigate();

const[form,setForm]=useState({

username:"",
email:"",
password:""

});

const[accepted,setAccepted]=useState(false);

const[error,setError]=useState("");

const[loading,setLoading]=useState(false);

useEffect(()=>{

const token=localStorage.getItem("acinyx_token");

if(token) navigate("/dashboard");

},[]);


function update(e){

setForm({...form,[e.target.name]:e.target.value});

}


async function submit(){

if(!accepted){

setError("Accept terms first");

return;

}

setLoading(true);

try{

const res=await fetch(`${API}/signup`,{

method:"POST",

headers:{"Content-Type":"application/json"},

body:JSON.stringify(form)

});

const data=await res.json();

if(!res.ok) throw new Error(data.detail);


// AUTO LOGIN

const body=new URLSearchParams();

body.append("username",form.username);

body.append("password",form.password);

const loginRes=await fetch(`${API}/token`,{

method:"POST",

headers:{"Content-Type":"application/x-www-form-urlencoded"},

body

});

const loginData=await loginRes.json();

localStorage.setItem("acinyx_token",loginData.access_token);

localStorage.setItem("acinyx_plan",loginData.plan);

localStorage.setItem("acinyx_username",form.username);

navigate("/dashboard");

}

catch(e){

setError(e.message);

}

setLoading(false);

}


return(

<div className="min-h-screen flex items-center justify-center bg-[#050b18] text-white">

<div className="p-8 bg-[#0d1b2a] rounded w-96">


<h1>Create Account</h1>


<input name="username" onChange={update} placeholder="Username" className="w-full p-3 text-black"/>


<input name="email" onChange={update} placeholder="Email" className="w-full p-3 text-black"/>


<input name="password" type="password" onChange={update} placeholder="Password" className="w-full p-3 text-black"/>


<label>

<input type="checkbox" onChange={e=>setAccepted(e.target.checked)}/>

Accept Terms

</label>


<button onClick={submit}>

{loading?"Creating":"Signup"}

</button>


{error}

</div>

</div>

);

}
