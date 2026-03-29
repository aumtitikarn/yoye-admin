"use client";

import { useState } from "react";
import { BillDialog } from "./components/BillDialog";
import { EditStatusDialog } from "./components/EditStatusDialog";
import { OrdersTable } from "./components/OrdersTable";
import { mockBillHistory } from "./components/mock-data";
import type { BillFormData } from "./components/types";
import type { EBookingStatus } from "./types/enum";
import type { IBookingOrder } from "./types/interface";

export default function PaymentSummaryPage() {
  const [selectedItem, setSelectedItem] = useState<IBookingOrder | null>(null);
  const [isBillDialogOpen, setIsBillDialogOpen] = useState(false);
  const [billDialogMode, setBillDialogMode] = useState<"create" | "manage">("manage");
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  const handleManageTicket = (item: IBookingOrder) => {
    setSelectedItem(item);
    setBillDialogMode(item.fulfillment ? "manage" : "create");
    setIsBillDialogOpen(true);
  };

  const handleOpenStatusDialog = (item: IBookingOrder) => {
    setSelectedItem(item);
    setIsStatusDialogOpen(true);
  };

  const handleSaveBill = (data: BillFormData) => {
    console.log("Saving bill:", { itemId: selectedItem?.id, ...data });
    // TODO: API call
  };

  const handleSaveStatus = (status: EBookingStatus, note: string) => {
    console.log("Saving status:", { itemId: selectedItem?.id, status, note });
    // TODO: API call
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
      />

      <BillDialog
        open={isBillDialogOpen}
        onOpenChange={setIsBillDialogOpen}
        item={selectedItem}
        mode={billDialogMode}
        history={selectedItem ? (mockBillHistory[selectedItem.id] ?? []) : []}
        onSave={handleSaveBill}
      />

      <EditStatusDialog
        open={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
        item={selectedItem}
        onSave={handleSaveStatus}
      />
    </div>
  );
}
