import { create } from "zustand";

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

const refreshAccessToken = async () => {
  try {
    const res = await axiosInstance.post("/auth/refreshAccessToken");

    const newAccessToken = res.data.accessToken;

    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${newAccessToken}`;

    return newAccessToken;
  } catch (error) {
    console.log("refresh Token failed", error.response?.data);
    return null;
  }
};

export const useAuthStore = create((set, get) => ({
  user: null,
  checkingAuth: true,
  loading: false,

  signup: async (formData) => {
    try {
      const res = await axiosInstance.post("/auth/signup", formData);
      set({ user: res.data });
      return res;
    } catch (error) {
      console.log("signup failed", error.response?.data);
    }
  },

  login: async (formData) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      set({ user: res.data.user });
      console.log(res.data.user.role);
      return res;
    } catch (error) {
      console.log("login failed", error.response?.data);
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await axiosInstance.post("/auth/logout");
      set({ user: null });
    } catch (error) {
      console.log("logout failed", error.response?.data);
    } finally {
      set({ loading: false });
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });

    try {
      const res = await axiosInstance.get("/auth/getUserProfile");
      set({ user: res.data, checkingAuth: false });
    } catch (error) {
      if (error.response?.status === 401) {
        const newAccessToken = await refreshAccessToken();

        if (newAccessToken) {
          try {
            const res = await axiosInstance.get("/auth/getUserProfile");
            set({ user: res.data, checkingAuth: false });
            return;
          } catch (error) {
            console.log(
              "Failed to get profile after refresh",
              error.response?.data
            );
          }
        }
      }

      set({ user: null, checkingAuth: false });
      window.location.href = "/"; // Redirect to login if unauthorized
    }
  },
}));
