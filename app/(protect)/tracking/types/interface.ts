import {
  EBookingStatus,
  EDeliveryStatus,
  EFulfillmentType,
  EPaymentStatus,
} from "./enum";

export interface IEvent {
  id: number;
  name: string;
}

export interface IFulfillment {
  id: number;
  type: EFulfillmentType;
  serviceFee: number;
  shippingFee: number;
  totalCharge: number;
  recipientName?: string;
  recipientPhone?: string;
  shippingAddress?: string;
  deliveryStatus?: EDeliveryStatus;
}

export interface IBookingOrder {
  id: number;
  bookingCode: string;
  nameCustomer: string;
  status: EBookingStatus;
  paymentStatus: EPaymentStatus;
  netCardPrice: number;
  serviceFee: number;
  event: IEvent;
  fulfillment: IFulfillment | null;
}
