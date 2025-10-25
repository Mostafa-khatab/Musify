import dotenv from "dotenv";

import type ms from "ms";

dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  mongoUrl: process.env.MONGO_URL,
  NodeEnv: process.env.NODE_ENV,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as ms.StringValue,
};

export default config;
