import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../config';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = axios.create({ baseURL: API_URL });
  api.interceptors.request.use(async (cfg) => {
    const t = await AsyncStorage.getItem('kdrama_token');
    if (t) cfg.headers.Authorization = 'Bearer ' + t;
    return cfg;
  });

  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem('kdrama_token');
      if (t) {
        try {
          const r = await api.get('/auth/me');
          setUser(r.data.user);
        } catch { await AsyncStorage.removeItem('kdrama_token'); }
      }
      setLoading(false);
    })();
  }, []);

  const login = async (email, password) => {
    const r = await api.post('/auth/login', { email, password });
    await AsyncStorage.setItem('kdrama_token', r.data.token);
    setUser(r.data.user); return r.data.user;
  };

  const register = async (name, email, password) => {
    const r = await api.post('/auth/register', { name, email, password });
    await AsyncStorage.setItem('kdrama_token', r.data.token);
    setUser(r.data.user); return r.data.user;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('kdrama_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, loading, api, login, register, logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
