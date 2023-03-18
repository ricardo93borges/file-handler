const dotenv = require("dotenv");

dotenv.config();

const config = {
  httpPort: process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT, 10) : 3000,
  fileField: process.env.FILE_FIELD ? process.env.FILE_FIELD : "file",
  fileDestination: process.env.FILE_DESTINATION
    ? process.env.FILE_DESTINATION
    : "uploads/",
  maxFileSize: process.env.MAX_FILE_SIZE
    ? parseInt(process.env.MAX_FILE_SIZE, 10)
    : 52428800,
};

export default config;
