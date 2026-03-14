import { z } from "zod";

// ──────────────────────────────────────────────────────────────
// Sub-schemas
// ──────────────────────────────────────────────────────────────

export const ticketZoneSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อโซน"),
  price: z
    .string()
    .min(1, "กรุณากรอกราคา")
    .refine(
      (v) => !Number.isNaN(Number(v)) && Number(v) >= 0,
      "ราคาต้องเป็นตัวเลขที่ไม่ติดลบ",
    ),
  fee: z
    .string()
    .refine(
      (v) => v === "" || (!Number.isNaN(Number(v)) && Number(v) >= 0),
      "ค่าบริการต้องเป็นตัวเลขที่ไม่ติดลบ",
    )
    .optional()
    .default(""),
  capacity: z
    .string()
    .min(1, "กรุณากรอกจำนวน")
    .refine(
      (v) => !Number.isNaN(Number(v)) && Number(v) > 0,
      "จำนวนต้องมากกว่า 0",
    ),
});

export const showRoundSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อรอบการแสดง"),
  date: z.string().min(1, "กรุณาเลือกวันที่รอบการแสดง"),
  time: z.string().min(1, "กรุณาเลือกเวลาแสดง"),
  zones: z.array(ticketZoneSchema).min(1, "ต้องมีอย่างน้อย 1 โซน"),
});

export const deepInfoFieldSchema = z.object({
  otherCode: z.string(),
  label: z.string().min(1, "กรุณากรอก label"),
  isRequired: z.boolean(),
});

// ──────────────────────────────────────────────────────────────
// TICKET schema
// ──────────────────────────────────────────────────────────────

export const ticketEventSchema = z.object({
  type: z.literal("TICKET"),
  name: z.string().min(1, "กรุณากรอกชื่องาน"),
  posterImage: z.string().optional().default(""),
  posterUrl: z.string().optional().default(""),
  notes: z.string().optional().default(""),
  status: z.boolean().default(true),
  showRounds: z.array(showRoundSchema).min(1, "ต้องมีอย่างน้อย 1 รอบการแสดง"),
  deepInfoFields: z.array(deepInfoFieldSchema).default([]),
});

// ──────────────────────────────────────────────────────────────
// FORM schema
// ──────────────────────────────────────────────────────────────

export const formEventSchema = z.object({
  type: z.literal("FORM"),
  name: z.string().min(1, "กรุณากรอกชื่องาน"),
  eventDate: z.string().min(1, "กรุณาเลือกวันที่จัดงาน"),
  feePerEntry: z
    .string()
    .min(1, "กรุณากรอกค่าบริการ")
    .refine(
      (v) => !Number.isNaN(Number(v)) && Number(v) >= 0,
      "ต้องเป็นตัวเลขที่ไม่ติดลบ",
    ),
  capacity: z
    .string()
    .min(1, "กรุณากรอกจำนวนที่รับ")
    .refine(
      (v) => !Number.isNaN(Number(v)) && Number(v) > 0,
      "จำนวนต้องมากกว่า 0",
    ),
  notes: z.string().optional().default(""),
  posterImage: z.string().optional().default(""),
  posterUrl: z.string().optional().default(""),
  status: z.boolean().default(true),
  deepInfoFields: z.array(deepInfoFieldSchema).default([]),
});

// ──────────────────────────────────────────────────────────────
// Union (discriminated on `type`)
// ──────────────────────────────────────────────────────────────

export const createEventSchema = z.discriminatedUnion("type", [
  ticketEventSchema,
  formEventSchema,
]);

// ──────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────

export type TicketZoneValues = z.infer<typeof ticketZoneSchema>;
export type ShowRoundValues = z.infer<typeof showRoundSchema>;
export type DeepInfoFieldValues = z.infer<typeof deepInfoFieldSchema>;
export type TicketEventValues = z.infer<typeof ticketEventSchema>;
export type FormEventValues = z.infer<typeof formEventSchema>;
export type CreateEventValues = z.infer<typeof createEventSchema>;
