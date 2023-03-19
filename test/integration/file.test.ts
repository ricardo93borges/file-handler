import path from "path";
import request from "supertest";
import { Request, Response } from "express";
import config from "@/config";
import { setupServer } from "@/server";
import { initializeContainer } from "@/container";
import { countFiles, deleteFiles } from "../helpers/file";

describe("File Controller", () => {
  describe("Rate limit", () => {
    it("should be allowed only one request per 10 seconds", async () => {
      const container = initializeContainer(config);

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
    });
  });

  describe("File upload", () => {
    it("should upload a file", async () => {
      const fileDestination = path.join(__dirname, "uploads");
      const container = initializeContainer({
        ...config,
        fileUpload: {
          fileField: "file",
          maxFileSize: 52428800,
          maxConcurrentProcess: 5,
          fileDestination: fileDestination,
        },
      });
      const app = setupServer(container);

      deleteFiles(fileDestination);
      expect(countFiles(fileDestination)).toBe(1);

      const response = await request(app)
        .post("/file/upload")
        .set("content-length", "50000")
        .attach("file", `${__dirname}/test-file.csv`);

      expect(response.status).toBe(204);
      expect(countFiles(fileDestination)).toBe(2);

      deleteFiles(fileDestination);
    });
  });
});
