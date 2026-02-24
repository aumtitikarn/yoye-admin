import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@yoye.com' },
    update: {},
    create: {
      email: 'admin@yoye.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '0800000000',
      line: 'admin_line',
      role: 'SUPER_ADMIN',
    },
  })

  // Create sample events
  const concertEvent = await prisma.event.create({
    data: {
      name: 'Concert Night 2024',
      type: 'TICKET',
      description: 'คอนเสิร์ตใหญ่ประจำปี 2024',
      startDate: new Date('2024-03-15'),
      endDate: new Date('2024-03-15'),
      status: 'ACTIVE',
      createdBy: admin.id,
      serviceFee: 50,
      depositRate: 100,
      paymentMethod: 'DEPOSIT',
      fulfillmentMethod: 'E_TICKET',
      ticketZones: {
        create: [
          { name: 'VIP', price: 2000, fee: 100 },
          { name: 'Standard', price: 1000, fee: 50 },
          { name: 'Economy', price: 500, fee: 25 },
        ],
      },
    },
  })

  const formEvent = await prisma.event.create({
    data: {
      name: 'Product Pre-order',
      type: 'FORM',
      description: 'การสั่งจองสินค้าล่วงหน้า',
      startDate: new Date('2024-03-20'),
      endDate: new Date('2024-03-31'),
      status: 'ACTIVE',
      createdBy: admin.id,
      serviceFeeFixed: 100,
      paymentMethod: 'DEPOSIT',
      fulfillmentMethod: 'SHIPPING',
      formFields: {
        create: [
          { label: 'ลิงก์สินค้า', type: 'URL', required: true },
          { label: 'ไซส์', type: 'SELECT', required: true, options: 'S,M,L,XL' },
          { label: 'ที่อยู่จัดส่ง', type: 'TEXTAREA', required: true },
        ],
      },
    },
  })

  // Create sample bookings
  await prisma.booking.create({
    data: {
      eventId: concertEvent.id,
      userId: admin.id,
      status: 'PENDING',
      depositPaid: 100,
      totalPaid: 0,
      notes: 'รอการอนุมัติ',
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
