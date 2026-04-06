import { DepositBookingStatus, FeeType } from "./enum";

export interface IFinanceSummary {
  totalDeposit: number;
  usedAsFee: number;
  forfeited: number;
  refunded: number;
}

export interface IDepositRecord {
  id: number;
  bookingCode: string;
  customer: string | null;
  event: string | null;
  amount: number;
  date: string;
  status: DepositBookingStatus;
}

export interface IDepositQuery {
  page?: number;
  pageSize?: number;
  status?: DepositBookingStatus;
  search?: string;
}

export interface IFeeRecord {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: FeeType;
}

export interface IFinanceFeesQuery {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface IRefundRecord {
  id: number;
  customer: string | null;
  amount: number;
  reason: string | null;
  date: string;
}

export interface IFinanceRefundsQuery {
  page?: number;
  pageSize?: number;
}
