import { create } from "zustand";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

export const useAdminStore = create((set, get) => ({
  markets: [],
  managerRequests: [],
  loading: false,
  successMessage: null,
  error: null,

  // Clear messages
  clearMessages: () => set({ successMessage: null, error: null }),

  // Create market
  createMarket: async (marketData) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post("/admin/createMarket", marketData);
      set((state) => ({
        markets: [...state.markets, res.data.market],
        successMessage: res.data.message,
        error: null,
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to create market" });
    } finally {
      set({ loading: false });
    }
  },

  // Update market
  updateMarket: async (updateData) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.patch("/admin/updateMarket", updateData);
      set((state) => ({
        markets: state.markets.map((market) =>
          market._id === res.data.market._id ? res.data.market : market
        ),
        successMessage: res.data.message,
        error: null,
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to update market" });
    } finally {
      set({ loading: false });
    }
  },

  // Delete market
  deleteMarket: async (marketId) => {
    try {
      set({ loading: true });
      await axiosInstance.delete("/admin/deleteMarket", {
        data: { marketId },
      });
      set((state) => ({
        markets: state.markets.filter((market) => market._id !== marketId),
        successMessage: "Market deleted successfully",
        error: null,
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to delete market" });
    } finally {
      set({ loading: false });
    }
  },

  // Handle manager request
  handleManagerRequest: async (requestId, action) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.patch(
        `/admin/manager-requests/${requestId}`,
        { action }
      );
      set((state) => ({
        managerRequests: state.managerRequests.map((req) =>
          req._id === requestId ? { ...req, status: action } : req
        ),
        successMessage: res.data.message,
        error: null,
      }));
    } catch (err) {
      set({
        error:
          err.response?.data?.message || "Failed to handle manager request",
      });
    } finally {
      set({ loading: false });
    }
  },

  // Optionally fetch manager requests (if needed)
  fetchManagerRequests: async () => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get("/admin/getAllManagerRequests");
      set({ managerRequests: res.data.requests, error: null });
    } catch (err) {
      set({
        error:
          err.response?.data?.message || "Failed to fetch manager requests",
      });
    } finally {
      set({ loading: false });
    }
  },
}));
