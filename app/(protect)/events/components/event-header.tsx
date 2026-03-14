"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function EventHeader() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
        <p className="text-gray-600">
          จัดการงานทั้งแบบ Ticket Mode และ Form Mode
        </p>
      </div>

      <Link href="/events/create">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          สร้างงานใหม่
        </Button>
      </Link>
    </div>
  );
}
