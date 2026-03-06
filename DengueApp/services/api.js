import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.132.146:5000';  // Node backend
const ML_BASE_URL  = 'http://192.168.132.146:5001';  // ML backend

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (e) {}
  return config;
});

// AUTH
export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (name, email, password, district) => {
  const response = await api.post('/auth/register', { name, email, password, district });
  return response.data;
};

// HEATMAP — from ML server (real predictions!)
export const getHeatmapData = async () => {
  const response = await axios.get(`${ML_BASE_URL}/predict/all`);
  return response.data;
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