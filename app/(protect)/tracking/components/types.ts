export enum EBookingStatus {
  WAITING_SERVICE_FEE = "WAITING_SERVICE_FEE",
  WAITING_SERVICE_FEE_VERIFY = "WAITING_SERVICE_FEE_VERIFY",
  SERVICE_FEE_PAID = "SERVICE_FEE_PAID",
}

export type DeliveryStatus = EBookingStatus;

export type FulfillmentType = "ETICKET" | "PICKUP" | "DELIVERY";

export type PaymentItem = {
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
  deliveryContactName?: string;
  deliveryPhone?: string;
  deliveryAddress?: string;
  deliveryDate?: string;
  deliveryCompany?: string;
  trackingNumber?: string;
  createdAt: string;
};

export type BillHistoryEntry = {
  id: string;
  action: "create" | "edit";
  adminName: string;
  timestamp: string;
  ticketFee: number;
  shippingFee: number;
  totalAmount: number;
  fulfillmentType: FulfillmentType;
  note?: string;
};

export type BillFormData = {
  ticketFee: number;
  shippingFee: number;
  vatAmount: number;
  totalAmount: number;
  fulfillmentType: FulfillmentType;
  deliveryContactName?: string;
  deliveryPhone?: string;
  deliveryAddress?: string;
};
