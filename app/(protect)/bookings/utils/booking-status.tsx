import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { EBookingStatus } from "../types/enum";

export function getStatusColor(status: string): string {
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
}

export function getStatusIcon(status: string) {
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
}
