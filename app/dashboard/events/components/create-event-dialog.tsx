"use client";

import { Dispatch, SetStateAction, useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Upload } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { formatDate } from "@/components/functions/date-formatter";

export type CreateEventDialogProps = Readonly<{
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  eventType: "TICKET" | "FORM";
  onEventTypeChange: Dispatch<SetStateAction<"TICKET" | "FORM">>;
}>;

type DeepInfoField = {
  id: number;
  otherCode: string;
  label: string;
  isRequired: boolean;
};

type TicketZone = {
  id: number;
  name: string;
  price: string;
  fee: string;
  capacity: string;
};

type ShowRound = {
  id: number;
  name: string;
  date: string;
  time: string;
  zones: TicketZone[];
};

export function CreateEventDialog({
  isOpen,
  onOpenChange,
  eventType,
  onEventTypeChange,
}: CreateEventDialogProps) {
  const [ticketGeneralInfo, setTicketGeneralInfo] = useState({
    name: "",
    notes: "",
    posterUrl: "",
    isActive: true,
  });
  const [showRounds, setShowRounds] = useState<ShowRound[]>([
    {
      id: 1,
      name: "",
      date: "",
      time: "",
      zones: [{ id: 1, name: "", price: "", fee: "", capacity: "" }],
    },
  ]);
  const [showRoundCounter, setShowRoundCounter] = useState(1);
  const [formGeneralInfo, setFormGeneralInfo] = useState({
    name: "",
    eventDate: "",
    feePerEntry: "",
    notes: "",
    posterUrl: "",
    isActive: true,
  });

  const [deepInfoFields, setDeepInfoFields] = useState<DeepInfoField[]>([
    { id: 1, otherCode: "other1", label: "", isRequired: true },
  ]);
  const [deepInfoCounter, setDeepInfoCounter] = useState(1);

  const estimatedTicketFee = useMemo(() => {
    const fees = showRounds
      .flatMap((round) => round.zones)
      .map((zone) => Number.parseFloat(zone.fee))
      .filter((fee) => !Number.isNaN(fee) && fee >= 0);
    if (!fees.length) return "0";
    const average = fees.reduce((sum, fee) => sum + fee, 0) / fees.length;
    return average.toFixed(2);
  }, [showRounds]);

  const handleGeneralInfoChange = (
    field: keyof typeof formGeneralInfo,
    value: string | boolean,
  ) => {
    setFormGeneralInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleTicketInfoChange = (
    field: keyof typeof ticketGeneralInfo,
    value: string | boolean,
  ) => {
    setTicketGeneralInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleShowRoundChange = (
    roundId: number,
    field: keyof ShowRound,
    value: string,
  ) => {
    setShowRounds((prev) =>
      prev.map((round) =>
        round.id === roundId ? { ...round, [field]: value } : round,
      ),
    );
  };

  const handleZoneChange = (
    roundId: number,
    zoneId: number,
    field: keyof TicketZone,
    value: string,
  ) => {
    setShowRounds((prev) =>
      prev.map((round) =>
        round.id === roundId
          ? {
              ...round,
              zones: round.zones.map((zone) =>
                zone.id === zoneId ? { ...zone, [field]: value } : zone,
              ),
            }
          : round,
      ),
    );
  };

  const addShowRound = () => {
    const nextId = showRoundCounter + 1;
    setShowRounds((prev) => [
      ...prev,
      {
        id: nextId,
        name: "",
        date: "",
        time: "",
        zones: [{ id: 1, name: "", price: "", fee: "", capacity: "" }],
      },
    ]);
    setShowRoundCounter(nextId);
  };

  const removeShowRound = (roundId: number) => {
    setShowRounds((prev) =>
      prev.length === 1 ? prev : prev.filter((round) => round.id !== roundId),
    );
  };

  const addZone = (roundId: number) => {
    setShowRounds((prev) =>
      prev.map((round) =>
        round.id === roundId
          ? {
              ...round,
              zones: [
                ...round.zones,
                {
                  id: Math.max(...round.zones.map((z) => z.id), 0) + 1,
                  name: "",
                  price: "",
                  fee: "",
                  capacity: "",
                },
              ],
            }
          : round,
      ),
    );
  };

  const removeZone = (roundId: number, zoneId: number) => {
    setShowRounds((prev) =>
      prev.map((round) =>
        round.id === roundId
          ? {
              ...round,
              zones:
                round.zones.length === 1
                  ? round.zones
                  : round.zones.filter((zone) => zone.id !== zoneId),
            }
          : round,
      ),
    );
  };

  const handleDeepInfoChange = (
    id: number,
    updates: Partial<DeepInfoField>,
  ) => {
    setDeepInfoFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, ...updates } : field)),
    );
  };

  const addDeepInfoField = () => {
    const nextId = deepInfoCounter + 1;
    setDeepInfoFields((prev) => [
      ...prev,
      { id: nextId, otherCode: `other${nextId}`, label: "", isRequired: false },
    ]);
    setDeepInfoCounter(nextId);
  };

  const removeDeepInfoField = (id: number) => {
    setDeepInfoFields((prev) =>
      prev.length === 1 ? prev : prev.filter((field) => field.id !== id),
    );
  };

  const renderDeepInfoSection = (idPrefix: string) => (
    <div className="space-y-4 rounded-xl border p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">ข้อมูลเชิงลึก</p>
          <p className="text-base font-semibold text-gray-900">
            กำหนด label ที่ต้องการให้ผู้ใช้งานกรอก
          </p>
          <p className="text-sm text-gray-500">
            ระบบจะสร้าง Input ให้จากที่คุณกำหนดในระบบข้อมูลเชิงลึกของลูกค้า
          </p>
        </div>
        <Button
          variant="outline"
          onClick={addDeepInfoField}
          className="shrink-0"
        >
          <Plus className="mr-2 h-4 w-4" /> เพิ่มหัวข้อ
        </Button>
      </div>

      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {deepInfoFields.map((field) => (
          <div
            key={`${idPrefix}-${field.id}`}
            className="rounded-lg border p-4"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex-1 space-y-1">
                <Label className="text-sm font-semibold">
                  Label ที่ต้องการให้กรอก
                </Label>
                <Input
                  placeholder="เช่น ราคาบัตรสำรอง"
                  value={field.label}
                  onChange={(e) =>
                    handleDeepInfoChange(field.id, {
                      label: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id={`${idPrefix}-required-${field.id}`}
                  checked={field.isRequired}
                  onCheckedChange={(checked) =>
                    handleDeepInfoChange(field.id, {
                      isRequired: Boolean(checked),
                    })
                  }
                />
                <Label
                  htmlFor={`${idPrefix}-required-${field.id}`}
                  className="text-sm text-gray-700"
                >
                  จำเป็นต้องกรอก
                </Label>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeDeepInfoField(field.id)}
                disabled={deepInfoFields.length === 1}
                className="text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          สร้างงานใหม่
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-[90vw] lg:max-w-6xl xl:max-w-7xl py-3">
        <div className="flex max-h-[90vh] flex-col">
          <DialogHeader className="flex-shrink-0 py-3">
            <DialogTitle>สร้างงานใหม่</DialogTitle>
            <DialogDescription>
              เลือกรูปแบบงานและกรอกข้อมูลเพื่อสร้างงานใหม่
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={eventType}
            onValueChange={(value) =>
              onEventTypeChange(value as "TICKET" | "FORM")
            }
            className="flex-1 overflow-y-auto pr-1"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="TICKET">Ticket Mode</TabsTrigger>
              <TabsTrigger value="FORM">Form Mode</TabsTrigger>
            </TabsList>

            <TabsContent value="TICKET" className="space-y-6">
              <div className="grid gap-6 xl:grid-cols-[1.1fr_1.4fr]">
                <div className="space-y-6">
                  <div className="space-y-4 rounded-xl border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          ข้อมูลทั่วไป
                        </p>
                        <p className="text-base font-semibold text-gray-900">
                          ตั้งค่ารายละเอียดงาน Ticket Mode
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="ticket-active"
                          checked={ticketGeneralInfo.isActive}
                          onCheckedChange={(checked) =>
                            handleTicketInfoChange("isActive", checked)
                          }
                        />
                        <Label htmlFor="ticket-active" className="text-sm">
                          {ticketGeneralInfo.isActive
                            ? "เปิดใช้งาน"
                            : "ปิดใช้งาน"}
                        </Label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>โปสเตอร์งาน</Label>
                        <div className="w-full h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = URL.createObjectURL(file);
                                handleTicketInfoChange("posterUrl", url);
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          {ticketGeneralInfo.posterUrl ? (
                            <div className="relative w-full h-full">
                              <img
                                src={ticketGeneralInfo.posterUrl}
                                alt="Poster preview"
                                className="w-full h-full object-cover rounded-lg"
                                suppressHydrationWarning
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                                <p className="text-white text-sm">
                                  คลิกเพื่อเปลี่ยนรูปภาพ
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">
                                คลิกหรือลากไฟล์มาวางที่นี่
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="ticket-name">ชื่องาน</Label>
                        <Input
                          id="ticket-name"
                          placeholder="กรอกชื่องาน"
                          value={ticketGeneralInfo.name}
                          onChange={(e) =>
                            handleTicketInfoChange("name", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ticket-notes">หมายเหตุ</Label>
                        <Input
                          id="ticket-notes"
                          placeholder="ระบุข้อมูลเพิ่มเติม"
                          value={ticketGeneralInfo.notes}
                          onChange={(e) =>
                            handleTicketInfoChange("notes", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {renderDeepInfoSection("ticket")}
                </div>

                <div className="space-y-4 rounded-xl border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        รอบการแสดงและโซน
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        ตั้งค่ารอบการแสดงและโซนบัตรในแต่ละรอบ
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={addShowRound}
                      className="shrink-0"
                    >
                      <Plus className="mr-2 h-4 w-4" /> เพิ่มรอบการแสดง
                    </Button>
                  </div>

                  <div className="space-y-4 max-h-[430px] overflow-y-auto pr-1">
                    {showRounds.map((round) => (
                      <div
                        key={round.id}
                        className="rounded-lg border p-4 space-y-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="grid gap-4 md:grid-cols-3">
                              <div className="space-y-2">
                                <Label>รอบการแสดง</Label>
                                <DatePicker
                                  value={round.date}
                                  onChange={(value) =>
                                    handleShowRoundChange(
                                      round.id,
                                      "date",
                                      value,
                                    )
                                  }
                                  placeholder="เลือกเลือกรอบการแสดง"
                                />
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                            onClick={() => removeShowRound(round.id)}
                            disabled={showRounds.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-700">
                              โซนในรอบนี้
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addZone(round.id)}
                            >
                              <Plus className="mr-2 h-3 w-3" /> เพิ่มโซน
                            </Button>
                          </div>
                          {round.zones.map((zone) => (
                            <div
                              key={zone.id}
                              className="rounded-lg border p-3 space-y-3 bg-gray-50"
                            >
                              <div className="grid gap-3 md:grid-cols-4">
                                <div className="space-y-2">
                                  <Label>ชื่อโซน</Label>
                                  <Input
                                    placeholder="เช่น VIP"
                                    value={zone.name}
                                    onChange={(e) =>
                                      handleZoneChange(
                                        round.id,
                                        zone.id,
                                        "name",
                                        e.target.value,
                                      )
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>ราคาบัตร</Label>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    value={zone.price}
                                    onChange={(e) =>
                                      handleZoneChange(
                                        round.id,
                                        zone.id,
                                        "price",
                                        e.target.value,
                                      )
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>ค่าบริการ</Label>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    value={zone.fee}
                                    onChange={(e) =>
                                      handleZoneChange(
                                        round.id,
                                        zone.id,
                                        "fee",
                                        e.target.value,
                                      )
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>จำนวนคิวที่รับ</Label>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    value={zone.capacity}
                                    onChange={(e) =>
                                      handleZoneChange(
                                        round.id,
                                        zone.id,
                                        "capacity",
                                        e.target.value,
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500"
                                  onClick={() => removeZone(round.id, zone.id)}
                                  disabled={round.zones.length === 1}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="FORM" className="space-y-6">
              <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
                <div className="space-y-4 rounded-xl border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        ข้อมูลทั่วไป
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        ตั้งค่าฟอร์มสำหรับการกรอกข้อมูล
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="form-active"
                        checked={formGeneralInfo.isActive}
                        onCheckedChange={(checked) =>
                          handleGeneralInfoChange("isActive", checked)
                        }
                      />
                      <Label htmlFor="form-active" className="text-sm">
                        {formGeneralInfo.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>โปสเตอร์งาน</Label>
                      <div className="w-full h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = URL.createObjectURL(file);
                              handleGeneralInfoChange("posterUrl", url);
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {formGeneralInfo.posterUrl ? (
                          <div className="relative w-full h-full">
                            <img
                              src={formGeneralInfo.posterUrl}
                              alt="Poster preview"
                              className="w-full h-full object-cover rounded-lg"
                              suppressHydrationWarning
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                              <p className="text-white text-sm">
                                คลิกเพื่อเปลี่ยนรูปภาพ
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">
                              คลิกหรือลากไฟล์มาวางที่นี่
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="form-name">ชื่องาน</Label>
                      <Input
                        id="form-name"
                        placeholder="กรอกชื่องาน"
                        value={formGeneralInfo.name}
                        onChange={(e) =>
                          handleGeneralInfoChange("name", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="form-period">วันที่กรอกฟอร์ม</Label>
                      <DatePicker
                        value={formGeneralInfo.eventDate}
                        onChange={(value) =>
                          handleGeneralInfoChange("eventDate", value)
                        }
                        placeholder="วันที่กรอกฟอร์ม"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="form-fee">ค่ากด / รายชื่อ</Label>
                      <Input
                        id="form-fee"
                        type="number"
                        placeholder="กรอกจำนวนเงิน"
                        value={formGeneralInfo.feePerEntry}
                        onChange={(e) =>
                          handleGeneralInfoChange("feePerEntry", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="form-notes">หมายเหตุ</Label>
                      <Input
                        id="form-notes"
                        placeholder="ระบุข้อมูลเพิ่มเติม"
                        value={formGeneralInfo.notes}
                        onChange={(e) =>
                          handleGeneralInfoChange("notes", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                {renderDeepInfoSection("form")}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex-shrink-0 border-t pt-4">
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                ยกเลิก
              </Button>
              <Button onClick={() => onOpenChange(false)}>สร้างงาน</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
