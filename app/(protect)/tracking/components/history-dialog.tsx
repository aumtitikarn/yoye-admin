"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { History } from "lucide-react";
import { useBillLog } from "../hooks/use-bill-log";
import type { IBookingOrder } from "../types/interface";
import { fulfillmentTypeConfig } from "./constants";

type Props = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly item: IBookingOrder | null;
};

export function HistoryDialog({ open, onOpenChange, item }: Props) {
  const { data, isLoading } = useBillLog(item?.id ?? 0);
  const logs = data?.data ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <History className="h-4 w-4" />
            ประวัติการสร้างบิล
          </DialogTitle>
          <DialogDescription>
            {item && `ลูกค้า: ${item.nameCustomer} - ${item.event.name}`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {isLoading && (
            <p className="text-center text-sm text-gray-400 py-8">กำลังโหลด...</p>
          )}
          {!isLoading && logs.length === 0 && (
            <p className="text-center text-sm text-gray-500 py-8">ไม่มีประวัติการสร้างบิล</p>
          )}
          {!isLoading && logs.length > 0 && (
            <div className="space-y-3">
              {logs.map((entry) => (
                <div key={entry.id} className="flex gap-3 text-sm">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-2 w-2 rounded-full mt-1.5 ${
                        entry.action === "CREATE" ? "bg-blue-500" : "bg-orange-400"
                      }`}
                    />
                    <div className="w-px flex-1 bg-gray-200 mt-1" />
                  </div>
                  <div className="pb-3 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                          entry.action === "CREATE"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {entry.action === "CREATE" ? "สร้างบิล" : "แก้ไขบิล"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(entry.createdAt).toLocaleString("th-TH", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">
                      โดย {entry.admin.firstName} {entry.admin.lastName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {entry.vatAmount > 0 ? (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-medium">
                          รวมภาษี
                        </span>
                      ) : (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">
                          ไม่มีการคิดภาษี
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 mt-0.5">
                      ค่ากด ฿{(entry.serviceFee + (entry.vatServiceFee ?? 0)).toFixed(2)}
                      {entry.vatServiceFee > 0 && (
                        <span className="text-xs text-gray-400"> (รวม VAT ฿{entry.vatServiceFee.toFixed(2)})</span>
                      )}
                      {" · "}
                      ค่าส่ง ฿{(entry.shippingFee + (entry.vatShippingFee ?? 0)).toFixed(2)}
                      {entry.vatShippingFee > 0 && (
                        <span className="text-xs text-gray-400"> (รวม VAT ฿{entry.vatShippingFee.toFixed(2)})</span>
                      )}
                      {" · "}
                      รวม ฿{entry.totalCharge.toFixed(2)} ·{" "}
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
