import { describe, it, expect, vi, afterEach } from "vitest";
import httpMocks from "node-mocks-http";

import * as managerController from "../controllers/manager.controller.js";

import Market from "../models/market.model.js";
import Produce from "../models/produce.model.js";
import DeliveryManRequest from "../models/delivery.request.model.js";
import User from "../models/user.model.js"; // Assuming this exists for User.findByIdAndUpdate

vi.mock("../models/market.model.js");
vi.mock("../models/produce.model.js");
vi.mock("../models/delivery.request.model.js");
vi.mock("../models/user.model.js");

// Mock notification functions to skip in tests
vi.mock("../controllers/notification.controller.js", () => ({
  sendPriceDropNotification: vi.fn(),
  sendUserRoleNotification: vi.fn(),
}));

describe("manager.controller", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("updateProducePriceQuantity", () => {
    it("returns 404 if market not found", async () => {
      Market.findById.mockResolvedValue(null);

      const req = httpMocks.createRequest({
        body: { marketId: "m1", produceId: "p1", price: 100 },
        user: { _id: "user1" },
      });
      const res = httpMocks.createResponse();

      await managerController.updateProducePriceQuantity(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toMatchObject({ message: "Market not found" });
    });

    it("returns 403 if user is not market manager", async () => {
      Market.findById.mockResolvedValue({ manager: "otherUserId" });

      const req = httpMocks.createRequest({
        body: { marketId: "m1", produceId: "p1", price: 100 },
        user: { _id: "user1" },
      });
      const res = httpMocks.createResponse();

      await managerController.updateProducePriceQuantity(req, res);

      expect(res.statusCode).toBe(403);
      expect(res._getJSONData()).toMatchObject({ message: "Unauthorized" });
    });

    it("returns 404 if produce not found in master list", async () => {
      Market.findById.mockResolvedValue({
        manager: "user1",
        producePrices: [{ produce: "p1", price: 150, quantity: 10 }],
        save: vi.fn().mockResolvedValue(),
      });
      Produce.findById.mockResolvedValue(null);

      const req = httpMocks.createRequest({
        body: { marketId: "m1", produceId: "p2", price: 100 },
        user: { _id: "user1" },
      });
      const res = httpMocks.createResponse();

      await managerController.updateProducePriceQuantity(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toMatchObject({
        message: "Produce not found in master list",
      });
    });

    it("returns 400 if produce not listed in market", async () => {
      Market.findById.mockResolvedValue({
        manager: "user1",
        producePrices: [{ produce: "p1", price: 150, quantity: 10 }],
        save: vi.fn().mockResolvedValue(),
      });
      Produce.findById.mockResolvedValue({ name: "Apple" });

      const req = httpMocks.createRequest({
        body: { marketId: "m1", produceId: "p2", price: 100 },
        user: { _id: "user1" },
      });
      const res = httpMocks.createResponse();

      await managerController.updateProducePriceQuantity(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toMatchObject({
        message:
          "This produce is not already listed in the market. New additions are not allowed.",
      });
    });

    it("updates price and quantity successfully", async () => {
      const mockSave = vi.fn().mockResolvedValue();
      Market.findById.mockResolvedValue({
        manager: "user1",
        producePrices: [{ produce: "p1", price: 150, quantity: 10 }],
        save: mockSave,
      });
      Produce.findById.mockResolvedValue({ name: "Apple" });

      const req = httpMocks.createRequest({
        body: { marketId: "m1", produceId: "p1", price: 100, quantity: 5 },
        user: { _id: "user1" },
      });
      const res = httpMocks.createResponse();

      await managerController.updateProducePriceQuantity(req, res);

      expect(mockSave).toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().message).toBe("Price updated successfully");
      expect(res._getJSONData().market.producePrices[0].price).toBe(100);
      expect(res._getJSONData().market.producePrices[0].quantity).toBe(5);
    });
  });

  describe("handleDeliveryManRequest", () => {
    it("returns 404 if request not found", async () => {
      DeliveryManRequest.findById.mockResolvedValue(null);

      const req = httpMocks.createRequest({
        params: { requestId: "req1" },
        body: { action: "approve" },
      });
      const res = httpMocks.createResponse();

      await managerController.handleDeliveryManRequest(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toMatchObject({
        message: "deliveryman request not found",
      });
    });

    it("returns 400 if request already handled", async () => {
      DeliveryManRequest.findById.mockResolvedValue({ status: "approved" });

      const req = httpMocks.createRequest({
        params: { requestId: "req1" },
        body: { action: "approve" },
      });
      const res = httpMocks.createResponse();

      await managerController.handleDeliveryManRequest(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toMatchObject({
        message: "This request has already been handled",
      });
    });

    it("returns 400 if invalid action", async () => {
      DeliveryManRequest.findById.mockResolvedValue({
        status: "pending",
        save: vi.fn().mockResolvedValue(),
      });

      const req = httpMocks.createRequest({
        params: { requestId: "req1" },
        body: { action: "invalid" },
      });
      const res = httpMocks.createResponse();

      await managerController.handleDeliveryManRequest(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toMatchObject({ message: "Invalid action" });
    });

    it("rejects request successfully", async () => {
      const saveMock = vi.fn().mockResolvedValue();
      DeliveryManRequest.findById.mockResolvedValue({
        status: "pending",
        user: "user1",
        save: saveMock,
      });
      const req = httpMocks.createRequest({
        params: { requestId: "req1" },
        body: { action: "reject" },
      });
      const res = httpMocks.createResponse();

      await managerController.handleDeliveryManRequest(req, res);

      expect(saveMock).toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toMatchObject({
        message: "Request rejected successfully",
      });
    });
  });

  describe("getDeliverymanRequests", () => {
    it("returns empty array if manager has no markets", async () => {
      Market.find.mockResolvedValue([]);

      const req = httpMocks.createRequest({
        user: { id: "manager1" },
      });
      const res = httpMocks.createResponse();

      await managerController.getDeliverymanRequests(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toMatchObject({
        message: "No markets assigned",
        requests: [],
      });
    });

    it("returns requests successfully when markets exist", async () => {
      Market.find.mockResolvedValue([{ _id: "m1" }, { _id: "m2" }]);

      const mockRequests = [
        {
          _id: "req1",
          user: { name: "User1", email: "user1@example.com" },
          market: { name: "Market1" },
        },
      ];

      // Mock chaining populate calls properly
      const populateMock2 = vi.fn().mockResolvedValue(mockRequests);
      const populateMock1 = vi
        .fn()
        .mockReturnValue({ populate: populateMock2 });
      DeliveryManRequest.find.mockReturnValue({ populate: populateMock1 });

      const req = httpMocks.createRequest({
        user: { id: "manager1" },
      });
      const res = httpMocks.createResponse();

      await managerController.getDeliverymanRequests(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toMatchObject({ requests: mockRequests });
    });
  });
});
