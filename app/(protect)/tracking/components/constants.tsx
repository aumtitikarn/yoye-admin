import { AlertCircle, CheckCircle, Clock, Package, Truck } from "lucide-react";
import {
  EBookingStatus,
  EFulfillmentType,
} from "@/app/(protect)/tracking/types/enum";

export const VAT_RATE = 0.07;

export const parseAmount = (value: string) => {
  const parsed = Number.parseFloat(value || "0");
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const statusConfig: Record<
  EBookingStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  [EBookingStatus.WAITING_SERVICE_FEE]: {
    label: "รอโอนค่ากด",
    color: "orange",
    icon: <Clock className="h-4 w-4" />,
  },
  [EBookingStatus.WAITING_SERVICE_FEE_VERIFY]: {
    label: "รอตรวจสลิปค่ากด",
    color: "yellow",
    icon: <AlertCircle className="h-4 w-4" />,
  },
  [EBookingStatus.SERVICE_FEE_PAID]: {
    label: "ชำระค่ากดแล้ว",
    color: "green",
    icon: <CheckCircle className="h-4 w-4" />,
  },
};

export const fulfillmentTypeConfig: Record<
  EFulfillmentType,
  { label: string; description: string; icon: React.ReactNode }
> = {
  [EFulfillmentType.ETICKET]: {
    label: "E-ticket / ใช้แอคเคาท์ลูกค้า",
    description: "ไม่มีแลกบัตร, ไม่มีจัดส่ง",
    icon: <Package className="h-4 w-4" />,
  },
  [EFulfillmentType.PICKUP]: {
    label: "รับบัตรหน้างาน หรือ ส่ง Grab",
    description: "แอดมินนัดวันเวลารับบัตร",
    icon: <Clock className="h-4 w-4" />,
  },
  [EFulfillmentType.DELIVERY]: {
    label: "จัดส่ง",
    description: "จัดส่งบัตรให้ลูกค้า",
    icon: <Truck className="h-4 w-4" />,
  },
};

export const statusColorMap: Record<EBookingStatus, string> = {
  [EBookingStatus.WAITING_SERVICE_FEE]: "bg-orange-100 text-orange-800",
  [EBookingStatus.WAITING_SERVICE_FEE_VERIFY]: "bg-yellow-100 text-yellow-800",
  [EBookingStatus.SERVICE_FEE_PAID]: "bg-green-100 text-green-800",
};
