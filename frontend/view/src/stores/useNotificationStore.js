import { create } from "zustand";

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  loading: false,
  getNotifications: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/notification/getNotifications");

      set({
        notifications: Array.isArray(res.data.notifications)
          ? res.data.notifications
          : [],
      });
    } catch (error) {
      console.log("error fetching notifications", error.response?.data);
    } finally {
      set({ loading: false });
    }
  },
}));
