import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useBookingById } from "../hooks/use-booking-id";
import { BOOKING_STATUS_LABEL } from "../types/enum";
import { getStatusColor, getStatusIcon } from "../utils/booking-status";

interface BookingDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: number | null;
}

export function BookingDetailDialog({
  open,
  onOpenChange,
  bookingId,
}: Readonly<BookingDetailDialogProps>) {
  const { data: bookingDetailData, isLoading } = useBookingById(bookingId);
  const bookingDetail = bookingId ? bookingDetailData?.data : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>รายละเอียดคิว {bookingDetail?.bookingCode}</DialogTitle>
          <DialogDescription>
            ข้อมูลละเอียดและประวัติการเปลี่ยนสถานะ
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : bookingDetail ? (
          <Tabs defaultValue="details" className="space-y-4">
            <TabsList>
              <TabsTrigger value="details">ข้อมูลทั่วไป</TabsTrigger>
              <TabsTrigger value="payment">การชำระเงิน</TabsTrigger>
              <TabsTrigger value="history">ประวัติเปลี่ยนสถานะ</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ชื่อผู้จอง</Label>
                  <p className="font-medium">{bookingDetail.customer.fullName}</p>
                </div>
                <div>
                  <Label>ชื่อเล่น</Label>
                  <p>{bookingDetail.customer.nickname ?? "-"}</p>
                </div>
                <div>
                  <Label>เบอร์โทร</Label>
                  <p>{bookingDetail.customer.phone ?? "-"}</p>
                </div>
                <div>
                  <Label>Line ID</Label>
                  <p>{bookingDetail.customer.lineId ?? "-"}</p>
                </div>

                <Separator className="col-span-2" />

                <div>
                  <Label>ชื่องาน</Label>
                  <p className="font-medium">{bookingDetail.event.name}</p>
                </div>
                <div>
                  <Label>ประเภท</Label>
                  <Badge
                    variant={
                      bookingDetail.event.type === "TICKET"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {bookingDetail.event.type}
                  </Badge>
                </div>
                <div>
                  <Label>สถานะปัจจุบัน</Label>
                  <Badge className={getStatusColor(bookingDetail.status)}>
                    {BOOKING_STATUS_LABEL[bookingDetail.status]}
                  </Badge>
                </div>
                <div>
                  <Label>รหัสจอง</Label>
                  <p>{bookingDetail.bookingCode}</p>
                </div>
                <div>
                  <Label>วันที่สร้าง</Label>
                  <p>
                    {new Date(bookingDetail.createdAt).toLocaleDateString("th-TH")}
                  </p>
                </div>
                <div>
                  <Label>อัปเดตล่าสุด</Label>
                  <p>
                    {new Date(bookingDetail.updatedAt).toLocaleDateString("th-TH")}{" "}
                    โดย {bookingDetail.updatedBy}
                  </p>
                </div>

                {bookingDetail.bookingItems.length > 0 && (
                  <div className="col-span-2">
                    <Label>รอบ / โซน</Label>
                    <div className="mt-1 space-y-1">
                      {bookingDetail.bookingItems.map((item) => (
                        <p key={item.id}>
                          {item.round?.name ?? "-"} — {item.zone?.name ?? "-"} (x{item.quantity})
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {bookingDetail.notes && (
                  <div className="col-span-2">
                    <Label>หมายเหตุ</Label>
                    <p className="text-sm">{bookingDetail.notes}</p>
                  </div>
                )}
              </div>

              {bookingDetail.deepInfoResponses.length > 0 && (
                <>
                  <Separator />
                  <h4 className="font-medium">ข้อมูลเพิ่มเติม</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {bookingDetail.deepInfoResponses.map((resp) => (
                      <div key={resp.id}>
                        <Label>{resp.field.label}</Label>
                        <p>{resp.value}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="payment" className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <Label>ค่าบัตร</Label>
                  <p className="font-medium">
                    ฿{bookingDetail.netCardPrice.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label>ค่ากด</Label>
                  <p>฿{bookingDetail.serviceFee.toLocaleString()}</p>
                </div>
                <div>
                  <Label>มัดจำ</Label>
                  <p>฿{bookingDetail.depositPaid.toLocaleString()}</p>
                </div>
                <div>
                  <Label>ยอดชำระแล้ว</Label>
                  <p className="font-medium text-green-600">
                    ฿{bookingDetail.totalPaid.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label>คืนเงิน</Label>
                  <p>฿{bookingDetail.refundAmount.toLocaleString()}</p>
                </div>
                <div>
                  <Label>สถานะชำระ</Label>
                  <Badge variant="outline">{bookingDetail.paymentStatus}</Badge>
                </div>
              </div>

              {bookingDetail.paymentSlips.length > 0 && (
                <>
                  <Separator />
                  <h4 className="font-medium">สลิปการชำระเงิน</h4>
                  <div className="space-y-2">
                    {bookingDetail.paymentSlips.map((slip) => (
                      <div
                        key={slip.id}
                        className="flex justify-between items-center p-3 border rounded"
                      >
                        <div>
                          <p className="font-medium">{slip.type}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(slip.createdAt).toLocaleDateString("th-TH")}{" "}
                            — ตรวจโดย {slip.reviewer.firstName}{" "}
                            {slip.reviewer.lastName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ฿{slip.slipAmount.toLocaleString()}
                          </p>
                          <Badge
                            className={
                              slip.status === "VERIFIED"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {slip.status === "VERIFIED" ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {slip.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium">ประวัติการเปลี่ยนสถานะ</h4>
                <div className="space-y-2">
                  {bookingDetail.statusLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 p-3 border rounded"
                    >
                      <div className="mt-0.5">{getStatusIcon(log.status)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(log.status)}>
                            {BOOKING_STATUS_LABEL[log.status]}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {log.admin.firstName} {log.admin.lastName} —{" "}
                          {new Date(log.createdAt).toLocaleString("th-TH")}
                        </p>
                        {log.notes && (
                          <p className="text-sm mt-1">{log.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : null}
        </div>

        <div className="flex justify-end pt-2 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            ปิด
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
