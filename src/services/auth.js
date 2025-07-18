import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE

export const registerApi = async (credential) => {
  const res = await axios.post(`${API_BASE}/auth/register`, credential)

  return res.data
}

export const loginApi = async (credential) => {
  const res = await axios.post(`${API_BASE}/auth/login`, credential)

  return res.data
}

export const logout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  window.location.href = "/login"
}