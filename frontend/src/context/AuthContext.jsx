import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import axios from 'axios';

const AuthContext = createContext();

// API instance
export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');

        setUser(res.data.user);
      } catch (error) {
        console.error(error);

        localStorage.removeItem('token');

        setUser(null);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', {
        email,
        password,
      });

      localStorage.setItem(
        'token',
        res.data.token
      );

      setUser(res.data.user);

      return res.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          'Login failed'
      );
    }
  };

  const register = async (
    email,
    password
  ) => {
    try {
      const res = await api.post(
        '/auth/register',
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        'token',
        res.data.token
      );

      setUser(res.data.user);

      return res.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          'Registration failed'
      );
    }
  };

  const logout = () => {
    localStorage.removeItem('token');

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};