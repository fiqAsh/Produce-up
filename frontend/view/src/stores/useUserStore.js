import { create } from "zustand";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

export const useUserStore = create((set, get) => ({
  user: null,
  markets: [],
  nearestMarkets: [],
  selectedMarket: null,
  loading: false,
  error: null,
  successMessage: null,

  updateUser: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.patch("/user/updateUser", data);
      set({ user: res.data.user, successMessage: res.data.message });
    } catch (err) {
      set({ error: err.response?.data?.message || "Update failed" });
    } finally {
      set({ loading: false });
    }
  },

  fetchNearestMarkets: async (latitude, longitude) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get("/user/getNearestMarkets", {
        params: { latitude, longitude },
      });
      set({ nearestMarkets: res.data.markets });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to fetch markets" });
    } finally {
      set({ loading: false });
    }
  },

  fetchSingleMarket: async (marketid) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(`/user/getSingleMarket/${marketid}`);
      set({ selectedMarket: res.data.market });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to fetch market" });
    } finally {
      set({ loading: false });
    }
  },

  fetchAllMarkets: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get("/user/getAllMarkets");
      set({ markets: res.data.markets });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to get markets" });
    } finally {
      set({ loading: false });
    }
  },

  applyForManager: async (marketId) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post("/user/applyForManager", {
        marketId,
      });
      set({ successMessage: res.data.message });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Manager application failed",
      });
    } finally {
      set({ loading: false });
    }
  },

  applyForDeliveryman: async (marketId) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post("/user/applyForDeliveryman", {
        marketId,
      });
      set({ successMessage: res.data.message });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Deliveryman application failed",
      });
    } finally {
      set({ loading: false });
    }
  },

  clearMessages: () => set({ error: null, successMessage: null }),
}));
