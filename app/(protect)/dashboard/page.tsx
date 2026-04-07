"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  FileText,
  CreditCard,
  DollarSign,
  CheckCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { useDashboardStats } from "./hooks/use-dashboard-stats";
import { useDashboardAlerts } from "./hooks/use-dashboard-alerts";
import { useDashboardActivity } from "./hooks/use-dashboard-activity";
import { AlertItem, ActivityItem } from "./types/interface";

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────

const priorityBorder: Record<AlertItem["priority"], string> = {
  high: "border-l-red-500",
  medium: "border-l-yellow-400",
  low: "border-l-blue-400",
};

const priorityBadge: Record<AlertItem["priority"], "destructive" | "secondary" | "outline"> = {
  high: "destructive",
  medium: "secondary",
  low: "outline",
};

const priorityLabel: Record<AlertItem["priority"], string> = {
  high: "เร่งด่วน",
  medium: "ปานกลาง",
  low: "ปกติ",
};

function formatRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "เมื่อกี้";
  if (mins < 60) return `${mins} นาทีที่แล้ว`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ชั่วโมงที่แล้ว`;
  return `${Math.floor(hrs / 24)} วันที่แล้ว`;
}

// ────────────────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────────────────

function StatRow({
  label,
  value,
  loading,
  valueClass = "text-gray-900",
}: Readonly<{
  label: string;
  value: React.ReactNode;
  loading: boolean;
  valueClass?: string;
}>) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-gray-500">{label}</span>
      {loading ? (
        <Skeleton className="h-5 w-12 rounded" />
      ) : (
        <span className={`text-sm font-semibold ${valueClass}`}>{value}</span>
      )}
    </div>
  );
}

function AlertCard({ alert }: Readonly<{ alert: AlertItem }>) {
  return (
    <div
      className={`flex items-start gap-3 rounded-md border-l-4 bg-gray-50 px-4 py-3 ${priorityBorder[alert.priority]}`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 leading-snug">
          {alert.message}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {formatRelativeTime(alert.time)}
        </p>
      </div>
      <Badge variant={priorityBadge[alert.priority]} className="shrink-0 text-xs">
        {priorityLabel[alert.priority]}
      </Badge>
    </div>
  );
}

function ActivityRow({ activity }: Readonly<{ activity: ActivityItem }>) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="h-7 w-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <CheckCircle className="h-3.5 w-3.5 text-green-600" />
        </div>
        <div className="w-px flex-1 bg-gray-100 mt-1" />
      </div>
      <div className="pb-4 flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 leading-snug">
          {activity.message}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {activity.actor ? `${activity.actor} · ` : ""}
          {formatRelativeTime(activity.createdAt)}
        </p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────

export default function DashboardOverview() {
  const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = useDashboardStats();
  const { data: alertsData, isLoading: alertsLoading } = useDashboardAlerts(5);
  const { data: activityData, isLoading: activityLoading } = useDashboardActivity(5);

  const stats = statsData?.data;
  const alerts = alertsData?.data ?? [];
  const activities = activityData?.data ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">ภาพรวมระบบ — อัปเดตทุก 30 วินาที</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetchStats()}
          className="gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          รีเฟรช
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ticket */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Ticket Mode</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="divide-y divide-gray-100">
              <StatRow label="รออนุมัติ" value={<Badge variant="destructive" className="text-xs">{stats?.ticket.pendingApproval}</Badge>} loading={statsLoading} />
              <StatRow label="กำลังดำเนินการ" value={stats?.ticket.inProgress} loading={statsLoading} />
              <StatRow label="สำเร็จแล้วทั้งหมด" value={stats?.ticket.totalCompleted} loading={statsLoading} valueClass="text-green-700" />
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Form Mode</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="divide-y divide-gray-100">
              <StatRow label="ฟอร์มใหม่ (24 ชม.)" value={stats?.form.newForms} loading={statsLoading} />
              <StatRow label="รอตรวจสอบสลิป" value={<Badge variant="secondary" className="text-xs">{stats?.form.pendingReview}</Badge>} loading={statsLoading} />
            </div>
          </CardContent>
        </Card>

        {/* Finance */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Finance</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="divide-y divide-gray-100">
              <StatRow
                label="มัดจำถืออยู่"
                value={`฿${(stats?.finance.depositsHeld ?? 0).toLocaleString()}`}
                loading={statsLoading}
                valueClass="text-blue-700"
              />
              <StatRow
                label="เงินคืนสะสม"
                value={`฿${(stats?.finance.refundsAccumulated ?? 0).toLocaleString()}`}
                loading={statsLoading}
                valueClass="text-red-600"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: CheckCircle, label: "อนุมัติคิว", color: "text-green-600", bg: "bg-green-50 hover:bg-green-100" },
              { icon: CreditCard, label: "ตรวจสลิป", color: "text-blue-600", bg: "bg-blue-50 hover:bg-blue-100" },
              { icon: Calendar, label: "สร้างงาน", color: "text-purple-600", bg: "bg-purple-50 hover:bg-purple-100" },
              { icon: FileText, label: "รายงาน", color: "text-orange-600", bg: "bg-orange-50 hover:bg-orange-100" },
            ].map(({ icon: Icon, label, color, bg }) => (
              <button
                key={label}
                className={`flex flex-col items-center justify-center gap-2 rounded-lg border border-transparent p-4 transition-colors ${bg}`}
              >
                <Icon className={`h-5 w-5 ${color}`} />
                <span className="text-xs font-medium text-gray-700">{label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Alerts */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-gray-600">การแจ้งเตือน</CardTitle>
                <CardDescription className="text-xs mt-0.5">รายการที่ต้องดำเนินการ</CardDescription>
              </div>
              {!alertsLoading && alerts.length > 0 && (
                <Badge variant="destructive" className="text-xs tabular-nums">
                  {alerts.filter((a) => a.priority === "high").length} เร่งด่วน
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {alertsLoading && (
              <div className="space-y-2">
                {["a", "b", "c"].map((k) => (
                  <Skeleton key={k} className="h-14 w-full rounded-md" />
                ))}
              </div>
            )}
            {!alertsLoading && alerts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400 gap-2">
                <CheckCircle className="h-8 w-8 text-green-300" />
                <p className="text-sm">ไม่มีการแจ้งเตือน</p>
              </div>
            )}
            {!alertsLoading && alerts.length > 0 && (
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">กิจกรรมล่าสุด</CardTitle>
            <CardDescription className="text-xs mt-0.5">การเปลี่ยนแปลงสถานะโดย admin</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {activityLoading && (
              <div className="space-y-4">
                {["a", "b", "c"].map((k) => (
                  <div key={k} className="flex gap-3">
                    <Skeleton className="h-7 w-7 rounded-full shrink-0" />
                    <div className="flex-1 space-y-1.5 pt-0.5">
                      <Skeleton className="h-4 w-3/4 rounded" />
                      <Skeleton className="h-3 w-1/3 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!activityLoading && activities.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400 gap-2">
                <Clock className="h-8 w-8 text-gray-200" />
                <p className="text-sm">ไม่มีกิจกรรม</p>
              </div>
            )}
            {!activityLoading && activities.length > 0 && (
              <div>
                {activities.map((activity) => (
                  <ActivityRow key={activity.id} activity={activity} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
