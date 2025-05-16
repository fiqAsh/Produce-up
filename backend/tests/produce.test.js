import { describe, it, expect, vi, beforeEach } from "vitest";
import * as produceController from "../controllers/produce.controller.js";
import Produce from "../models/produce.model.js";
import Market from "../models/market.model.js";

// Mock the Mongoose models
vi.mock("../models/produce.model.js");
vi.mock("../models/market.model.js");

describe("Produce Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: vi.fn(() => res),
      json: vi.fn(),
    };

    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe("createProduce", () => {
    it("should return 400 if produce already exists", async () => {
      req.body = { name: "Apple", unit: "kg" };
      Produce.findOne.mockResolvedValue({ name: "Apple" });

      await produceController.createProduce(req, res);

      expect(Produce.findOne).toHaveBeenCalledWith({ name: "Apple" });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Produce already exists",
      });
    });

    it("should create produce and return 201", async () => {
      req.body = { name: "Banana", unit: "dozen" };
      Produce.findOne.mockResolvedValue(null);
      Produce.create.mockResolvedValue({ name: "Banana", unit: "dozen" });

      await produceController.createProduce(req, res);

      expect(Produce.create).toHaveBeenCalledWith({
        name: "Banana",
        unit: "dozen",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Produce created successfully",
        newProduce: { name: "Banana", unit: "dozen" },
      });
    });

    it("should handle errors during creation", async () => {
      req.body = { name: "Banana", unit: "dozen" };
      Produce.findOne.mockResolvedValue(null);
      Produce.create.mockRejectedValue(new Error("Create error"));

      await produceController.createProduce(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to create produce",
        error: "Create error",
      });
    });
  });

  describe("getAllProduce", () => {
    it("should return all produces", async () => {
      const mockProduces = [
        { name: "Apple", unit: "kg" },
        { name: "Banana", unit: "dozen" },
      ];
      Produce.find.mockResolvedValue(mockProduces);

      await produceController.getAllProduce(req, res);

      expect(Produce.find).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ produces: mockProduces });
    });

    it("should handle errors when fetching produces", async () => {
      Produce.find.mockRejectedValue(new Error("DB error"));

      await produceController.getAllProduce(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to get produces",
        error: "DB error",
      });
    });
  });
});
