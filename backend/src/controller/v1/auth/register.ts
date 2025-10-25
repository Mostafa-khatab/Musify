import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@/models/v1/model";
import { Request, Response } from "express";
import config from "@/config";
import TryCatch from "@/lib/TryCatch.js";

const register = TryCatch(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });
  await newUser.save();
  const accessToken = jwt.sign(
    { userId: newUser._id },
    config.JWT_ACCESS_SECRET,
    {
      expiresIn: config.ACCESS_TOKEN_EXPIRY,
    }
  );
  res.status(201).json({
    message: "User registered successfully",
    accessToken,
  });
});
export default register;
