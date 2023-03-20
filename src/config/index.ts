const dotenv = require("dotenv");

dotenv.config();

export type Config = {
  server: {
    httpPort: number;
    rateLimitWindowMS: number;
    maxRequestsPerWindow: number;
  };
  fileUpload: {
    fileField: string;
    fileDestination: string;
    maxFileSize: number;
    maxConcurrentProcess: number;
  };
};

const config: Config = {
  server: {
    httpPort: process.env.HTTP_PORT
      ? parseInt(process.env.HTTP_PORT, 10)
      : 3000,
    rateLimitWindowMS: process.env.MAX_LIMIT_WINDOW_MS
      ? parseInt(process.env.MAX_LIMIT_WINDOW_MS, 10)
      : 10000,
    maxRequestsPerWindow: process.env.MAX_REQUESTS_PER_WINDOW
      ? parseInt(process.env.MAX_REQUESTS_PER_WINDOW, 10)
      : 1,
  },
  fileUpload: {
    fileField: process.env.FILE_FIELD ? process.env.FILE_FIELD : "file",
    fileDestination: process.env.FILE_DESTINATION
      ? process.env.FILE_DESTINATION
      : "uploads/",
    maxFileSize: process.env.MAX_FILE_SIZE
      ? parseInt(process.env.MAX_FILE_SIZE, 10)
      : 52428800,
    maxConcurrentProcess: process.env.MAX_CONCURRENT_PROCESS
      ? parseInt(process.env.MAX_CONCURRENT_PROCESS, 10)
      : 5,
  },
};

export default config;
