import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URI + "/api"
});

// Auto-attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // GET TOKEN DIRECTLY
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle 401 errors - auto logout
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;