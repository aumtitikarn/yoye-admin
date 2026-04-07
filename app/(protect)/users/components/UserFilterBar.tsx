"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { AdminRoleAPI } from "../types";

type Props = Readonly<{
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roleFilter: AdminRoleAPI | "ALL";
  onRoleFilterChange: (value: AdminRoleAPI | "ALL") => void;
}>;

export function UserFilterBar({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
}: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="admin-search">ค้นหา</Label>
        <Input
          id="admin-search"
          placeholder="ค้นหาชื่อ อีเมล หรือรหัสผู้ใช้"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-white"
        />
      </div>
      <div className="space-y-2">
        <Label>สิทธิ์</Label>
        <Select
          value={roleFilter}
          onValueChange={(value) =>
            onRoleFilterChange(value as AdminRoleAPI | "ALL")
          }
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="เลือกสิทธิ์" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="ALL">ทั้งหมด</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
