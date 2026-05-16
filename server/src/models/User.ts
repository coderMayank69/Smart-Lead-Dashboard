// ─────────────────────────────────────────────────────────────────────────────
// src/models/User.ts  – Mongoose User model with bcrypt password hashing
// ─────────────────────────────────────────────────────────────────────────────

import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser, UserRole } from "../types";

export interface IUserDocument extends Omit<IUser, "_id">, Document {
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name must not exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "sales"] as UserRole[],
      default: "sales",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  (this as IUserDocument).password = await bcrypt.hash((this as IUserDocument).password, salt);
});

// Instance method for password comparison
userSchema.methods.comparePassword = async function (
  candidate: string
): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return bcrypt.compare(candidate, (this as any).password as string);
};

// Remove password from all JSON responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject() as Record<string, unknown>;
  delete obj["password"];
  return obj;
};

export const User = mongoose.model<IUserDocument>("User", userSchema);
