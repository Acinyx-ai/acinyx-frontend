const API_URL = import.meta.env.VITE_API_URL;


export async function apiRequest(endpoint, options = {}) {

  const token = localStorage.getItem("acinyx_token");


  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers || {})
  };


  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });


  if (res.status === 401) {

    localStorage.removeItem("acinyx_token");
    localStorage.removeItem("acinyx_plan");

    window.location.href = "/login";

    return;
  }


  const data = await res.json();


  if (!res.ok) {

    throw new Error(data.detail || "API error");

  }


  return data;

}
