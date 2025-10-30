import config from "@/config";
import { User } from "@/models/User";
import { Request, Response } from "express";
import TryCatch from "@/lib/TryCatch.js";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import Token from "@/models/token";

const login = TryCatch(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  const user = await User.findOne({ email })
    .select("username email password role")
    .lean()
    .exec();

  if (!user) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await Token.create({ token: refreshToken, userId: user._id });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    user: {
      email: user.email,
      role: user.role,
    },
    accessToken,
  });
});

export default login;
