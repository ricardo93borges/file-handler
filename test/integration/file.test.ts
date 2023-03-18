import request from "supertest";
import { setupServer } from "@/server";
import { initializeContainer } from "@/container";
import { Request, Response } from "express";

describe("File Controller", () => {
  describe("Rate limit", () => {
    it("should be allowed only one request per 10 seconds", async () => {
      const container = initializeContainer();

      container.fileController.uploadFile = jest
        .fn()
        .mockImplementationOnce((req: Request, res: Response) => {
          res.status(204).send();
        });

      const app = setupServer(container);

      let response = await request(app)
        .post("/file/upload")
        .set("content-length", "50000")
        .set("content-type", "text/csv");

      expect(response.status).toBe(204);

      response = await request(app).post("/file/upload");
      const headers = Object.keys(response.headers);

      expect(response.status).toBe(429);
      expect(headers.includes("ratelimit-limit")).toBe(true);
      expect(headers.includes("ratelimit-remaining")).toBe(true);
      expect(headers.includes("ratelimit-reset")).toBe(true);
      expect(headers.includes("retry-after")).toBe(true);

      expect(1).toBe(1);
    });
  });
});
