"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SingleCombobox } from "@/components/ui/combobox";
import { Textarea } from "@/components/ui/textarea";
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
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  AlertCircle,
  CreditCard,
  FileImage,
  AlertTriangle,
  MoreVertical,
  Loader2,
} from "lucide-react";

import { useAllPayments } from "../hooks/use-all-payment";
import { useVerifyPayment, useRejectPayment } from "../hooks/use-verify-payment";
import { useEvents } from "../../events/hooks/use-events";
import { PaymentSlipStatus, PaymentSlipType } from "../types/enum";
import { IPaymentSlip } from "../types/interface";

const TAB_TYPE_MAP: Record<string, PaymentSlipType | undefined> = {
  deposits: PaymentSlipType.DEPOSIT_PAID,
  payments: PaymentSlipType.CARD_PAID,
  service: PaymentSlipType.SERVICE_PAID,
};

const getStatusColor = (status: PaymentSlipStatus) => {
  switch (status) {
    case PaymentSlipStatus.PENDING:
      return "bg-yellow-100 text-yellow-800";
    case PaymentSlipStatus.VERIFIED:
      return "bg-green-100 text-green-800";
    case PaymentSlipStatus.REJECTED:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: PaymentSlipStatus) => {
  switch (status) {
    case PaymentSlipStatus.PENDING:
      return <Clock className="h-4 w-4" />;
    case PaymentSlipStatus.VERIFIED:
      return <CheckCircle className="h-4 w-4" />;
    case PaymentSlipStatus.REJECTED:
      return <XCircle className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

const getTypeLabel = (type: PaymentSlipType) => {
  switch (type) {
    case PaymentSlipType.DEPOSIT_PAID:
      return "มัดจำ";
    case PaymentSlipType.CARD_PAID:
      return "ค่าบัตร/สินค้า";
    case PaymentSlipType.SERVICE_PAID:
      return "ค่ากด/ค่าบริการ";
  
    default:
      return type;
  }
};

export default function SlipVerification() {
  const queryClient = useQueryClient();

  const [selectedSlip, setSelectedSlip] = useState<IPaymentSlip | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectTargetId, setRejectTargetId] = useState<number | null>(null);
  const [rejectNotes, setRejectNotes] = useState("");
  const [rejectNotesTouched, setRejectNotesTouched] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("");
  const [page, setPage] = useState(1);

  const resetPage = () => setPage(1);

  const query = {
    page,
    pageSize: 10,
    ...(TAB_TYPE_MAP[selectedTab] && { type: TAB_TYPE_MAP[selectedTab] }),
    ...(statusFilter !== "all" && { status: statusFilter as PaymentSlipStatus }),
    ...(eventFilter && { eventId: Number(eventFilter) }),
    ...(searchTerm && { search: searchTerm }),
  };

  const { data, isLoading } = useAllPayments(query);
  const { mutate: verifyPayment, isPending: isVerifying } = useVerifyPayment();
  const { mutate: rejectPayment, isPending: isRejecting } = useRejectPayment();
  const { data: eventsData } = useEvents();

  const slips = data?.data ?? [];
  const meta = data?.pagination;

  const eventOptions = (eventsData?.data ?? []).map((e) => ({
    value: String(e.id),
    label: e.name,
  }));

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["payment-slips"] });

  const handleVerify = (slipId: number) => {
    verifyPayment({ id: slipId }, { onSuccess: () => { invalidate(); setIsDetailDialogOpen(false); } });
  };

  const openRejectDialog = (slipId: number) => {
    setRejectTargetId(slipId);
    setRejectNotes("");
    setRejectNotesTouched(false);
    setIsRejectDialogOpen(true);
  };

  const handleReject = () => {
    if (!rejectTargetId) return;
    if (!rejectNotes.trim()) { setRejectNotesTouched(true); return; }
    rejectPayment(
      { id: rejectTargetId, payload: { ...(rejectNotes && { notes: rejectNotes }) } },
      {
        onSuccess: () => {
          invalidate();
          setIsRejectDialogOpen(false);
          setIsDetailDialogOpen(false);
        },
      },
    );
  };

  const openSlipDetail = (slip: IPaymentSlip) => {
    setSelectedSlip(slip);
    setIsDetailDialogOpen(true);
  };

  return (
    <>
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
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ค้นหาชื่อลูกค้าหรือรหัสการจอง"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); resetPage(); }}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); resetPage(); }}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="กรองสถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">สถานะทั้งหมด</SelectItem>
                <SelectItem value={PaymentSlipStatus.PENDING}>รอตรวจสอบ</SelectItem>
                <SelectItem value={PaymentSlipStatus.VERIFIED}>ยืนยันแล้ว</SelectItem>
                <SelectItem value={PaymentSlipStatus.REJECTED}>ปฏิเสธแล้ว</SelectItem>
              </SelectContent>
            </Select>
            <SingleCombobox
              className="w-48"
              placeholder="กรองงาน"
              searchPlaceholder="ค้นหางาน..."
              emptyText="ไม่พบงาน"
              value={eventFilter}
              onChange={(val) => { setEventFilter(val); resetPage(); }}
              options={eventOptions}
            />
          </div>

          <Tabs value={selectedTab} onValueChange={(v) => { setSelectedTab(v); resetPage(); }}>
            <TabsList>
              <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
              <TabsTrigger value="deposits">สลิปมัดจำ</TabsTrigger>
              <TabsTrigger value="payments">สลิปค่าบัตร/สินค้า</TabsTrigger>
              <TabsTrigger value="service">สลิปค่ากด/ค่าบริการ</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>เลขที่สลิป</TableHead>
                      <TableHead>รหัสการจอง</TableHead>
                      <TableHead>ชื่อลูกค้า</TableHead>
                      <TableHead>งาน</TableHead>
                      <TableHead>ประเภท</TableHead>
                      <TableHead>ยอดระบบ</TableHead>
                      <TableHead>ยอดสลิป</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>วันที่</TableHead>
                      <TableHead>การจัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {slips.map((slip) => (
                      <TableRow key={slip.id}>
                        <TableCell className="font-medium">{slip.id}</TableCell>
                        <TableCell>{slip.booking.bookingCode}</TableCell>
                        <TableCell>{slip.booking.nameCustomer}</TableCell>
                        <TableCell>{slip.booking.event.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{getTypeLabel(slip.type)}</Badge>
                        </TableCell>
                        <TableCell>฿{slip.systemAmount}</TableCell>
                        <TableCell
                          className={
                            slip.slipAmount === slip.systemAmount
                              ? ""
                              : "text-red-600 font-medium"
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
                        <TableCell>
                          {new Date(slip.createdAt).toLocaleString("th-TH")}
                        </TableCell>
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
                              <DropdownMenuItem onClick={() => openSlipDetail(slip)}>
                                <Eye className="h-4 w-4 mr-2" />
                                ดูรายละเอียด
                              </DropdownMenuItem>
                              {slip.status === PaymentSlipStatus.PENDING && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => handleVerify(slip.id)}
                                    className="text-green-600"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    ยืนยัน
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => openRejectDialog(slip.id)}
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
                    {slips.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-10 text-muted-foreground">
                          ไม่พบข้อมูล
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}

              {meta && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    ทั้งหมด {meta.totalCounts} รายการ
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page <= 1}
                    >
                      ก่อนหน้า
                    </Button>
                    {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                      <Button
                        key={p}
                        variant={p === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= meta.totalPages}
                    >
                      ถัดไป
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>ตรวจสอบสลิป #{selectedSlip?.id}</DialogTitle>
            <DialogDescription>
              ตรวจสอบความถูกต้องของสลิปการชำระเงิน
            </DialogDescription>
          </DialogHeader>

          {selectedSlip && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>รูปสลิป</Label>
                <div className="border rounded-lg p-4 bg-gray-50">
                  {selectedSlip.imageUrl ? (
                    <div className="relative w-full h-80">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`${process.env.NEXT_PUBLIC_IMAGES_URL}/${selectedSlip.imageUrl}`}
                        alt="สลิปการชำระเงิน"
                        className="rounded object-contain w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
                      <FileImage className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

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
                      className={`text-2xl font-bold ${
                        selectedSlip.slipAmount === selectedSlip.systemAmount
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ชื่อลูกค้า</Label>
                  <p className="font-medium">{selectedSlip.booking.nameCustomer}</p>
                </div>
                <div>
                  <Label>รหัสการจอง</Label>
                  <p className="font-medium">{selectedSlip.booking.bookingCode}</p>
                </div>
                <div>
                  <Label>งาน</Label>
                  <p className="font-medium">{selectedSlip.booking.event.name}</p>
                </div>
                <div>
                  <Label>วันที่ส่งสลิป</Label>
                  <p className="font-medium">
                    {new Date(selectedSlip.createdAt).toLocaleString("th-TH")}
                  </p>
                </div>
              </div>

              {selectedSlip.notes && (
                <div className="space-y-2">
                  <Label>หมายเหตุการตรวจสอบ</Label>
                  <p className="text-sm text-gray-700">{selectedSlip.notes}</p>
                </div>
              )}

              {selectedSlip.status === PaymentSlipStatus.PENDING && (
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    className="text-red-600"
                    disabled={isVerifying}
                    onClick={() => openRejectDialog(selectedSlip.id)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    ปฏิเสธสลิป
                  </Button>
                  <Button
                    disabled={isVerifying}
                    onClick={() => handleVerify(selectedSlip.id)}
                  >
                    {isVerifying ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    ยืนยันสลิป
                  </Button>
                </div>
              )}

              {selectedSlip.status !== PaymentSlipStatus.PENDING && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedSlip.status)}
                    <span className="font-medium">
                      สลิปนี้ได้รับการ
                      {selectedSlip.status === PaymentSlipStatus.VERIFIED ? "ยืนยัน" : "ปฏิเสธ"}
                      แล้ว
                    </span>
                  </div>
                  {selectedSlip.reviewer && (
                    <p className="text-sm text-gray-600 mt-1">
                      โดย {selectedSlip.reviewer.firstName} {selectedSlip.reviewer.lastName}
                      {selectedSlip.reviewedAt && (
                        <> เมื่อ {new Date(selectedSlip.reviewedAt).toLocaleString("th-TH")}</>
                      )}
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

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>ปฏิเสธสลิป</DialogTitle>
            <DialogDescription>กรุณาระบุเหตุผลในการปฏิเสธสลิปนี้</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label>หมายเหตุ</Label>
                <span className="text-red-500">*</span>
              </div>
              <Textarea
                placeholder="กรอกเหตุผลการปฏิเสธ"
                value={rejectNotes}
                onChange={(e) => { setRejectNotes(e.target.value); setRejectNotesTouched(true); }}
                aria-invalid={rejectNotesTouched && !rejectNotes.trim()}
              />
              {rejectNotesTouched && !rejectNotes.trim() && (
                <p className="text-sm text-red-500">กรุณากรอกเหตุผลการปฏิเสธ</p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)} disabled={isRejecting}>
                ยกเลิก
              </Button>
              <Button variant="destructive" onClick={handleReject} disabled={isRejecting}>
                {isRejecting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
                ยืนยันการปฏิเสธ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
