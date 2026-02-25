"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Upload, ArrowLeft } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { formatDate } from "@/components/functions/date-formatter";
import Link from "next/link";

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

export default function CreateEventPage() {
  const router = useRouter();
  const [eventType, setEventType] = useState<"TICKET" | "FORM">("TICKET");

  const [ticketGeneralInfo, setTicketGeneralInfo] = useState({
    name: "",
    notes: "",
    posterUrl: "",
    isActive: true,
    deliveryOption: "ETICKET", // ETICKET | PICKUP | DELIVERY | CHOICE
    pickupDate: "",
    pickupTime: "",
    deliveryAddress: "",
    trackingNumber: "",
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

  const handleCreateEvent = () => {
    // TODO: Implement event creation logic
    console.log("Creating event:", {
      eventType,
      ticketGeneralInfo,
      showRounds,
      formGeneralInfo,
      deepInfoFields,
    });

    // Redirect back to events page after creation
    router.push("/dashboard/events");
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/events">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับ
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">สร้างงานใหม่</h1>
            <p className="text-gray-600">
              เลือกรูปแบบงานและกรอกข้อมูลเพื่อสร้างงานใหม่
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl border p-6">
        <Tabs
          value={eventType}
          onValueChange={(value) => setEventType(value as "TICKET" | "FORM")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="TICKET">Ticket Mode</TabsTrigger>
            <TabsTrigger value="FORM">Form Mode</TabsTrigger>
          </TabsList>

          <TabsContent value="TICKET" className="space-y-8 mt-6">
            {/* Section 1: ข้อมูลทั่วไป */}
            <section className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  ข้อมูลทั่วไป
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  ตั้งค่ารายละเอียดพื้นฐานของงาน
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      สถานะการใช้งาน
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      เปิด/ปิด การใช้งานงานนี้
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
                      {ticketGeneralInfo.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                    </Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700">
                    โปสเตอร์งาน
                  </Label>
                  <div className="w-full h-40 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors cursor-pointer relative">
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
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
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

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="ticket-name"
                      className="text-sm font-medium text-gray-700"
                    >
                      ชื่องาน
                    </Label>
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
                    <Label
                      htmlFor="ticket-notes"
                      className="text-sm font-medium text-gray-700"
                    >
                      หมายเหตุ
                    </Label>
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
            </section>
            {/* Section 3: รอบการแสดงและโซน */}
            <section className="space-y-6">
              <div className="border-l-4 border-orange-500 pl-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  รอบการแสดงและโซน
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  ตั้งค่ารอบการแสดงและโซนบัตรในแต่ละรอบ
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    รายการรอบการแสดง
                  </h3>
                  <Button
                    variant="outline"
                    onClick={addShowRound}
                    className="shrink-0"
                  >
                    <Plus className="mr-2 h-4 w-4" /> เพิ่มรอบการแสดง
                  </Button>
                </div>

                <div className="space-y-6">
                  {showRounds.map((round, roundIndex) => (
                    <div
                      key={round.id}
                      className="bg-white rounded-lg border p-6 space-y-6"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900 mb-4">
                            รอบที่ {roundIndex + 1}
                          </h4>
                          <div className="space-y-4">
                            <div className="space-y-2 w-[300px]">
                              <Label className="text-sm font-medium text-gray-700">
                                รอบการแสดง
                              </Label>
                              <DatePicker
                                value={round.date}
                                onChange={(value) =>
                                  handleShowRoundChange(round.id, "date", value)
                                }
                                placeholder="เลือกรอบการแสดง"
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

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h5 className="text-md font-medium text-gray-800">
                            โซนในรอบนี้
                          </h5>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addZone(round.id)}
                          >
                            <Plus className="mr-2 h-3 w-3" /> เพิ่มโซน
                          </Button>
                        </div>
                        {round.zones.map((zone, zoneIndex) => (
                          <div
                            key={zone.id}
                            className="bg-gray-50 rounded-lg border p-4 space-y-4"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h6 className="text-sm font-medium text-gray-700">
                                โซนที่ {zoneIndex + 1}
                              </h6>
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
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">
                                  ชื่อโซน
                                </Label>
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
                                <Label className="text-sm font-medium text-gray-700">
                                  ราคาบัตร
                                </Label>
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
                                <Label className="text-sm font-medium text-gray-700">
                                  ค่าบริการ
                                </Label>
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
                                <Label className="text-sm font-medium text-gray-700">
                                  จำนวนคิวที่รับ
                                </Label>
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
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 4: ข้อมูลเชิงลึก */}
            <section className="space-y-6">
              <div className="border-l-4 border-purple-500 pl-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  ข้อมูลเชิงลึก
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  กำหนด label ที่ต้องการให้ผู้ใช้งานกรอก
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">
                      ระบบจะสร้าง Input
                      ให้จากที่คุณกำหนดในระบบข้อมูลเชิงลึกของลูกค้า
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

                <div className="space-y-4">
                  {deepInfoFields.map((field, index) => (
                    <div
                      key={`ticket-${field.id}`}
                      className="bg-white rounded-lg border p-4"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="flex-1 space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Label ที่ต้องการให้กรอก #{index + 1}
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
                            id={`ticket-required-${field.id}`}
                            checked={field.isRequired}
                            onCheckedChange={(checked) =>
                              handleDeepInfoChange(field.id, {
                                isRequired: Boolean(checked),
                              })
                            }
                          />
                          <Label
                            htmlFor={`ticket-required-${field.id}`}
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
            </section>
          </TabsContent>

          <TabsContent value="FORM" className="space-y-8 mt-6">
            {/* Section 1: ข้อมูลทั่วไป */}
            <section className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  ข้อมูลทั่วไป
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  ตั้งค่ารายละเอียดพื้นฐานของฟอร์ม
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      สถานะการใช้งาน
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      เปิด/ปิด การใช้งานฟอร์มนี้
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
                  <Label className="text-sm font-medium text-gray-700">
                    โปสเตอร์งาน
                  </Label>
                  <div className="w-full h-40 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors cursor-pointer relative">
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
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
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

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="form-name"
                      className="text-sm font-medium text-gray-700"
                    >
                      ชื่องาน
                    </Label>
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
                    <Label
                      htmlFor="form-period"
                      className="text-sm font-medium text-gray-700"
                    >
                      วันที่กรอกฟอร์ม
                    </Label>
                    <DatePicker
                      value={formGeneralInfo.eventDate}
                      onChange={(value) =>
                        handleGeneralInfoChange("eventDate", value)
                      }
                      placeholder="วันที่กรอกฟอร์ม"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="form-fee"
                      className="text-sm font-medium text-gray-700"
                    >
                      ค่าบริการ / รายชื่อ
                    </Label>
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
                    <Label
                      htmlFor="form-notes"
                      className="text-sm font-medium text-gray-700"
                    >
                      หมายเหตุ
                    </Label>
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
            </section>

            {/* Section 2: ข้อมูลเชิงลึก */}
            <section className="space-y-6">
              <div className="border-l-4 border-purple-500 pl-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  ข้อมูลเชิงลึก
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  กำหนด label ที่ต้องการให้ผู้ใช้งานกรอก
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">
                      ระบบจะสร้าง Input
                      ให้จากที่คุณกำหนดในระบบข้อมูลเชิงลึกของลูกค้า
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

                <div className="space-y-4">
                  {deepInfoFields.map((field, index) => (
                    <div
                      key={`form-${field.id}`}
                      className="bg-white rounded-lg border p-4"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="flex-1 space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Label ที่ต้องการให้กรอก #{index + 1}
                          </Label>
                          <Input
                            placeholder="เช่น ชื่อผู้กรอก"
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
                            id={`form-required-${field.id}`}
                            checked={field.isRequired}
                            onCheckedChange={(checked) =>
                              handleDeepInfoChange(field.id, {
                                isRequired: Boolean(checked),
                              })
                            }
                          />
                          <Label
                            htmlFor={`form-required-${field.id}`}
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
            </section>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex-shrink-0 border-t pt-4 mt-6">
          <div className="flex justify-end gap-2">
            <Link href="/dashboard/events">
              <Button variant="outline">ยกเลิก</Button>
            </Link>
            <Button onClick={handleCreateEvent}>สร้างงาน</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
