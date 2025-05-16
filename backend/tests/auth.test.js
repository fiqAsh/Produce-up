import { describe, it, beforeAll, afterAll, afterEach, expect } from "vitest";
import supertest from "supertest";
import app from "../index.js";
import mongoose from "mongoose";
import User from "../models/user.model.js";

const request = supertest(app);

describe("Auth Controller", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /api/auth/signup", () => {
    it("should create a new user", async () => {
      const res = await request.post("/api/auth/signup").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        phone: 1234567890,
        latitude: 23.81,
        longitude: 90.41,
        role: "user",
      });
      expect(res.status).toBe(201);
      expect(res.body.message).toBe("User created successfully");
      expect(res.body.email).toBe("test@example.com");
    });

    it("should not allow duplicate email", async () => {
      await User.create({
        name: "Test",
        email: "duplicate@example.com",
        password: "hashed",
        phone: 123,
        location: { type: "Point", coordinates: [90.41, 23.81] },
        role: "user",
      });

      const res = await request.post("/api/auth/signup").send({
        name: "Duplicate",
        email: "duplicate@example.com",
        password: "password",
        phone: 123456,
        latitude: 23.81,
        longitude: 90.41,
        role: "user",
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("User already exists");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should log in an existing user", async () => {
      const bcrypt = await import("bcryptjs");
      const hashedPassword = await bcrypt.hash("mypassword", 10);

      await User.create({
        name: "Login User",
        email: "login@example.com",
        password: hashedPassword,
        phone: 1234567890,
        location: { type: "Point", coordinates: [90.41, 23.81] },
        role: "user",
      });

      const res = await request.post("/api/auth/login").send({
        email: "login@example.com",
        password: "mypassword",
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Login successful");
      expect(res.body.user.email).toBe("login@example.com");
    });

    it("should reject invalid credentials", async () => {
      const res = await request.post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: "wrongpassword",
      });
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("User not found");
    });
  });
});
