import { z } from "zod";

export const addAdminSchema = z.object({
  email: z.string().email({ message: "อีเมลไม่ถูกต้อง" }),
  password: z.string().min(1, "กรุณากรอกอีเมลก่อน"),
  confirmPassword: z.string().min(1, "กรุณากรอกอีเมลก่อน"),
  firstName: z.string().min(1, "กรุณากรอกชื่อ"),
  lastName: z.string().min(1, "กรุณากรอกนามสกุล"),
  line: z.string().optional(),
  phone: z
    .string()
    .min(1, "กรุณากรอกเบอร์โทรศัพท์")
    .regex(/^0\d{9}$/, "เบอร์โทรศัพท์ไม่ถูกต้อง"),
});

export type AddAdminFormValues = z.infer<typeof addAdminSchema>;
