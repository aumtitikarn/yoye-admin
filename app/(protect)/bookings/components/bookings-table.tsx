import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Loader2, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { IBooking } from "../types/interface";
import { BookingStatusBadge } from "./booking-status-badge";
import { BookingUpdateStatusDialog } from "./booking-update-status-dialog";
import { useDeleteBooking } from "../hooks/use-delete-booking";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface BookingsMeta {
  totalCounts: number;
  totalPages: number;
}

interface BookingsTableProps {
  bookings: IBooking[];
  isLoading: boolean;
  meta?: BookingsMeta;
  page: number;
  onPageChange: (page: number) => void;
  onViewDetail: (booking: IBooking) => void;
}

export function BookingsTable({
  bookings,
  isLoading,
  meta,
  page,
  onPageChange,
  onViewDetail,
}: Readonly<BookingsTableProps>) {
  const queryClient = useQueryClient();
  const [editingBooking, setEditingBooking] = useState<IBooking | null>(null);
  const [deletingBooking, setDeletingBooking] = useState<IBooking | null>(null);

  const { mutate: deleteBooking } = useDeleteBooking();

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>รายการจอง {meta ? `(${meta.totalCounts})` : ""}</CardTitle>
        <CardDescription>รายการจองทั้งหมดตามตัวกรองที่เลือก</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>รหัสการจอง</TableHead>
                  <TableHead>ชื่องาน</TableHead>
                  <TableHead>ชื่อผู้จอง</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>วันที่สร้าง</TableHead>
                  <TableHead>มัดจำ</TableHead>
                  <TableHead>การจัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {booking.bookingCode}
                    </TableCell>
                    <TableCell>{booking.event.name}</TableCell>
                    <TableCell>{booking.nameCustomer}</TableCell>
                    <TableCell>
                      <BookingStatusBadge status={booking.status} />
                    </TableCell>
                    <TableCell>
                      {new Date(booking.createdAt).toLocaleDateString("th-TH")}
                    </TableCell>
                    <TableCell>
                      ฿{booking.depositPaid.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            suppressHydrationWarning
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewDetail(booking)}>
                            <Eye className="h-4 w-4 mr-2" />
                            ดูรายละเอียด
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditingBooking(booking)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            แก้ไขสถานะ
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setDeletingBooking(booking)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            ลบ
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {bookings.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-10 text-gray-500"
                    >
                      ไม่พบข้อมูล
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {meta && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  ทั้งหมด {meta.totalCounts} รายการ
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                  >
                    ก่อนหน้า
                  </Button>
                  {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <Button
                        key={p}
                        variant={p === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(p)}
                      >
                        {p}
                      </Button>
                    ),
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= meta.totalPages}
                  >
                    ถัดไป
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>

    <BookingUpdateStatusDialog
      open={!!editingBooking}
      onOpenChange={(open) => { if (!open) setEditingBooking(null); }}
      bookingId={editingBooking?.id ?? null}
      onSuccess={() => queryClient.invalidateQueries({ queryKey: ["bookings"] })}
    />

    <ConfirmDialog
      open={!!deletingBooking}
      onOpenChange={(open) => { if (!open) setDeletingBooking(null); }}
      title="ยืนยันการลบ"
      description={`ต้องการลบคิว ${deletingBooking?.bookingCode} ของ ${deletingBooking?.nameCustomer} ใช่หรือไม่?`}
      confirmLabel="ลบ"
      variant="destructive"
      onConfirm={() => {
        if (!deletingBooking) return;
        deleteBooking(deletingBooking.id, {
          onSuccess: () => {
            setDeletingBooking(null);
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
          },
        });
      }}
    />
    </>
  );
}
