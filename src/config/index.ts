const dotenv = require("dotenv");

dotenv.config();

const config = {
  httpPort: process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT, 10) : 3000,
};

export default config;
