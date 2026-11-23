import { z } from "zod";

import { INDUSTRIES, LEAD_STATUSES } from "./constants";

const trimmed = (min: number, max: number) =>
  z.string().trim().min(min).max(max);

export const leadCreateSchema = z.object({
  businessName: trimmed(2, 120),
  contactPerson: trimmed(0, 120).optional(),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Enter a valid phone number"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email")
    .max(160)
    .optional()
    .or(z.literal("")),
  industry: z.enum(INDUSTRIES).default("Other"),
  status: z.enum(LEAD_STATUSES).default("New Lead"),
  source: trimmed(1, 60).default("Website Enquiry"),
  value: z.coerce.number().int().min(0).max(1_000_000_000).default(0),
  nextFollowUp: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
    .optional()
    .or(z.literal("")),
  notes: trimmed(0, 4000).optional(),
});

export const leadUpdateSchema = z.object({
  businessName: trimmed(2, 120).optional(),
  contactPerson: trimmed(0, 120).optional(),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Enter a valid phone number")
    .optional(),
  email: z
    .string()
    .trim()
    .email("Enter a valid email")
    .max(160)
    .optional()
    .or(z.literal("")),
  industry: z.enum(INDUSTRIES).optional(),
  status: z.enum(LEAD_STATUSES).optional(),
  source: trimmed(1, 60).optional(),
  value: z.coerce.number().int().min(0).max(1_000_000_000).optional(),
  nextFollowUp: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
    .optional()
    .or(z.literal("")),
  notes: trimmed(0, 4000).optional(),
});

export const enquirySchema = z.object({
  businessName: trimmed(2, 120),
  contactPerson: trimmed(0, 120).optional(),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Enter a valid phone number"),
  industry: z.enum(INDUSTRIES).default("Other"),
  value: z.coerce.number().int().min(0).max(1_000_000_000).default(0),
  notes: trimmed(0, 4000).optional(),
});

export const logCreateSchema = z.object({
  type: trimmed(1, 40),
  summary: trimmed(2, 2000),
});

export const loginSchema = z.object({
  password: z.string().min(1, "Enter the access key"),
});

export type LeadCreateInput = z.infer<typeof leadCreateSchema>;
export type EnquiryInput = z.infer<typeof enquirySchema>;
export type LogCreateInput = z.infer<typeof logCreateSchema>;
