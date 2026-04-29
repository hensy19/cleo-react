import { clearUserData, clearAdminData } from './helpers';

/**
 * Centralized API utility for handling backend requests
 */

const BASE_URL = 'http://localhost:5000/api';

/**
 * Custom fetch wrapper with error handling
 */
const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Select appropriate token based on endpoint
  let token;
  if (endpoint.startsWith('/admin')) {
    token = localStorage.getItem('adminToken');
  } else {
    token = localStorage.getItem('authToken');
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearUserData();
        clearAdminData();
        window.location.href = '/login';
      }
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
};

export const api = {
  signup: (userData) => request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  googleLogin: (idToken) => request('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ idToken }),
  }),

  // Admin Auth
  adminLogin: (credentials) => request('/admin/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  // User Profile
  getProfile: () => request('/users/profile'),
  updateProfile: (profileData) => request('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),

  // Health Goals
  getGoals: () => request('/goals'),
  saveGoal: (goalData) => request('/goals', {
    method: 'POST',
    body: JSON.stringify(goalData),
  }),
  updateGoalProgress: (goalName, data) => request(`/goals/${goalName}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteGoal: (goalName) => request(`/goals/${goalName}`, {
    method: 'DELETE',
  }),
  resetGoals: () => request('/goals/reset', {
    method: 'POST',
  }),

  // Reminders
  getReminders: () => request('/reminders'),
  updateReminders: (reminderData) => request('/reminders', {
    method: 'PUT',
    body: JSON.stringify(reminderData),
  }),

  // Notes
  getNotes: () => request('/notes'),
  createNote: (noteData) => request('/notes', {
    method: 'POST',
    body: JSON.stringify(noteData),
  }),
  deleteNote: (id) => request(`/notes/${id}`, {
    method: 'DELETE',
  }),
  updateNote: (id, noteData) => request(`/notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(noteData),
  }),

  // Moods
  getMoods: () => request('/moods'),
  logMood: (moodData) => request('/moods', {
    method: 'POST',
    body: JSON.stringify(moodData),
  }),

  // Symptoms
  getSymptoms: () => request('/symptoms'),
  logSymptoms: (symptomData) => request('/symptoms', {
    method: 'POST',
    body: JSON.stringify(symptomData),
  }),

  // Periods
  getPeriods: () => request('/periods'),
  logPeriod: (periodData) => request('/periods', {
    method: 'POST',
    body: JSON.stringify(periodData),
  }),
  updatePeriod: (id, periodData) => request(`/periods/${id}`, {
    method: 'PUT',
    body: JSON.stringify(periodData),
  }),
  deletePeriod: (id) => request(`/periods/${id}`, {
    method: 'DELETE',
  }),
  getTipRecommendation: () => request('/tips/recommendation'),
  getAllTips: () => request('/tips'),

  // Admin Endpoints
  getAdminStats: () => request('/admin/stats'),
  getAdminActivity: () => request('/admin/activity'),
  getAdminActiveUsers: () => request('/admin/active-users'),
  getAdminUsers: () => request('/admin/users'),
  updateAdminUserStatus: (id, status) => request(`/admin/users/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
  deleteAdminUser: (id) => request(`/admin/users/${id}`, {
    method: 'DELETE',
  }),
  getAdminTips: () => request('/admin/tips'),
  createAdminTip: (tipData) => request('/admin/tips', {
    method: 'POST',
    body: JSON.stringify(tipData),
  }),
  updateAdminTip: (id, tipData) => request(`/admin/tips/${id}`, {
    method: 'PUT',
    body: JSON.stringify(tipData),
  }),
  deleteAdminTip: (id) => request(`/admin/tips/${id}`, {
    method: 'DELETE',
  }),
  updateAdminTipStatus: (id, status) => request(`/admin/tips/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),

  // Admin Settings
  getAdminSettings: () => request('/admin/settings'),
  updateAdminSettings: (data) => request('/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  uploadAdminLogo: (formData) => {
    const token = localStorage.getItem('adminToken');
    return fetch(`${BASE_URL}/admin/settings/logo`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData, // FormData - browser sets Content-Type automatically
    }).then(async (res) => {
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('adminToken');
          window.location.href = '/login';
        }
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message || 'Upload failed');
      }
      return res.json();
    });
  },

  completeOnboarding: (data) => request('/users/onboarding', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

};
