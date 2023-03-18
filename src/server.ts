import express, { Express } from "express";
import http from "http";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import config from "@/config";
import { Container } from "./container";
import { SystemRouter, FileRouter } from "@/routers";

function setRouters(app: Express, container: Container) {
  const systemRouter = new SystemRouter(container);
  const fileRouter = new FileRouter(container);

  app.use("/", systemRouter.getRouter());
  app.use("/file", fileRouter.getRouter());
  return app;
}

export function setupServer(container: Container): Express {
  let app = express();

  const rateLimiter = rateLimit({
    windowMs: config.server.rateLimitWindowMS,
    max: config.server.maxRequestsPerWindow,
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use(rateLimiter);
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app = setRouters(app, container);

  return app;
}

async function startServer(container: Container) {
  const app = setupServer(container);
  const httpServer = http.createServer(app);
  const port = config.server.httpPort;

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));

  console.log(`🚀 Server ready at http://localhost:${port}/`);
}

export default startServer;
