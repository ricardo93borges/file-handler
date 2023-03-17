import "module-alias/register";
import startServer from "./server";
import { initializeContainer } from "./container";

async function run() {
  const container = initializeContainer();
  startServer(container);
}

run();
