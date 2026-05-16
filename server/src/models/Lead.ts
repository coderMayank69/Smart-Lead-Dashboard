// ─────────────────────────────────────────────────────────────────────────────
// src/models/Lead.ts  – Mongoose Lead model
// ─────────────────────────────────────────────────────────────────────────────

import mongoose, { Schema, Document, Types } from "mongoose";
import { ILead, LeadSource, LeadStatus } from "../types";

export interface ILeadDocument extends Omit<ILead, "_id">, Document {}

const leadSchema = new Schema<ILeadDocument>(
  {
    name: {
      type: String,
      required: [true, "Lead name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must not exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Lost"] as LeadStatus[],
      default: "New",
    },
    source: {
      type: String,
      enum: ["Website", "Instagram", "Referral"] as LeadSource[],
      required: [true, "Lead source is required"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes must not exceed 500 characters"],
    },
    assignedTo: {
      type: Types.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound index for efficient text search + filter queries
leadSchema.index({ name: "text", email: "text" });
leadSchema.index({ status: 1, source: 1, createdAt: -1 });
leadSchema.index({ createdBy: 1 });

export const Lead = mongoose.model<ILeadDocument>("Lead", leadSchema);
