/**
 * custom modules
 */

import config from "@/config";
import TryCatch from "@/lib/TryCatch";
/**
 * Models
 */

import Token from "@/models/token";

/**
 * Types
 */
import type { Request, Response } from "express";

const logout = TryCatch(async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken as string;
  if (!refreshToken) {
    res.status(400).json({
      code: "bad_request",
      message: "Refresh token is required",
    });
    return;
  }
  await Token.deleteOne({ token: refreshToken });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

export default logout;
