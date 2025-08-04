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

export const deleteNoteApi = async (id, token) => {
  try {
    const res = await axios.delete(`${API_BASE}/notes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    })

    return res.data
  } catch (error) {
    console.error("Error in deleteNoteApi:", error);
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

export const searchNoteApi = async (token, key) => {
  try {
    const res = await axios.get(`${API_BASE}/notes?search=${key}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })

    return(res.data)
  } catch (error) {
    console.error("Error in searchNoteApi:", error)
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
    const res = await axios.post(`${API_BASE}/notes/${id}/like`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })

    return res.data
  } catch (error) {
    console.error("Error in likeNoteApi:", error)
    throw error
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

    return res.data
  } catch (error) {
    console.error("Error in unLikeNoteApi:", error)
    throw error
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
    const res = await axios.post(`${API_BASE}/notes/${id}/favorite`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json"
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
    const res = await axios.get(`${API_BASE}/notes/${id}/reviews`, {
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

export const addReviewApi = async (formData, id, token) => {
  try {
    const res = await axios.post(`${API_BASE}/notes/${id}/reviews`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    })

    return(res.data)
  } catch (error) {
    console.error("Error in addReviewApi:", error)
  }
}

export const voteReviewApi = async (id, token, formData) => {
  try {
    const res = await axios.post(`${API_BASE}/reviews/${id}/vote`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    })

    return(res.data)
  } catch (error) {
    console.error("Error in voteReviewApi:", error)
  }
}

export const buyNoteApi = async (id, token) => {
  const res = await axios.post(`${API_BASE}/notes/${id}/buy`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    }
  })

  return(res.data)
}

export const updatePaymentStatusApi = async (paymentData, token) => {
    try {
        const response = await fetch(`${API_BASE}/payment/manual-update`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(paymentData)
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating payment status:', error);
        throw error;
    }
};

export const getTransactionStatusApi = async (transactionId, token) => {
    try {
        const response = await fetch(`${API_BASE}/payment/status/${transactionId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error getting transaction status:', error);
        throw error;
    }
};

export const getPurchaseHistoryApi = async (token) => {
    try {
        const response = await fetch(`${API_BASE}/user/purchases`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error getting purchase history:', error);
        throw error;
    }
};

// Get chat room messages
export const createOrGetChatRoomApi = async (noteId, token) => {
  try {
    const res = await axios.post(`${API_BASE}/notes/${noteId}/chat`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })

    return res.data
  } catch (error) {
    console.error("Error in createOrGetChatRoomApi:", error)
    throw error
  }
}

// Get chat room messages (sesuai dokumentasi: GET /api/chat-rooms/{chat_room_id}/messages)
export const getChatRoomMessagesApi = async (chatRoomId, token) => {
  try {
    const res = await axios.get(`${API_BASE}/chat-rooms/${chatRoomId}/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })

    return res.data
  } catch (error) {
    console.error("Error in getChatRoomMessagesApi:", error)
    throw error
  }
}

// Send message to chat room (sesuai dokumentasi: POST /api/chat-rooms/{chat_room_id}/messages)
export const sendChatMessageApi = async (chatRoomId, message, token) => {
  try {
    const res = await axios.post(`${API_BASE}/chat-rooms/${chatRoomId}/messages`, {
      pesan: message
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })

    return res.data
  } catch (error) {
    console.error("Error in sendChatMessageApi:", error)
    throw error
  }
}

export const getNoteFileApi = async (id, token) => {
  try {
    const res = await axios.get(`${API_BASE}/notes/${id}/files`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })

    return res.data
  } catch (error) {
    console.error("Error in getNoteFileApi:", error)
    throw error
  }
}