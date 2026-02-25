"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";

type DepositStatus = "ACTIVE" | "USED" | "FORFEITED" | "REFUNDED";

type DepositRecord = {
  id: string;
  customer: string;
  event: string;
  amount: number;
  date: string;
  status: DepositStatus;
};

type FeeRecord = {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: "TICKET" | "HANDLING";
};

type RefundRecord = {
  id: string;
  customer: string;
  amount: number;
  reason: string;
  date: string;
};

const depositRecords: DepositRecord[] = [
  {
    id: "DEP-001",
    customer: "สมชาย ใจดี",
    event: "Concert Night",
    amount: 3000,
    date: "2026-02-01",
    status: "ACTIVE",
  },
  {
    id: "DEP-002",
    customer: "สมหญิง รักดี",
    event: "Fan Meeting",
    amount: 2000,
    date: "2026-02-02",
    status: "USED",
  },
  {
    id: "DEP-003",
    customer: "วิชัย มั่นคง",
    event: "Product Launch",
    amount: 2500,
    date: "2026-02-03",
    status: "FORFEITED",
  },
  {
    id: "DEP-004",
    customer: "มานี สุขใจ",
    event: "Charity Night",
    amount: 1800,
    date: "2026-02-04",
    status: "REFUNDED",
  },
];

const feeRecords: FeeRecord[] = [
  {
    id: "FEE-001",
    description: "ค่าบัตร Concert Night",
    amount: 1500,
    date: "2026-02-05",
    type: "TICKET",
  },
  {
    id: "FEE-002",
    description: "ค่ากดบัตร Fan Meeting",
    amount: 400,
    date: "2026-02-06",
    type: "HANDLING",
  },
  {
    id: "FEE-003",
    description: "ค่ากดบัตร Product Launch",
    amount: 500,
    date: "2026-02-07",
    type: "HANDLING",
  },
];

const refundRecords: RefundRecord[] = [
  {
    id: "REF-001",
    customer: "มานี สุขใจ",
    amount: 1800,
    reason: "ยกเลิกงาน",
    date: "2026-02-08",
  },
  {
    id: "REF-002",
    customer: "สมชาย ใจดี",
    amount: 500,
    reason: "โซนที่นั่งเต็ม",
    date: "2026-02-09",
  },
];

const statusColor: Record<DepositStatus, string> = {
  ACTIVE: "bg-blue-100 text-blue-800",
  USED: "bg-green-100 text-green-800",
  FORFEITED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

const currency = (value: number) =>
  value.toLocaleString("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 2,
  });

export default function FinancePage() {
  const [statusFilter, setStatusFilter] = useState<DepositStatus | "ALL">(
    "ALL",
  );
  const [searchTerm, setSearchTerm] = useState("");

  const depositSummary = useMemo(() => {
    const totalDeposit = depositRecords.reduce(
      (sum, record) => sum + record.amount,
      0,
    );
    const usedAsFee = depositRecords
      .filter((record) => record.status === "USED")
      .reduce((sum, record) => sum + record.amount, 0);
    const forfeited = depositRecords
      .filter((record) => record.status === "FORFEITED")
      .reduce((sum, record) => sum + record.amount, 0);
    const refunded = refundRecords.reduce(
      (sum, record) => sum + record.amount,
      0,
    );

    return {
      totalDeposit,
      usedAsFee,
      forfeited,
      refunded,
    };
  }, []);

  const filteredDeposits = useMemo(() => {
    return depositRecords.filter((record) => {
      const matchesStatus =
        statusFilter === "ALL" || record.status === statusFilter;
      const matchesSearch =
        record.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [statusFilter, searchTerm]);

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
              {currency(depositSummary.totalDeposit)}
            </p>
            <p className="text-xs text-gray-500 mt-2">รวมมัดจำจากทุกรายการ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">
              ใช้เป็นค่ากด
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-gray-900">
              {currency(depositSummary.usedAsFee)}
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
              {currency(depositSummary.forfeited)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              เนื่องจากไม่ปฏิบัติตามเงื่อนไข
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">
              เงินที่คืนลูกค้า
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-gray-900">
              {currency(depositSummary.refunded)}
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
                placeholder="ค้นหา ID ลูกค้า ชื่อ หรือชื่องาน"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>สถานะ</Label>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as DepositStatus | "ALL")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกสถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">ทั้งหมด</SelectItem>
                  <SelectItem value="ACTIVE">ยังถือมัดจำ</SelectItem>
                  <SelectItem value="USED">ใช้เป็นค่ากด</SelectItem>
                  <SelectItem value="FORFEITED">ยึดมัดจำ</SelectItem>
                  <SelectItem value="REFUNDED">คืนให้ลูกค้า</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="py-2 text-left">รหัส</th>
                  <th className="py-2 text-left">ลูกค้า</th>
                  <th className="py-2 text-left">งาน</th>
                  <th className="py-2 text-left">วันที่</th>
                  <th className="py-2 text-right">จำนวนเงิน</th>
                  <th className="py-2 text-center">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeposits.map((record) => (
                  <tr key={record.id} className="border-b last:border-0">
                    <td className="py-2">{record.id}</td>
                    <td className="py-2">{record.customer}</td>
                    <td className="py-2">{record.event}</td>
                    <td className="py-2">{record.date}</td>
                    <td className="py-2 text-right">
                      {currency(record.amount)}
                    </td>
                    <td className="py-2 text-center">
                      <Badge className={statusColor[record.status]}>
                        {record.status === "ACTIVE" && "ถือมัดจำ"}
                        {record.status === "USED" && "ใช้ค่ากดแล้ว"}
                        {record.status === "FORFEITED" && "ยึดมัดจำ"}
                        {record.status === "REFUNDED" && "คืนเงินแล้ว"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>ค่าบัตร & ค่ากด</CardTitle>
          </CardHeader>
          <CardContent>
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
                  {feeRecords.map((record) => (
                    <tr key={record.id} className="border-b last:border-0">
                      <td className="py-2">{record.description}</td>
                      <td className="py-2">{record.date}</td>
                      <td className="py-2">
                        <Badge variant="outline">
                          {record.type === "TICKET" ? "ค่าบัตร" : "ค่ากด"}
                        </Badge>
                      </td>
                      <td className="py-2 text-right">
                        {currency(record.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>เงินคืนลูกค้า</CardTitle>
          </CardHeader>
          <CardContent>
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
                  {refundRecords.map((record) => (
                    <tr key={record.id} className="border-b last:border-0">
                      <td className="py-2">{record.customer}</td>
                      <td className="py-2 text-gray-600">{record.reason}</td>
                      <td className="py-2">{record.date}</td>
                      <td className="py-2 text-right">
                        {currency(record.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
// finance.tsx
