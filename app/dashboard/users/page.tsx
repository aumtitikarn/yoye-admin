"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type AdminRole = "admin" | "superAdmin";

type AdminUser = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  role: AdminRole;
  lastLogin: string;
  phone: string;
  line?: string;
  teams: string[];
};

const adminUsers: AdminUser[] = [
  {
    id: "USR-001",
    firstName: "สมชาย",
    lastName: "ใจดี",
    name: "สมชาย ใจดี",
    email: "somchai@yoye.co",
    role: "superAdmin",
    lastLogin: "2026-02-23 09:15",
    phone: "089-123-4567",
    line: "somchai.line",
    teams: ["Events", "Finance"],
  },
  {
    id: "USR-002",
    firstName: "สมหญิง",
    lastName: "รักดี",
    name: "สมหญิง รักดี",
    email: "somying@yoye.co",
    role: "admin",
    lastLogin: "2026-02-22 17:48",
    phone: "081-222-4444",
    teams: ["Users"],
  },
  {
    id: "USR-003",
    firstName: "วิชัย",
    lastName: "มั่นคง",
    name: "วิชัย มั่นคง",
    email: "wichai@yoye.co",
    role: "admin",
    lastLogin: "2026-02-21 13:22",
    phone: "085-333-1111",
    line: "wichai.support",
    teams: ["Events", "Support"],
  },
  {
    id: "USR-004",
    firstName: "มานี",
    lastName: "สุขใจ",
    name: "มานี สุขใจ",
    email: "manee@yoye.co",
    role: "superAdmin",
    lastLogin: "2026-02-20 08:05",
    phone: "082-555-9999",
    teams: ["Finance", "Users"],
  },
];

const roleBadge: Record<AdminRole, string> = {
  admin: "bg-blue-100 text-blue-800",
  superAdmin: "bg-purple-100 text-purple-800",
};

export default function AdminUsersPage() {
  const [roleFilter, setRoleFilter] = useState<AdminRole | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [detailForm, setDetailForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    line: "",
    role: "admin" as AdminRole,
    lastLogin: "",
  });

  const openDetailDialog = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setDetailForm({
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      phone: admin.phone,
      line: admin.line ?? "",
      role: admin.role,
      lastLogin: admin.lastLogin,
    });
    setIsDialogOpen(true);
  };

  const filteredAdmins = useMemo(() => {
    return adminUsers.filter((user) => {
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
      const normalizedSearch = searchTerm.trim().toLowerCase();
      const matchesSearch =
        normalizedSearch.length === 0 ||
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        user.id.toLowerCase().includes(normalizedSearch);
      return matchesRole && matchesSearch;
    });
  }, [roleFilter, searchTerm]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">แอดมินทั้งหมด</h1>
        <p className="text-gray-600 mt-2">
          ตรวจสอบรายชื่อ admin / superAdmin พร้อมข้อมูลการเข้าใช้งานล่าสุด
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="admin-search">ค้นหา</Label>
          <Input
            id="admin-search"
            placeholder="ค้นหาชื่อ อีเมล หรือรหัสผู้ใช้"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label>สิทธิ์</Label>
          <Select
            value={roleFilter}
            onValueChange={(value) => setRoleFilter(value as AdminRole | "ALL")}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="เลือกสิทธิ์" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="ALL">ทั้งหมด</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="superAdmin">Super Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>รายชื่อแอดมิน</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">รหัส</TableHead>
                  <TableHead>ชื่อ</TableHead>
                  <TableHead>อีเมล</TableHead>
                  <TableHead className="text-center">สิทธิ์</TableHead>
                  <TableHead>เข้าใช้งานล่าสุด</TableHead>
                  <TableHead className="text-right">การจัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>{admin.id}</TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {admin.name}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {admin.email}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={roleBadge[admin.role]}>
                        {admin.role === "admin" ? "Admin" : "Super Admin"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {admin.lastLogin}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDetailDialog(admin)}
                      >
                        ดูรายละเอียด
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAdmins.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-6 text-center text-gray-500"
                    >
                      ไม่พบรายชื่อ
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>รายละเอียดแอดมิน</DialogTitle>
            <DialogDescription>
              ข้อมูลตามแบบฟอร์มลงทะเบียน (SignUp)
            </DialogDescription>
          </DialogHeader>
          {selectedAdmin && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-center">
                    {selectedAdmin.name}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {selectedAdmin.role === "admin" ? "Admin" : "Super Admin"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>ชื่อ</Label>
                      <Input
                        value={detailForm.firstName}
                        onChange={(e) =>
                          setDetailForm((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>นามสกุล</Label>
                      <Input
                        value={detailForm.lastName}
                        onChange={(e) =>
                          setDetailForm((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label>อีเมล</Label>
                    <Input
                      value={detailForm.email}
                      onChange={(e) =>
                        setDetailForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label>เบอร์โทรศัพท์</Label>
                    <Input
                      value={detailForm.phone}
                      onChange={(e) =>
                        setDetailForm((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label>LINE ID</Label>
                    <Input
                      value={detailForm.line}
                      onChange={(e) =>
                        setDetailForm((prev) => ({
                          ...prev,
                          line: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label>สิทธิ์</Label>
                      <Select
                        value={detailForm.role}
                        onValueChange={(value) =>
                          setDetailForm((prev) => ({
                            ...prev,
                            role: value as AdminRole,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="superAdmin">
                            Super Admin
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={() => {
                        console.log("save-admin", selectedAdmin.id, detailForm);
                        setIsDialogOpen(false);
                      }}
                    >
                      บันทึกการแก้ไข
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
// users
