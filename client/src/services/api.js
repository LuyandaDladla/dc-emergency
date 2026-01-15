import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = "Bearer " + token;
  return config;
});

export function setToken(token) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

//Backwards-compatible export
export function setAuthToken(token) {
  return setToken(token);
}
