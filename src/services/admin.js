import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE

export const getAllReportApi = async (token) => {
  const res = await axios.get(`${API_BASE}/admin/reports`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  })

  return res.data
}

export const notesSubmissionApi = async (token) => {
  const res = await axios.get(`${API_BASE}/admin/notes-submission`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  })

  return res.data
}

export const addNotesSubmissionToQueueApi = async (id, token) => {
  const res = await axios.post(`${API_BASE}/admin/notes-submission/${id}/queue`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  })

  return res.data
}

export const getNotesSubmissionQueueApi = async (token) => {
  const res = await axios.get(`${API_BASE}/admin/notes-submission/queue`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  })

  return res.data
}

export const getDetailAnalysisResultApi = async (id, token) => {
  const res = await axios.get(`${API_BASE}/admin/notes-submission/${id}/queue`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  })

  return res.data
}

export const handleQueueSubmissionApi = async (id, formData, token) => {
  const res = await axios.post(`${API_BASE}/admin/notes-submission/${id}/handle`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  })

  return res.data
}

export const approvedNoteApi = async (token) => {
  const res = await axios.get(`${API_BASE}/admin/notes-submission/handled`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  })

  return res.data
}

export const getAllUsersApi = async (token, searchParams = {}) => {
  const { search = '', page = 1, size = 15 } = searchParams;
  
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('size', size);
  if (search) {
    params.append('search', search);
  }

  const res = await axios.get(`${API_BASE}/admin/users?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
  });

  return res.data;
};

export const sendWarningToUserApi = async (userId, warningMessage, token) => {
  const formData = new FormData();
  formData.append('body', warningMessage);

  const res = await axios.post(`${API_BASE}/admin/notifications/users/${userId}/warnings`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    }
  });

  return res.data;
}

export const closeAccessApi = async (id, token) => {
  const res = await axios.patch(`${API_BASE}/admin/users/${id}/ban`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  })

  window.location.href = '/reported'

  return res.data
}

export const openAccessApi = async (id, token) => {
  const res = await axios.patch(`${API_BASE}/admin/users/${id}/unban`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  })

  window.location.href = '/reported'

  return res.data
}

export const createAnnouncementApi = async (announcementData, token) => {
  const formData = new FormData();
  
  formData.append('title', announcementData.title);
  formData.append('body', announcementData.body);

  const res = await axios.post(`${API_BASE}/admin/notifications/announcements`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    }
  });

  return res.data;
};