"use client";

import { useMemo, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Package,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  FileText,
} from "lucide-react";

type DeliveryStatus =
  | "payment_completed"
  | "waiting_pickup_date"
  | "waiting_pickup"
  | "pickup_completed"
  | "waiting_delivery"
  | "preparing_delivery"
  | "delivered"
  | "completed";

type FulfillmentType = "ETICKET" | "PICKUP" | "DELIVERY";

type PaymentItem = {
  id: string;
  customerId: string;
  eventName: string;
  customerName: string;
  phone: string;
  status: DeliveryStatus;
  paymentDate: string;
  ticketFee?: number;
  shippingFee?: number;
  vatAmount?: number;
  totalAmount?: number;
  fulfillmentType?: FulfillmentType;
  pickupDate?: string;
  pickupTime?: string;
  pickupContactName?: string;
  pickupContactPhone?: string;
  pickupLocation?: string;
  pickupNotes?: string;
  deliveryAddress?: string;
  deliveryDate?: string;
  deliveryCompany?: string;
  trackingNumber?: string;
  createdAt: string;
};

// Mock data
const mockPaymentData: PaymentItem[] = [
  {
    id: "1",
    customerId: "CUS001",
    eventName: "Concert Night 2024",
    customerName: "สมชาย ใจดี",
    phone: "0812345678",
    status: "completed",
    paymentDate: "2024-03-10",
    ticketFee: 1500,
    shippingFee: 0,
    vatAmount: 0,
    totalAmount: 1500,
    fulfillmentType: "ETICKET",
    createdAt: "2024-03-10T10:30:00",
  },
  {
    id: "2",
    customerId: "CUS002",
    eventName: "Fan Meeting",
    customerName: "สมหญิง รักดี",
    phone: "0823456789",
    status: "waiting_pickup_date",
    paymentDate: "2024-03-11",
    ticketFee: 2000,
    shippingFee: 0,
    vatAmount: 0,
    totalAmount: 2000,
    fulfillmentType: "PICKUP",
    createdAt: "2024-03-11T14:20:00",
  },
  {
    id: "3",
    customerId: "CUS003",
    eventName: "Product Launch",
    customerName: "วิชัย มั่นคง",
    phone: "0834567890",
    status: "preparing_delivery",
    paymentDate: "2024-03-12",
    ticketFee: 800,
    shippingFee: 150,
    vatAmount: (800 + 150) * 0.07,
    totalAmount: 800 + 150 + (800 + 150) * 0.07,
    fulfillmentType: "DELIVERY",
    createdAt: "2024-03-12T09:15:00",
  },
];

const VAT_RATE = 0.07;

const parseAmount = (value: string) => {
  const parsed = Number.parseFloat(value || "0");
  return Number.isNaN(parsed) ? 0 : parsed;
};

const statusConfig: Record<
  DeliveryStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  payment_completed: {
    label: "ชำระเงินแล้ว",
    color: "blue",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  waiting_pickup_date: {
    label: "รอวันรับบัตร",
    color: "orange",
    icon: <Clock className="h-4 w-4" />,
  },
  waiting_pickup: {
    label: "รอรับบัตร",
    color: "yellow",
    icon: <AlertCircle className="h-4 w-4" />,
  },
  pickup_completed: {
    label: "รับบัตรแล้ว",
    color: "green",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  waiting_delivery: {
    label: "รอจัดส่ง",
    color: "orange",
    icon: <Package className="h-4 w-4" />,
  },
  preparing_delivery: {
    label: "กำลังจัดส่ง",
    color: "blue",
    icon: <Truck className="h-4 w-4" />,
  },
  delivered: {
    label: "ได้รับบัตรแล้ว",
    color: "green",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  completed: {
    label: "เสร็จสมบูรณ์",
    color: "green",
    icon: <CheckCircle className="h-4 w-4" />,
  },
};

const fulfillmentTypeConfig: Record<
  FulfillmentType,
  { label: string; description: string; icon: React.ReactNode }
> = {
  ETICKET: {
    label: "E-ticket / ใช้แอคเคาท์ลูกค้า",
    description: "ไม่มีแลกบัตร, ไม่มีจัดส่ง",
    icon: <Package className="h-4 w-4" />,
  },
  PICKUP: {
    label: "รับบัตรหน้างาน หรือ ส่ง Grab",
    description: "แอดมินนัดวันเวลารับบัตร",
    icon: <Clock className="h-4 w-4" />,
  },
  DELIVERY: {
    label: "จัดส่ง",
    description: "จัดส่งบัตรให้ลูกค้า",
    icon: <Truck className="h-4 w-4" />,
  },
};

export default function PaymentSummaryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<DeliveryStatus | "ALL">(
    "ALL",
  );
  const [selectedItem, setSelectedItem] = useState<PaymentItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "manage">("create");

  // Dialog form state
  const [ticketFee, setTicketFee] = useState("");
  const [shippingFee, setShippingFee] = useState("");
  const [fulfillmentType, setFulfillmentType] =
    useState<FulfillmentType>("ETICKET");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [pickupContactName, setPickupContactName] = useState("");
  const [pickupContactPhone, setPickupContactPhone] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupNotes, setPickupNotes] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryCompany, setDeliveryCompany] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  const filteredData = useMemo(() => {
    return mockPaymentData.filter((item) => {
      const matchesSearch =
        item.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone.includes(searchTerm);

      const matchesStatus =
        statusFilter === "ALL" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const getStatusColor = (status: DeliveryStatus) => {
    const colors: Record<DeliveryStatus, string> = {
      payment_completed: "bg-blue-100 text-blue-800",
      waiting_pickup_date: "bg-orange-100 text-orange-800",
      waiting_pickup: "bg-yellow-100 text-yellow-800",
      pickup_completed: "bg-green-100 text-green-800",
      waiting_delivery: "bg-orange-100 text-orange-800",
      preparing_delivery: "bg-blue-100 text-blue-800",
      delivered: "bg-green-100 text-green-800",
      completed: "bg-green-100 text-green-800",
    };
    return colors[status];
  };

  const handleCreateBill = (item: PaymentItem) => {
    setSelectedItem(item);
    setDialogMode("create");
    setIsDialogOpen(true);

    // Reset form
    setTicketFee("");
    setShippingFee("");
    setFulfillmentType("ETICKET");
    setPickupDate("");
    setPickupTime("");
    setPickupContactName("");
    setPickupContactPhone("");
    setPickupLocation("");
    setPickupNotes("");
    setDeliveryAddress("");
    setDeliveryDate("");
    setDeliveryCompany("");
    setTrackingNumber("");
  };

  const handleManageTicket = (item: PaymentItem) => {
    setSelectedItem(item);
    setDialogMode("manage");
    setIsDialogOpen(true);

    // Pre-fill existing data
    setTicketFee(item.ticketFee?.toString() || "");
    setShippingFee(item.shippingFee?.toString() || "");
    setFulfillmentType(item.fulfillmentType || "ETICKET");
    setPickupDate(item.pickupDate || "");
    setPickupTime(item.pickupTime || "");
    setPickupContactName(item.pickupContactName || "");
    setPickupContactPhone(item.pickupContactPhone || "");
    setPickupLocation(item.pickupLocation || "");
    setPickupNotes(item.pickupNotes || "");
    setDeliveryAddress(item.deliveryAddress || "");
    setDeliveryDate(item.deliveryDate || "");
    setDeliveryCompany(item.deliveryCompany || "");
    setTrackingNumber(item.trackingNumber || "");
  };

  const ticketFeeAmount = parseAmount(ticketFee);
  const shippingFeeAmount =
    fulfillmentType === "ETICKET" ? 0 : parseAmount(shippingFee);
  const isDelivery = fulfillmentType === "DELIVERY";
  const vatTicket = isDelivery ? Number(ticketFeeAmount * VAT_RATE) : 0;
  const vatShipping = isDelivery ? Number(shippingFeeAmount * VAT_RATE) : 0;
  const totalDue =
    ticketFeeAmount + shippingFeeAmount + vatTicket + vatShipping;

  const handleSaveBill = () => {
    if (!selectedItem) return;

    console.log("Saving bill:", {
      itemId: selectedItem.id,
      ticketFee: ticketFeeAmount,
      shippingFee: shippingFeeAmount,
      vatTicket,
      vatShipping,
      vatAmountTotal: vatTicket + vatShipping,
      totalAmount: totalDue,
      fulfillmentType,
      pickupDate,
      pickupTime,
      pickupContactName,
      pickupContactPhone,
      pickupLocation,
      pickupNotes,
      deliveryAddress,
      deliveryDate,
      deliveryCompany,
      trackingNumber,
    });

    // TODO: Implement API call
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">สรุปยอดชำระ</h1>
        <p className="text-gray-600 mt-2">จัดการการชำระเงินและการจัดส่งบัตร</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="ค้นหารหัสลูกค้า, ชื่อลูกค้า, ชื่องาน, หรือเบอร์โทร..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as DeliveryStatus | "ALL")
          }
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

      {/* Payment Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการคำสั่งซื้อ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    รหัสลูกค้า
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    ชื่องาน
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    ชื่อลูกค้า
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    เบอร์โทรศัพท์
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    สถานะ
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    การจัดการ
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      ไม่พบข้อมูลที่ตรงกับเงื่อนไข
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{item.customerId}</td>
                      <td className="py-3 px-4">{item.eventName}</td>
                      <td className="py-3 px-4">{item.customerName}</td>
                      <td className="py-3 px-4">{item.phone}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(item.status)}>
                          {statusConfig[item.status].icon}
                          <span className="ml-1">
                            {statusConfig[item.status].label}
                          </span>
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {!item.ticketFee && (
                            <Button
                              size="sm"
                              onClick={() => handleCreateBill(item)}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              สร้างบิล
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleManageTicket(item)}
                          >
                            <Package className="h-4 w-4 mr-1" />
                            จัดการบิล
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Bill Creation & Management Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="w-full sm:max-w-[92vw] lg:max-w-[1200px] max-h-[90vh] flex flex-col"
          style={{ width: "92vw", maxWidth: "1200px" }}
        >
          <DialogHeader className="flex-shrink-0 pb-4 border-b">
            <DialogTitle>
              {dialogMode === "create" ? "สร้างบิลค่ากด" : "จัดการบิล"}
            </DialogTitle>
            <DialogDescription>
              {selectedItem &&
                `ลูกค้า: ${selectedItem.customerName} - ${selectedItem.eventName}`}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Left Column: Fulfillment Selection */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    เลือกประเภทการรับบัตร (Fulfillment Selection)
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(fulfillmentTypeConfig).map(
                      ([key, config]) => (
                        <div
                          key={key}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            fulfillmentType === key
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() =>
                            setFulfillmentType(key as FulfillmentType)
                          }
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1">{config.icon}</div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                {config.label}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {config.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Billing */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    ข้อมูลค่าใช้จ่าย (Billing)
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>ค่ากดบัตร (รวมค่าธรรมเนียม)</Label>
                      <Input
                        type="number"
                        placeholder="กรอกค่ากดบัตร"
                        value={ticketFee}
                        onChange={(e) => setTicketFee(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>ค่าส่ง</Label>
                      <Input
                        type="number"
                        placeholder="กรอกค่าส่ง"
                        value={shippingFee}
                        onChange={(e) => setShippingFee(e.target.value)}
                        disabled={fulfillmentType === "ETICKET"}
                      />
                      {fulfillmentType === "ETICKET" && (
                        <p className="text-xs text-gray-500">
                          E-ticket ไม่มีค่าส่ง
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>ค่ากดบัตร (รวมค่าธรรมเนียม)</span>
                      <span>฿{ticketFeeAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ค่าส่ง</span>
                      <span>฿{shippingFeeAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT 7% จากค่ากด</span>
                      <span>
                        {isDelivery ? `฿${vatTicket.toFixed(2)}` : "ไม่คิด VAT"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT 7% จากค่าส่ง</span>
                      <span>
                        {isDelivery
                          ? `฿${vatShipping.toFixed(2)}`
                          : "ไม่คิด VAT"}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold text-base">
                      <span>ยอดรวมทั้งหมด</span>
                      <span>฿{totalDue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-shrink-0 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleSaveBill}>
              {dialogMode === "create" ? "สร้างบิล" : "บันทึกการจัดการ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
