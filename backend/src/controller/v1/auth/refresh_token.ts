/**
 *  Custom modules
 */
import { verifyRefreshToken, generateAccessToken } from "@/lib/jwt";

/**
 * Models
 */

import Token from "@/models/token";

/**
 * Types
 */

import type { Request, Response } from "express";
import { Types } from "mongoose";
import TryCatch from "@/lib/TryCatch";

const refreshToken = TryCatch(
  async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken as string;

    const tokenExist = await Token.exists({ token: refreshToken });
    if (!tokenExist) {
      res.status(401).json({
        code: "Unauthorized",
        message: "Invalid refresh token",
      });
      return;
    }

    // verify refresh token
    const jwtPayload = verifyRefreshToken(refreshToken) as {
      userId: Types.ObjectId;
    };

    if (!jwtPayload) {
      res.status(401).json({
        code: "Unauthorized",
        message: "Invalid refresh token",
      });
      return;
    }
    const accessToken = generateAccessToken(jwtPayload.userId);
    res.status(200).json({ accessToken });
  }
);

export default refreshToken;
