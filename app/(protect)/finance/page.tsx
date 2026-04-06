"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useFinanceSummary } from "./hooks/use-finance-summary";
import { useFinanceDeposits } from "./hooks/use-finance-deposits";
import { useFinanceFees } from "./hooks/use-finance-fees";
import { useFinanceRefunds } from "./hooks/use-finance-refunds";
import { DepositBookingStatus } from "./types/enum";
import { IMeta } from "@/types/globalType";

const statusColor: Record<DepositBookingStatus, string> = {
  DEPOSIT_PENDING: "bg-blue-100 text-blue-800",
  DEPOSIT_USED: "bg-green-100 text-green-800",
  DEPOSIT_FORFEITED: "bg-red-100 text-red-800",
  WAITING_REFUND: "bg-yellow-100 text-yellow-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

const statusLabel: Record<DepositBookingStatus, string> = {
  DEPOSIT_PENDING: "ถือมัดจำ",
  DEPOSIT_USED: "ใช้เป็นค่ากด",
  DEPOSIT_FORFEITED: "ยึดมัดจำ",
  WAITING_REFUND: "รอคืนเงิน",
  REFUNDED: "คืนเงินแล้ว",
};

const currency = (value: number) =>
  value.toLocaleString("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 2,
  });

const formatDate = (iso: string) => iso.slice(0, 10);

function PaginationControls({
  meta,
  onPrev,
  onNext,
}: {
  meta?: IMeta;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (!meta) return null;

  return (
    <div className="flex items-center justify-between border-t pt-4">
      <p className="text-sm text-gray-500">
        ทั้งหมด {meta.totalCounts} รายการ • หน้า {meta.page} / {meta.totalPages}
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onPrev} disabled={meta.page <= 1}>
          ก่อนหน้า
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={meta.page >= meta.totalPages}
        >
          ถัดไป
        </Button>
      </div>
    </div>
  );
}

export default function FinancePage() {
  const [statusFilter, setStatusFilter] = useState<DepositBookingStatus | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [feesSearchTerm, setFeesSearchTerm] = useState("");
  const [depositPage, setDepositPage] = useState(1);
  const [feesPage, setFeesPage] = useState(1);
  const [refundsPage, setRefundsPage] = useState(1);

  const { data: summaryResponse, isLoading: isSummaryLoading } = useFinanceSummary();
  const { data: depositsResponse, isLoading: isDepositsLoading } = useFinanceDeposits({
    page: depositPage,
    pageSize: 10,
    status: statusFilter === "ALL" ? undefined : statusFilter,
    search: searchTerm || undefined,
  });
  const { data: feesResponse, isLoading: isFeesLoading } = useFinanceFees({
    page: feesPage,
    pageSize: 10,
    search: feesSearchTerm || undefined,
  });
  const { data: refundsResponse, isLoading: isRefundsLoading } = useFinanceRefunds({
    page: refundsPage,
    pageSize: 10,
  });

  const summary = summaryResponse?.data;
  const deposits = depositsResponse?.data ?? [];
  const depositsMeta = depositsResponse?.pagination ?? depositsResponse?.meta;
  const fees = feesResponse?.data ?? [];
  const feesMeta = feesResponse?.pagination ?? feesResponse?.meta;
  const refunds = refundsResponse?.data ?? [];
  const refundsMeta = refundsResponse?.pagination ?? refundsResponse?.meta;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">ภาพรวมการเงิน</h1>
        <p className="text-gray-600 mt-2">
          ระบบบันทึกมัดจำ ค่าบัตร ค่ากด และเงินที่คืนให้ลูกค้า พร้อมสรุปยอดสำคัญ
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">มัดจำรวม</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-gray-900">
              {isSummaryLoading ? "กำลังโหลด..." : currency(summary?.totalDeposit ?? 0)}
            </p>
            <p className="text-xs text-gray-500 mt-2">รวมมัดจำจากทุกรายการ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">ใช้เป็นค่ากด</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-gray-900">
              {isSummaryLoading ? "กำลังโหลด..." : currency(summary?.usedAsFee ?? 0)}
            </p>
            <p className="text-xs text-gray-500 mt-2">จากมัดจำที่ถูกนำไปใช้</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">ยึดมัดจำ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-gray-900">
              {isSummaryLoading ? "กำลังโหลด..." : currency(summary?.forfeited ?? 0)}
            </p>
            <p className="text-xs text-gray-500 mt-2">เนื่องจากไม่ปฏิบัติตามเงื่อนไข</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">เงินที่คืนลูกค้า</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-gray-900">
              {isSummaryLoading ? "กำลังโหลด..." : currency(summary?.refunded ?? 0)}
            </p>
            <p className="text-xs text-gray-500 mt-2">ยอดคืนตามข้อตกลง</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>รายการมัดจำ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="deposit-search">ค้นหา</Label>
              <Input
                id="deposit-search"
                placeholder="ค้นหา ID รหัสจอง ชื่อลูกค้า หรือชื่องาน"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setDepositPage(1);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>สถานะ</Label>
              <Select
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v as DepositBookingStatus | "ALL");
                  setDepositPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกสถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">ทั้งหมด</SelectItem>
                  <SelectItem value={DepositBookingStatus.DEPOSIT_PENDING}>ถือมัดจำ</SelectItem>
                  <SelectItem value={DepositBookingStatus.DEPOSIT_USED}>ใช้เป็นค่ากด</SelectItem>
                  <SelectItem value={DepositBookingStatus.DEPOSIT_FORFEITED}>ยึดมัดจำ</SelectItem>
                  <SelectItem value={DepositBookingStatus.WAITING_REFUND}>รอคืนเงิน</SelectItem>
                  <SelectItem value={DepositBookingStatus.REFUNDED}>คืนเงินแล้ว</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="py-2 text-left">รหัสจอง</th>
                  <th className="py-2 text-left">ลูกค้า</th>
                  <th className="py-2 text-left">งาน</th>
                  <th className="py-2 text-left">วันที่</th>
                  <th className="py-2 text-right">จำนวนเงิน</th>
                  <th className="py-2 text-center">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {isDepositsLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8">
                      <div className="flex items-center justify-center text-gray-500">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        กำลังโหลดข้อมูล
                      </div>
                    </td>
                  </tr>
                ) : deposits.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      ไม่พบรายการมัดจำ
                    </td>
                  </tr>
                ) : (
                  deposits.map((record) => (
                    <tr key={record.id} className="border-b last:border-0">
                      <td className="py-2">{record.bookingCode}</td>
                      <td className="py-2">{record.customer ?? "—"}</td>
                      <td className="py-2">{record.event ?? "—"}</td>
                      <td className="py-2">{formatDate(record.date)}</td>
                      <td className="py-2 text-right">{currency(record.amount)}</td>
                      <td className="py-2 text-center">
                        <Badge className={statusColor[record.status]}>
                          {statusLabel[record.status]}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <PaginationControls
            meta={depositsMeta}
            onPrev={() => setDepositPage((current) => Math.max(1, current - 1))}
            onNext={() =>
              setDepositPage((current) =>
                depositsMeta ? Math.min(depositsMeta.totalPages, current + 1) : current,
              )
            }
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>ค่าบัตร & ค่ากด</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fees-search">ค้นหา</Label>
              <Input
                id="fees-search"
                placeholder="ค้นหารายละเอียดค่าบัตรหรือค่ากด"
                value={feesSearchTerm}
                onChange={(e) => {
                  setFeesSearchTerm(e.target.value);
                  setFeesPage(1);
                }}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="py-2 text-left">รายละเอียด</th>
                    <th className="py-2 text-left">วันที่</th>
                    <th className="py-2 text-left">ประเภท</th>
                    <th className="py-2 text-right">จำนวนเงิน</th>
                  </tr>
                </thead>
                <tbody>
                  {isFeesLoading ? (
                    <tr>
                      <td colSpan={4} className="py-8">
                        <div className="flex items-center justify-center text-gray-500">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          กำลังโหลดข้อมูล
                        </div>
                      </td>
                    </tr>
                  ) : fees.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">
                        ไม่พบรายการค่าบัตรหรือค่ากด
                      </td>
                    </tr>
                  ) : (
                    fees.map((record) => (
                      <tr key={record.id} className="border-b last:border-0">
                        <td className="py-2">{record.description}</td>
                        <td className="py-2">{formatDate(record.date)}</td>
                        <td className="py-2">
                          <Badge variant="outline">
                            {record.type === "TICKET" ? "ค่าบัตร" : "ค่ากด"}
                          </Badge>
                        </td>
                        <td className="py-2 text-right">{currency(record.amount)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <PaginationControls
              meta={feesMeta}
              onPrev={() => setFeesPage((current) => Math.max(1, current - 1))}
              onNext={() =>
                setFeesPage((current) =>
                  feesMeta ? Math.min(feesMeta.totalPages, current + 1) : current,
                )
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>เงินคืนลูกค้า</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="py-2 text-left">ลูกค้า</th>
                    <th className="py-2 text-left">เหตุผล</th>
                    <th className="py-2 text-left">วันที่</th>
                    <th className="py-2 text-right">จำนวนเงิน</th>
                  </tr>
                </thead>
                <tbody>
                  {isRefundsLoading ? (
                    <tr>
                      <td colSpan={4} className="py-8">
                        <div className="flex items-center justify-center text-gray-500">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          กำลังโหลดข้อมูล
                        </div>
                      </td>
                    </tr>
                  ) : refunds.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">
                        ไม่พบรายการคืนเงิน
                      </td>
                    </tr>
                  ) : (
                    refunds.map((record) => (
                      <tr key={record.id} className="border-b last:border-0">
                        <td className="py-2">{record.customer ?? "—"}</td>
                        <td className="py-2 text-gray-600">{record.reason ?? "—"}</td>
                        <td className="py-2">{formatDate(record.date)}</td>
                        <td className="py-2 text-right">{currency(record.amount)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <PaginationControls
              meta={refundsMeta}
              onPrev={() => setRefundsPage((current) => Math.max(1, current - 1))}
              onNext={() =>
                setRefundsPage((current) =>
                  refundsMeta ? Math.min(refundsMeta.totalPages, current + 1) : current,
                )
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
