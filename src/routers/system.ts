import { Router } from "express";
import { Container } from "@/container";
import { SystemController } from "@/controllers";

export class SystemRouter {
  private router: Router;
  private systemController: SystemController;

  constructor(container: Container) {
    this.systemController = container.systemController;
    this.router = Router();
  }

  getRouter() {
    this.router.get("/health", this.systemController.getHealthData);

    return this.router;
  }
}