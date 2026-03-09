import Constants from 'expo-constants';

// --- 🤖 AUTO-DETECT HOST IP ----------------------------------------------------
// This extracts the IP address from the Expo packager URL automatically.
const getHostAddress = () => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    return hostUri.split(':')[0]; // Get IP part, ignore port
  }
  return '172.17.131.146'; // Fallback to last known working IP
};

export const HOST = getHostAddress();
// ------------------------------------------------------------------------------

export const API_BASE_URL = `http://${HOST}:5000`;  // Node.js backend (mobile)
export const WEB_BACKEND_URL = `http://${HOST}:5002`; // Node.js backend (web)
export const ML_BASE_URL = `http://${HOST}:5001`;  // Python ML backend

export const ENDPOINTS = {
  login: '/auth/login',
  register: '/auth/register',
  heatmap: '/api/heatmap',
  predictions: '/api/predictions',
  alerts: '/api/alerts',
  awareness: '/api/awareness',
  chatbot: '/api/chatbot',
};