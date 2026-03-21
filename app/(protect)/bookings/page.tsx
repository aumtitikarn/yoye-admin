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
import { SingleCombobox } from "@/components/ui/combobox";
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
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Calendar,
  FileText,
  AlertCircle,
  MoreVertical,
  Loader2,
} from "lucide-react";
import { useBookings } from "./hooks/use-bookings";
import { useEvents } from "../events/hooks/use-events";
import { IBooking } from "./types/interface";
import { EBookingStatus } from "./types/enum";

export default function BookingManagement() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const { data: bookingsData, isLoading } = useBookings({
    page,
    pageSize,
    search: search || undefined,
    eventId: selectedEventId === "all" ? undefined : Number(selectedEventId),
    status: selectedStatus === "all" ? undefined : (selectedStatus as EBookingStatus),
  });

  const { data: eventsData } = useEvents();

  const bookings = bookingsData?.data ?? [];
  const meta = bookingsData?.meta ?? bookingsData?.pagination;
  const events = eventsData?.data ?? [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case EBookingStatus.WAITING_QUEUE_APPROVAL:
      case EBookingStatus.WAITING_DEPOSIT_TRANSFER:
      case EBookingStatus.WAITING_DEPOSIT_VERIFY:
      case EBookingStatus.WAITING_BOOKING_INFO:
      case EBookingStatus.WAITING_ADMIN_CONFIRM:
      case EBookingStatus.WAITING_SERVICE_FEE:
      case EBookingStatus.WAITING_SERVICE_FEE_VERIFY:
      case EBookingStatus.WAITING_REFUND:
        return "bg-yellow-100 text-yellow-800";
      case EBookingStatus.QUEUE_BOOKED:
      case EBookingStatus.FULLY_BOOKED:
      case EBookingStatus.TEAM_BOOKED:
      case EBookingStatus.SERVICE_FEE_PAID:
      case EBookingStatus.COMPLETED:
      case EBookingStatus.REFUNDED:
        return "bg-green-100 text-green-800";
      case EBookingStatus.BOOKING_IN_PROGRESS:
      case EBookingStatus.TRANSFERRING_TICKET:
      case EBookingStatus.CONFIRMING_TICKET:
      case EBookingStatus.READY_TO_BOOK:
        return "bg-blue-100 text-blue-800";
      case EBookingStatus.PARTIALLY_BOOKED:
      case EBookingStatus.CUSTOMER_SELF_BOOKED:
      case EBookingStatus.TEAM_NOT_RECEIVED:
      case EBookingStatus.PARTIAL_SELF_TEAM_BOOKING:
      case EBookingStatus.DEPOSIT_PENDING:
      case EBookingStatus.DEPOSIT_USED:
        return "bg-orange-100 text-orange-800";
      case EBookingStatus.BOOKING_FAILED:
      case EBookingStatus.CANCELLED:
      case EBookingStatus.DEPOSIT_FORFEITED:
        return "bg-red-100 text-red-800";
      case EBookingStatus.CLOSED_REFUNDED:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case EBookingStatus.COMPLETED:
      case EBookingStatus.FULLY_BOOKED:
      case EBookingStatus.QUEUE_BOOKED:
      case EBookingStatus.SERVICE_FEE_PAID:
      case EBookingStatus.REFUNDED:
      case EBookingStatus.TEAM_BOOKED:
        return <CheckCircle className="h-4 w-4" />;
      case EBookingStatus.BOOKING_FAILED:
      case EBookingStatus.CANCELLED:
      case EBookingStatus.DEPOSIT_FORFEITED:
        return <XCircle className="h-4 w-4" />;
      case EBookingStatus.BOOKING_IN_PROGRESS:
      case EBookingStatus.TRANSFERRING_TICKET:
      case EBookingStatus.CONFIRMING_TICKET:
      case EBookingStatus.READY_TO_BOOK:
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const openBookingDetail = (booking: IBooking) => {
    setSelectedBooking(booking);
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Booking & Form Management
        </h1>
        <p className="text-gray-600">จัดการคิวและรายการทั้งหมดในระบบ</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="ค้นหาชื่อลูกค้าหรือเลขที่คิว..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 bg-white"
          />
        </div>
        <SingleCombobox
          options={[
            { value: "", label: "ทุกงาน" },
            ...events.map((event) => ({
              value: String(event.id),
              label: event.name,
            })),
          ]}
          value={selectedEventId === "all" ? "" : selectedEventId}
          onChange={(value) => {
            setSelectedEventId(value || "all");
            setPage(1);
          }}
          placeholder="เลือกงาน"
          searchPlaceholder="ค้นหางาน..."
          emptyText="ไม่พบงาน"
          className="w-full sm:w-48"
        />
        <SingleCombobox
          options={[
            { value: "", label: "ทุกสถานะ" },
            ...Object.values(EBookingStatus).map((status) => ({
              value: status,
              label: status,
            })),
          ]}
          value={selectedStatus === "all" ? "" : selectedStatus}
          onChange={(value) => {
            setSelectedStatus(value || "all");
            setPage(1);
          }}
          placeholder="เลือกสถานะ"
          searchPlaceholder="ค้นหาสถานะ..."
          emptyText="ไม่พบสถานะ"
          className="w-full sm:w-48"
        />
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการคิว {meta ? `(${meta.totalCounts})` : ""}</CardTitle>
          <CardDescription>รายการคิวทั้งหมดตามตัวกรองที่เลือก</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>เลขที่คิว</TableHead>
                    <TableHead>ชื่องาน</TableHead>
                    <TableHead>ชื่อลูกค้า</TableHead>
                    <TableHead>ประเภท</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>วันที่สร้าง</TableHead>
                    <TableHead>มัดจำ</TableHead>
                    <TableHead>การจัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        {booking.queueCode}
                      </TableCell>
                      <TableCell>{booking.event.name}</TableCell>
                      <TableCell>{booking.customer.fullName}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            booking.event.type === "TICKET"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {booking.event.type === "TICKET" ? (
                            <>
                              <Calendar className="h-3 w-3 mr-1" />
                              Ticket
                            </>
                          ) : (
                            <>
                              <FileText className="h-3 w-3 mr-1" />
                              Form
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(booking.status)}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1">{booking.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(booking.createdAt).toLocaleDateString("th-TH")}
                      </TableCell>
                      <TableCell>
                        ฿{booking.amount.toLocaleString()}
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
                            <DropdownMenuItem
                              onClick={() => openBookingDetail(booking)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              ดูรายละเอียด
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {bookings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                        ไม่พบข้อมูล
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {meta && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    ทั้งหมด {meta.totalCounts} รายการ
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p - 1)}
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
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page >= meta.totalPages}
                    >
                      ถัดไป
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Booking Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              รายละเอียดคิว {selectedBooking?.queueCode}
            </DialogTitle>
            <DialogDescription>
              ข้อมูลละเอียดและประวัติการเปลี่ยนสถานะ
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <Tabs defaultValue="details" className="space-y-4">
              <TabsList>
                <TabsTrigger value="details">ข้อมูลทั่วไป</TabsTrigger>
                <TabsTrigger value="payment">การชำระเงิน</TabsTrigger>
                <TabsTrigger value="history">ประวัติ</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>ชื่อลูกค้า</Label>
                    <p className="font-medium">
                      {selectedBooking.customer.fullName}
                    </p>
                  </div>
                  <div>
                    <Label>ชื่องาน</Label>
                    <p className="font-medium">
                      {selectedBooking.event.name}
                    </p>
                  </div>
                  <div>
                    <Label>ประเภท</Label>
                    <Badge
                      variant={
                        selectedBooking.event.type === "TICKET"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {selectedBooking.event.type}
                    </Badge>
                  </div>
                  <div>
                    <Label>สถานะปัจจุบัน</Label>
                    <Badge
                      className={getStatusColor(selectedBooking.status)}
                    >
                      {selectedBooking.status}
                    </Badge>
                  </div>
                  <div>
                    <Label>รหัสจอง</Label>
                    <p>{selectedBooking.bookingCode}</p>
                  </div>
                  <div>
                    <Label>วันที่สร้าง</Label>
                    <p>
                      {new Date(selectedBooking.createdAt).toLocaleDateString(
                        "th-TH",
                      )}
                    </p>
                  </div>
                  {selectedBooking.showRound && (
                    <div>
                      <Label>รอบการแสดง</Label>
                      <p>{selectedBooking.showRound.name}</p>
                    </div>
                  )}
                  {selectedBooking.zone && (
                    <div>
                      <Label>โซน</Label>
                      <p>{selectedBooking.zone.name}</p>
                    </div>
                  )}
                  <div>
                    <Label>มัดจำ</Label>
                    <p className="font-medium">
                      ฿{selectedBooking.amount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>หมายเหตุ</Label>
                  <Textarea placeholder="กรอกหมายเหตุ (ถ้ามี)" />
                </div>
              </TabsContent>

              <TabsContent value="payment" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>มัดจำ</Label>
                    <p className="font-medium">
                      ฿{selectedBooking.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium">ประวัติการเปลี่ยนสถานะ</h4>

                  <div className="space-y-2">
                    <div className="flex items-start gap-3 p-3 border rounded">
                      <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">สร้างคิว</p>
                        <p className="text-sm text-gray-500">
                          ระบบ -{" "}
                          {new Date(
                            selectedBooking.createdAt,
                          ).toLocaleDateString("th-TH")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDetailDialogOpen(false)}
            >
              ปิด
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
