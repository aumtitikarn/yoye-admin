"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  MessageSquare,
  History,
  Calendar,
  FileText,
  CreditCard,
  Package,
  AlertCircle,
} from "lucide-react"

export default function BookingManagement() {
  const [bookings, setBookings] = useState([
    {
      id: "BK001",
      eventName: "Concert Night 2024",
      customerName: "สมชาย ใจดี",
      status: "PENDING",
      type: "TICKET",
      createdAt: "2024-03-10",
      depositPaid: 100,
      totalAmount: 1500,
    },
    {
      id: "BK002",
      eventName: "Product Pre-order",
      customerName: "สมศรี รักดี",
      status: "APPROVED",
      type: "FORM",
      createdAt: "2024-03-09",
      depositPaid: 0,
      totalAmount: 500,
    },
    {
      id: "BK003",
      eventName: "Fan Meeting",
      customerName: "วิชัย มั่นคง",
      status: "PROCESSING",
      type: "TICKET",
      createdAt: "2024-03-08",
      depositPaid: 100,
      totalAmount: 2000,
    },
  ])

  const [selectedEvent, setSelectedEvent] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "APPROVED":
        return "bg-green-100 text-green-800"
      case "PROCESSING":
        return "bg-blue-100 text-blue-800"
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      case "REFUND_PENDING":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4" />
      case "APPROVED":
        return <CheckCircle className="h-4 w-4" />
      case "PROCESSING":
        return <AlertCircle className="h-4 w-4" />
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4" />
      case "CANCELLED":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesEvent = selectedEvent === "all" || booking.eventName.includes(selectedEvent)
    const matchesStatus = selectedStatus === "all" || booking.status === selectedStatus
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesEvent && matchesStatus && matchesSearch
  })

  const handleStatusUpdate = (bookingId: string, newStatus: string) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ))
  }

  const openBookingDetail = (booking: any) => {
    setSelectedBooking(booking)
    setIsDetailDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Booking & Form Management</h1>
        <p className="text-gray-600">จัดการคิวและรายการทั้งหมดในระบบ</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            ตัวกรอง
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>ค้นหา</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ค้นหาชื่อลูกค้าหรือเลขที่คิว"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>ชื่องาน</Label>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกงาน" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกงาน</SelectItem>
                  <SelectItem value="Concert Night 2024">Concert Night 2024</SelectItem>
                  <SelectItem value="Product Pre-order">Product Pre-order</SelectItem>
                  <SelectItem value="Fan Meeting">Fan Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>สถานะ</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกสถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกสถานะ</SelectItem>
                  <SelectItem value="PENDING">รออนุมัติ</SelectItem>
                  <SelectItem value="APPROVED">อนุมัติแล้ว</SelectItem>
                  <SelectItem value="PROCESSING">กำลังดำเนินการ</SelectItem>
                  <SelectItem value="COMPLETED">เสร็จสิ้น</SelectItem>
                  <SelectItem value="CANCELLED">ยกเลิก</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedEvent("all")
                  setSelectedStatus("all")
                  setSearchTerm("")
                }}
              >
                รีเซ็ตตัวกรอง
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการคิว ({filteredBookings.length})</CardTitle>
          <CardDescription>รายการคิวทั้งหมดตามตัวกรองที่เลือก</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>เลขที่คิว</TableHead>
                <TableHead>ชื่องาน</TableHead>
                <TableHead>ชื่อลูกค้า</TableHead>
                <TableHead>ประเภท</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>วันที่สร้าง</TableHead>
                <TableHead>จำนวนเงิน</TableHead>
                <TableHead>การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>{booking.eventName}</TableCell>
                  <TableCell>{booking.customerName}</TableCell>
                  <TableCell>
                    <Badge variant={booking.type === "TICKET" ? "default" : "secondary"}>
                      {booking.type === "TICKET" ? (
                        <><Calendar className="h-3 w-3 mr-1" />Ticket</>
                      ) : (
                        <><FileText className="h-3 w-3 mr-1" />Form</>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(booking.status)}>
                      {getStatusIcon(booking.status)}
                      <span className="ml-1">{booking.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>{booking.createdAt}</TableCell>
                  <TableCell>฿{booking.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openBookingDetail(booking)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {booking.status === "PENDING" && (
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-green-600"
                            onClick={() => handleStatusUpdate(booking.id, "APPROVED")}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-600"
                            onClick={() => handleStatusUpdate(booking.id, "CANCELLED")}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Booking Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>รายละเอียดคิว {selectedBooking?.id}</DialogTitle>
            <DialogDescription>
              ข้อมูลละเอียดและประวัติการเปลี่ยนสถานะ
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <Tabs defaultValue="details" className="space-y-4">
              <TabsList>
                <TabsTrigger value="details">ข้อมูลทั่วไป</TabsTrigger>
                <TabsTrigger value="payment">การชำระเงิน</TabsTrigger>
                <TabsTrigger value="history">ประวัติ</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>ชื่อลูกค้า</Label>
                    <p className="font-medium">{selectedBooking.customerName}</p>
                  </div>
                  <div>
                    <Label>ชื่องาน</Label>
                    <p className="font-medium">{selectedBooking.eventName}</p>
                  </div>
                  <div>
                    <Label>ประเภท</Label>
                    <Badge variant={selectedBooking.type === "TICKET" ? "default" : "secondary"}>
                      {selectedBooking.type}
                    </Badge>
                  </div>
                  <div>
                    <Label>สถานะปัจจุบัน</Label>
                    <Badge className={getStatusColor(selectedBooking.status)}>
                      {selectedBooking.status}
                    </Badge>
                  </div>
                  <div>
                    <Label>วันที่สร้าง</Label>
                    <p>{selectedBooking.createdAt}</p>
                  </div>
                  <div>
                    <Label>จำนวนเงินทั้งหมด</Label>
                    <p className="font-medium">฿{selectedBooking.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>หมายเหตุ</Label>
                  <Textarea placeholder="กรอกหมายเหตุ (ถ้ามี)" />
                </div>
              </TabsContent>
              
              <TabsContent value="payment" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>มัดจำที่จ่าย</Label>
                    <p className="font-medium">฿{selectedBooking.depositPaid.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>ยอดค้างชำระ</Label>
                    <p className="font-medium text-orange-600">
                      ฿{(selectedBooking.totalAmount - selectedBooking.depositPaid).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium">ประวัติการชำระเงิน</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="font-medium">มัดจำ</p>
                        <p className="text-sm text-gray-500">10 มี.ค. 2024</p>
                      </div>
                      <Badge>฿{selectedBooking.depositPaid.toLocaleString()}</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium">ประวัติการเปลี่ยนสถานะ</h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-start gap-3 p-3 border rounded">
                      <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">สร้างคิว</p>
                        <p className="text-sm text-gray-500">ระบบ - {selectedBooking.createdAt}</p>
                      </div>
                    </div>
                    
                    {selectedBooking.status !== "PENDING" && (
                      <div className="flex items-start gap-3 p-3 border rounded">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium">อนุมัติคิว</p>
                          <p className="text-sm text-gray-500">Admin - 11 มี.ค. 2024</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              ปิด
            </Button>
            {selectedBooking?.status === "PENDING" && (
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  className="text-red-600"
                  onClick={() => {
                    handleStatusUpdate(selectedBooking.id, "CANCELLED")
                    setIsDetailDialogOpen(false)
                  }}
                >
                  ปฏิเสธ
                </Button>
                <Button 
                  onClick={() => {
                    handleStatusUpdate(selectedBooking.id, "APPROVED")
                    setIsDetailDialogOpen(false)
                  }}
                >
                  อนุมัติ
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
