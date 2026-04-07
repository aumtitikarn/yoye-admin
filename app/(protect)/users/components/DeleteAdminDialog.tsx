"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useDeleteUser } from "../hooks/use-delete-user";
import { AdminUserAPI } from "../types";

type Props = Readonly<{
  admin: AdminUserAPI | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>;

export function DeleteAdminDialog({ admin, open, onOpenChange }: Props) {
  const { deleteUser, isPending } = useDeleteUser(() => onOpenChange(false));

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ยืนยันการลบบัญชี</AlertDialogTitle>
          <AlertDialogDescription>
            คุณต้องการลบบัญชีของ{" "}
            <span className="font-semibold text-gray-900">
              {admin?.firstName} {admin?.lastName}
            </span>{" "}
            ({admin?.email}) ใช่หรือไม่?
            <br />
            การกระทำนี้ไม่สามารถย้อนกลับได้
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            disabled={isPending}
            onClick={() => {
              if (admin) deleteUser(admin.id);
            }}
          >
            {isPending ? "กำลังลบ..." : "ลบบัญชี"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
