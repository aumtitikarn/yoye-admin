import { EBookingStatus } from "./enum";

export interface IBookingEvent {
  id: number;
  name: string;
  type: string;
}

export interface IBookingCustomer {
  id: number;
  fullName: string;
}

export interface IBookingShowRound {
  id: number;
  name: string;
}

export interface IBookingZone {
  id: number;
  name: string;
}

export interface IBooking {
  id: number;
  queueCode: string;
  bookingCode: string;
  status: EBookingStatus;
  amount: number;
  createdAt: string;
  event: IBookingEvent;
  customer: IBookingCustomer;
  showRound: IBookingShowRound | null;
  zone: IBookingZone | null;
}

export interface IBookingsQuery {
  status?: EBookingStatus;
  page?: number;
  pageSize?: number;
  search?: string;
  eventId?: number;
}
