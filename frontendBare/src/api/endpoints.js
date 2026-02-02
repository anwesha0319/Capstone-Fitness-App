import apiClient from './client';

export const authAPI = {
  signup: (userData) => apiClient.post('/auth/signup/', userData),
  login: (credentials) => apiClient.post('/auth/login/', credentials),
  getProfile: () => apiClient.get('/auth/profile/'),
  updateProfile: (data) => apiClient.patch('/auth/profile/', data),
};

export const healthAPI = {
  getHealthData: (days = 7) => apiClient.get(`/health/health-data/?days=${days}`),
  syncHealthData: (data) => apiClient.post('/health/sync/', data),
  getAnalytics: (days = 7) => apiClient.get(`/health/analytics/?days=${days}`),
  addWorkout: (workoutData) => apiClient.post('/health/workouts/', workoutData),
  getWorkouts: () => apiClient.get('/health/workouts/'),
  addSleepData: (sleepData) => apiClient.post('/health/sleep/', sleepData),
  addHeartRate: (heartRateData) => apiClient.post('/health/heart-rate/', heartRateData),
};

export const dietAPI = {
  getDiets: () => apiClient.get('/health/diet/'),
  createDiet: (data) => apiClient.post('/health/diet/', data),
  updateDiet: (id, data) => apiClient.patch(`/health/diet/${id}/`, data),
  deleteDiet: (id) => apiClient.delete(`/health/diet/${id}/`),
  getDiet: (id) => apiClient.get(`/health/diet/${id}/`),
};

export const marathonAPI = {
  getMarathons: () => apiClient.get('/health/marathon/'),
  createMarathon: (data) => apiClient.post('/health/marathon/', data),
  updateMarathon: (id, data) => apiClient.patch(`/health/marathon/${id}/`, data),
  deleteMarathon: (id) => apiClient.delete(`/health/marathon/${id}/`),
  getMarathon: (id) => apiClient.get(`/health/marathon/${id}/`),
};

export const workoutAPI = {
  getWorkouts: () => apiClient.get('/health/workout/'),
  createWorkout: (data) => apiClient.post('/health/workout/', data),
  updateWorkout: (id, data) => apiClient.patch(`/health/workout/${id}/`, data),
  deleteWorkout: (id) => apiClient.delete(`/health/workout/${id}/`),
  getWorkout: (id) => apiClient.get(`/health/workout/${id}/`),
};