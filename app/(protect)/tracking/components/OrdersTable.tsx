"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileEdit, MoreVertical, Package, RefreshCw, Search, Send } from "lucide-react";
import { useState } from "react";
import { useAllFulfillment } from "../hooks/use-all-fulfillment";
import {
  EBookingStatus,
  EDeliveryStatus,
  EFulfillmentType,
} from "../types/enum";
import type { IBookingOrder } from "../types/interface";
import { statusColorMap, statusConfig } from "./constants";

const deliveryStatusConfig: Record<EDeliveryStatus, { label: string; className: string }> = {
  [EDeliveryStatus.NOT_STARTED]: { label: "ยังไม่เริ่ม", className: "bg-gray-100 text-gray-600" },
  [EDeliveryStatus.WAITING_DELIVERY]: { label: "รอจัดส่ง", className: "bg-orange-100 text-orange-700" },
  [EDeliveryStatus.DELIVERED]: { label: "จัดส่งแล้ว", className: "bg-green-100 text-green-700" },
  [EDeliveryStatus.CANCELLED]: { label: "ยกเลิก", className: "bg-red-100 text-red-700" },
};

type Props = {
  onManageTicket: (item: IBookingOrder) => void;
  onOpenStatusDialog: (item: IBookingOrder) => void;
};

export function OrdersTable({ onManageTicket, onOpenStatusDialog }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<EBookingStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [notifyItem, setNotifyItem] = useState<IBookingOrder | null>(null);

  const resetPage = () => setPage(1);

  const { data, isLoading } = useAllFulfillment({
    page,
    pageSize: 10,
    search: searchTerm || undefined,
    status: statusFilter !== "ALL" ? statusFilter : undefined,
  });

  const orders = data?.data ?? [];
  const meta = data?.pagination ?? data?.meta;

  const handleConfirmNotify = () => {
    if (!notifyItem) return;
    console.log("Notify delivery:", { id: notifyItem.id });
    // TODO: API call — notify customer + update deliveryStatus to DELIVERED
    setNotifyItem(null);
  };

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="ค้นหารหัสการจอง, ชื่อลูกค้า, ชื่องาน..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              resetPage();
            }}
            className="pl-10 bg-white"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value as EBookingStatus | "ALL");
            resetPage();
          }}
        >
          <SelectTrigger className="w-full sm:w-48 bg-white">
            <SelectValue placeholder="สถานะทั้งหมด" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">สถานะทั้งหมด</SelectItem>
            {Object.entries(statusConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการคำสั่งซื้อ</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>รหัสการจอง</TableHead>
                <TableHead>ชื่องาน</TableHead>
                <TableHead>ชื่อลูกค้า</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>สถานะการจัดส่ง</TableHead>
                <TableHead>การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                    กำลังโหลด...
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    ไม่พบข้อมูลที่ตรงกับเงื่อนไข
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((item) => {
                  const deliveryStatus = item.fulfillment?.deliveryStatus;
                  const isDelivery = item.fulfillment?.type === EFulfillmentType.DELIVERY;
                  const canNotify =
                    isDelivery &&
                    deliveryStatus !== EDeliveryStatus.NOT_STARTED;
                  const showDropdown =
                    item.status === EBookingStatus.WAITING_SERVICE_FEE_VERIFY ||
                    item.status === EBookingStatus.SERVICE_FEE_PAID;

                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.bookingCode}</TableCell>
                      <TableCell>{item.event.name}</TableCell>
                      <TableCell>{item.nameCustomer}</TableCell>
                      <TableCell>
                        <Badge className={statusColorMap[item.status]}>
                          {statusConfig[item.status].icon}
                          <span className="ml-1">{statusConfig[item.status].label}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {isDelivery && deliveryStatus && deliveryStatusConfig[deliveryStatus] ? (
                          <Badge className={deliveryStatusConfig[deliveryStatus].className}>
                            {deliveryStatusConfig[deliveryStatus].label}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.status === EBookingStatus.WAITING_SERVICE_FEE && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onManageTicket(item)}
                          >
                            <Package className="h-4 w-4 mr-1" />
                            จัดการบิลค่ากดบัตร
                          </Button>
                        )}
                        {showDropdown && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onManageTicket(item)}>
                                <FileEdit className="h-4 w-4 mr-2" />
                                แก้ไขบิล
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onOpenStatusDialog(item)}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                แก้ไขสถานะ
                              </DropdownMenuItem>
                              {canNotify && (
                                <DropdownMenuItem onClick={() => setNotifyItem(item)}>
                                  <Send className="h-4 w-4 mr-2" />
                                  แจ้งจัดส่งบัตร
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

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

      {/* Confirm Notify Dialog */}
      <AlertDialog open={!!notifyItem} onOpenChange={(open) => !open && setNotifyItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันแจ้งจัดส่งบัตร?</AlertDialogTitle>
            <AlertDialogDescription>
              ระบบจะส่งข้อความแจ้งจัดส่งบัตรไปหาลูกค้า{" "}
              <span className="font-semibold text-gray-900">{notifyItem?.nameCustomer}</span>{" "}
              และสถานะการจัดส่งจะเปลี่ยนเป็น{" "}
              <span className="font-semibold text-green-700">จัดส่งแล้ว</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmNotify}>ยืนยัน</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
