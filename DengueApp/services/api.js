import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, ML_BASE_URL, WEB_BACKEND_URL } from '../constants/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// WEB BACKEND STATS
export const getDashboardStats = async () => {
  const response = await axios.get(`${WEB_BACKEND_URL}/api/heatmap/dashboard-stats`);
  return response.data;
};

api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (e) { }
  return config;
});

// AUTH
export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (name, email, password, district, role = 'public') => {
  const response = await api.post('/auth/register', { name, email, password, district, role });
  return response.data;
};

// HEATMAP — from Web Backend (merges real data + predictions)
export const getHeatmapData = async () => {
  const response = await axios.get(`${WEB_BACKEND_URL}/api/heatmap`);
  const { points } = response.data.data;

  // map mosquito-backend points to mobile app format
  return points.map(p => ({
    district: p.district,
    cases: p.displayCases, // use displayCases (real or gap-fill)
    risk: p.effectiveRisk.charAt(0).toUpperCase() + p.effectiveRisk.slice(1), // format to "High", "Medium", "Low"
    latitude: p.lat,
    longitude: p.lng,
    predictedNextWeek: Math.round(p.predictedCases),
    trend: p.predictedCases > p.currentCases ? '↑' : p.predictedCases < p.currentCases ? '↓' : '→',
    rainfall: "120mm", // placeholders for now as mosquito-backend doesn't store weather in points
    temp: "29°C"
  }));
};

// ALERTS — from Node backend
export const getAlerts = async () => {
  const response = await api.get('/api/alerts');
  return response.data;
};

// PREDICTIONS — from ML server
export const getPredictions = async () => {
  const response = await axios.get(`${ML_BASE_URL}/predict/all`);
  return response.data;
};

// SINGLE DISTRICT
export const getDistrictPrediction = async (district) => {
  const response = await axios.get(`${ML_BASE_URL}/predict/${district}`);
  return response.data;
};

export const sendChatMessage = async (message) => {
  const response = await api.post('/api/chatbot', { message });
  return response.data;
};

// --- NEW REALISTIC UPLOAD METHODS ---
export const getFacilities = async (district) => {
  const response = await axios.get(`${WEB_BACKEND_URL}/api/hospitals?district=${district}`);
  return response.data;
};

export const submitCaseReport = async (reportData) => {
  const response = await axios.post(`${WEB_BACKEND_URL}/api/case-reports`, reportData);
  return response.data;
};

export const uploadCaseData = async (district, cases) => {
  const response = await api.post('/api/update-cases', { district, cases });
  return response.data;
};