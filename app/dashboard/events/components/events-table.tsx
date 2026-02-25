"use client";

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
  Calendar,
  Edit,
  FileText,
  Settings,
  Trash2,
  MoreVertical,
  Eye,
} from "lucide-react";

export type EventStatus = "ACTIVE" | "DRAFT" | "CLOSED";

export type EventItem = {
  id: string;
  name: string;
  type: "TICKET" | "FORM";
  status: EventStatus;
  startDate: string;
  endDate: string;
  bookings: number;
  totalCapacity: number;
};

type EventsTableProps = Readonly<{
  events: EventItem[];
}>;

export function EventsTable({ events }: EventsTableProps) {
  const handleStatusChange = (eventId: string, newStatus: boolean) => {
    console.log(
      `Event ${eventId} status changed to: ${newStatus ? "ACTIVE" : "DRAFT"}`,
    );
    // TODO: Implement API call to update event status
  };

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
              <TableHead>สถานะ</TableHead>
              <TableHead>จำนวนคิวทั้งหมด</TableHead>
              <TableHead>เหลือจำนวนคิว</TableHead>
              <TableHead>การจัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={event.type === "TICKET" ? "default" : "secondary"}
                  >
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
                <TableCell>
                  <Switch
                    checked={event.status === "ACTIVE"}
                    onCheckedChange={(checked) =>
                      handleStatusChange(event.id, checked)
                    }
                    suppressHydrationWarning
                  />
                </TableCell>
                <TableCell>{event.totalCapacity}</TableCell>
                <TableCell>
                  <span
                    className={
                      event.totalCapacity - event.bookings <= 0
                        ? "text-red-600 font-medium"
                        : ""
                    }
                  >
                    {event.totalCapacity - event.bookings}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        suppressHydrationWarning
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        ดูรายละเอียด
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        แก้ไข
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        ลบ
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
