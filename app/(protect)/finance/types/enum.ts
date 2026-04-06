export enum DepositBookingStatus {
  DEPOSIT_PENDING = "DEPOSIT_PENDING",     // ถือมัดจำ
  DEPOSIT_USED = "DEPOSIT_USED",           // ใช้เป็นค่ากด
  DEPOSIT_FORFEITED = "DEPOSIT_FORFEITED", // ยึดมัดจำ
  WAITING_REFUND = "WAITING_REFUND",       // รอคืนเงิน
  REFUNDED = "REFUNDED",                   // คืนเงินแล้ว
}

export enum FeeType {
  TICKET = "TICKET",
  HANDLING = "HANDLING",
}
