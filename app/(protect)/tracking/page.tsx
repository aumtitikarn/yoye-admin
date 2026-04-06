"use client";

import { useState } from "react";
import { BillDialog } from "./components/BillDialog";
import { EditStatusDialog } from "./components/EditStatusDialog";
import { HistoryDialog } from "./components/history-dialog";
import { OrdersTable } from "./components/OrdersTable";
import type { IBookingOrder } from "./types/interface";
import { EBookingStatus } from "./types/enum";

export default function PaymentSummaryPage() {
  const [selectedItem, setSelectedItem] = useState<IBookingOrder | null>(null);
  const [isBillDialogOpen, setIsBillDialogOpen] = useState(false);
  const [billDialogMode, setBillDialogMode] = useState<"create" | "manage">("manage");
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleManageTicket = (item: IBookingOrder) => {
    setSelectedItem(item);
    setBillDialogMode(item.status === EBookingStatus.WAITING_SERVICE_FEE ? "create" : "manage");
    setIsBillDialogOpen(true);
  };

  const handleOpenStatusDialog = (item: IBookingOrder) => {
    setSelectedItem(item);
    setIsStatusDialogOpen(true);
  };

  const handleViewBillHistory = (item: IBookingOrder) => {
    setSelectedItem(item);
    setIsHistoryOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">สรุปยอดชำระ</h1>
        <p className="text-gray-600 mt-2">จัดการการชำระเงินและการจัดส่งบัตร</p>
      </div>

      <OrdersTable
        onManageTicket={handleManageTicket}
        onOpenStatusDialog={handleOpenStatusDialog}
        onViewBillHistory={handleViewBillHistory}
      />

      <BillDialog
        key={selectedItem?.id ?? "empty"}
        open={isBillDialogOpen}
        onOpenChange={setIsBillDialogOpen}
        item={selectedItem}
        mode={billDialogMode}
      />

      <HistoryDialog
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
        item={selectedItem}
      />

      <EditStatusDialog
        open={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
        item={selectedItem}
      />
    </div>
  );
}
