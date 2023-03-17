import { SystemController } from "@/controllers/";

export interface Container {
  systemController: SystemController;
}

export function initializeContainer(): Container {
  const systemController = new SystemController();

  return {
    systemController,
  };
}
