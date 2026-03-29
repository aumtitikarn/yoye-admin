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
import { History } from "lucide-react";
import { useState } from "react";
import { VAT_RATE, fulfillmentTypeConfig, parseAmount } from "./constants";
import type { IBookingOrder } from "../types/interface";
import type { BillFormData, BillHistoryEntry, FulfillmentType } from "./types";

type Props = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly item: IBookingOrder | null;
  readonly mode: "create" | "manage";
  readonly history: BillHistoryEntry[];
  readonly onSave: (data: BillFormData) => void;
};

export function BillDialog({ open, onOpenChange, item, mode, history, onSave }: Props) {
  const [ticketFee, setTicketFee] = useState(item?.serviceFee?.toString() ?? "");
  const [shippingFee, setShippingFee] = useState(
    item?.fulfillment?.shippingFee?.toString() ?? "",
  );
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>(
    (item?.fulfillment?.type as FulfillmentType) ?? "ETICKET",
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Reset form when item changes
  const handleOpenChange = (val: boolean) => {
    if (val && item) {
      setTicketFee(item.serviceFee?.toString() ?? "");
      setShippingFee(item.fulfillment?.shippingFee?.toString() ?? "");
      setFulfillmentType((item.fulfillment?.type as FulfillmentType) ?? "ETICKET");
    }
    onOpenChange(val);
  };

  const ticketFeeAmount = parseAmount(ticketFee);
  const shippingFeeAmount = fulfillmentType === "ETICKET" ? 0 : parseAmount(shippingFee);
  const isDelivery = fulfillmentType === "DELIVERY";
  const vatTicket = isDelivery ? ticketFeeAmount * VAT_RATE : 0;
  const vatShipping = isDelivery ? shippingFeeAmount * VAT_RATE : 0;
  const totalDue = ticketFeeAmount + shippingFeeAmount + vatTicket + vatShipping;

  const handleConfirm = () => {
    onSave({
      ticketFee: ticketFeeAmount,
      shippingFee: shippingFeeAmount,
      vatAmount: vatTicket + vatShipping,
      totalAmount: totalDue,
      fulfillmentType,
    });
    setIsConfirmOpen(false);
    onOpenChange(false);
  };

  const sortedHistory = [...history].reverse();

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="w-full sm:max-w-[92vw] lg:max-w-[1200px] max-h-[90vh] flex flex-col"
          style={{ width: "92vw", maxWidth: "1200px" }}
        >
          <DialogHeader className="flex-shrink-0 pb-4 border-b">
            <DialogTitle>
              {mode === "create" ? "สร้างบิลค่ากดบัตร" : "จัดการบิลค่ากดบัตร"}
            </DialogTitle>
            <DialogDescription>
              {item && `ลูกค้า: ${item.nameCustomer} - ${item.event.name}`}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4">
            <div className="grid gap-6 lg:grid-cols-2 mb-6">
              {/* Fulfillment Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  เลือกประเภทการรับบัตร (Fulfillment Selection)
                </h3>
                <div className="space-y-3">
                  {Object.entries(fulfillmentTypeConfig).map(([key, config]) => (
                    <div
                      key={key}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        fulfillmentType === key
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setFulfillmentType(key as FulfillmentType)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{config.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{config.label}</h4>
                          <p className="text-sm text-gray-600 mt-1">{config.description}</p>
                        </div>
                      </div>
                    </div>
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
                      onChange={(e) => setTicketFee(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ค่าส่ง</Label>
                    <Input
                      type="number"
                      placeholder="กรอกค่าส่ง"
                      value={shippingFee}
                      onChange={(e) => setShippingFee(e.target.value)}
                      disabled={fulfillmentType === "ETICKET"}
                    />
                    {fulfillmentType === "ETICKET" && (
                      <p className="text-xs text-gray-500">E-ticket ไม่มีค่าส่ง</p>
                    )}
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

            {/* Bill History */}
            {sortedHistory.length > 0 && (
              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <History className="h-4 w-4" />
                  ประวัติการสร้าง/แก้ไขบิล
                </h3>
                <div className="space-y-3">
                  {sortedHistory.map((entry) => (
                    <div key={entry.id} className="flex gap-3 text-sm">
                      <div className="flex flex-col items-center">
                        <div
                          className={`h-2 w-2 rounded-full mt-1.5 ${
                            entry.action === "create" ? "bg-blue-500" : "bg-orange-400"
                          }`}
                        />
                        <div className="w-px flex-1 bg-gray-200 mt-1" />
                      </div>
                      <div className="pb-3 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                              entry.action === "create"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {entry.action === "create" ? "สร้างบิล" : "แก้ไขบิล"}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(entry.timestamp).toLocaleString("th-TH", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">โดย {entry.adminName}</p>
                        <p className="text-gray-500">
                          ค่ากด ฿{entry.ticketFee.toFixed(2)} · ค่าส่ง ฿
                          {entry.shippingFee.toFixed(2)} · รวม ฿{entry.totalAmount.toFixed(2)} ·{" "}
                          {fulfillmentTypeConfig[entry.fulfillmentType].label}
                        </p>
                        {entry.note && (
                          <p className="text-gray-400 italic mt-0.5">
                            &ldquo;{entry.note}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>ยืนยัน</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
