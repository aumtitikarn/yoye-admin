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
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import type { EBookingStatus } from "../types/enum";
import type { IBookingOrder } from "../types/interface";
import { statusConfig } from "./constants";

type Props = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly item: IBookingOrder | null;
  readonly onSave: (status: EBookingStatus, note: string) => void;
};

export function EditStatusDialog({ open, onOpenChange, item, onSave }: Props) {
  const [editStatus, setEditStatus] = useState<EBookingStatus>(
    item?.status ?? (Object.keys(statusConfig)[0] as EBookingStatus),
  );
  const [editNote, setEditNote] = useState("");

  const handleOpenChange = (val: boolean) => {
    if (val && item) {
      setEditStatus(item.status as EBookingStatus);
      setEditNote("");
    }
    onOpenChange(val);
  };

  const handleSave = () => {
    onSave(editStatus, editNote);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>แก้ไขสถานะ</DialogTitle>
          <DialogDescription>
            {item && `ลูกค้า: ${item.nameCustomer} - ${item.event.name}`}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>สถานะ</Label>
            <Select
              value={editStatus}
              onValueChange={(value) => setEditStatus(value as EBookingStatus)}
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
            <Label>หมายเหตุ</Label>
            <Textarea
              placeholder="กรอกหมายเหตุ (ถ้ามี)"
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            ยกเลิก
          </Button>
          <Button onClick={handleSave}>บันทึก</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
