"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Edit,
  FileText,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteEvent } from "../hooks/use-delete.event";
import { useMutationPatch } from "@/service/globalQuery";
import { IEvent } from "../types/interface";
import { IMeta, IBaseResponseData } from "@/types/globalType";

function StatusSwitch({ event }: Readonly<{ event: IEvent }>) {
  const queryClient = useQueryClient();
  const mutation = useMutationPatch<IBaseResponseData<unknown>, { status: boolean }>(
    event.type === "TICKET" ? `events/ticket/${event.id}` : `events/form/${event.id}`,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["events"] });
      },
    },
  );

  return (
    <Switch
      checked={event.status}
      disabled={mutation.isPending}
      onCheckedChange={(checked) => mutation.mutate({ status: checked })}
      suppressHydrationWarning
    />
  );
}

type EventsTableProps = Readonly<{
  events: IEvent[];
  pagination?: IMeta;
  onPageChange?: (page: number) => void;
}>;

function EventRow({ event }: Readonly<{ event: IEvent }>) {
  const router = useRouter();
  const deleteMutation = useDeleteEvent();
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  return (
    <>
      <TableRow key={event.id}>
        <TableCell className="font-medium">{event.name}</TableCell>
        <TableCell>
          <Badge variant="secondary">
            {event.type === "TICKET" ? (
              <>
                <Calendar className="h-3 w-3 mr-1" />
                Ticket Mode
              </>
            ) : (
              <>
                <FileText className="h-3 w-3 mr-1" />
                Form Mode
              </>
            )}
          </Badge>
        </TableCell>
        <TableCell>{event.capacity?.toLocaleString() ?? "-"}</TableCell>
        <TableCell>
          <span className={event.capacityAmount <= 0 ? "text-red-600 font-medium" : ""}>
            {event.capacityAmount.toLocaleString()}
          </span>
        </TableCell>
        <TableCell>
          <StatusSwitch event={event} />
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" suppressHydrationWarning>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/events/${event.id}`)}>
                <Edit className="h-4 w-4 mr-2" />
                แก้ไข
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                disabled={deleteMutation.isPending}
                onClick={() => setConfirmOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                ลบ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent showCloseButton={false} className="max-w-sm">
          <DialogHeader>
            <DialogTitle>ยืนยันการลบ</DialogTitle>
            <DialogDescription>
              คุณต้องการลบงาน <span className="font-medium text-foreground">&quot;{event.name}&quot;</span> ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={deleteMutation.isPending}>
              ยกเลิก
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => {
                deleteMutation.mutate(event.id, {
                  onSuccess: () => setConfirmOpen(false),
                });
              }}
            >
              ลบ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function EventsTable({ events, pagination, onPageChange }: EventsTableProps) {

  return (
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
              <TableHead>จำนวนคิวทั้งหมด</TableHead>
              <TableHead>เหลือจำนวนคิว</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead>การจัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  ไม่มีข้อมูล
                </TableCell>
              </TableRow>
            )}
            {events.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </TableBody>
        </Table>

        {pagination && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              ทั้งหมด {pagination.totalCounts} รายการ
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                ก่อนหน้า
              </Button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === pagination.page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange?.(p)}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
              >
                ถัดไป
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}