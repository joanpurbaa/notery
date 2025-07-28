import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE

export const getProfilApi = async (token) => {
  const res = await axios.get(`${API_BASE}/profile`, {
    headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
  })

  return res.data
}

export const getNoteByProfilApi = async (token) => {
  const res = await axios.get(`${API_BASE}/profile/notes`, {
    headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
  })

  return res.data
}

export const getNoteStatusApi = async (token) => {
  const res = await axios.get(`${API_BASE}/profile/product-status`, {
    headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
  })

  return res.data
}

export const getFavoriteCourseApi = async (token) => {
  const res = await axios.get(`${API_BASE}/favorite-courses`, {
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
  })

  return res.data
}

export const editAcademicApi = async (token, data) => {
	try {
		const response = await fetch('http://localhost:8000/api/profile/academic', {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
		}

		const result = await response.json();
		return result;
	} catch (error) {
		console.error('API Error:', error);
		throw error;
	}
};

export const addFavoriteCourseApi = async (token, data) => {
	try {
		const response = await fetch('http://localhost:8000/api/favorite-courses', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
		}

		const result = await response.json();
		return result;
	} catch (error) {
		console.error('API Error:', error);
		throw error;
	}
};

export const deleteFavoriteCourseApi = async (token, id) => {
  const res = await axios.delete(`${API_BASE}/favorite-courses/${id}`, {
    headers: {
			Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    }
  })

  return res;
}

export const getTransactionsHistoryApi = async (token) => {
  const res = await axios.get(`${API_BASE}/profile/transactions`, {
    headers: {
			Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    }
  })

  return res;
}