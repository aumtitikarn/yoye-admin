"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Settings,
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"

export default function EventManagement() {
  const [events, setEvents] = useState([
    {
      id: "1",
      name: "Concert Night 2024",
      type: "TICKET",
      status: "ACTIVE",
      startDate: "2024-03-15",
      endDate: "2024-03-15",
      bookings: 45,
    },
    {
      id: "2",
      name: "Product Pre-order",
      type: "FORM",
      status: "ACTIVE",
      startDate: "2024-03-20",
      endDate: "2024-03-31",
      bookings: 23,
    },
    {
      id: "3",
      name: "Fan Meeting",
      type: "TICKET",
      status: "DRAFT",
      startDate: "2024-04-10",
      endDate: "2024-04-10",
      bookings: 0,
    },
  ])

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [eventType, setEventType] = useState<"TICKET" | "FORM">("TICKET")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800"
      case "DRAFT":
        return "bg-gray-100 text-gray-800"
      case "CLOSED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <CheckCircle className="h-4 w-4" />
      case "DRAFT":
        return <Clock className="h-4 w-4" />
      case "CLOSED":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600">จัดการงานทั้งแบบ Ticket Mode และ Form Mode</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              สร้างงานใหม่
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>สร้างงานใหม่</DialogTitle>
              <DialogDescription>
                เลือกรูปแบบงานและกรอกข้อมูลเพื่อสร้างงานใหม่
              </DialogDescription>
            </DialogHeader>
            
            <Tabs value={eventType} onValueChange={(value) => setEventType(value as "TICKET" | "FORM")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="TICKET">Ticket Mode</TabsTrigger>
                <TabsTrigger value="FORM">Form Mode</TabsTrigger>
              </TabsList>
              
              <TabsContent value="TICKET" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ticket-name">ชื่องาน</Label>
                    <Input id="ticket-name" placeholder="กรอกชื่องาน" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ticket-date">วันที่จัดงาน</Label>
                    <Input id="ticket-date" type="date" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>โซนบัตรและราคา</Label>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
                      <Input placeholder="ชื่อโซน (เช่น VIP)" />
                      <Input placeholder="ราคาบัตร" type="number" />
                      <Input placeholder="ค่ากด" type="number" />
                    </div>
                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      เพิ่มโซน
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deposit">มัดจำต่อใบ (A x 100)</Label>
                    <Input id="deposit" placeholder="100" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service-fee">ค่ากดทั่วไป</Label>
                    <Input id="service-fee" placeholder="50" type="number" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ticket-description">รายละเอียดงาน</Label>
                  <Textarea id="ticket-description" placeholder="กรอกรายละเอียดงาน" />
                </div>
              </TabsContent>
              
              <TabsContent value="FORM" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="form-name">ชื่องาน</Label>
                    <Input id="form-name" placeholder="กรอกชื่องาน" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="form-period">ระยะเวลารับฟอร์ม</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="date" placeholder="เริ่ม" />
                      <Input type="date" placeholder="สิ้นสุด" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>ฟิลด์ฟอร์ม</Label>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                      <Input placeholder="ชื่อคำถาม" />
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="ประเภทคำถาม" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">ข้อความสั้น</SelectItem>
                          <SelectItem value="textarea">ข้อความยาว</SelectItem>
                          <SelectItem value="select">ตัวเลือก</SelectItem>
                          <SelectItem value="checkbox">กาเคาะ์</SelectItem>
                          <SelectItem value="radio">ปุ่มเลือก</SelectItem>
                          <SelectItem value="url">ลิงก์</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      เพิ่มคำถาม
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="service-fee-type">ค่าบริการ</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกประเภท" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">ค่าบริการเหมา</SelectItem>
                        <SelectItem value="per-option">ตามตัวเลือก</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service-amount">จำนวนเงิน</Label>
                    <Input id="service-amount" placeholder="0" type="number" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="form-description">รายละเอียดงาน</Label>
                  <Textarea id="form-description" placeholder="กรอกรายละเอียดงาน" />
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="space-y-4">
              <Separator />
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>วิธีการจ่ายเงิน</Label>
                  <Select defaultValue="DEPOSIT">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DEPOSIT">ฝากจ่าย</SelectItem>
                      <SelectItem value="SELF_PAY">จ่ายเอง</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>วิธีการรับของ</Label>
                  <Select defaultValue="E_TICKET">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="E_TICKET">E-ticket</SelectItem>
                      <SelectItem value="PICKUP">นัดรับ</SelectItem>
                      <SelectItem value="SHIPPING">จัดส่ง</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>สถานะ</Label>
                  <Select defaultValue="DRAFT">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">ฉบับร่าง</SelectItem>
                      <SelectItem value="ACTIVE">เปิดใช้งาน</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>
                  สร้างงาน
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>รายการงานทั้งหมด</CardTitle>
          <CardDescription>จัดการงานทั้งหมดในระบบ</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่องาน</TableHead>
                <TableHead>ประเภท</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>วันที่จัดงาน</TableHead>
                <TableHead>จำนวนคิว</TableHead>
                <TableHead>การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>
                    <Badge variant={event.type === "TICKET" ? "default" : "secondary"}>
                      {event.type === "TICKET" ? (
                        <><Calendar className="h-3 w-3 mr-1" />Ticket Mode</>
                      ) : (
                        <><FileText className="h-3 w-3 mr-1" />Form Mode</>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(event.status)}>
                      {getStatusIcon(event.status)}
                      <span className="ml-1">{event.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>{event.startDate}</TableCell>
                  <TableCell>{event.bookings}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
