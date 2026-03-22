import { Badge } from "@/components/ui/badge";
import { EBookingStatus, BOOKING_STATUS_LABEL } from "../types/enum";
import { getStatusColor, getStatusIcon } from "../utils/booking-status";

interface BookingStatusBadgeProps {
  status: EBookingStatus;
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  return (
    <Badge className={getStatusColor(status)}>
      {getStatusIcon(status)}
      <span className="ml-1">{BOOKING_STATUS_LABEL[status]}</span>
    </Badge>
  );
}
