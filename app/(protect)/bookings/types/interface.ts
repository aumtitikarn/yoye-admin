import { EBookingStatus } from "./enum";

export interface IBookingEvent {
  id: number;
  name: string;
  type: string;
}

export interface IBookingCustomer {
  id: number;
  fullName: string;
  nickname?: string;
  phone?: string;
  lineId?: string;
}

export interface IBookingRound {
  id: number;
  name: string;
  date?: string;
  time?: string;
  eventId?: number;
  createdAt?: string;
}

export interface IBookingZone {
  id: number;
  name: string;
  price?: string;
  fee?: string;
  capacity?: number;
  roundId?: number;
  createdAt?: string;
}

export interface IBookingItem {
  id: number;
  bookingId: number;
  roundId: number;
  zoneId: number;
  quantity: number;
  notes: string | null;
  createdAt: string;
  round: IBookingRound;
  zone: IBookingZone;
}

export interface IDeepInfoField {
  id: number;
  otherCode: string;
  label: string;
  isRequired: boolean;
  eventId: number;
  createdAt: string;
}

export interface IDeepInfoResponse {
  id: number;
  bookingId: number;
  fieldId: number;
  value: string;
  createdAt: string;
  field: IDeepInfoField;
}

export interface IStatusLogAdmin {
  id: number;
  firstName: string;
  lastName: string;
}

export interface IStatusLog {
  id: number;
  bookingId: number;
  changedBy: number;
  status: EBookingStatus;
  notes: string | null;
  createdAt: string;
  admin: IStatusLogAdmin;
}

export interface ISlipReviewer {
  id: number;
  firstName: string;
  lastName: string;
}

export interface IPaymentSlip {
  id: number;
  bookingId: number;
  reviewerId: number;
  type: string;
  status: string;
  systemAmount: number;
  slipAmount: number;
  imageUrl: string;
  reviewedAt: string | null;
  notes: string | null;
  createdAt: string;
  reviewer: ISlipReviewer;
}

export interface IBooking {
  id: number;
  queueCode: string;
  bookingCode: string;
  status: EBookingStatus;
  nameCustomer: string;
  depositPaid: number;
  createdAt: string;
  event: IBookingEvent;
  customer: IBookingCustomer;
  bookingItems: IBookingItem[];
}

export interface IBookingDetail {
  id: number;
  queueCode: string;
  bookingCode: string;
  status: EBookingStatus;
  paymentStatus: string;
  nameCustomer: string;
  netCardPrice: number;
  serviceFee: number;
  shippingFee: number;
  vatAmount: number;
  depositPaid: number;
  totalPaid: number;
  refundAmount: number;
  notes: string | null;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  event: IBookingEvent;
  customer: IBookingCustomer;
  bookingItems: IBookingItem[];
  deepInfoResponses: IDeepInfoResponse[];
  formSubmission: unknown;
  statusLogs: IStatusLog[];
  paymentSlips: IPaymentSlip[];
}

export interface IBookingsQuery {
  status?: EBookingStatus;
  page?: number;
  pageSize?: number;
  search?: string;
  eventId?: number;
}
