"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
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
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Upload,
  AlertCircle,
  CreditCard,
  DollarSign,
  RefreshCw,
  FileImage,
  AlertTriangle,
  MoreVertical,
} from "lucide-react";

type PaymentSlip = {
  id: string;
  bookingId: string;
  bookingName: string;
  customerName: string;
  type: string;
  amount: number;
  systemAmount: number;
  slipAmount: number;
  status: string;
  imageUrl: string;
  createdAt: string;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
};

type RefundRequest = {
  id: string;
  bookingId: string;
  bookingName: string;
  customerName: string;
  refundAmount: number;
  reason: string;
  status: string;
  createdAt: string;
  processedBy?: string;
  processedAt?: string;
  transferProof?: string;
};

export default function PaymentManagement() {
  const [paymentSlips, setPaymentSlips] = useState<PaymentSlip[]>([
    {
      id: "PS001",
      bookingId: "BK001",
      bookingName: "Concert Night 2024",
      customerName: "สมชาย ใจดี",
      type: "DEPOSIT",
      amount: 100,
      systemAmount: 100,
      slipAmount: 100,
      status: "PENDING",
      imageUrl: "/api/placeholder/300/200",
      createdAt: "2024-03-10 14:30",
    },
    {
      id: "PS002",
      bookingId: "BK002",
      bookingName: "Product Pre-order",
      customerName: "สมศรี รักดี",
      type: "PAYMENT",
      amount: 500,
      systemAmount: 500,
      slipAmount: 500,
      status: "VERIFIED",
      imageUrl: "/api/placeholder/300/200",
      createdAt: "2024-03-09 10:15",
      verifiedBy: "Admin",
      verifiedAt: "2024-03-09 10:45",
    },
    {
      id: "PS003",
      bookingId: "BK003",
      bookingName: "Fan Meeting",
      customerName: "วิชัย มั่นคง",
      type: "SERVICE_FEE",
      amount: 50,
      systemAmount: 50,
      slipAmount: 45,
      status: "REJECTED",
      imageUrl: "/api/placeholder/300/200",
      createdAt: "2024-03-08 16:20",
      notes: "ยอดเงินไม่ตรงกับระบบ",
    },
  ]);

  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([
    {
      id: "RF001",
      bookingId: "BK001",
      bookingName: "Concert Night 2024",
      customerName: "สมชาย ใจดี",
      refundAmount: 50,
      reason: "กดบัตรไม่ได้ครบ 10 ใบ",
      status: "PENDING",
      createdAt: "2024-03-10 15:00",
    },
    {
      id: "RF002",
      bookingId: "BK002",
      bookingName: "Product Pre-order",
      customerName: "สมศรี รักดี",
      refundAmount: 200,
      reason: "ยกเลิกคำสั่งซื้อ",
      status: "APPROVED",
      createdAt: "2024-03-09 11:00",
      processedAt: "2024-03-09 14:30",
      processedBy: "Admin",
      transferProof: "/api/placeholder/300/200",
    },
  ]);

  const [selectedSlip, setSelectedSlip] = useState<PaymentSlip | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("deposits");
  const [searchTerm, setSearchTerm] = useState("");
  const [verificationNotes, setVerificationNotes] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "VERIFIED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      case "VERIFIED":
        return <CheckCircle className="h-4 w-4" />;
      case "REJECTED":
        return <XCircle className="h-4 w-4" />;
      case "APPROVED":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "DEPOSIT":
        return "มัดจำ";
      case "PAYMENT":
        return "ค่าบัตร/สินค้า";
      case "SERVICE_FEE":
        return "ค่ากด/ค่าบริการ";
      default:
        return type;
    }
  };

  const filteredSlips = paymentSlips.filter((slip) => {
    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "deposits" && slip.type === "DEPOSIT") ||
      (selectedTab === "payments" && slip.type === "PAYMENT") ||
      (selectedTab === "service" && slip.type === "SERVICE_FEE");

    const matchesSearch =
      slip.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slip.bookingId.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleVerification = (
    slipId: string,
    status: "VERIFIED" | "REJECTED",
  ) => {
    setPaymentSlips((prev) =>
      prev.map((slip) =>
        slip.id === slipId
          ? {
              ...slip,
              status,
              verifiedBy: "Admin",
              verifiedAt: new Date().toISOString(),
              ...(verificationNotes && { notes: verificationNotes }),
            }
          : slip,
      ),
    );
    setIsDetailDialogOpen(false);
    setVerificationNotes("");
  };

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

  const openSlipDetail = (slip: PaymentSlip) => {
    setSelectedSlip(slip);
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Payment & Slip Verification
        </h1>
        <p className="text-gray-600">
          ตรวจสอบสลิปการชำระเงินและจัดการการคืนเงิน
        </p>
      </div>

      {/* Payment Slips Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            ตรวจสอบสลิปการชำระเงิน
          </CardTitle>
          <CardDescription>
            ตรวจสอบและยืนยันสลิปการชำระเงินจากลูกค้า
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ค้นหาชื่อลูกค้าหรือเลขที่คิว"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              ตัวกรอง
            </Button>
          </div>

          {/* Tabs for different slip types */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
              <TabsTrigger value="deposits">สลิปมัดจำ</TabsTrigger>
              <TabsTrigger value="payments">สลิปค่าบัตร/สินค้า</TabsTrigger>
              <TabsTrigger value="service">สลิปค่ากด/ค่าบริการ</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>เลขที่สลิป</TableHead>
                    <TableHead>เลขที่คิว</TableHead>
                    <TableHead>ชื่อลูกค้า</TableHead>
                    <TableHead>ประเภท</TableHead>
                    <TableHead>ยอดระบบ</TableHead>
                    <TableHead>ยอดสลิป</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>วันที่</TableHead>
                    <TableHead>การจัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSlips.map((slip) => (
                    <TableRow key={slip.id}>
                      <TableCell className="font-medium">{slip.id}</TableCell>
                      <TableCell>{slip.bookingId}</TableCell>
                      <TableCell>{slip.customerName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getTypeLabel(slip.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>฿{slip.systemAmount}</TableCell>
                      <TableCell
                        className={
                          slip.slipAmount !== slip.systemAmount
                            ? "text-red-600 font-medium"
                            : ""
                        }
                      >
                        ฿{slip.slipAmount}
                        {slip.slipAmount !== slip.systemAmount && (
                          <AlertTriangle className="h-3 w-3 inline ml-1" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(slip.status)}>
                          {getStatusIcon(slip.status)}
                          <span className="ml-1">{slip.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>{slip.createdAt}</TableCell>
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
                            <DropdownMenuItem
                              onClick={() => openSlipDetail(slip)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              ดูรายละเอียด
                            </DropdownMenuItem>
                            {slip.status === "PENDING" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleVerification(slip.id, "VERIFIED")
                                  }
                                  className="text-green-600"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  ยืนยัน
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleVerification(slip.id, "REJECTED")
                                  }
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Refund Management Section */}
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>เลขที่คำขอ</TableHead>
                <TableHead>เลขที่คิว</TableHead>
                <TableHead>ชื่อลูกค้า</TableHead>
                <TableHead>จำนวนเงิน</TableHead>
                <TableHead>เหตุผล</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>วันที่ขอ</TableHead>
                <TableHead>การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {refundRequests.map((refund) => (
                <TableRow key={refund.id}>
                  <TableCell className="font-medium">{refund.id}</TableCell>
                  <TableCell>{refund.bookingId}</TableCell>
                  <TableCell>{refund.customerName}</TableCell>
                  <TableCell className="font-medium">
                    ฿{refund.refundAmount}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {refund.reason}
                  </TableCell>
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
                              onClick={() =>
                                handleRefund(refund.id, "APPROVED")
                              }
                              className="text-green-600"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              อนุมัติ
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleRefund(refund.id, "REJECTED")
                              }
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

      {/* Slip Verification Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>ตรวจสอบสลิป {selectedSlip?.id}</DialogTitle>
            <DialogDescription>
              ตรวจสอบความถูกต้องของสลิปการชำระเงิน
            </DialogDescription>
          </DialogHeader>

          {selectedSlip && (
            <div className="space-y-6">
              {/* Slip Image */}
              <div className="space-y-2">
                <Label>รูปสลิป</Label>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
                    <FileImage className="h-12 w-12 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Comparison */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">ยอดเงินตามระบบ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      ฿{selectedSlip.systemAmount}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      ประเภท: {getTypeLabel(selectedSlip.type)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">ยอดเงินในสลิป</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`text-2xl font-bold ${selectedSlip.slipAmount !== selectedSlip.systemAmount ? "text-red-600" : "text-green-600"}`}
                    >
                      ฿{selectedSlip.slipAmount}
                    </div>
                    {selectedSlip.slipAmount !== selectedSlip.systemAmount && (
                      <p className="text-sm text-red-600 mt-1">
                        ยอดเงินไม่ตรงกับระบบ
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ชื่อลูกค้า</Label>
                  <p className="font-medium">{selectedSlip.customerName}</p>
                </div>
                <div>
                  <Label>เลขที่คิว</Label>
                  <p className="font-medium">{selectedSlip.bookingId}</p>
                </div>
                <div>
                  <Label>งาน</Label>
                  <p className="font-medium">{selectedSlip.bookingName}</p>
                </div>
                <div>
                  <Label>วันที่ส่งสลิป</Label>
                  <p className="font-medium">{selectedSlip.createdAt}</p>
                </div>
              </div>

              {/* Verification Notes */}
              <div className="space-y-2">
                <Label>หมายเหตุการตรวจสอบ</Label>
                <Textarea
                  placeholder="กรอกหมายเหตุ (ถ้ามี)"
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                />
              </div>

              {/* Actions */}
              {selectedSlip.status === "PENDING" && (
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    className="text-red-600"
                    onClick={() =>
                      handleVerification(selectedSlip.id, "REJECTED")
                    }
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    ปฏิเสธสลิป
                  </Button>
                  <Button
                    onClick={() =>
                      handleVerification(selectedSlip.id, "VERIFIED")
                    }
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    ยืนยันสลิป
                  </Button>
                </div>
              )}

              {selectedSlip.status !== "PENDING" && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedSlip.status)}
                    <span className="font-medium">
                      สลิปนี้ได้รับการ
                      {selectedSlip.status === "VERIFIED" ? "ยืนยัน" : "ปฏิเสธ"}
                      แล้ว
                    </span>
                  </div>
                  {selectedSlip.verifiedBy && (
                    <p className="text-sm text-gray-600 mt-1">
                      โดย {selectedSlip.verifiedBy} เมื่อ{" "}
                      {selectedSlip.verifiedAt}
                    </p>
                  )}
                  {selectedSlip.notes && (
                    <p className="text-sm text-gray-600 mt-1">
                      หมายเหตุ: {selectedSlip.notes}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
