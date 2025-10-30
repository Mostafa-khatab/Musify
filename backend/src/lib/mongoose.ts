/**
 * Node modules
 */

import mongoose from "mongoose";

/**
 * Custom modules
 */

import config from "@/config";

/**
 * Types
 */

import type { ConnectOptions } from "mongoose";

/**
 * Client option
 */

const clientOption: ConnectOptions = {
  dbName: "Musify",
  appName: "Quraan App",
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
};

export const connectToDatabase = async (): Promise<void> => {
  if (!config.MONGO_URL) {
    throw new Error("MongoDB URL is not defined in the configuration. ❌");
  }

  try {
    await mongoose.connect(config.MONGO_URL, clientOption);
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
  }
};
