import { PaymentSlipStatus, PaymentSlipType, RefundStatus } from "./enum";

export type IPaymentSlipBooking = {
  id: number;
  queueCode: string;
  bookingCode: string;
  nameCustomer: string;
  status: string;
  paymentStatus: string;
  netCardPrice: number;
  totalPaid: number;
  event: {
    id: number;
    name: string;
  };
  customer: {
    id: number;
    fullName: string;
    phone: string;
  };
};

export type IPaymentSlip = {
  id: number;
  bookingId: number;
  reviewerId: number | null;
  type: PaymentSlipType;
  status: PaymentSlipStatus;
  systemAmount: number;
  slipAmount: number;
  imageUrl: string;
  reviewedAt: string | null;
  notes: string | null;
  createdAt: string;
  booking: IPaymentSlipBooking;
  reviewer: {
    id: number;
    firstName: string;
    lastName: string;
  } | null;
};

export type IPaymentSlipQuery = {
  page?: number;
  pageSize?: number;
  type?: PaymentSlipType;
  status?: PaymentSlipStatus;
  bookingId?: number;
  eventId?: number;
  search?: string;
};

export type IRefundRequest = {
  id: number;
  bookingId: number;
  paymentSlipId: number;
  processedById: number | null;
  bookingRef: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  amount: number;
  status: RefundStatus;
  reason: string;
  requestedAt: string;
  processedAt: string | null;
  booking: {
    id: number;
    queueCode: string;
    bookingCode: string;
    nameCustomer: string;
    event: {
      id: number;
      name: string;
    };
  };
  paymentSlip: {
    id: number;
    type: PaymentSlipType;
    slipAmount: number;
  };
  processedBy: {
    id: number;
    firstName: string;
    lastName: string;
  } | null;
};

export type IRefundRequestQuery = {
  page?: number;
  pageSize?: number;
  status?: RefundStatus;
  eventId?: number;
  search?: string;
};
