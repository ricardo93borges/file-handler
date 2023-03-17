import express, { Express } from "express";
import http from "http";
import bodyParser from "body-parser";
import config from "@/config";
import { Container } from "./container";
import { SystemRouter } from "@/routers";

function setRouters(app: Express, container: Container) {
  const systemRouter = new SystemRouter(container);

  app.use("/", systemRouter.getRouter());
  return app;
}

export function setupServer(container: Container): Express {
  let app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app = setRouters(app, container);

  return app;
}

async function startServer(container: Container) {
  const app = setupServer(container);

  const httpServer = http.createServer(app);

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: config.httpPort }, resolve)
  );

  console.log(`🚀 Server ready at http://localhost:${config.httpPort}/`);
}

export default startServer;
