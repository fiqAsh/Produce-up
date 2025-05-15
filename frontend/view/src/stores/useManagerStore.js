import { create } from "zustand";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

export const useManagerStore = create((set) => ({
  loading: false,
  successMessage: null,
  error: null,
  deliverymanRequests: [],

  updatePriceAndQuantity: async ({ marketId, produceId, price, quantity }) => {
    set({ loading: true, successMessage: null, error: null });
    try {
      const response = await axiosInstance.patch(
        "/manager/updateProducePrice",
        {
          marketId,
          produceId,
          price,
          quantity,
        }
      );

      set({ successMessage: response.data.message, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update produce info",
        loading: false,
      });
    }
  },

  handleDeliveryRequest: async (requestId, action) => {
    set({ loading: true, successMessage: null, error: null });
    try {
      const response = await axiosInstance.patch(
        `/manager/deliveryman-requests/${requestId}`,
        { action }
      );

      set({ successMessage: response.data.message, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to handle request",
        loading: false,
      });
    }
  },
  fetchdeliverymanrequests: async () => {
    set({ loading: true, successMessage: null, error: null });
    try {
      const response = await axiosInstance.get(
        "/manager/getDeliverymanRequests"
      );
      set({ deliverymanRequests: response.data.requests, loading: false });
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to fetch deliveryman requests",
        loading: false,
      });
    }
  },

  clearMessages: () => set({ successMessage: null, error: null }),
}));
