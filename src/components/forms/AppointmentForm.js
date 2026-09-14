"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  CarFront,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  HandCoins,
  MessageSquareText,
  RefreshCw,
  UserRound,
} from "lucide-react";

const appointmentTypes = [
  {
    value: "vehicle_inspection",
    title: "Araç İnceleme",
    description: "Portföyümüzdeki bir aracı yakından inceleyin.",
    icon: CarFront,
  },
  {
    value: "vehicle_sale",
    title: "Araç Satışı Görüşmesi",
    description: "Satmak istediğiniz araç için görüşme oluşturun.",
    icon: HandCoins,
  },
  {
    value: "trade",
    title: "Takas Görüşmesi",
    description: "Aracınızı Auto Tokyo portföyündeki araçla takas edin.",
    icon: RefreshCw,
  },
  {
    value: "general",
    title: "Genel Görüşme",
    description: "Diğer konular için görüşme talebi oluşturun.",
    icon: MessageSquareText,
  },
];

const timeSlots = [
  "09:00",
  "09:45",
  "10:30",
  "11:15",
  "12:00",
  "12:45",
  "13:30",
  "14:15",
  "15:00",
  "15:45",
];

const steps = [
  {
    number: 1,
    title: "Randevu Türü",
  },
  {
    number: 2,
    title: "Araç Seçimi",
  },
  {
    number: 3,
    title: "Tarih ve Saat",
  },
  {
    number: 4,
    title: "İletişim",
  },
  {
    number: 5,
    title: "Kontrol",
  },
];

function getToday() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - offset * 60 * 1000);

  return localDate.toISOString().split("T")[0];
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "Seçilmedi";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(`${dateValue}T12:00:00`));
}

function formatPhone(value) {
  const numbers = value.replace(/\D/g, "").slice(0, 11);

  if (numbers.length <= 4) {
    return numbers;
  }

  if (numbers.length <= 7) {
    return `${numbers.slice(0, 4)} ${numbers.slice(4)}`;
  }

  if (numbers.length <= 9) {
    return `${numbers.slice(0, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7)}`;
  }

  return `${numbers.slice(0, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7, 9)} ${numbers.slice(9)}`;
}

export default function AppointmentForm({ initialVehicle = "", vehicles = [] }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    appointmentType: initialVehicle ? "vehicle_inspection" : "",
    vehicleSlug: initialVehicle,
    date: "",
    time: "",
    fullName: "",
    phone: "",
    note: "",
    kvkkAccepted: false,
  });

  const publishedVehicles = vehicles.filter(
    (vehicle) => vehicle.status === "published",
  );

  const selectedType = appointmentTypes.find(
    (type) => type.value === formData.appointmentType,
  );

  const selectedVehicle = publishedVehicles.find(
    (vehicle) => vehicle.slug === formData.vehicleSlug,
  );

  const minimumDate = useMemo(() => getToday(), []);

  const updateFormData = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  };

  const validateCurrentStep = () => {
    if (currentStep === 1 && !formData.appointmentType) {
      return "Lütfen randevu türünü seçin.";
    }

    if (
      currentStep === 2 &&
      formData.appointmentType === "vehicle_inspection" &&
      !formData.vehicleSlug
    ) {
      return "Lütfen incelemek istediğiniz aracı seçin.";
    }

    if (currentStep === 3) {
      if (!formData.date) {
        return "Lütfen randevu tarihini seçin.";
      }

      const selectedDate = new Date(`${formData.date}T12:00:00`);

      if (selectedDate.getDay() === 0) {
        return "Pazar günleri randevu oluşturulamamaktadır.";
      }

      if (!formData.time) {
        return "Lütfen uygun bir saat seçin.";
      }

      const appointmentDate = new Date(
        `${formData.date}T${formData.time}:00`,
      );

      const minimumAppointmentTime = new Date(
        Date.now() + 60 * 60 * 1000,
      );

      if (appointmentDate < minimumAppointmentTime) {
        return "Aynı gün randevuları en az 1 saat önceden oluşturulmalıdır.";
      }
    }

    if (currentStep === 4) {
      if (formData.fullName.trim().length < 3) {
        return "Lütfen adınızı ve soyadınızı girin.";
      }

      const phoneNumbers = formData.phone.replace(/\D/g, "");

      if (phoneNumbers.length !== 11 || !phoneNumbers.startsWith("05")) {
        return "Telefon numarası 05 ile başlayan 11 haneli bir numara olmalıdır.";
      }
    }

    if (currentStep === 5 && !formData.kvkkAccepted) {
      return "Lütfen KVKK Aydınlatma Metni'ni okuduğunuzu onaylayın.";
    }


    return "";
  };

  const goToNextStep = () => {
    const validationError = validateCurrentStep();

    if (validationError) {
      setError(validationError);
      return;
    }

    setCurrentStep((current) => Math.min(current + 1, 5));
    setError("");
  };

  const goToPreviousStep = () => {
    setCurrentStep((current) => Math.max(current - 1, 1));
    setError("");
  };

  const submitAppointment = async (event) => {
    event.preventDefault();

    const validationError = validateCurrentStep();

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, phone: formData.phone.replace(/\D/g, "") }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Randevu kaydedilemedi.");
      setIsCompleted(true);
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="glass-panel mx-auto max-w-2xl rounded-[2rem] p-8 text-center sm:p-12">
        <div className="red-glow mx-auto grid size-20 place-items-center rounded-full bg-tokyo-red text-white">
          <CheckCircle2 aria-hidden="true" className="size-10" />
        </div>

        <p className="mt-7 text-xs font-bold uppercase tracking-[0.25em] text-tokyo-red">
          Talebiniz Alındı
        </p>

        <h2 className="mt-4 font-display text-4xl font-extrabold uppercase text-white sm:text-5xl">
          Randevu Talebiniz Oluşturuldu
        </h2>

        <p className="mt-5 text-sm leading-7 text-tokyo-silver">
          Randevu talebiniz Auto Tokyo tarafından incelendikten sonra
          Tuğra Çevik tarafından WhatsApp üzerinden bilgilendirileceksiniz.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-5">
          <p className="text-xs uppercase tracking-wider text-tokyo-muted">
            Seçilen randevu
          </p>

          <p className="mt-2 font-semibold text-white">
            {formatDate(formData.date)} — {formData.time}
          </p>

          <p className="mt-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            Onay bekliyor
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submitAppointment}
      className="glass-panel overflow-hidden rounded-[2rem]"
    >
      <div className="border-b border-white/10 px-5 py-6 sm:px-8">
        <div className="grid grid-cols-5 gap-2">
          {steps.map((step) => {
            const isActive = step.number === currentStep;
            const isFinished = step.number < currentStep;

            return (
              <div
                key={step.number}
                className="flex flex-col items-center text-center"
              >
                <div
                  className={`grid size-9 place-items-center rounded-full border text-xs font-bold transition-colors ${
                    isActive
                      ? "border-tokyo-red bg-tokyo-red text-white"
                      : isFinished
                        ? "border-tokyo-red bg-tokyo-red/15 text-tokyo-red"
                        : "border-white/10 bg-white/[0.03] text-tokyo-muted"
                  }`}
                >
                  {isFinished ? (
                    <Check aria-hidden="true" className="size-4" />
                  ) : (
                    step.number
                  )}
                </div>

                <span
                  className={`mt-2 hidden text-[0.65rem] sm:block ${
                    isActive ? "text-white" : "text-tokyo-muted"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="min-h-[32rem] p-6 sm:p-9">
        {currentStep === 1 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-tokyo-red">
              1. Adım
            </p>

            <h2 className="mt-3 font-display text-4xl font-extrabold uppercase text-white">
              Randevu Türünü Seçin
            </h2>

            <p className="mt-3 text-sm text-tokyo-silver">
              Auto Tokyo&apos;yu hangi amaçla ziyaret etmek istediğinizi
              seçin.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {appointmentTypes.map((type) => {
                const Icon = type.icon;
                const isSelected =
                  formData.appointmentType === type.value;

                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => {
                      updateFormData("appointmentType", type.value);

                      if (type.value !== "vehicle_inspection") {
                        updateFormData("vehicleSlug", "");
                      }
                    }}
                    className={`rounded-2xl border p-5 text-left transition-all ${
                      isSelected
                        ? "border-tokyo-red bg-tokyo-red/10"
                        : "border-white/10 bg-black/20 hover:border-white/25"
                    }`}
                  >
                    <Icon
                      aria-hidden="true"
                      className={`size-6 ${
                        isSelected
                          ? "text-tokyo-red"
                          : "text-tokyo-silver"
                      }`}
                    />

                    <h3 className="mt-4 font-display text-2xl font-bold uppercase text-white">
                      {type.title}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-tokyo-silver">
                      {type.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-tokyo-red">
              2. Adım
            </p>

            <h2 className="mt-3 font-display text-4xl font-extrabold uppercase text-white">
              {formData.appointmentType === "vehicle_inspection"
                ? "İncelenecek Aracı Seçin"
                : "Araç Seçimi Gerekmiyor"}
            </h2>

            {formData.appointmentType === "vehicle_inspection" ? (
              <div className="mt-8 grid max-h-[26rem] gap-3 overflow-y-auto pr-2">
                {publishedVehicles.map((vehicle) => {
                  const isSelected =
                    formData.vehicleSlug === vehicle.slug;

                  return (
                    <button
                      key={vehicle.id}
                      type="button"
                      onClick={() =>
                        updateFormData("vehicleSlug", vehicle.slug)
                      }
                      className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                        isSelected
                          ? "border-tokyo-red bg-tokyo-red/10"
                          : "border-white/10 bg-black/20 hover:border-white/25"
                      }`}
                    >
                      <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-white/[0.04]">
                        <CarFront
                          aria-hidden="true"
                          className="size-7 text-tokyo-red"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-tokyo-red">
                          {vehicle.brand}
                        </p>

                        <p className="mt-1 truncate font-semibold text-white">
                          {vehicle.model}
                        </p>

                        <p className="mt-1 truncate text-xs text-tokyo-muted">
                          {vehicle.title}
                        </p>
                      </div>

                      {isSelected && (
                        <CheckCircle2
                          aria-hidden="true"
                          className="size-6 shrink-0 text-tokyo-red"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-8 text-center">
                <CheckCircle2
                  aria-hidden="true"
                  className="mx-auto size-12 text-tokyo-red"
                />

                <p className="mt-5 text-sm leading-7 text-tokyo-silver">
                  Seçtiğiniz randevu türü için Auto Tokyo portföyünden araç
                  seçmeniz gerekmiyor. Tarih ve saat adımına geçebilirsiniz.
                </p>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-tokyo-red">
              3. Adım
            </p>

            <h2 className="mt-3 font-display text-4xl font-extrabold uppercase text-white">
              Tarih ve Saat Seçin
            </h2>

            <p className="mt-3 text-sm leading-6 text-tokyo-silver">
              Pazar günleri kapalıyız. Aynı gün randevuları en az bir saat
              önceden oluşturulabilir.
            </p>

            <div className="mt-8">
              <label
                htmlFor="appointment-date"
                className="text-sm font-semibold text-white"
              >
                Randevu tarihi
              </label>

              <input
                id="appointment-date"
                type="date"
                min={minimumDate}
                value={formData.date}
                onChange={(event) => {
                  updateFormData("date", event.target.value);
                  updateFormData("time", "");
                }}
                className="mt-3 w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none transition-colors focus:border-tokyo-red"
              />
            </div>

            <div className="mt-8">
              <p className="text-sm font-semibold text-white">
                Randevu saati
              </p>

              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => updateFormData("time", time)}
                    className={`rounded-xl border px-3 py-3 text-sm font-semibold transition-all ${
                      formData.time === time
                        ? "border-tokyo-red bg-tokyo-red text-white"
                        : "border-white/10 bg-black/20 text-tokyo-silver hover:border-white/25 hover:text-white"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-tokyo-red">
              4. Adım
            </p>

            <h2 className="mt-3 font-display text-4xl font-extrabold uppercase text-white">
              İletişim Bilgilerinizi Girin
            </h2>

            <div className="mt-8 grid gap-6">
              <div>
                <label
                  htmlFor="full-name"
                  className="text-sm font-semibold text-white"
                >
                  Ad soyad
                </label>

                <div className="relative mt-3">
                  <UserRound
                    aria-hidden="true"
                    className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-tokyo-muted"
                  />

                  <input
                    id="full-name"
                    type="text"
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={(event) =>
                      updateFormData("fullName", event.target.value)
                    }
                    placeholder="Adınız ve soyadınız"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 py-4 pl-12 pr-5 text-white outline-none transition-colors placeholder:text-tokyo-muted focus:border-tokyo-red"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="text-sm font-semibold text-white"
                >
                  Telefon numarası
                </label>

                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={(event) =>
                    updateFormData(
                      "phone",
                      formatPhone(event.target.value),
                    )
                  }
                  placeholder="05xx xxx xx xx"
                  className="mt-3 w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none transition-colors placeholder:text-tokyo-muted focus:border-tokyo-red"
                />
              </div>

              <div>
                <label
                  htmlFor="note"
                  className="text-sm font-semibold text-white"
                >
                  Ek not
                  <span className="ml-2 text-xs font-normal text-tokyo-muted">
                    İsteğe bağlı
                  </span>
                </label>

                <textarea
                  id="note"
                  rows={5}
                  maxLength={500}
                  value={formData.note}
                  onChange={(event) =>
                    updateFormData("note", event.target.value)
                  }
                  placeholder="Randevunuzla ilgili eklemek istediğiniz bilgiler..."
                  className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none transition-colors placeholder:text-tokyo-muted focus:border-tokyo-red"
                />

                <p className="mt-2 text-right text-xs text-tokyo-muted">
                  {formData.note.length}/500
                </p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-tokyo-red">
              5. Adım
            </p>

            <h2 className="mt-3 font-display text-4xl font-extrabold uppercase text-white">
              Bilgilerinizi Kontrol Edin
            </h2>

            <div className="mt-8 grid gap-4">
              {[
                {
                  label: "Randevu türü",
                  value: selectedType?.title || "Seçilmedi",
                },
                {
                  label: "Araç",
                  value:
                    formData.appointmentType === "vehicle_inspection"
                      ? selectedVehicle
                        ? `${selectedVehicle.brand} ${selectedVehicle.model}`
                        : "Seçilmedi"
                      : "Araç seçimi gerekmiyor",
                },
                {
                  label: "Tarih",
                  value: formatDate(formData.date),
                },
                {
                  label: "Saat",
                  value: formData.time || "Seçilmedi",
                },
                {
                  label: "Ad soyad",
                  value: formData.fullName,
                },
                {
                  label: "Telefon",
                  value: formData.phone,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="text-xs uppercase tracking-wider text-tokyo-muted">
                    {item.label}
                  </span>

                  <span className="text-sm font-semibold text-white">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs leading-6 text-tokyo-silver">
              <input type="checkbox" checked={formData.kvkkAccepted} onChange={(event) => updateFormData("kvkkAccepted", event.target.checked)} className="mt-1 size-4 shrink-0 accent-red-600" />
              <span><a href="/kvkk" target="_blank" rel="noreferrer" className="font-semibold text-white underline">KVKK Aydınlatma Metni</a>&apos;ni okudum ve kişisel verilerimin randevu talebim için işlenmesini kabul ediyorum.</span>
            </label>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-200"
          >
            {error}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-white/10 px-6 py-5 sm:px-9">
        <button
          type="button"
          onClick={goToPreviousStep}
          disabled={currentStep === 1}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-white transition-colors hover:border-white/25 disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
          Geri
        </button>

        {currentStep < 5 ? (
          <button
            type="button"
            onClick={goToNextStep}
            className="red-glow inline-flex items-center gap-2 rounded-full bg-tokyo-red px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-red-500"
          >
            Devam Et
            <ChevronRight aria-hidden="true" className="size-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="red-glow inline-flex items-center gap-2 rounded-full bg-tokyo-red px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-red-500"
          >
            {isSubmitting ? "Gönderiliyor…" : "Randevu Talebini Gönder"}
            <CheckCircle2 aria-hidden="true" className="size-4" />
          </button>
        )}
      </div>
    </form>
  );
}
