"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SingleCombobox } from "@/components/ui/combobox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  AlertCircle,
  RefreshCw,
  MoreVertical,
} from "lucide-react";

type RefundRequest = {
  id: string;
  bookingId: string;
  bookerName: string;
  customerNickname: string;
  bankName: string;
  payoutChannel: string;
  accountHolder: string;
  refundAmount: number;
  reason: string;
  status: string;
  createdAt: string;
  processedBy?: string;
  processedAt?: string;
  transferProof?: string;
};

const initialRefunds: RefundRequest[] = [
  {
    id: "RF001",
    bookingId: "BK001",
    bookerName: "สมชาย ใจดี",
    customerNickname: "คุณเอ",
    bankName: "กสิกรไทย",
    payoutChannel: "XXX-1-23456-7",
    accountHolder: "นายสมชาย ใจดี",
    refundAmount: 50,
    reason: "กดบัตรไม่ได้ครบ 10 ใบ",
    status: "PENDING",
    createdAt: "2024-03-10 15:00",
  },
  {
    id: "RF002",
    bookingId: "BK002",
    bookerName: "สมศรี รักดี",
    customerNickname: "Nok",
    bankName: "ไทยพาณิชย์",
    payoutChannel: "093-123-4567 (PromptPay)",
    accountHolder: "นางสาวสมศรี รักดี",
    refundAmount: 200,
    reason: "ยกเลิกคำสั่งซื้อ",
    status: "APPROVED",
    createdAt: "2024-03-09 11:00",
    processedAt: "2024-03-09 14:30",
    processedBy: "Admin",
    transferProof: "/api/placeholder/300/200",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "APPROVED":
      return "bg-green-100 text-green-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "PENDING":
      return <Clock className="h-4 w-4" />;
    case "APPROVED":
      return <CheckCircle className="h-4 w-4" />;
    case "REJECTED":
      return <XCircle className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

export default function RefundManagement() {
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>(initialRefunds);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bookingFilter, setBookingFilter] = useState("all");

  const uniqueBookings = Array.from(
    new Map(refundRequests.map((r) => [r.bookingId, r.bookingId])).entries(),
  );

  const filteredRefunds = refundRequests.filter((refund) => {
    const matchesSearch =
      refund.bookerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.customerNickname.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || refund.status === statusFilter;
    const matchesBooking = bookingFilter === "all" || refund.bookingId === bookingFilter;

    return matchesSearch && matchesStatus && matchesBooking;
  });

  const handleRefund = (refundId: string, status: "APPROVED" | "REJECTED") => {
    setRefundRequests((prev) =>
      prev.map((refund) =>
        refund.id === refundId
          ? {
              ...refund,
              status,
              processedBy: "Admin",
              processedAt: new Date().toISOString(),
            }
          : refund,
      ),
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          การจัดการคืนเงิน
        </CardTitle>
        <CardDescription>
          รายการคิวที่รอการคืนเงินและประวัติการคืนเงิน
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="ค้นหาชื่อผู้จอง ชื่อเล่น หรือเลขที่คิว"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="กรองสถานะ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">สถานะทั้งหมด</SelectItem>
              <SelectItem value="PENDING">รอดำเนินการ</SelectItem>
              <SelectItem value="APPROVED">อนุมัติแล้ว</SelectItem>
              <SelectItem value="REJECTED">ปฏิเสธแล้ว</SelectItem>
            </SelectContent>
          </Select>
          <SingleCombobox
            className="w-48"
            placeholder="กรองงาน"
            searchPlaceholder="ค้นหางาน..."
            emptyText="ไม่พบงาน"
            value={bookingFilter === "all" ? "" : bookingFilter}
            onChange={(val) => setBookingFilter(val || "all")}
            options={[
              { value: "all", label: "งานทั้งหมด" },
              ...uniqueBookings.map(([id]) => ({ value: id, label: id })),
            ]}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>เลขที่คำขอ</TableHead>
              <TableHead>เลขที่คิว</TableHead>
              <TableHead>ชื่อเล่น/ผู้จอง</TableHead>
              <TableHead>ธนาคาร</TableHead>
              <TableHead>บัญชี / PromptPay / บัตร ปชช.</TableHead>
              <TableHead>ชื่อบัญชี</TableHead>
              <TableHead>จำนวนเงินที่คืน</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead>วันที่ขอ</TableHead>
              <TableHead>การจัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRefunds.map((refund) => (
              <TableRow key={refund.id}>
                <TableCell className="font-medium">{refund.id}</TableCell>
                <TableCell>{refund.bookingId}</TableCell>
                <TableCell className="space-y-1">
                  <p className="font-medium">{refund.bookerName}</p>
                  <p className="text-xs text-muted-foreground">
                    ({refund.customerNickname})
                  </p>
                </TableCell>
                <TableCell>{refund.bankName}</TableCell>
                <TableCell>{refund.payoutChannel}</TableCell>
                <TableCell>{refund.accountHolder}</TableCell>
                <TableCell className="font-medium">฿{refund.refundAmount}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(refund.status)}>
                    {getStatusIcon(refund.status)}
                    <span className="ml-1">{refund.status}</span>
                  </Badge>
                </TableCell>
                <TableCell>{refund.createdAt}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        suppressHydrationWarning
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        ดูรายละเอียด
                      </DropdownMenuItem>
                      {refund.status === "PENDING" && (
                        <>
                          <DropdownMenuItem
                            onClick={() => handleRefund(refund.id, "APPROVED")}
                            className="text-green-600"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            อนุมัติ
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleRefund(refund.id, "REJECTED")}
                            className="text-red-600"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            ปฏิเสธ
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
