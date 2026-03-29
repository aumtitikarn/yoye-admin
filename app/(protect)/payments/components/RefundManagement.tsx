"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { Separator } from "@/components/ui/separator";
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
  Banknote,
  Loader2,
} from "lucide-react";
import { RefundStatus } from "../types/enum";
import { IRefundRequest } from "../types/interface";
import { useRefundRequests } from "../hooks/use-refund-requests";
import { useUpdateRefundStatus } from "../hooks/use-update-status-refund";
import { useEvents } from "../../events/hooks/use-events";

const getStatusColor = (status: string) => {
  switch (status) {
    case RefundStatus.REQUESTED: return "bg-yellow-100 text-yellow-800";
    case RefundStatus.APPROVED:  return "bg-blue-100 text-blue-800";
    case RefundStatus.REJECTED:  return "bg-red-100 text-red-800";
    case RefundStatus.PAID:      return "bg-green-100 text-green-800";
    default:                     return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case RefundStatus.REQUESTED: return <Clock className="h-4 w-4" />;
    case RefundStatus.APPROVED:  return <CheckCircle className="h-4 w-4" />;
    case RefundStatus.REJECTED:  return <XCircle className="h-4 w-4" />;
    case RefundStatus.PAID:      return <Banknote className="h-4 w-4" />;
    default:                     return <AlertCircle className="h-4 w-4" />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case RefundStatus.REQUESTED: return "รอดำเนินการ";
    case RefundStatus.APPROVED:  return "อนุมัติแล้ว";
    case RefundStatus.REJECTED:  return "ปฏิเสธแล้ว";
    case RefundStatus.PAID:      return "โอนเงินแล้ว";
    default:                     return status;
  }
};


export default function RefundManagement() {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedRefund, setSelectedRefund] = useState<IRefundRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<RefundStatus | "">("");
  const [statusNote, setStatusNote] = useState("");
  const [statusNoteTouched, setStatusNoteTouched] = useState(false);

  const resetPage = () => setPage(1);

  const query = {
    page,
    pageSize: 10,
    ...(statusFilter !== "all" && { status: statusFilter as RefundStatus }),
    ...(eventFilter && { eventId: Number(eventFilter) }),
    ...(searchTerm && { search: searchTerm }),
  };

  const { data, isLoading } = useRefundRequests(query);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateRefundStatus();
  const { data: eventsData } = useEvents();

  const refunds = data?.data ?? [];
  const meta = data?.pagination;

  const eventOptions = (eventsData?.data ?? []).map((e) => ({
    value: String(e.id),
    label: e.name,
  }));

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["refund-requests"] });

  const openStatusDialog = (refund: IRefundRequest, preselect?: RefundStatus) => {
    setSelectedRefund(refund);
    setTargetStatus(preselect ?? "");
    setStatusNote("");
    setStatusNoteTouched(false);
    setIsStatusDialogOpen(true);
  };

  const handleStatusChange = () => {
    if (!selectedRefund || !targetStatus) return;
    if (targetStatus === RefundStatus.REJECTED && !statusNote.trim()) {
      setStatusNoteTouched(true);
      return;
    }
    updateStatus(
      { id: selectedRefund.id, payload: { status: targetStatus, ...(statusNote.trim() && { note: statusNote }) } },
      {
        onSuccess: () => {
          invalidate();
          setIsStatusDialogOpen(false);
          setIsDetailOpen(false);
        },
      },
    );
  };

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          การจัดการคืนเงิน
        </CardTitle>
        <CardDescription>
          รายการจองที่รอการคืนเงินและประวัติการคืนเงิน
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="ค้นหาชื่อผู้จอง หรือรหัสการจอง"
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
              <SelectItem value={RefundStatus.REQUESTED}>รอดำเนินการ</SelectItem>
              <SelectItem value={RefundStatus.APPROVED}>อนุมัติแล้ว</SelectItem>
              <SelectItem value={RefundStatus.REJECTED}>ปฏิเสธแล้ว</SelectItem>
              <SelectItem value={RefundStatus.PAID}>โอนเงินแล้ว</SelectItem>
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

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>เลขที่คำขอ</TableHead>
                <TableHead>รหัสการจอง</TableHead>
                <TableHead>ชื่อลูกค้า</TableHead>
                <TableHead>งาน</TableHead>
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
              {refunds.map((refund) => (
                <TableRow key={refund.id}>
                  <TableCell className="font-medium">{refund.id}</TableCell>
                  <TableCell>{refund.booking.bookingCode}</TableCell>
                  <TableCell>{refund.booking.nameCustomer}</TableCell>
                  <TableCell>{refund.booking.event.name}</TableCell>
                  <TableCell>{refund.bankName}</TableCell>
                  <TableCell>{refund.accountNumber}</TableCell>
                  <TableCell>{refund.accountHolder}</TableCell>
                  <TableCell className="font-medium">฿{refund.amount}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(refund.status)}>
                      {getStatusIcon(refund.status)}
                      <span className="ml-1">{getStatusLabel(refund.status)}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(refund.requestedAt).toLocaleString("th-TH")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" suppressHydrationWarning>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedRefund(refund); setIsDetailOpen(true); }}>
                          <Eye className="h-4 w-4 mr-2" />
                          ดูรายละเอียด
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openStatusDialog(refund)}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          เปลี่ยนสถานะ
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {refunds.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-10 text-muted-foreground">
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
      </CardContent>
    </Card>

    <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {"คำขอคืนเงิน "}
            <span className="text-muted-foreground font-normal text-sm">#{selectedRefund?.id}</span>
          </DialogTitle>
          <DialogDescription className="sr-only">รายละเอียดคำขอคืนเงิน</DialogDescription>
        </DialogHeader>

        {selectedRefund && (
          <div className="space-y-5">
            {/* Status + Amount */}
            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
              <Badge className={getStatusColor(selectedRefund.status)}>
                {getStatusIcon(selectedRefund.status)}
                <span className="ml-1">{getStatusLabel(selectedRefund.status)}</span>
              </Badge>
              <span className="text-2xl font-bold text-green-600">฿{selectedRefund.amount.toLocaleString()}</span>
            </div>

            {/* Booking */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">ข้อมูลการจอง</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">รหัสการจอง</p>
                  <p className="font-medium">{selectedRefund.booking.bookingCode}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">รหัสการจอง</p>
                  <p className="font-medium">{selectedRefund.booking.bookingCode}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">ชื่อลูกค้า</p>
                  <p className="font-medium">{selectedRefund.booking.nameCustomer}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">งาน</p>
                  <p className="font-medium">{selectedRefund.booking.event.name}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Bank */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">บัญชีรับเงิน</p>
              <div className="rounded-lg border bg-card p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ธนาคาร</span>
                  <span className="font-medium">{selectedRefund.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">เลขบัญชี / PromptPay</span>
                  <span className="font-medium">{selectedRefund.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ชื่อบัญชี</span>
                  <span className="font-medium">{selectedRefund.accountHolder}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Reason & Dates */}
            <div className="space-y-3 text-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">เหตุผลและวันที่</p>
              <div className="rounded-lg bg-muted/50 px-4 py-3">
                <p className="text-muted-foreground text-xs mb-1">เหตุผล</p>
                <p className="font-medium">{selectedRefund.reason}</p>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <p className="text-muted-foreground">วันที่ขอ</p>
                  <p className="font-medium">{new Date(selectedRefund.requestedAt).toLocaleString("th-TH")}</p>
                </div>
                {selectedRefund.processedAt && (
                  <div>
                    <p className="text-muted-foreground">วันที่ดำเนินการ</p>
                    <p className="font-medium">{new Date(selectedRefund.processedAt).toLocaleString("th-TH")}</p>
                  </div>
                )}
                {selectedRefund.processedBy && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground">ดำเนินการโดย</p>
                    <p className="font-medium">{selectedRefund.processedBy.firstName} {selectedRefund.processedBy.lastName}</p>
                  </div>
                )}
              </div>
            </div>

            {(selectedRefund.status === RefundStatus.REQUESTED || selectedRefund.status === RefundStatus.APPROVED) && (
              <div className="flex justify-end pt-2">
                <Button onClick={() => openStatusDialog(selectedRefund)}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  เปลี่ยนสถานะ
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>

    <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>เปลี่ยนสถานะ</DialogTitle>
          <DialogDescription>
            {selectedRefund?.booking.nameCustomer} — {selectedRefund?.booking.bookingCode}
          </DialogDescription>
        </DialogHeader>
        {selectedRefund && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
              <span className="text-sm text-muted-foreground">สถานะปัจจุบัน</span>
              <Badge className={getStatusColor(selectedRefund.status)}>
                {getStatusIcon(selectedRefund.status)}
                <span className="ml-1">{getStatusLabel(selectedRefund.status)}</span>
              </Badge>
            </div>

            <div className="space-y-2">
              <Label>สถานะใหม่</Label>
              <Select value={targetStatus} onValueChange={(v) => setTargetStatus(v as RefundStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกสถานะ" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(RefundStatus)
                    .filter((s) => s !== selectedRefund.status)
                    .map((s) => (
                      <SelectItem key={s} value={s}>{getStatusLabel(s)}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label>หมายเหตุ</Label>
                {targetStatus === RefundStatus.REJECTED && <span className="text-red-500 text-xs">*</span>}
              </div>
              <Textarea
                placeholder="กรอกหมายเหตุ (ถ้ามี)"
                value={statusNote}
                onChange={(e) => { setStatusNote(e.target.value); setStatusNoteTouched(true); }}
                aria-invalid={targetStatus === RefundStatus.REJECTED && statusNoteTouched && !statusNote.trim()}
              />
              {targetStatus === RefundStatus.REJECTED && statusNoteTouched && !statusNote.trim() && (
                <p className="text-sm text-red-500">กรุณากรอกเหตุผลการปฏิเสธ</p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)} disabled={isUpdating}>
                ยกเลิก
              </Button>
              <Button onClick={handleStatusChange} disabled={isUpdating || !targetStatus}>
                {isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                ยืนยัน
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
}
