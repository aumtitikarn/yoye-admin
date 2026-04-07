"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Info, UserPlus } from "lucide-react";
import { useAddAdmin } from "../hooks/use-add-admin";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddAdminDialog({ open, onOpenChange }: Props) {
  const { form, onSubmit, isPending } = useAddAdmin(() => onOpenChange(false));
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const emailPrefix = watch("email").split("@")[0];

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) form.reset();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>เพิ่มแอดมินใหม่</DialogTitle>
          <DialogDescription>กรอกข้อมูลเพื่อสร้างบัญชีแอดมิน</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="add-firstName">ชื่อ</Label>
                <span className="text-red-500 text-xs">*</span>
              </div>
              <Input
                id="add-firstName"
                placeholder="ชื่อ"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="add-lastName">นามสกุล</Label>
                <span className="text-red-500 text-xs">*</span>
              </div>
              <Input
                id="add-lastName"
                placeholder="นามสกุล"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="add-email">อีเมล</Label>
              <span className="text-red-500 text-xs">*</span>
            </div>
            <Input
              id="add-email"
              type="email"
              placeholder="example@email.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="add-phone">เบอร์โทรศัพท์</Label>
              <span className="text-red-500 text-xs">*</span>
            </div>
            <Input
              id="add-phone"
              type="tel"
              maxLength={10}
              placeholder="08xxxxxxxx"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-xs text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="add-line">LINE ID (ไม่จำเป็น)</Label>
            <Input id="add-line" placeholder="line_id" {...register("line")} />
          </div>

          <div className="flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
            <Info className="h-4 w-4 mt-0.5 shrink-0" />
            <span>
              รหัสผ่านเข้าสู่ระบบคือ :{" "}
              <span className="font-semibold">{emailPrefix || "..."}</span>
              <br />
              แอดมินสามารถเปลี่ยนรหัสผ่านได้ภายหลังในหน้าตั้งค่า
            </span>
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                กำลังสร้างบัญชี...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                สร้างบัญชีแอดมิน
              </div>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
