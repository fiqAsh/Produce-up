import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Import the controller functions
import {
  applyForManager,
  applyForDeliveryman,
} from "../controllers/user.controller.js";

// Mock dependencies
import Market from "../models/market.model.js";
import ManagerRequest from "../models/manager.request.model.js";
import DeliveryManRequest from "../models/delivery.request.model.js";
import {
  sendDeliveryManApplicationNotification,
  sendManagerApplicationNotification,
} from "../controllers/notification.controller.js";

// Mock the models and functions
vi.mock("../models/market.model.js");
vi.mock("../models/manager.request.model.js");
vi.mock("../models/delivery.request.model.js");
vi.mock("../controllers/notification.controller.js");

describe("Application Controllers", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: "user123" },
      body: { marketId: "market123" },
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    // Clear mocks before each test
    vi.clearAllMocks();
  });

  describe("applyForManager", () => {
    it("should return 404 if market not found", async () => {
      Market.findById.mockResolvedValue(null);

      await applyForManager(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Market not found" });
    });

    it("should return 400 if pending request already exists", async () => {
      Market.findById.mockResolvedValue({ id: "market123" });
      ManagerRequest.findOne.mockResolvedValue({ id: "existingRequest" });

      await applyForManager(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "You have already applied for this market",
      });
    });

    it("should create a new manager request and send notification", async () => {
      const mockMarket = { id: "market123", name: "Test Market" };
      const mockNewRequest = { id: "newRequest" };

      Market.findById.mockResolvedValue(mockMarket);
      ManagerRequest.findOne.mockResolvedValue(null);
      ManagerRequest.create.mockResolvedValue(mockNewRequest);
      sendManagerApplicationNotification.mockResolvedValue();

      await applyForManager(req, res);

      expect(ManagerRequest.create).toHaveBeenCalledWith({
        user: "user123",
        market: "market123",
      });
      expect(sendManagerApplicationNotification).toHaveBeenCalledWith(
        "user123",
        mockMarket
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Request sent successfully",
        request: mockNewRequest,
      });
    });

    it("should handle errors and return 500", async () => {
      Market.findById.mockRejectedValue(new Error("DB error"));

      await applyForManager(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to apply for manager",
        error: "DB error",
      });
    });
  });

  describe("applyForDeliveryman", () => {
    it("should return 400 if pending deliveryman request exists", async () => {
      const mockMarket = { id: "market123", manager: "managerId" };

      Market.findById.mockResolvedValue(mockMarket);
      DeliveryManRequest.findOne.mockResolvedValue({ id: "existingRequest" });

      await applyForDeliveryman(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "You have already applied for this market",
      });
    });

    it("should create a new deliveryman request and send notification", async () => {
      const mockMarket = { id: "market123", manager: "managerId" };
      const mockNewRequest = { id: "newRequest" };

      Market.findById.mockResolvedValue(mockMarket);
      DeliveryManRequest.findOne.mockResolvedValue(null);
      DeliveryManRequest.create.mockResolvedValue(mockNewRequest);
      sendDeliveryManApplicationNotification.mockResolvedValue();

      await applyForDeliveryman(req, res);

      expect(DeliveryManRequest.create).toHaveBeenCalledWith({
        user: "user123",
        market: "market123",
      });
      expect(sendDeliveryManApplicationNotification).toHaveBeenCalledWith(
        "user123",
        mockMarket,
        "managerId"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Request sent successfully",
        request: mockNewRequest,
      });
    });

    it("should handle errors and return 500", async () => {
      Market.findById.mockRejectedValue(new Error("DB error"));

      await applyForDeliveryman(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to apply for delivery man",
        error: "DB error",
      });
    });
  });
});
