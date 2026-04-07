"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatThaiDateTime } from "@/lib/utils";
import { Mail, Clock, CalendarDays } from "lucide-react";
import { AdminUserAPI } from "../types";

const roleBadgeClass: Record<string, string> = {
  ADMIN: "bg-blue-100 text-blue-800",
  SUPER_ADMIN: "bg-purple-100 text-purple-800",
};

const roleLabel: Record<string, string> = {
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin",
};

type Props = Readonly<{
  admin: AdminUserAPI | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>;

function InfoItem({
  icon,
  label,
  value,
}: Readonly<{ icon: React.ReactNode; label: string; value: string }>) {
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-gray-50 px-4 py-3">
      <div className="mt-0.5 text-gray-400">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export function AdminDetailDialog({ admin, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>รายละเอียดแอดมิน</DialogTitle>
          <DialogDescription className="sr-only">
            ข้อมูลบัญชีผู้ดูแลระบบ
          </DialogDescription>
        </DialogHeader>
        {admin && (
          <div className="space-y-5">
            {/* Avatar + Name */}
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-2xl font-bold text-white">
                {admin.firstName.charAt(0)}
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-gray-900">
                  {admin.firstName} {admin.lastName}
                </p>
                <Badge className={`mt-1 ${roleBadgeClass[admin.role] ?? ""}`}>
                  {roleLabel[admin.role] ?? admin.role}
                </Badge>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2">
              <InfoItem
                icon={<Mail className="h-4 w-4" />}
                label="อีเมล"
                value={admin.email}
              />
              <InfoItem
                icon={<Clock className="h-4 w-4" />}
                label="เข้าใช้งานล่าสุด"
                value={formatThaiDateTime(admin.lastLogin)}
              />
              <InfoItem
                icon={<CalendarDays className="h-4 w-4" />}
                label="วันที่สร้างบัญชี"
                value={formatThaiDateTime(admin.createdAt)}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
