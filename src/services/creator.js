import axios from "axios"

const API_BASE = import.meta.env.VITE_API_BASE

export const getTopCreatorApi = async (token) => {
  try {
    const res = await axios.get(`${API_BASE}/top-creators`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })

    return(res.data)
  } catch (error) {
    console.error("Error in getTopCreatorApi:", error)
  }
}