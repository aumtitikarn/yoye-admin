"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { EBookingStatus, EDeliveryStatus } from "../types/enum";
import { useUpdateDeliveryStatus, useUpdateOrderStatus } from "../hooks/use-update-status";
import type { IBookingOrder } from "../types/interface";
import { statusConfig } from "./constants";

const deliveryStatusConfig: Record<EDeliveryStatus, string> = {
  [EDeliveryStatus.NOT_STARTED]: "ยังไม่เริ่ม",
  [EDeliveryStatus.WAITING_DELIVERY]: "รอจัดส่ง",
  [EDeliveryStatus.DELIVERED]: "จัดส่งแล้ว",
  [EDeliveryStatus.CANCELLED]: "ยกเลิก",
};

type Props = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly item: IBookingOrder | null;
};

export function EditStatusDialog({ open, onOpenChange, item}: Props) {
  const { mutate: updateOrderStatus, isPending: isOrderPending } = useUpdateOrderStatus(item?.id ?? 0);
  const { mutate: updateDeliveryStatus, isPending: isDeliveryPending } = useUpdateDeliveryStatus(item?.fulfillment?.id ?? 0);

  const [bookingStatus, setBookingStatus] = useState<EBookingStatus>(
    item?.status ?? (Object.keys(statusConfig)[0] as EBookingStatus),
  );
  const [bookingNote, setBookingNote] = useState("");

  const [deliveryStatus, setDeliveryStatus] = useState<EDeliveryStatus>(
    item?.fulfillment?.deliveryStatus ?? EDeliveryStatus.NOT_STARTED,
  );
  const [deliveryNote, setDeliveryNote] = useState("");

  const resetForm = () => {
    setBookingStatus(item?.status ?? (Object.keys(statusConfig)[0] as EBookingStatus));
    setBookingNote("");
    setBookingNoteError(false);
    setDeliveryStatus(item?.fulfillment?.deliveryStatus ?? EDeliveryStatus.NOT_STARTED);
    setDeliveryNote("");
    setDeliveryNoteError(false);
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) resetForm();
    onOpenChange(val);
  };

  const [bookingNoteError, setBookingNoteError] = useState(false);
  const [deliveryNoteError, setDeliveryNoteError] = useState(false);

  const handleSaveBooking = () => {
    if (!bookingNote.trim()) {
      setBookingNoteError(true);
      return;
    }
    updateOrderStatus(
      { status: bookingStatus, note: bookingNote },
      { onSuccess: () => handleOpenChange(false) },
    );
  };

  const handleSaveDelivery = () => {
    if (!deliveryNote.trim()) {
      setDeliveryNoteError(true);
      return;
    }
    updateDeliveryStatus(
      { deliveryStatus, note: deliveryNote },
      { onSuccess: () => handleOpenChange(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>แก้ไขสถานะ</DialogTitle>
          <DialogDescription>
            {item && `ลูกค้า: ${item.nameCustomer} - ${item.event.name}`}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="booking" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="booking" className="flex-1">สถานะการจอง</TabsTrigger>
            <TabsTrigger value="delivery" className="flex-1">สถานะการจัดส่ง</TabsTrigger>
          </TabsList>

          <TabsContent value="booking" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>สถานะ <span className="text-red-500">*</span></Label>
              <Select
                value={bookingStatus}
                onValueChange={(value) => setBookingStatus(value as EBookingStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>หมายเหตุ <span className="text-red-500">*</span></Label>
              <Textarea
                placeholder="กรอกหมายเหตุ"
                value={bookingNote}
                onChange={(e) => {
                  setBookingNote(e.target.value);
                  if (e.target.value.trim()) setBookingNoteError(false);
                }}
                rows={3}
                className={bookingNoteError ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {bookingNoteError && (
                <p className="text-xs text-red-500">กรุณากรอกหมายเหตุ</p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                ยกเลิก
              </Button>
              <Button onClick={handleSaveBooking} disabled={isOrderPending}>บันทึก</Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="delivery" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>สถานะการจัดส่ง <span className="text-red-500">*</span></Label>
              <Select
                value={deliveryStatus}
                onValueChange={(value) => setDeliveryStatus(value as EDeliveryStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(deliveryStatusConfig).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>หมายเหตุ <span className="text-red-500">*</span></Label>
              <Textarea
                placeholder="กรอกหมายเหตุ"
                value={deliveryNote}
                onChange={(e) => {
                  setDeliveryNote(e.target.value);
                  if (e.target.value.trim()) setDeliveryNoteError(false);
                }}
                rows={3}
                className={deliveryNoteError ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {deliveryNoteError && (
                <p className="text-xs text-red-500">กรุณากรอกหมายเหตุ</p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                ยกเลิก
              </Button>
              <Button onClick={handleSaveDelivery} disabled={isDeliveryPending}>บันทึก</Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
