"use client";

import { useRef } from "react";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Upload } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import type { FormEventValues } from "../validate/create-event.validate";

type Props = Readonly<{ form: UseFormReturn<FormEventValues> }>;

export function AddFormForm({ form }: Props) {
  const posterRef = useRef<HTMLInputElement>(null);
  const posterImageValue = form.watch("posterImage");
  const posterPreview = posterImageValue
    ? posterImageValue.startsWith("data:")
      ? posterImageValue
      : `${process.env.NEXT_PUBLIC_IMAGES_URL}/${posterImageValue}`
    : "";

  const { fields: deepFields, append: appendDeep, remove: removeDeep } =
    useFieldArray({ control: form.control, name: "deepInfoFields" });

  return (
    <div className="space-y-8">
      {/* Section 1: ข้อมูลทั่วไป */}
      <section className="space-y-6">
        <div className="border-l-4 border-blue-500 pl-4">
          <h2 className="text-xl font-semibold text-gray-900">ข้อมูลทั่วไป</h2>
          <p className="text-sm text-gray-600 mt-1">ตั้งค่ารายละเอียดพื้นฐานของฟอร์ม</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium text-gray-700">สถานะการใช้งาน</Label>
              <p className="text-xs text-gray-500 mt-1">เปิด/ปิด การใช้งานฟอร์มนี้</p>
            </div>
            <div className="flex items-center space-x-2">
              <Controller
                control={form.control}
                name="status"
                render={({ field }) => (
                  <Switch
                    id="form-active"
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      form.setValue("status", checked);
                    }}
                  />
                )}
              />
              <Label htmlFor="form-active" className="text-sm">
                {form.watch("status") ? "เปิดใช้งาน" : "ปิดใช้งาน"}
              </Label>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-gray-700">โปสเตอร์งาน</Label>
              <input type="hidden" {...form.register("posterImage")} />
              <div className="relative w-48 aspect-[2/3] overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-white">
                <input
                  ref={posterRef}
                  id="form-poster-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      e.target.value = "";
                      form.setValue("posterUrl", "");
                      const reader = new FileReader();
                      reader.onload = () => {
                        form.setValue("posterImage", reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {posterPreview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={posterPreview}
                      alt="Poster preview"
                      className="absolute inset-0 w-full h-full object-cover"
                      suppressHydrationWarning
                    />
                    <label
                      htmlFor="form-poster-input"
                      className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <p className="text-white text-sm">คลิกเพื่อเปลี่ยนรูปภาพ</p>
                    </label>
                  </>
                ) : (
                  <label
                    htmlFor="form-poster-input"
                    className="absolute inset-0 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <Upload className="w-10 h-10 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600 text-center">คลิกหรือลากไฟล์มาวางที่นี่</p>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG ≤ 5MB</p>
                  </label>
                )}
                {posterPreview && (
                  <button
                    type="button"
                    onClick={() => form.setValue("posterImage", "")}
                    className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow"
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="space-y-1 w-48">
                <Label htmlFor="form-poster-url" className="text-xs text-gray-500">
                  หรือ URL รูปภาพ
                </Label>
                <Input
                  id="form-poster-url"
                  placeholder="กรอก URL รูปภาพ"
                  {...form.register("posterUrl")}
                  onChange={(e) => {
                    form.setValue("posterUrl", e.target.value);
                    if (e.target.value) form.setValue("posterImage", "");
                  }}
                />
              </div>
            </div>

            <div className="flex-1 grid gap-4 content-start md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="form-name" className="text-sm font-medium text-gray-700">
                  ชื่องาน <span className="text-red-500">*</span>
                </Label>
                <Input id="form-name" placeholder="กรอกชื่องาน" {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="form-period" className="text-sm font-medium text-gray-700">
                  วันที่จัดงาน <span className="text-red-500">*</span>
                </Label>
                <Controller
                  control={form.control}
                  name="eventDate"
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="วันที่กรอกฟอร์ม"
                    />
                  )}
                />
                {form.formState.errors.eventDate && (
                  <p className="text-xs text-red-500">{form.formState.errors.eventDate.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="form-fee" className="text-sm font-medium text-gray-700">
                  ค่าบริการ / รายชื่อ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="form-fee"
                  type="number"
                  min={0}
                  placeholder="กรอกจำนวนเงิน"
                  {...form.register("feePerEntry")}
                />
                {form.formState.errors.feePerEntry && (
                  <p className="text-xs text-red-500">{form.formState.errors.feePerEntry.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="form-queue" className="text-sm font-medium text-gray-700">
                  จำนวนที่รับ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="form-queue"
                  type="number"
                  min={0}
                  placeholder="กรอกจำนวนคิว"
                  {...form.register("capacity")}
                />
                {form.formState.errors.capacity && (
                  <p className="text-xs text-red-500">{form.formState.errors.capacity.message}</p>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="form-notes" className="text-sm font-medium text-gray-700">
                  หมายเหตุ
                </Label>
                <Input
                  id="form-notes"
                  placeholder="กรอกข้อมูลเพิ่มเติม"
                  {...form.register("notes")}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: ข้อมูลเชิงลึก */}
      <section className="space-y-6">
        <div className="border-l-4 border-purple-500 pl-4">
          <h2 className="text-xl font-semibold text-gray-900">ข้อมูลเชิงลึก</h2>
          <p className="text-sm text-gray-600 mt-1">กำหนด label ที่ต้องการให้ผู้ใช้งานกรอก</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <p className="text-sm text-gray-600">
              ระบบจะสร้าง Input ให้จากที่คุณกำหนดในระบบข้อมูลเชิงลึกของลูกค้า
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendDeep({ otherCode: `other${Date.now()}`, label: "", isRequired: false })
              }
              className="shrink-0"
            >
              <Plus className="mr-2 h-4 w-4" /> เพิ่มหัวข้อ
            </Button>
          </div>

          <div className="space-y-4">
            {deepFields.map((field, index) => {
              const deepError = form.formState.errors.deepInfoFields?.[index];
              return (
                <div key={`form-${field.id}`} className="bg-white rounded-lg border p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="flex-1 space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Label ที่ต้องการให้กรอก #{index + 1}{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="เช่น ชื่อผู้กรอก"
                        {...form.register(`deepInfoFields.${index}.label`)}
                      />
                      {deepError?.label && (
                        <p className="text-xs text-red-500">{deepError.label.message}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Controller
                        control={form.control}
                        name={`deepInfoFields.${index}.isRequired`}
                        render={({ field: f }) => (
                          <Checkbox
                            id={`form-required-${index}`}
                            checked={f.value}
                            onCheckedChange={(checked) => f.onChange(Boolean(checked))}
                          />
                        )}
                      />
                      <Label htmlFor={`form-required-${index}`} className="text-sm text-gray-700">
                        จำเป็นต้องกรอก
                      </Label>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDeep(index)}
                      disabled={deepFields.length === 1}
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
    </div>
  );
}