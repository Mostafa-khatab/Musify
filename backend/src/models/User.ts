import mongoose, { Schema, model } from "mongoose";

import bcrypt from "bcrypt";

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
  playlists: string[];
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      maxLength: [20, "Username cannot exceed 20 characters"],
      unique: [true, "Username already exists"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
      maxLength: [50, "Email cannot exceed 50 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // Do not return password in queries
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: ["admin", "user"],
        message: "Role must be either admin or user",
      },
      default: "user",
    },
    playlists: { type: [String], default: [] },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const User = model<IUser>("User", UserSchema);
