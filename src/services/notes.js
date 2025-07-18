import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE

export const addNoteApi = async (credential, token) => {
  try {
    const res = await axios.post(`${API_BASE}/notes`, credential, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    })

    return res.data
  } catch (error) {
    console.error("Error in addNoteApi:", error);
    throw error;
  }
}

export const getAllNoteApi = async (token) => {
  try {
    const res = await axios.get(`${API_BASE}/notes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })

    return(res.data)
  } catch (error) {
    console.error("Error in getAllNoteApi:", error)
  }
}

export const latestNoteApi = async (token) => {
  try {
    const res = await axios.get(`${API_BASE}/notes/latest-notes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })

    return(res.data)
  } catch (error) {
    console.error("Error in latestNoteApi:", error)
  }
}

export const mostLikedNoteApi = async (token) => {
  try {
    const res = await axios.get(`${API_BASE}/notes/most-liked-notes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })

    return(res.data)
  } catch (error) {
    console.error("Error in mostLikedNoteApi:", error)
  }
}

export const showNoteById = async (id, token) => {
  try {
    const res = await axios.get(`${API_BASE}/notes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })

    return(res.data)
  } catch (error) {
    console.error("Error in showNoteById:", error)
  }
}

export const likeNoteApi = async (id, token) => {
  try {
    const res = await axios.post(`${API_BASE}/notes/${id}/like`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    })

    return(res.data)
  } catch (error) {
    console.error("Error in likeNoteApi:", error)
  }
}

export const unLikeNoteApi = async (id, token) => {
  try {
    const res = await axios.delete(`${API_BASE}/notes/${id}/like`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    })

    return(res.data)
  } catch (error) {
    console.error("Error in unLikeNoteApi:", error)
  }
}

export const showNoteByUserId = async (token) => {
  try {
    const res = await axios.get(`${API_BASE}/profile/notes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })

    return(res.data)
  } catch (error) {
    console.error("Error in showNoteByUserId:", error)
  }
}

export const favoriteNoteApi = async (id, token) => {
  try {
    const res = await axios.post(`${API_BASE}/notes/${id}/favorite`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    })

    return(res.data)
  } catch (error) {
    console.error("Error in favoriteNoteApi:", error)
  }
}

export const unFavoriteNoteApi = async (id, token) => {
  try {
    const res = await axios.delete(`${API_BASE}/notes/${id}/favorite`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    })

    return(res.data)
  } catch (error) {
    console.error("Error in unFavoriteNoteApi:", error)
  }
}

export const getReviewApi = async (id, token) => {
  try {
    const res = await axios.delete(`${API_BASE}/notes/${id}/reviews`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    })

    return(res.data)
  } catch (error) {
    console.error("Error in getReviewApi:", error)
  }
}