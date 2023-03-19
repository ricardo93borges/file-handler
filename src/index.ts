import "module-alias/register";
import config from "@/config";
import startServer from "./server";
import { initializeContainer } from "./container";

async function run() {
  const container = initializeContainer(config);
  startServer(container);
}

run();
