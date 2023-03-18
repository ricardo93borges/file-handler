import config from "@/config";
import { FileController, SystemController } from "@/controllers/";
import { CacheManagerService, FileHandlerService } from "./services";

export interface Container {
  systemController: SystemController;
  fileController: FileController;
  fileHandlerService: FileHandlerService;
  cacheManagerService: CacheManagerService;
}

export function initializeContainer(): Container {
  const fileHandlerService = new FileHandlerService(
    config.fileUpload.maxFileSize,
    config.fileUpload.fileField,
    config.fileUpload.fileDestination
  );

  const cacheManagerService = new CacheManagerService();

  const systemController = new SystemController();
  const fileController = new FileController(
    fileHandlerService,
    cacheManagerService,
    config.fileUpload.maxConcurrentProcess
  );

  return {
    fileHandlerService,
    systemController,
    fileController,
    cacheManagerService,
  };
}
