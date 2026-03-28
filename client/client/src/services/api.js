import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_URL   // Production (Render)
    : "http://localhost:5000/api";  // Local

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);


export const authAPI = {
  signup: (data) => API.post("/auth/signup", data),
  login: (data) => API.post("/auth/login", data),
  me: () => API.get("/auth/me"),
  logout: () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  },
};

export const walletAPI = {
  deposit: (amount) => API.post("/wallet/deposit", { amount }),
  withdraw: (amount)=> API.post("/wallet/withdraw", {amount})
};

export const gameAPI = {
  create: (betAmount) => API.post("/game", { betAmount }),
  current: () => API.get("/game/current"),
  match: (gameId, cardId1, cardId2) =>
    API.put(`/game/${gameId}/match`, { cardId1, cardId2 }),
};

export const adminAPI = {
  users: () => API.get("/admin/users"),
  stats: () => API.get("/admin/stats"),
  updateBalance: (userId, balance) =>
    API.put(`/admin/users/${userId}/balance`, { balance }),
};

export default API;