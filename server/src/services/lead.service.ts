// ─────────────────────────────────────────────────────────────────────────────
// src/services/lead.service.ts  – Lead business logic
// ─────────────────────────────────────────────────────────────────────────────

import { Types } from "mongoose";
import { Lead } from "../models/Lead";
import { buildPaginationMeta } from "../utils/response";
import { AppError } from "../utils/AppError";
import {
  CreateLeadInput,
  UpdateLeadInput,
  LeadQueryInput,
} from "../validators/lead.validator";
import { UserRole } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LeadFilter = Record<string, any>;

export const leadService = {
  async create(data: CreateLeadInput, userId: string) {
    const lead = await Lead.create({
      ...data,
      assignedTo: data.assignedTo ? new Types.ObjectId(data.assignedTo) : undefined,
      createdBy: new Types.ObjectId(userId),
    });
    return lead.populate("createdBy", "name email");
  },

  async getAll(
    query: LeadQueryInput,
    userId: string,
    userRole: UserRole
  ) {
    const { status, source, search, sortBy, page, limit } = query;

    const filter: LeadFilter = {};

    if (userRole === "sales") {
      filter.createdBy = new Types.ObjectId(userId);
    }

    if (status) filter.status = status;
    if (source) filter.source = source;

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ name: regex }, { email: regex }];
    }

    const sortOrder: 1 | -1 = sortBy === "oldest" ? 1 : -1;
    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email")
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Lead.countDocuments(filter),
    ]);

    const meta = buildPaginationMeta(total, page, limit);
    return { leads, meta };
  },

  async getById(id: string, userId: string, userRole: UserRole) {
    const lead = await Lead.findById(id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    if (!lead) {
      throw AppError.notFound("Lead not found");
    }

    // BUG FIX: After populate(), createdBy is an object { _id, name, email }
    // so we must compare ._id.toString(), NOT .toString() which yields [object Object]
    if (userRole === "sales") {
      // Works for both populated (object with _id) and unpopulated (ObjectId) cases
      const creatorRef = lead.createdBy as unknown as { _id?: Types.ObjectId } | Types.ObjectId;
      const creatorId = "_id" in creatorRef ? creatorRef._id!.toString() : creatorRef.toString();

      if (creatorId !== userId) {
        throw AppError.forbidden("Access denied");
      }
    }

    return lead;
  },

  async update(
    id: string,
    data: UpdateLeadInput,
    userId: string,
    userRole: UserRole
  ) {
    const lead = await leadService.getById(id, userId, userRole);
    Object.assign(lead, data);
    await lead.save();
    return lead;
  },

  async delete(id: string, userId: string, userRole: UserRole) {
    const lead = await leadService.getById(id, userId, userRole);
    await lead.deleteOne();
  },

  async getStats(userId: string, userRole: UserRole) {
    const matchCondition =
      userRole === "sales"
        ? { createdBy: new Types.ObjectId(userId) }
        : {};

    const [statusStats, sourceStats, total] = await Promise.all([
      Lead.aggregate([
        { $match: matchCondition },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Lead.aggregate([
        { $match: matchCondition },
        { $group: { _id: "$source", count: { $sum: 1 } } },
      ]),
      userRole === "sales"
        ? Lead.countDocuments({ createdBy: new Types.ObjectId(userId) })
        : Lead.countDocuments(),
    ]);

    return { total, byStatus: statusStats, bySource: sourceStats };
  },
};
