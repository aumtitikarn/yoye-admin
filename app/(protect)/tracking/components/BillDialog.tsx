"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { VAT_RATE, fulfillmentTypeConfig, parseAmount } from "./constants";
import type { IBookingOrder } from "../types/interface";
import { EFulfillmentType } from "../types/enum";
import { useCreateBill } from "../hooks/use-create-bill";
import { useUpdateBillMutation } from "../hooks/use-update.bill";
import { useBillLog } from "../hooks/use-bill-log";

type Props = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly item: IBookingOrder | null;
  readonly mode: "create" | "manage";
  readonly onSave?: () => void;
};

type UserEdits = {
  ticketFee?: string;
  shippingFee?: string;
  fulfillmentType?: EFulfillmentType;
  note?: string;
};

export function BillDialog({ open, onOpenChange, item, mode, onSave }: Props) {
  const [userEdits, setUserEdits] = useState<UserEdits>({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const queryClient = useQueryClient();
  const bookingId = item?.id ?? 0;

  const createBill = useCreateBill(bookingId);
  const updateMutation = useUpdateBillMutation(bookingId);
  const isPending = mode === "create" ? createBill.isPending : updateMutation.isPending;

  const { data: billLogData, isLoading: isBillLogLoading } = useBillLog(mode === "manage" ? bookingId : 0);
  const latestBillLog = billLogData?.data?.[0];

  // Derive effective values: user edits take priority, then latestBillLog, then item defaults (create only)
  const defaultTicketFee = latestBillLog?.serviceFee.toString()
    ?? (mode === "create" ? (item?.serviceFee?.toString() ?? "") : "");
  const defaultShippingFee = latestBillLog?.shippingFee.toString()
    ?? (mode === "create" ? (item?.fulfillment?.shippingFee?.toString() ?? "") : "");
  const defaultFulfillmentType: EFulfillmentType =
    latestBillLog?.fulfillmentType
    ?? item?.fulfillment?.type
    ?? EFulfillmentType.ETICKET;

  const ticketFee = userEdits.ticketFee ?? defaultTicketFee;
  const shippingFee = userEdits.shippingFee ?? defaultShippingFee;
  const fulfillmentType: EFulfillmentType = userEdits.fulfillmentType ?? defaultFulfillmentType;
  const note = userEdits.note ?? (latestBillLog?.note ?? "");

  const handleOpenChange = (val: boolean) => {
    if (!val) setUserEdits({});
    onOpenChange(val);
  };

  const ticketFeeAmount = parseAmount(ticketFee);
  const shippingFeeAmount = fulfillmentType === "ETICKET" ? 0 : parseAmount(shippingFee);
  const isDelivery = fulfillmentType === "DELIVERY";
  const vatTicket = isDelivery ? ticketFeeAmount * VAT_RATE : 0;
  const vatShipping = isDelivery ? shippingFeeAmount * VAT_RATE : 0;
  const totalDue = ticketFeeAmount + shippingFeeAmount + vatTicket + vatShipping;

  const payload = {
    type: fulfillmentType,
    serviceFee: ticketFeeAmount,
    shippingFee: shippingFeeAmount,
    vatServiceFee: vatTicket,
    vatShippingFee: vatShipping,
    note: note || undefined,
  };

  const resetForm = () => setUserEdits({});

  const handleConfirm = async () => {
    if (mode === "create") {
      try {
        await createBill.mutateAsync(payload);
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        queryClient.invalidateQueries({ queryKey: ["bill-log", bookingId] });
        resetForm();
        setIsConfirmOpen(false);
        onOpenChange(false);
        onSave?.();
      } catch {
        setIsConfirmOpen(false);
      }
    } else {
      updateMutation.mutate(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["orders"] });
          queryClient.invalidateQueries({ queryKey: ["bill-log", bookingId] });
          toast.success("อัปเดตบิลสำเร็จ", { position: "top-center" });
          resetForm();
          setIsConfirmOpen(false);
          onOpenChange(false);
          onSave?.();
        },
        onError: (error: unknown) => {
          try {
            const parsed = JSON.parse((error as Error).message);
            toast.error(parsed?.message ?? "เกิดข้อผิดพลาด กรุณาลองใหม่", { position: "top-center" });
          } catch {
            toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่", { position: "top-center" });
          }
          setIsConfirmOpen(false);
        },
      });
    }
  };

  const dialogTitle = mode === "create" ? "สร้างบิลค่ากดบัตร" : "จัดการบิลค่ากดบัตร";

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="w-full sm:max-w-[92vw] lg:max-w-[1200px] max-h-[90vh] flex flex-col"
          style={{ width: "92vw", maxWidth: "1200px" }}
        >
          <DialogHeader className="flex-shrink-0 pb-4 border-b">
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>
              {item && `ลูกค้า: ${item.nameCustomer} - ${item.event.name}`}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4">
            {mode === "manage" && !isBillLogLoading && !latestBillLog && (
              <p className="text-center text-sm text-gray-500 py-8">ยังไม่มีข้อมูลบิลในระบบ</p>
            )}
            {(mode === "create" || latestBillLog) && (<><div className="grid gap-6 lg:grid-cols-2 mb-6">
              {/* Fulfillment Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  เลือกประเภทการรับบัตร (Fulfillment Selection)
                </h3>
                <div className="space-y-3">
                  {Object.entries(fulfillmentTypeConfig).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      className={`w-full text-left p-4 border rounded-lg cursor-pointer transition-colors ${
                        fulfillmentType === key
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setUserEdits((prev) => ({ ...prev, fulfillmentType: key as EFulfillmentType }))}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{config.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{config.label}</h4>
                          <p className="text-sm text-gray-600 mt-1">{config.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Billing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  ข้อมูลค่าใช้จ่าย (Billing)
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>ค่ากดบัตร (รวมค่าธรรมเนียม)</Label>
                    <Input
                      type="number"
                      placeholder="กรอกค่ากดบัตร"
                      value={ticketFee}
                      onChange={(e) => setUserEdits((prev) => ({ ...prev, ticketFee: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ค่าส่ง</Label>
                    <Input
                      type="number"
                      placeholder="กรอกค่าส่ง"
                      value={shippingFee}
                      onChange={(e) => setUserEdits((prev) => ({ ...prev, shippingFee: e.target.value }))}
                      disabled={fulfillmentType === "ETICKET"}
                    />
                    {fulfillmentType === "ETICKET" && (
                      <p className="text-xs text-gray-500">E-ticket ไม่มีค่าส่ง</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>หมายเหตุ</Label>
                    <Textarea
                      placeholder="หมายเหตุ (ถ้ามี)"
                      value={note}
                      onChange={(e) => setUserEdits((prev) => ({ ...prev, note: e.target.value }))}
                      rows={2}
                    />
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>ค่ากดบัตร (รวมค่าธรรมเนียม)</span>
                    <span>฿{ticketFeeAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ค่าส่ง</span>
                    <span>฿{shippingFeeAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT 7% จากค่ากด</span>
                    <span>{isDelivery ? `฿${vatTicket.toFixed(2)}` : "ไม่คิด VAT"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT 7% จากค่าส่ง</span>
                    <span>{isDelivery ? `฿${vatShipping.toFixed(2)}` : "ไม่คิด VAT"}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base">
                    <span>ยอดรวมทั้งหมด</span>
                    <span>฿{totalDue.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            {isDelivery && (
              <div className="border rounded-lg p-4 space-y-3 mb-6">
                <h3 className="text-sm font-semibold text-gray-900">ข้อมูลการจัดส่ง</h3>
                <div className="grid gap-3 sm:grid-cols-2 text-sm">
                  <div>
                    <p className="text-gray-500">ชื่อสำหรับการจัดส่ง</p>
                    <p className="font-medium mt-0.5">{item?.fulfillment?.recipientName || "—"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">เบอร์โทรศัพท์</p>
                    <p className="font-medium mt-0.5">{item?.fulfillment?.recipientPhone || "—"}</p>
                  </div>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">ที่อยู่</p>
                  <p className="font-medium mt-0.5">{item?.fulfillment?.shippingAddress || "—"}</p>
                </div>
              </div>
            )}
            </>)}

          </div>

          <DialogFooter className="flex-shrink-0 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              ยกเลิก
            </Button>
            <Button onClick={() => setIsConfirmOpen(true)}>
              {mode === "create" ? "สร้างบิล" : "บันทึกการจัดการ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ยืนยันการ{mode === "create" ? "สร้างบิล" : "แก้ไขบิล"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              เมื่อ{mode === "create" ? "สร้างบิล" : "แก้ไขบิล"}แล้ว สถานะการจองจะเปลี่ยนเป็น{" "}
              <span className="font-semibold text-yellow-700">รอตรวจสลิปค่ากด</span>{" "}
              โดยอัตโนมัติ
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
              {isPending ? "กำลังบันทึก..." : "ยืนยัน"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
