/**
 * Custom modules
 */

import config from "@/config";
import { genUsername } from "@/utils";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";

/**
 * Models
 */

/**
 * Types
 */
import type { Request, Response } from "express";
import type { IUser } from "@/models/User";
import { User } from "@/models/User";
import Token from "@/models/token";
import TryCatch from "@/lib/TryCatch";

type UserData = Pick<IUser, "email" | "password" | "role">;

const register = TryCatch(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password, role } = req.body as UserData;

    if (role === "admin" && !config.WHITELIST_ADMINS_MAIL.includes(email)) {
      res.status(403).json({
        code: "forbidden",
        message: "You are not allowed to register as admin",
      });
    }

    const username = genUsername();
    const newUser = await User.create({ username, email, password, role });

    // Generate access token and refresh token
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // Store refresh token in database
    await Token.create({ token: refreshToken, userId: newUser._id });

    res.cookie("resfreshToken", refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(201).json({
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
    });
  }
);

export default register;
