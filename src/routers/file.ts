import { Router } from "express";
import { Container } from "@/container";
import { FileController } from "@/controllers";
import { validator } from "@/middlewares";
import { uploadFileSchema } from "@/schemas";

export class FileRouter {
  private router: Router;
  private fileController: FileController;

  constructor(container: Container) {
    this.fileController = container.fileController;
    this.router = Router();
  }

  getRouter() {
    this.router.post(
      "/upload",
      validator(uploadFileSchema),
      this.fileController.uploadFile
    );

    return this.router;
  }
}
