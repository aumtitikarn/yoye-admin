"use client";

import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

type Props = {
  onAddClick: () => void;
};

export function UserPageHeader({ onAddClick }: Props) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">แอดมินทั้งหมด</h1>
        <p className="text-gray-600 mt-2">
          ตรวจสอบรายชื่อ admin / superAdmin พร้อมข้อมูลการเข้าใช้งานล่าสุด
        </p>
      </div>
      <Button onClick={onAddClick}>
        <UserPlus className="h-4 w-4 mr-2" />
        เพิ่มแอดมิน
      </Button>
    </div>
  );
}
