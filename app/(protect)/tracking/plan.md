# หน้า Tracking — สรุปการทำงาน

## ภาพรวม
หน้านี้ให้แอดมินจัดการ **บิลค่ากดบัตร** และ **สถานะการจอง** สำหรับแต่ละ Order ที่ลูกค้าชำระเงินมาแล้ว

---

## สถานะ (EBookingStatus)

| ค่า | ป้าย | สี | ปุ่ม actions |
|-----|------|----|--------------|
| `WAITING_SERVICE_FEE` | รอโอนค่ากด | orange | ปุ่ม "จัดการบิลค่ากดบัตร" |
| `WAITING_SERVICE_FEE_VERIFY` | รอตรวจสลิปค่ากด | yellow | MoreVertical → แก้ไขบิล / แก้ไขสถานะ |
| `SERVICE_FEE_PAID` | ชำระค่ากดแล้ว | green | MoreVertical → แก้ไขบิล / แก้ไขสถานะ |

---

## ประเภทการรับบัตร (FulfillmentType)

| ค่า | ความหมาย | VAT | ค่าส่ง |
|-----|-----------|-----|--------|
| `ETICKET` | ใช้แอคเคาท์ลูกค้า ไม่แลกบัตร | ไม่คิด | ไม่มี |
| `PICKUP` | รับหน้างาน / ส่ง Grab | ไม่คิด | มี |
| `DELIVERY` | จัดส่งพัสดุ | คิด 7% ทั้งค่ากด+ค่าส่ง | มี |

---

## การคำนวณยอดบิล

```
ticketFee + shippingFee + VAT(ticketFee) + VAT(shippingFee) = totalAmount
```
- VAT 7% คิดเฉพาะ `DELIVERY` เท่านั้น
- `ETICKET` → shippingFee = 0 เสมอ

---

## Dialogs ทั้งหมด

### 1. Bill Dialog (`isDialogOpen`)
เปิดจาก:
- สถานะ `WAITING_SERVICE_FEE` → ปุ่ม "จัดการบิลค่ากดบัตร"
- สถานะ `WAITING_SERVICE_FEE_VERIFY` / `SERVICE_FEE_PAID` → dropdown "แก้ไขบิล"

เนื้อหา:
- **คอลัมน์ซ้าย**: เลือก FulfillmentType
- **คอลัมน์ขวา**: กรอก ticketFee / shippingFee + สรุปยอด
- **ด้านล่าง**: ประวัติการสร้าง/แก้ไขบิล (timeline)

### 2. Confirm Bill AlertDialog (`isConfirmBillOpen`)
เปิดจาก: กดปุ่ม "สร้างบิล" / "บันทึกการจัดการ" ใน Bill Dialog

แจ้งเตือนว่าสถานะจะเปลี่ยนเป็น **รอตรวจสลิปค่ากด** อัตโนมัติ
→ กด "ยืนยัน" → เรียก `handleSaveBill()`

### 3. Edit Status Dialog (`isStatusDialogOpen`)
เปิดจาก: dropdown "แก้ไขสถานะ" (เฉพาะ `WAITING_SERVICE_FEE_VERIFY` / `SERVICE_FEE_PAID`)

Field:
- Select สถานะ (3 ตัวเลือก)
- Textarea หมายเหตุ

---

## ประวัติบิล (BillHistoryEntry)

เก็บต่อ `orderId` แต่ละ entry มี:
- `action`: `"create"` | `"edit"`
- `adminName`: ชื่อแอดมินที่ทำรายการ
- `timestamp`: เวลา
- `ticketFee`, `shippingFee`, `totalAmount`, `fulfillmentType`: snapshot ณ เวลานั้น
- `note`: หมายเหตุ (optional)

แสดงเป็น timeline เรียงจากล่าสุดก่อน ภายใน Bill Dialog

---

## Backend API ที่ต้องมี


Method	Path	หน้าที่
GET	/orders	list orders (filter: search, status, paginate)
POST	/orders/:bookingId/bill	สร้างบิล → auto เปลี่ยน status เป็น WAITING_SERVICE_FEE_VERIFY
PATCH	/orders/:bookingId/bill	แก้ไขบิล → auto เปลี่ยน status เป็น WAITING_SERVICE_FEE_VERIFY
PATCH	/orders/:bookingId/status	แก้ไข status + note
GET	/orders/:bookingId/bill/history	ประวัติบิล

---

## TODO (ยังไม่ได้ implement)

- [ ] เชื่อม API จริงแทน mock data
- [ ] เชื่อม bill history จาก API (`GET /api/orders/:id/bill/history`)
- [ ] บันทึก `adminName` จาก session ปัจจุบัน
- [ ] Pagination รายการ Order
- [ ] แสดง tracking number / ข้อมูลนัดรับในตาราง
