import { create } from "zustand";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

const useDeliverymanStore = create((set, get) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get("/deliveryman/getDeliverymanOrders");
      set({ orders: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch orders",
        loading: false,
      });
    }
  },

  markAsDelivered: async (orderId) => {
    try {
      await axiosInstance.patch(`/deliveryman/markOrderDelivered/${orderId}`);
      // Update order status locally
      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === orderId ? { ...order, isDelivered: true } : order
        ),
      }));
    } catch (err) {
      console.error("Mark delivered failed:", err);
      set({
        error: err.response?.data?.message || "Failed to mark as delivered",
      });
    }
  },
}));

export default useDeliverymanStore;
