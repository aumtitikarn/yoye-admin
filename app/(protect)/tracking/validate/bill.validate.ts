import { z } from "zod";
import { EFulfillmentType } from "../types/enum";

export const createBillSchema = z.object({
  type: z.nativeEnum(EFulfillmentType, {
    required_error: "กรุณาเลือกประเภทการรับบัตร",
    invalid_type_error: "ประเภทการรับบัตรไม่ถูกต้อง",
  }),
  serviceFee: z.coerce
    .number({ invalid_type_error: "ค่ากดบัตรต้องเป็นตัวเลข" })
    .min(0, "ค่ากดบัตรต้องไม่น้อยกว่า 0"),
  shippingFee: z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.coerce
      .number({ invalid_type_error: "ค่าส่งต้องเป็นตัวเลข" })
      .min(0, "ค่าส่งต้องไม่น้อยกว่า 0")
      .optional(),
  ),
  note: z.string().optional(),
}).superRefine((data, ctx) => {
  if (
    (data.type === EFulfillmentType.PICKUP || data.type === EFulfillmentType.DELIVERY) &&
    data.shippingFee === undefined
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["shippingFee"],
      message: "กรุณากรอกค่าส่งสำหรับ PICKUP หรือ DELIVERY",
    });
  }
});

export type CreateBillFormValues = z.infer<typeof createBillSchema>;
