"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Calendar,
  Users,
  FileText,
  CreditCard,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Bell,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"

export default function DashboardOverview() {
  // Mock data for demo
  const stats = {
    ticketMode: {
      pendingApproval: 12,
      inProgress: 8,
      totalCompleted: 156,
    },
    formMode: {
      newForms: 23,
      pendingReview: 15,
    },
    finance: {
      depositsHeld: 45000,
      refundsAccumulated: 12000,
      outstandingPayments: 8500,
    },
  }

  const recentAlerts = [
    {
      id: 1,
      type: "slip",
      message: "มีสลิปใหม่จากลูกค้า #1234",
      time: "2 นาทีที่แล้ว",
      priority: "high",
    },
    {
      id: 2,
      type: "self_card",
      message: "ลูกค้า #5678 แจ้งว่าได้บัตรเองแล้ว",
      time: "5 นาทีที่แล้ว",
      priority: "medium",
    },
    {
      id: 3,
      type: "form",
      message: "มีฟอร์มใหม่จากลูกค้า #9012",
      time: "10 นาทีที่แล้ว",
      priority: "low",
    },
  ]

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "slip":
        return <CreditCard className="h-4 w-4" />
      case "self_card":
        return <CheckCircle className="h-4 w-4" />
      case "form":
        return <FileText className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">ภาพรวมระบบและสถิติสำคัญ</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Ticket Mode Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Mode</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">คิวรออนุมัติ</span>
                <Badge variant="secondary">{stats.ticketMode.pendingApproval}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">กำลังดำเนินการ</span>
                <Badge variant="outline">{stats.ticketMode.inProgress}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">จำนวนที่กดได้รวม</span>
                <Badge variant="default">{stats.ticketMode.totalCompleted}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Mode Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Form Mode</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">ฟอร์มใหม่</span>
                <Badge variant="secondary">{stats.formMode.newForms}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">รอตรวจสอบ</span>
                <Badge variant="outline">{stats.formMode.pendingReview}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Finance Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Finance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">มัดจำถืออยู่</span>
                <span className="text-sm font-medium">฿{stats.finance.depositsHeld.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">เงินคืนสะสม</span>
                <span className="text-sm font-medium text-red-600">฿{stats.finance.refundsAccumulated.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">ค้างชำระ</span>
                <span className="text-sm font-medium text-orange-600">฿{stats.finance.outstandingPayments.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Alerts */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Real-time Alerts
            </CardTitle>
            <CardDescription>แจ้งเตือนล่าสุด</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className="flex-shrink-0 mt-0.5">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {alert.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                    </div>
                    <Badge className={getPriorityColor(alert.priority)}>
                      {alert.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>การกระทำที่ใช้บ่อย</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <CheckCircle className="h-6 w-6 mb-2" />
                <span className="text-sm">อนุมัติคิว</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <CreditCard className="h-6 w-6 mb-2" />
                <span className="text-sm">ตรวจสลิป</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Calendar className="h-6 w-6 mb-2" />
                <span className="text-sm">สร้างงาน</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <FileText className="h-6 w-6 mb-2" />
                <span className="text-sm">รายงาน</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>กิจกรรมล่าสุดในระบบ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">คิว #1234 ได้รับการอนุมัติแล้ว</p>
                <p className="text-xs text-gray-500">โดย Admin - 5 นาทีที่แล้ว</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">สลิปจากลูกค้า #5678 ได้รับการตรวจสอบแล้ว</p>
                <p className="text-xs text-gray-500">โดย Staff - 15 นาทีที่แล้ว</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">ฟอร์มใหม่จากลูกค้า #9012 รอการตรวจสอบ</p>
                <p className="text-xs text-gray-500">30 นาทีที่แล้ว</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
