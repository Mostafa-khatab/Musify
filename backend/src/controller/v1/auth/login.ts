import config from "@/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "@/models/v1/model";
import { Request, Response } from "express";
import TryCatch from "@/lib/TryCatch.js";

const login = TryCatch(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const accessToken = jwt.sign({ userId: user._id }, config.JWT_ACCESS_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRY,
  });
  res.status(200).json({ accessToken });
});
export default login;
