"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { formatThaiDateTime } from "@/lib/utils";
import { MoreVertical, Eye, Trash2 } from "lucide-react";
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
  admins: AdminUserAPI[];
  onDetailClick: (admin: AdminUserAPI) => void;
  onDeleteClick: (admin: AdminUserAPI) => void;
  isLoading?: boolean;
}>;

export function UserTable({ admins, onDetailClick, onDeleteClick, isLoading }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>รายชื่อแอดมิน</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>ชื่อ</TableHead>
                <TableHead>อีเมล</TableHead>
                <TableHead className="text-center">สิทธิ์</TableHead>
                <TableHead>เข้าใช้งานล่าสุด</TableHead>
                <TableHead className="text-right">การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-6 text-center text-gray-400"
                  >
                    กำลังโหลด...
                  </TableCell>
                </TableRow>
              )}
              {!isLoading &&
                admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="text-gray-500">{admin.id}</TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {admin.firstName} {admin.lastName}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {admin.email}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={roleBadgeClass[admin.role] ?? ""}>
                        {roleLabel[admin.role] ?? admin.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {formatThaiDateTime(admin.lastLogin)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onDetailClick(admin)}>
                            <Eye className="h-4 w-4 mr-2" />
                            รายละเอียด
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => onDeleteClick(admin)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            ลบบัญชี
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              {!isLoading && admins.length === 0 && (
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
  );
}
