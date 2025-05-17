import { describe, it, beforeEach, afterEach, vi, expect } from "vitest";
import * as adminController from "../controllers/admin.controller.js";

import Market from "../models/market.model.js";
import ManagerRequest from "../models/manager.request.model.js";
import User from "../models/user.model.js";
import { sendUserRoleNotification } from "../controllers/notification.controller.js";

vi.mock("../models/market.model.js");
vi.mock("../models/manager.request.model.js");
vi.mock("../models/user.model.js");
vi.mock("../controllers/notification.controller.js", () => ({
  sendUserRoleNotification: vi.fn(),
}));

const mockResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("Admin Controller", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  //ar
  describe("createMarket", () => {
    it("returns 400 if required fields missing", async () => {
      const req = { body: { name: "Market1" } }; // incomplete
      const res = mockResponse();

      await adminController.createMarket(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "All fields are required",
      });
    });

    it("returns 400 if market already exists at location", async () => {
      const req = {
        body: {
          name: "Market1",
          latitude: 10,
          longitude: 20,
          manager: "managerId",
          producePrices: {},
        },
      };
      const res = mockResponse();

      Market.findOne.mockResolvedValue({ _id: "existingMarketId" });

      await adminController.createMarket(req, res);

      expect(Market.findOne).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Two market cannot be created at the same location ",
      });
    });

    it("creates market successfully", async () => {
      const req = {
        body: {
          name: "Market1",
          latitude: 10,
          longitude: 20,
          manager: "managerId",
          producePrices: { apple: 10 },
        },
      };
      const res = mockResponse();

      Market.findOne.mockResolvedValue(null);
      Market.create.mockResolvedValue({ _id: "newMarketId", name: "Market1" });

      await adminController.createMarket(req, res);

      expect(Market.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Market created successfully",
        market: { _id: "newMarketId", name: "Market1" },
      });
    });
  });
  //ar
  describe("updateMarket", () => {
    it("returns 404 if market not found", async () => {
      const req = { body: { id: "notFoundId", name: "New Name" } };
      const res = mockResponse();

      Market.findById.mockResolvedValue(null);

      await adminController.updateMarket(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Market not found" });
    });

    it("updates market successfully", async () => {
      const saveMock = vi.fn().mockResolvedValue();
      const market = {
        name: "Old Name",
        manager: "Old Manager",
        save: saveMock,
      };

      const req = {
        body: { id: "marketId", name: "New Name", manager: "New Manager" },
      };
      const res = mockResponse();

      Market.findById.mockResolvedValue(market);

      await adminController.updateMarket(req, res);

      expect(market.name).toBe("New Name");
      expect(market.manager).toBe("New Manager");
      expect(saveMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Market updated successfully",
        market,
      });
    });
  });
  //ar
  describe("deleteMarket", () => {
    it("returns 404 if market not found", async () => {
      const req = { body: { marketId: "nonexistent" } };
      const res = mockResponse();

      Market.findByIdAndDelete.mockResolvedValue(null);

      await adminController.deleteMarket(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Market not found" });
    });

    it("deletes market successfully", async () => {
      const req = { body: { marketId: "someId" } };
      const res = mockResponse();

      Market.findByIdAndDelete.mockResolvedValue({ _id: "someId" });

      await adminController.deleteMarket(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Market deleted successfully",
      });
    });
  });
});
