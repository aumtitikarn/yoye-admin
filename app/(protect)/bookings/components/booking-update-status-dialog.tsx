"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SingleCombobox } from "@/components/ui/combobox";
import { Loader2 } from "lucide-react";
import { useBookingById } from "../hooks/use-booking-id";
import { useUpdateBooking } from "../hooks/use-update-booking";
import { EBookingStatus, BOOKING_STATUS_LABEL } from "../types/enum";
import { IBookingDetail } from "../types/interface";

interface BookingUpdateStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: number | null;
  onSuccess?: () => void;
}

interface FormProps {
  booking: IBookingDetail;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

function BookingUpdateStatusForm({ booking, onOpenChange, onSuccess }: Readonly<FormProps>) {
  const [status, setStatus] = useState<string>(booking.status);
  const [notes, setNotes] = useState<string>("");

  const { mutate: updateBooking, isPending } = useUpdateBooking();

  const handleSubmit = () => {
    updateBooking(
      {
        id: booking.id,
        payload: {
          status: status as EBookingStatus,
          notes: notes || undefined,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
        },
      },
    );
  };

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>สถานะ</Label>
          <SingleCombobox
            options={Object.values(EBookingStatus).map((s) => ({
              value: s,
              label: BOOKING_STATUS_LABEL[s],
            }))}
            value={status}
            onChange={(value) => setStatus(value)}
            placeholder="เลือกสถานะ"
            searchPlaceholder="ค้นหาสถานะ..."
            emptyText="ไม่พบสถานะ"
            className="w-full"
          />
        </div>

        <div className="space-y-1.5">
          <Label>
            หมายเหตุ
          </Label>
          <Textarea
            placeholder="ระบุหมายเหตุ..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isPending}
        >
          ยกเลิก
        </Button>
        <Button onClick={handleSubmit} disabled={!status || isPending}>
          {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          บันทึก
        </Button>
      </div>
    </>
  );
}

export function BookingUpdateStatusDialog({
  open,
  onOpenChange,
  bookingId,
  onSuccess,
}: Readonly<BookingUpdateStatusDialogProps>) {
  const { data, isLoading } = useBookingById(bookingId);
  const booking = bookingId ? data?.data : undefined;

  let content: React.ReactNode;
  if (isLoading) {
    content = (
      <div className="flex justify-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  } else if (booking) {
    content = (
      <BookingUpdateStatusForm
        key={booking.id}
        booking={booking}
        onOpenChange={onOpenChange}
        onSuccess={onSuccess}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>แก้ไขสถานะ</DialogTitle>
          <DialogDescription>
            คิว {booking?.bookingCode} — {booking?.nameCustomer}
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
