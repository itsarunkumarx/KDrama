import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const api = axios.create({ baseURL: "/api" });
api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("kdrama_token");
  if (t) cfg.headers.Authorization = "Bearer " + t;
  return cfg;
});
api.interceptors.response.use(
  (r) => r,
  (err) => {
    // If we receive a 401, simply ignore for now, instead of redirecting so we can view the main page
    if (err.response?.status === 401) {
      console.warn("401 Unauthorized encountered, ignoring for guest view...");
    }
    return Promise.reject(err);
  },
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    _id: "guest123",
    name: "Guest User",
    email: "guest@kdrama.local",
    role: "guest",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Override authentication - always signed in as guest by default for now
    const token = localStorage.getItem("kdrama_token");
    if (token) {
      api
        .get("/auth/me")
        .then((r) => setUser(r.data.user))
        .catch(() => {
          // Keep guest user on failure, don't remove token for now
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const r = await api.post("/auth/login", { email, password });
    localStorage.setItem("kdrama_token", r.data.token);
    setUser(r.data.user);
    return r.data.user;
  };
  const register = async (name, email, password) => {
    const r = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("kdrama_token", r.data.token);
    setUser(r.data.user);
    return r.data.user;
  };

  const logout = () => {
    localStorage.removeItem("kdrama_token");
    setUser(null);
  };

  const loginWithToken = (user) => {
    setUser(user);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, loginWithToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
