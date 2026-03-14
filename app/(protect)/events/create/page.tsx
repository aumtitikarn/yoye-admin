"use client";

import { useRef, useState } from "react";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Upload, ArrowLeft } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import Link from "next/link";
import {
  useCreateTicketEvent,
  useCreateFormEvent,
} from "../hooks/use-create-event";
import type { TicketEventValues } from "./validate/create-event.validate";

function ZoneFields({
  roundIndex,
  form,
}: Readonly<{
  roundIndex: number;
  form: UseFormReturn<TicketEventValues>;
}>) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `showRounds.${roundIndex}.zones`,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h5 className="text-md font-medium text-gray-800">โซนในรอบนี้</h5>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({ name: "", price: "", fee: "", capacity: "" })
          }
        >
          <Plus className="mr-2 h-3 w-3" /> เพิ่มโซน
        </Button>
      </div>
      {fields.map((zone, zoneIndex) => {
        const errors =
          form.formState.errors.showRounds?.[roundIndex]?.zones?.[zoneIndex];
        return (
          <div key={zone.id} className="bg-gray-50 rounded-lg border p-4 space-y-4">
            <div className="flex items-center justify-between mb-3">
              <h6 className="text-sm font-medium text-gray-700">
                โซนที่ {zoneIndex + 1}
              </h6>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-red-500"
                onClick={() => remove(zoneIndex)}
                disabled={fields.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  ชื่อโซน <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="เช่น VIP"
                  {...form.register(
                    `showRounds.${roundIndex}.zones.${zoneIndex}.name`,
                  )}
                />
                {errors?.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  ราคาบัตร <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                  min={0}
                  {...form.register(
                    `showRounds.${roundIndex}.zones.${zoneIndex}.price`,
                  )}
                />
                {errors?.price && (
                  <p className="text-xs text-red-500">{errors.price.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  ค่าบริการ <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="0"
                  {...form.register(
                    `showRounds.${roundIndex}.zones.${zoneIndex}.fee`,
                  )}
                />
                {errors?.fee && (
                  <p className="text-xs text-red-500">{errors.fee.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  จำนวนคิวที่รับกด <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="กรอกจำนวนคิวที่รับกด"
                  {...form.register(
                    `showRounds.${roundIndex}.zones.${zoneIndex}.capacity`,
                  )}
                />
                {errors?.capacity && (
                  <p className="text-xs text-red-500">{errors.capacity.message}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function CreateEventPage() {
  const [eventType, setEventType] = useState<"TICKET" | "FORM">("TICKET");

  const ticketPosterRef = useRef<HTMLInputElement>(null);
  const [ticketPosterPreview, setTicketPosterPreview] = useState("");

  const formPosterRef = useRef<HTMLInputElement>(null);
  const [formPosterPreview, setFormPosterPreview] = useState("");

  const {
    form: ticketForm,
    onSubmit: onTicketSubmit,
    isPending: isTicketPending,
  } = useCreateTicketEvent();

  const {
    form: formForm,
    onSubmit: onFormSubmit,
    isPending: isFormPending,
  } = useCreateFormEvent();

  const {
    fields: roundFields,
    append: appendRound,
    remove: removeRound,
  } = useFieldArray({ control: ticketForm.control, name: "showRounds" });

  const {
    fields: ticketDeepFields,
    append: appendTicketDeep,
    remove: removeTicketDeep,
  } = useFieldArray({ control: ticketForm.control, name: "deepInfoFields" });

  const {
    fields: formDeepFields,
    append: appendFormDeep,
    remove: removeFormDeep,
  } = useFieldArray({ control: formForm.control, name: "deepInfoFields" });

  const handleSubmit = eventType === "TICKET" ? onTicketSubmit : onFormSubmit;
  const isPending = eventType === "TICKET" ? isTicketPending : isFormPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/events">
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

          {/* ─── TICKET TAB ─── */}
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
                    <Controller
                      control={ticketForm.control}
                      name="status"
                      render={({ field }) => (
                        <Switch
                          id="ticket-active"
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            ticketForm.setValue("status", checked);
                          }}
                        />
                      )}
                    />
                    <Label htmlFor="ticket-active" className="text-sm">
                      {ticketForm.watch("status") ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                    </Label>
                  </div>
                </div>

                <div className="flex gap-6">
                  {/* Left: dropzone + URL input */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium text-gray-700">
                      โปสเตอร์งาน
                    </Label>
                    <input type="hidden" {...ticketForm.register("posterImage")} />
                    <div className="relative w-48 aspect-[2/3] overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-white">
                      <input
                        ref={ticketPosterRef}
                        id="ticket-poster-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setTicketPosterPreview(URL.createObjectURL(file));
                            e.target.value = "";
                            ticketForm.setValue("posterUrl", "");
                            file.arrayBuffer().then((buf) => {
                              const binary = Array.from(
                                new Uint8Array(buf),
                                (b) => String.fromCodePoint(b),
                              ).join("");
                              ticketForm.setValue("posterImage", binary);
                            });
                          }
                        }}
                      />
                      {ticketPosterPreview ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={ticketPosterPreview}
                            alt="Poster preview"
                            className="absolute inset-0 w-full h-full object-cover"
                            suppressHydrationWarning
                          />
                          <label
                            htmlFor="ticket-poster-input"
                            className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <p className="text-white text-sm">
                              คลิกเพื่อเปลี่ยนรูปภาพ
                            </p>
                          </label>
                        </>
                      ) : (
                        <label
                          htmlFor="ticket-poster-input"
                          className="absolute inset-0 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <Upload className="w-10 h-10 text-gray-400 mb-3" />
                          <p className="text-sm text-gray-600 text-center">
                            คลิกหรือลากไฟล์มาวางที่นี่
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            JPG, PNG ≤ 5MB
                          </p>
                        </label>
                      )}
                      {ticketPosterPreview && (
                        <button
                          type="button"
                          onClick={() => setTicketPosterPreview("")}
                          className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <div className="space-y-1 w-48">
                      <Label
                        htmlFor="ticket-poster-url"
                        className="text-xs text-gray-500"
                      >
                        หรือ URL รูปภาพ
                      </Label>
                      <Input
                        id="ticket-poster-url"
                        placeholder="กรอก URL รูปภาพ"
                        {...ticketForm.register("posterUrl")}
                        onChange={(e) => {
                          ticketForm.setValue("posterUrl", e.target.value);
                          if (e.target.value) setTicketPosterPreview("");
                        }}
                      />
                    </div>
                  </div>

                  {/* Right: other fields */}
                  <div className="flex-1 grid gap-4 content-start">
                    <div className="space-y-2">
                      <Label
                        htmlFor="ticket-name"
                        className="text-sm font-medium text-gray-700"
                      >
                        ชื่องาน <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="ticket-name"
                        placeholder="กรอกชื่องาน"
                        {...ticketForm.register("name")}
                      />
                      {ticketForm.formState.errors.name && (
                        <p className="text-xs text-red-500">
                          {ticketForm.formState.errors.name.message}
                        </p>
                      )}
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
                        placeholder="กรอกข้อมูลเพิ่มเติม"
                        {...ticketForm.register("notes")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: รอบการแสดงและโซน */}
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
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendRound({
                        name: "",
                        date: "",
                        time: "",
                        zones: [
                          {name: "", price: "", fee: "", capacity: "" },
                        ],
                      })
                    }
                    className="shrink-0"
                  >
                    <Plus className="mr-2 h-4 w-4" /> เพิ่มรอบการแสดง
                  </Button>
                </div>

                <div className="space-y-6">
                  {roundFields.map((round, roundIndex) => {
                    const roundErrors =
                      ticketForm.formState.errors.showRounds?.[roundIndex];
                    return (
                      <div
                        key={round.id}
                        className="bg-white rounded-lg border p-6 space-y-6"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-gray-900 mb-4">
                              รอบที่ {roundIndex + 1}
                            </h4>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">
                                  ชื่อรอบ <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  type="text"
                                  placeholder="เช่น รอบเย็น"
                                  {...ticketForm.register(
                                    `showRounds.${roundIndex}.name`,
                                  )}
                                />
                                {roundErrors?.name && (
                                  <p className="text-xs text-red-500">
                                    {roundErrors.name.message}
                                  </p>
                                )}
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">
                                  วันที่แสดง{" "}
                                  <span className="text-red-500">*</span>
                                </Label>
                                <Controller
                                  control={ticketForm.control}
                                  name={`showRounds.${roundIndex}.date`}
                                  render={({ field }) => (
                                    <DatePicker
                                      value={field.value}
                                      onChange={field.onChange}
                                      placeholder="เลือกวันที่แสดง"
                                    />
                                  )}
                                />
                                {roundErrors?.date && (
                                  <p className="text-xs text-red-500">
                                    {roundErrors.date.message}
                                  </p>
                                )}
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">
                                  เวลาแสดง <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  type="time"
                                  {...ticketForm.register(
                                    `showRounds.${roundIndex}.time`,
                                  )}
                                />
                                {roundErrors?.time && (
                                  <p className="text-xs text-red-500">
                                    {roundErrors.time.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                            onClick={() => removeRound(roundIndex)}
                            disabled={roundFields.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <ZoneFields roundIndex={roundIndex} form={ticketForm} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Section 3: ข้อมูลเชิงลึก */}
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
                  <p className="text-sm text-gray-600">
                    ระบบจะสร้าง Input
                    ให้จากที่คุณกำหนดในระบบข้อมูลเชิงลึกของลูกค้า
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendTicketDeep({
                        otherCode: `other${Date.now()}`,
                        label: "",
                        isRequired: false,
                      })
                    }
                    className="shrink-0"
                  >
                    <Plus className="mr-2 h-4 w-4" /> เพิ่มหัวข้อ
                  </Button>
                </div>

                <div className="space-y-4">
                  {ticketDeepFields.map((field, index) => {
                    const deepError =
                      ticketForm.formState.errors.deepInfoFields?.[index];
                    return (
                      <div
                        key={`ticket-${field.id}`}
                        className="bg-white rounded-lg border p-4"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                          <div className="flex-1 space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                              Label ที่ต้องการให้กรอก #{index + 1}{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              placeholder="เช่น ราคาบัตรสำรอง"
                              {...ticketForm.register(
                                `deepInfoFields.${index}.label`,
                              )}
                            />
                            {deepError?.label && (
                              <p className="text-xs text-red-500">
                                {deepError.label.message}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Controller
                              control={ticketForm.control}
                              name={`deepInfoFields.${index}.isRequired`}
                              render={({ field: f }) => (
                                <Checkbox
                                  id={`ticket-required-${index}`}
                                  checked={f.value}
                                  onCheckedChange={(checked) =>
                                    f.onChange(Boolean(checked))
                                  }
                                />
                              )}
                            />
                            <Label
                              htmlFor={`ticket-required-${index}`}
                              className="text-sm text-gray-700"
                            >
                              จำเป็นต้องกรอก
                            </Label>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTicketDeep(index)}
                            disabled={ticketDeepFields.length === 1}
                            className="text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </TabsContent>

          {/* ─── FORM TAB ─── */}
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
                    <Controller
                      control={formForm.control}
                      name="status"
                      render={({ field }) => (
                        <Switch
                          id="form-active"
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            formForm.setValue("status", checked);
                          }}
                        />
                      )}
                    />
                    <Label htmlFor="form-active" className="text-sm">
                      {formForm.watch("status") ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                    </Label>
                  </div>
                </div>

                <div className="flex gap-6">
                  {/* Left: dropzone + URL input */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium text-gray-700">
                      โปสเตอร์งาน
                    </Label>
                    <input type="hidden" {...formForm.register("posterImage")} />
                    <div className="relative w-48 aspect-[2/3] overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-white">
                      <input
                        ref={formPosterRef}
                        id="form-poster-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFormPosterPreview(URL.createObjectURL(file));
                            e.target.value = "";
                            formForm.setValue("posterUrl", "");
                            file.arrayBuffer().then((buf) => {
                              const binary = Array.from(
                                new Uint8Array(buf),
                                (b) => String.fromCodePoint(b),
                              ).join("");
                              formForm.setValue("posterImage", binary);
                            });
                          }
                        }}
                      />
                      {formPosterPreview ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={formPosterPreview}
                            alt="Poster preview"
                            className="absolute inset-0 w-full h-full object-cover"
                            suppressHydrationWarning
                          />
                          <label
                            htmlFor="form-poster-input"
                            className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <p className="text-white text-sm">
                              คลิกเพื่อเปลี่ยนรูปภาพ
                            </p>
                          </label>
                        </>
                      ) : (
                        <label
                          htmlFor="form-poster-input"
                          className="absolute inset-0 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <Upload className="w-10 h-10 text-gray-400 mb-3" />
                          <p className="text-sm text-gray-600 text-center">
                            คลิกหรือลากไฟล์มาวางที่นี่
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            JPG, PNG ≤ 5MB
                          </p>
                        </label>
                      )}
                      {formPosterPreview && (
                        <button
                          type="button"
                          onClick={() => setFormPosterPreview("")}
                          className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <div className="space-y-1 w-48">
                      <Label
                        htmlFor="form-poster-url"
                        className="text-xs text-gray-500"
                      >
                        หรือ URL รูปภาพ
                      </Label>
                      <Input
                        id="form-poster-url"
                        placeholder="กรอก URL รูปภาพ"
                        {...formForm.register("posterUrl")}
                        onChange={(e) => {
                          formForm.setValue("posterUrl", e.target.value);
                          if (e.target.value) setFormPosterPreview("");
                        }}
                      />
                    </div>
                  </div>

                  {/* Right: other fields */}
                  <div className="flex-1 grid gap-4 content-start md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="form-name"
                        className="text-sm font-medium text-gray-700"
                      >
                        ชื่องาน <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="form-name"
                        placeholder="กรอกชื่องาน"
                        {...formForm.register("name")}
                      />
                      {formForm.formState.errors.name && (
                        <p className="text-xs text-red-500">
                          {formForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="form-period"
                        className="text-sm font-medium text-gray-700"
                      >
                        วันที่จัดงาน <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        control={formForm.control}
                        name="eventDate"
                        render={({ field }) => (
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="วันที่กรอกฟอร์ม"
                          />
                        )}
                      />
                      {formForm.formState.errors.eventDate && (
                        <p className="text-xs text-red-500">
                          {formForm.formState.errors.eventDate.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="form-fee"
                        className="text-sm font-medium text-gray-700"
                      >
                        ค่าบริการ / รายชื่อ{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="form-fee"
                        type="number"
                        min={0}
                        placeholder="กรอกจำนวนเงิน"
                        {...formForm.register("feePerEntry")}
                      />
                      {formForm.formState.errors.feePerEntry && (
                        <p className="text-xs text-red-500">
                          {formForm.formState.errors.feePerEntry.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="form-queue"
                        className="text-sm font-medium text-gray-700"
                      >
                        จำนวนที่รับ <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="form-queue"
                        type="number"
                        min={0}
                        placeholder="กรอกจำนวนคิว"
                        {...formForm.register("capacity")}
                      />
                      {formForm.formState.errors.capacity && (
                        <p className="text-xs text-red-500">
                          {formForm.formState.errors.capacity.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label
                        htmlFor="form-notes"
                        className="text-sm font-medium text-gray-700"
                      >
                        หมายเหตุ
                      </Label>
                      <Input
                        id="form-notes"
                        placeholder="กรอกข้อมูลเพิ่มเติม"
                        {...formForm.register("notes")}
                      />
                    </div>
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
                  <p className="text-sm text-gray-600">
                    ระบบจะสร้าง Input
                    ให้จากที่คุณกำหนดในระบบข้อมูลเชิงลึกของลูกค้า
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendFormDeep({
                        otherCode: `other${Date.now()}`,
                        label: "",
                        isRequired: false,
                      })
                    }
                    className="shrink-0"
                  >
                    <Plus className="mr-2 h-4 w-4" /> เพิ่มหัวข้อ
                  </Button>
                </div>

                <div className="space-y-4">
                  {formDeepFields.map((field, index) => {
                    const deepError =
                      formForm.formState.errors.deepInfoFields?.[index];
                    return (
                      <div
                        key={`form-${field.id}`}
                        className="bg-white rounded-lg border p-4"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                          <div className="flex-1 space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                              Label ที่ต้องการให้กรอก #{index + 1}{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              placeholder="เช่น ชื่อผู้กรอก"
                              {...formForm.register(
                                `deepInfoFields.${index}.label`,
                              )}
                            />
                            {deepError?.label && (
                              <p className="text-xs text-red-500">
                                {deepError.label.message}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Controller
                              control={formForm.control}
                              name={`deepInfoFields.${index}.isRequired`}
                              render={({ field: f }) => (
                                <Checkbox
                                  id={`form-required-${index}`}
                                  checked={f.value}
                                  onCheckedChange={(checked) =>
                                    f.onChange(Boolean(checked))
                                  }
                                />
                              )}
                            />
                            <Label
                              htmlFor={`form-required-${index}`}
                              className="text-sm text-gray-700"
                            >
                              จำเป็นต้องกรอก
                            </Label>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFormDeep(index)}
                            disabled={formDeepFields.length === 1}
                            className="text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex-shrink-0 border-t pt-4 mt-6">
          <div className="flex justify-end gap-2">
            <Link href="/events">
              <Button type="button" variant="outline">
                ยกเลิก
              </Button>
            </Link>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? "กำลังสร้าง..." : "สร้างงาน"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}