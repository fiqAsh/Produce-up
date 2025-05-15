import { create } from "zustand";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

const useDeliveryOrderStore = create((set) => ({
  deliveryEstimate: null,
  deliveryOrder: null,
  loading: false,
  error: null,

  getEstimate: async ({ marketFromId, marketToId, items }) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post("/delivery/getDeliveryEstimate", {
        marketFromId,
        marketToId,
        items,
      });
      set({ deliveryEstimate: res.data, loading: false });
    } catch (err) {
      console.error("Estimate Error:", err);
      set({
        error: err.response?.data?.message || "Failed to get estimate",
        loading: false,
      });
    }
  },

  createOrder: async ({
    marketFromId,
    marketToId,
    items,
    deliverymanId,
    managerid,
  }) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post("/delivery/createDeliveryOrder", {
        marketFromId,
        marketToId,
        items,
        deliverymanId,
        managerid,
      });
      set({ deliveryOrder: res.data.newOrder, loading: false });
    } catch (err) {
      console.error("Order Creation Error:", err);
      set({
        error: err.response?.data?.message || "Failed to create order",
        loading: false,
      });
    }
  },

  clearDeliveryState: () =>
    set({ deliveryEstimate: null, deliveryOrder: null, error: null }),
}));

export default useDeliveryOrderStore;
