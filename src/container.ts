import config from "@/config";
import { FileController, SystemController } from "@/controllers/";
import { FileHandlerService } from "./services";

export interface Container {
  systemController: SystemController;
  fileController: FileController;
  fileHandlerService: FileHandlerService;
}

export function initializeContainer(): Container {
  const fileHandlerService = new FileHandlerService(
    config.maxFileSize,
    config.fileField,
    config.fileDestination
  );

  const systemController = new SystemController();
  const fileController = new FileController(fileHandlerService);

  return {
    fileHandlerService,
    systemController,
    fileController,
  };
}
