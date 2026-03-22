export enum EBookingStatus {
  // ก่อนกด
  WAITING_QUEUE_APPROVAL = "WAITING_QUEUE_APPROVAL",
  WAITING_DEPOSIT_TRANSFER = "WAITING_DEPOSIT_TRANSFER",
  WAITING_DEPOSIT_VERIFY = "WAITING_DEPOSIT_VERIFY",
  QUEUE_BOOKED = "QUEUE_BOOKED",
  WAITING_BOOKING_INFO = "WAITING_BOOKING_INFO",
  TRANSFERRING_TICKET = "TRANSFERRING_TICKET",
  CONFIRMING_TICKET = "CONFIRMING_TICKET",
  WAITING_ADMIN_CONFIRM = "WAITING_ADMIN_CONFIRM",
  READY_TO_BOOK = "READY_TO_BOOK",

  // ระหว่างกด
  BOOKING_IN_PROGRESS = "BOOKING_IN_PROGRESS",
  PARTIALLY_BOOKED = "PARTIALLY_BOOKED",
  FULLY_BOOKED = "FULLY_BOOKED",
  BOOKING_FAILED = "BOOKING_FAILED",

  // ลูกค้าได้เอง
  CUSTOMER_SELF_BOOKED = "CUSTOMER_SELF_BOOKED",
  TEAM_NOT_RECEIVED = "TEAM_NOT_RECEIVED",
  TEAM_BOOKED = "TEAM_BOOKED",
  PARTIAL_SELF_TEAM_BOOKING = "PARTIAL_SELF_TEAM_BOOKING",

  // การเงิน
  WAITING_SERVICE_FEE = "WAITING_SERVICE_FEE",
  WAITING_SERVICE_FEE_VERIFY = "WAITING_SERVICE_FEE_VERIFY",
  SERVICE_FEE_PAID = "SERVICE_FEE_PAID",

  // มัดจำ
  DEPOSIT_PENDING = "DEPOSIT_PENDING",
  DEPOSIT_USED = "DEPOSIT_USED",
  DEPOSIT_FORFEITED = "DEPOSIT_FORFEITED",
  WAITING_REFUND = "WAITING_REFUND",
  REFUNDED = "REFUNDED",

  // ปิดงาน
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  CLOSED_REFUNDED = "CLOSED_REFUNDED",
}

export const BOOKING_STATUS_LABEL: Record<EBookingStatus, string> = {
  // คิว
  [EBookingStatus.WAITING_QUEUE_APPROVAL]: "รอแอดมินอนุมัติคิว",
  [EBookingStatus.WAITING_DEPOSIT_TRANSFER]: "รอโอนมัดจำ",
  [EBookingStatus.WAITING_DEPOSIT_VERIFY]: "รอตรวจสลิปมัดจำ",
  [EBookingStatus.QUEUE_BOOKED]: "จองคิวสำเร็จ",
  [EBookingStatus.WAITING_BOOKING_INFO]: "รอกรอกข้อมูลจอง",
  [EBookingStatus.TRANSFERRING_TICKET]: "โอนค่าบัตร (กรณีฝากร้าน)",
  [EBookingStatus.CONFIRMING_TICKET]: "ยืนยันโอนค่าบัตร",
  [EBookingStatus.WAITING_ADMIN_CONFIRM]: "รอแอดมินยืนยันข้อมูล",
  [EBookingStatus.READY_TO_BOOK]: "พร้อมกดบัตร",

  // ระหว่างกด
  [EBookingStatus.BOOKING_IN_PROGRESS]: "กำลังกดบัตร",
  [EBookingStatus.PARTIALLY_BOOKED]: "ได้บัตรบางส่วน",
  [EBookingStatus.FULLY_BOOKED]: "กดได้ครบแล้ว",
  [EBookingStatus.BOOKING_FAILED]: "กดไม่ได้",

  // ลูกค้าได้เอง
  [EBookingStatus.CUSTOMER_SELF_BOOKED]: "ลูกค้าแจ้งว่าได้เอง (รอทีมตรวจ)",
  [EBookingStatus.TEAM_NOT_RECEIVED]: "ทีมยังไม่ได้บัตร",
  [EBookingStatus.TEAM_BOOKED]: "ทีมกดได้แล้ว",
  [EBookingStatus.PARTIAL_SELF_TEAM_BOOKING]: "ลูกค้าได้เองบางส่วน / ทีมกดต่อ",

  // การเงิน
  [EBookingStatus.WAITING_SERVICE_FEE]: "รอโอนค่ากด",
  [EBookingStatus.WAITING_SERVICE_FEE_VERIFY]: "รอตรวจสลิปค่ากด",
  [EBookingStatus.SERVICE_FEE_PAID]: "ชำระค่ากดแล้ว",

  // มัดจำ
  [EBookingStatus.DEPOSIT_PENDING]: "รอใช้มัดจำเป็นค่ากด",
  [EBookingStatus.DEPOSIT_USED]: "ใช้เป็นค่ากด",
  [EBookingStatus.DEPOSIT_FORFEITED]: "ยึดมัดจำ",
  [EBookingStatus.WAITING_REFUND]: "รอคืนเงิน",
  [EBookingStatus.REFUNDED]: "โอนคืนแล้ว",

  // ปิดงาน
  [EBookingStatus.COMPLETED]: "เสร็จสมบูรณ์",
  [EBookingStatus.CANCELLED]: "ยกเลิก (ยึดมัดจำ)",
  [EBookingStatus.CLOSED_REFUNDED]: "ปิดงาน (คืนเงินแล้ว)",
};
