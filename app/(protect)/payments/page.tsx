"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, RefreshCw } from "lucide-react";
import SlipVerification from "./components/SlipVerification";
import RefundManagement from "./components/RefundManagement";

export default function PaymentManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Payment & Slip Verification
        </h1>
        <p className="text-gray-600">
          ตรวจสอบสลิปการชำระเงินและจัดการการคืนเงิน
        </p>
      </div>

      <Tabs defaultValue="slips">
        <TabsList className="bg-gray-200">
          <TabsTrigger value="slips" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            ตรวจสอบสลิป
          </TabsTrigger>
          <TabsTrigger value="refunds" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            การจัดการคืนเงิน
          </TabsTrigger>
        </TabsList>

        <TabsContent value="slips" className="mt-4">
          <SlipVerification />
        </TabsContent>

        <TabsContent value="refunds" className="mt-4">
          <RefundManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
