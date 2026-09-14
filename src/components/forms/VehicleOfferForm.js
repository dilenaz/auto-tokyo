"use client";

import { useState } from "react";
import {
  Camera,
  CarFront,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileImage,
  HandCoins,
  RefreshCw,
  Trash2,
  Upload,
  UserRound,
} from "lucide-react";

const steps = [
  {
    number: 1,
    title: "İşlem",
  },
  {
    number: 2,
    title: "Araç",
  },
  {
    number: 3,
    title: "Durum",
  },
  {
    number: 4,
    title: "Fotoğraflar",
  },
  {
    number: 5,
    title: "İletişim",
  },
  {
    number: 6,
    title: "Kontrol",
  },
];

const transactionTypes = [
  {
    value: "sale",
    title: "Aracımı Satmak İstiyorum",
    description:
      "Aracınızı Auto Tokyo’ya satmak için değerlendirme talebi oluşturun.",
    icon: HandCoins,
  },
  {
    value: "trade",
    title: "Aracımı Takasa Vermek İstiyorum",
    description:
      "Aracınızı portföyümüzdeki bir araçla takas etmek için talep oluşturun.",
    icon: RefreshCw,
  },
];

const initialFormData = {
  transactionType: "",
  interestedVehicle: "",
  brand: "",
  model: "",
  packageName: "",
  year: "",
  mileage: "",
  fuel: "",
  transmission: "",
  color: "",
  paintedParts: "",
  changedParts: "",
  tramer: "",
  conditionNote: "",
  fullName: "",
  phone: "",
  preferredContactTime: "",
  kvkkAccepted: false,
};

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

export default function VehicleOfferForm({ vehicles = [], initialTransaction = "", initialVehicle = "" }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({ ...initialFormData, transactionType: initialTransaction, interestedVehicle: initialVehicle });
  const [photos, setPhotos] = useState([]);
  const [isDraggingPhotos, setIsDraggingPhotos] = useState(false);
  const [error, setError] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const publishedVehicles = vehicles.filter(
    (vehicle) => vehicle.status === "published",
  );

  const updateFormData = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  };

  const addPhotos = (selectedFiles) => {
    const imageFiles = selectedFiles.filter((file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type) && file.size <= 8 * 1024 * 1024,
    );

    if (imageFiles.length !== selectedFiles.length) {
      setError("Her fotoğraf JPG, PNG veya WebP biçiminde ve en fazla 8 MB olmalıdır.");
    }

    const availablePhotoCount = 10 - photos.length;
    const filesToAdd = imageFiles.slice(0, availablePhotoCount);

    setPhotos((current) => [...current, ...filesToAdd]);
    if (imageFiles.length === selectedFiles.length) setError("");

  };

  const handlePhotoSelection = (event) => {
    addPhotos(Array.from(event.target.files || []));
    event.target.value = "";
  };

  const handlePhotoDrop = (event) => {
    event.preventDefault();
    setIsDraggingPhotos(false);
    addPhotos(Array.from(event.dataTransfer.files || []));
  };

  const removePhoto = (photoIndex) => {
    setPhotos((current) =>
      current.filter((_, index) => index !== photoIndex),
    );
  };

  const validateCurrentStep = () => {
    if (currentStep === 1 && !formData.transactionType) {
      return "Lütfen satış veya takas seçeneğini belirleyin.";
    }

    if (currentStep === 2) {
      if (!formData.brand.trim()) {
        return "Lütfen aracın markasını girin.";
      }

      if (!formData.model.trim()) {
        return "Lütfen aracın modelini girin.";
      }

      if (!formData.year || Number(formData.year) < 1950) {
        return "Lütfen geçerli bir model yılı girin.";
      }

      if (!formData.mileage || Number(formData.mileage) < 0) {
        return "Lütfen aracın kilometresini girin.";
      }

      if (!formData.fuel) {
        return "Lütfen yakıt türünü seçin.";
      }

      if (!formData.transmission) {
        return "Lütfen vites türünü seçin.";
      }
    }

    if (currentStep === 3) {
      if (!formData.tramer.trim()) {
        return "Tramer bilgisi yoksa 'Yok' yazarak devam edin.";
      }
    }

    if (currentStep === 4 && photos.length < 4) {
      return "Lütfen aracınıza ait en az 4 fotoğraf yükleyin.";
    }

    if (currentStep === 5) {
      if (formData.fullName.trim().length < 3) {
        return "Lütfen adınızı ve soyadınızı girin.";
      }

      const phoneNumbers = formData.phone.replace(/\D/g, "");

      if (phoneNumbers.length !== 11 || !phoneNumbers.startsWith("05")) {
        return "Telefon numarasi 05 ile baslayan 11 haneli bir numara olmalidir.";
      }
    }

    if (currentStep === 6 && !formData.kvkkAccepted) {
      return "Lütfen KVKK Aydınlatma Metni'ni okuduğunuzu onaylayın.";
    }


    return "";
  };

  const nextStep = () => {
    const validationError = validateCurrentStep();

    if (validationError) {
      setError(validationError);
      return;
    }

    setCurrentStep((current) => Math.min(current + 1, 6));
    setError("");
  };

  const previousStep = () => {
    setCurrentStep((current) => Math.max(current - 1, 1));
    setError("");
  };

  const submitForm = async (event) => {
    event.preventDefault();

    const validationError = validateCurrentStep();

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const submission = new FormData();
      submission.append("payload", JSON.stringify({
        ...formData,
        phone: formData.phone.replace(/\D/g, ""),
      }));
      photos.forEach((photo) => submission.append("photos", photo));
      const response = await fetch("/api/vehicle-offers", {
        method: "POST",
        body: submission,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Talep kaydedilemedi.");
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
          Talebiniz Alindi
        </p>

        <h2 className="mt-4 font-display text-4xl font-extrabold uppercase text-white sm:text-5xl">
          Araç Değerlendirme Talebiniz Oluşturuldu
        </h2>

        <p className="mt-5 text-sm leading-7 text-tokyo-silver">
          Araç bilgileriniz Auto Tokyo tarafından incelendikten sonra
          Tuğra Çevik tarafından WhatsApp üzerinden sizinle iletişime
          geçilecektir.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-5">
          <p className="text-xs uppercase tracking-wider text-tokyo-muted">
            Araç
          </p>

          <p className="mt-2 font-semibold text-white">
            {formData.brand} {formData.model} – {formData.year}
          </p>

          <p className="mt-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            Inceleniyor
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submitForm}
      className="glass-panel overflow-hidden rounded-[2rem]"
    >
      <div className="border-b border-white/10 px-4 py-6 sm:px-8">
        <div className="grid grid-cols-6 gap-1 sm:gap-2">
          {steps.map((step) => {
            const isActive = step.number === currentStep;
            const isFinished = step.number < currentStep;

            return (
              <div
                key={step.number}
                className="flex flex-col items-center text-center"
              >
                <div
                  className={`grid size-8 place-items-center rounded-full border text-xs font-bold transition-colors sm:size-9 ${
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
                  className={`mt-2 hidden text-[0.62rem] md:block ${
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

      <div className="min-h-[35rem] p-6 sm:p-9">
        {currentStep === 1 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-tokyo-red">
              1. Adim
            </p>

            <h2 className="mt-3 font-display text-4xl font-extrabold uppercase text-white">
              İşlem Türünü Seçin
            </h2>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {transactionTypes.map((type) => {
                const Icon = type.icon;
                const isSelected =
                  formData.transactionType === type.value;

                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => {
                      updateFormData("transactionType", type.value);

                      if (type.value === "sale") {
                        updateFormData("interestedVehicle", "");
                      }
                    }}
                    className={`rounded-3xl border p-6 text-left transition-all ${
                      isSelected
                        ? "border-tokyo-red bg-tokyo-red/10"
                        : "border-white/10 bg-black/20 hover:border-white/25"
                    }`}
                  >
                    <Icon
                      aria-hidden="true"
                      className={`size-8 ${
                        isSelected
                          ? "text-tokyo-red"
                          : "text-tokyo-silver"
                      }`}
                    />

                    <h3 className="mt-5 font-display text-3xl font-bold uppercase text-white">
                      {type.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-tokyo-silver">
                      {type.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {formData.transactionType === "trade" && (
              <div className="mt-7">
                <label
                  htmlFor="interested-vehicle"
                  className="text-sm font-semibold text-white"
                >
                  Takasta ilgilendiğiniz Auto Tokyo aracı
                  <span className="ml-2 text-xs font-normal text-tokyo-muted">
                    Istege bagli
                  </span>
                </label>

                <select
                  id="interested-vehicle"
                  value={formData.interestedVehicle}
                  onChange={(event) =>
                    updateFormData(
                      "interestedVehicle",
                      event.target.value,
                    )
                  }
                  className="mt-3 w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-tokyo-red"
                >
                  <option value="">Araç seçmedim</option>

                  {publishedVehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.slug}>
                      {vehicle.brand} {vehicle.model}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-tokyo-red">
              2. Adim
            </p>

            <h2 className="mt-3 font-display text-4xl font-extrabold uppercase text-white">
              Araç Bilgilerini Girin
            </h2>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <InputField
                label="Marka"
                value={formData.brand}
                onChange={(value) => updateFormData("brand", value)}
                placeholder="Örn. BMW"
              />

              <InputField
                label="Model"
                value={formData.model}
                onChange={(value) => updateFormData("model", value)}
                placeholder="Örn. 320d"
              />

              <InputField
                label="Paket"
                value={formData.packageName}
                onChange={(value) =>
                  updateFormData("packageName", value)
                }
                placeholder="Örn. M Sport"
                optional
              />

              <InputField
                label="Model yılı"
                type="number"
                min="1950"
                max={new Date().getFullYear() + 1}
                value={formData.year}
                onChange={(value) => updateFormData("year", value)}
                placeholder="2020"
              />

              <InputField
                label="Kilometre"
                type="number"
                min="0"
                value={formData.mileage}
                onChange={(value) =>
                  updateFormData("mileage", value)
                }
                placeholder="85000"
              />

              <InputField
                label="Renk"
                value={formData.color}
                onChange={(value) => updateFormData("color", value)}
                placeholder="Örn. Beyaz"
                optional
              />

              <SelectField
                label="Yakıt türü"
                value={formData.fuel}
                onChange={(value) => updateFormData("fuel", value)}
                options={[
                  "Benzin",
                  "Dizel",
                  "LPG",
                  "Hibrit",
                  "Elektrik",
                ]}
              />

              <SelectField
                label="Vites türü"
                value={formData.transmission}
                onChange={(value) =>
                  updateFormData("transmission", value)
                }
                options={["Manuel", "Otomatik", "Yari Otomatik"]}
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-tokyo-red">
              3. Adim
            </p>

            <h2 className="mt-3 font-display text-4xl font-extrabold uppercase text-white">
              Araç Durumunu Belirtin
            </h2>

            <div className="mt-8 grid gap-6">
              <InputField
                label="Boyalı parçalar"
                value={formData.paintedParts}
                onChange={(value) =>
                  updateFormData("paintedParts", value)
                }
                placeholder="Yoksa 'Yok' yazabilirsiniz"
                optional
              />

              <InputField
                label="Değişen parçalar"
                value={formData.changedParts}
                onChange={(value) =>
                  updateFormData("changedParts", value)
                }
                placeholder="Yoksa 'Yok' yazabilirsiniz"
                optional
              />

              <InputField
                label="Tramer kaydi"
                value={formData.tramer}
                onChange={(value) => updateFormData("tramer", value)}
                    placeholder="Tutarı yazın veya 'Yok' belirtin"
              />

              <div>
                <label
                  htmlFor="condition-note"
                  className="text-sm font-semibold text-white"
                >
                  Araç açıklaması
                  <span className="ml-2 text-xs font-normal text-tokyo-muted">
                    Istege bagli
                  </span>
                </label>

                <textarea
                  id="condition-note"
                  rows={6}
                  maxLength={1000}
                  value={formData.conditionNote}
                  onChange={(event) =>
                    updateFormData(
                      "conditionNote",
                      event.target.value,
                    )
                  }
                  placeholder="Bakım geçmişi, kullanım durumu ve eklemek istediğiniz bilgiler..."
                  className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none placeholder:text-tokyo-muted focus:border-tokyo-red"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-tokyo-red">
              4. Adim
            </p>

            <h2 className="mt-3 font-display text-4xl font-extrabold uppercase text-white">
              Araç Fotoğraflarini Yükleyin
            </h2>

            <p className="mt-3 text-sm leading-6 text-tokyo-silver">
              Ön, arka, sağ, sol ve iç mekân fotoğrafları dâhil en az 4,
              en fazla 10 fotoğraf yükleyebilirsiniz.
            </p>

            <label
              onDragEnter={(event) => { event.preventDefault(); setIsDraggingPhotos(true); }}
              onDragOver={(event) => { event.preventDefault(); setIsDraggingPhotos(true); }}
              onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIsDraggingPhotos(false); }}
              onDrop={handlePhotoDrop}
              className={`mt-8 flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed px-6 py-12 text-center transition-colors ${isDraggingPhotos ? "border-tokyo-red bg-tokyo-red/10" : "border-white/20 bg-black/20 hover:border-tokyo-red/60 hover:bg-tokyo-red/[0.04]"}`}
            >
              <Upload
                aria-hidden="true"
                className="size-10 text-tokyo-red"
              />

              <span className="mt-5 font-semibold text-white">
                Fotoğrafları sürükleyip bırakın veya seçmek için tıklayın
              </span>

              <span className="mt-2 text-xs text-tokyo-muted">
                JPG, PNG veya WEBP – En fazla 10 fotoğraf
              </span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handlePhotoSelection}
                className="sr-only"
              />
            </label>

            {photos.length > 0 && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {photos.map((photo, index) => (
                  <div
                    key={`${photo.name}-${photo.lastModified}`}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-tokyo-red/10 text-tokyo-red">
                      <FileImage
                        aria-hidden="true"
                        className="size-5"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-white">
                        {photo.name}
                      </p>

                      <p className="mt-1 text-[0.65rem] text-tokyo-muted">
                        {(photo.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      aria-label={`${photo.name} fotoğrafını kaldır`}
                      className="grid size-9 shrink-0 place-items-center rounded-full border border-white/10 text-tokyo-silver transition-colors hover:border-red-500/50 hover:text-red-400"
                    >
                      <Trash2
                        aria-hidden="true"
                        className="size-4"
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="mt-5 text-right text-xs text-tokyo-muted">
              {photos.length}/10 fotoğraf
            </p>
          </div>
        )}

        {currentStep === 5 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-tokyo-red">
              5. Adim
            </p>

            <h2 className="mt-3 font-display text-4xl font-extrabold uppercase text-white">
              İletişim Bilgilerinizi Girin
            </h2>

            <div className="mt-8 grid gap-6">
              <div>
                <label
                  htmlFor="offer-full-name"
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
                    id="offer-full-name"
                    type="text"
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={(event) =>
                      updateFormData(
                        "fullName",
                        event.target.value,
                      )
                    }
                    placeholder="Adınız ve soyadınız"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 py-4 pl-12 pr-5 text-white outline-none placeholder:text-tokyo-muted focus:border-tokyo-red"
                  />
                </div>
              </div>

              <InputField
                label="Telefon numarasi"
                type="tel"
                value={formData.phone}
                onChange={(value) =>
                  updateFormData("phone", formatPhone(value))
                }
                placeholder="05xx xxx xx xx"
              />

              <SelectField
                label="Tercih edilen iletişim saati"
                value={formData.preferredContactTime}
                onChange={(value) =>
                  updateFormData("preferredContactTime", value)
                }
                options={[
                  "09.00–11.00",
                  "11.00–13.00",
                  "13.00–15.00",
                  "15.00–17.00",
                ]}
                optional
              />
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-tokyo-red">
              6. Adim
            </p>

            <h2 className="mt-3 font-display text-4xl font-extrabold uppercase text-white">
              Bilgilerinizi Kontrol Edin
            </h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                {
                  label: "İşlem",
                  value:
                    formData.transactionType === "sale"
                      ? "Araç Satışı"
                      : "Araç Takası",
                },
                {
                  label: "Araç",
                  value: `${formData.brand} ${formData.model}`,
                },
                {
                  label: "Model yılı",
                  value: formData.year,
                },
                {
                  label: "Kilometre",
                  value: `${Number(
                    formData.mileage,
                  ).toLocaleString("tr-TR")} km`,
                },
                {
                  label: "Yakıt",
                  value: formData.fuel,
                },
                {
                  label: "Vites",
                  value: formData.transmission,
                },
                {
                  label: "Tramer",
                  value: formData.tramer,
                },
                {
                  label: "Fotoğraf",
                  value: `${photos.length} fotoğraf`,
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
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <p className="text-xs uppercase tracking-wider text-tokyo-muted">
                    {item.label}
                  </p>

                  <p className="mt-2 text-sm font-semibold text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs leading-6 text-tokyo-silver">
              <input type="checkbox" checked={formData.kvkkAccepted} onChange={(event) => updateFormData("kvkkAccepted", event.target.checked)} className="mt-1 size-4 shrink-0 accent-red-600" />
              <span><a href="/kvkk" target="_blank" rel="noreferrer" className="font-semibold text-white underline">KVKK Aydınlatma Metni</a>&apos;ni okudum ve kişisel verilerimin teklif talebim için işlenmesini kabul ediyorum.</span>
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
          onClick={previousStep}
          disabled={currentStep === 1}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-white transition-colors hover:border-white/25 disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
          Geri
        </button>

        {currentStep < 6 ? (
          <button
            type="button"
            onClick={nextStep}
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
            Talebi Günder
            <CheckCircle2 aria-hidden="true" className="size-4" />
          </button>
        )}
      </div>
    </form>
  );
}

function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  optional = false,
  min,
  max,
}) {
  const fieldId = `field-${label
    .toLocaleLowerCase("tr-TR")
    .replaceAll(" ", "-")}`;

  return (
    <div>
      <label
        htmlFor={fieldId}
        className="text-sm font-semibold text-white"
      >
        {label}

        {optional && (
          <span className="ml-2 text-xs font-normal text-tokyo-muted">
            Istege bagli
          </span>
        )}
      </label>

      <input
        id={fieldId}
        type={type}
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-3 w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none placeholder:text-tokyo-muted focus:border-tokyo-red"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  optional = false,
}) {
  const fieldId = `field-${label
    .toLocaleLowerCase("tr-TR")
    .replaceAll(" ", "-")}`;

  return (
    <div>
      <label
        htmlFor={fieldId}
        className="text-sm font-semibold text-white"
      >
        {label}

        {optional && (
          <span className="ml-2 text-xs font-normal text-tokyo-muted">
            Istege bagli
          </span>
        )}
      </label>

      <select
        id={fieldId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-tokyo-red"
      >
        <option value="">Seçiniz</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
