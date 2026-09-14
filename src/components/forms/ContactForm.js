"use client";

import { useState } from "react";
import {
  CheckCircle2,
  MessageSquareText,
  Send,
  UserRound,
} from "lucide-react";

const subjects = [
  "Araç hakkında bilgi",
  "Randevu",
  "Araç satışı",
  "Takas",
  "Diğer",
];

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

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    subject: "",
    message: "",
    kvkkAccepted: false,
  });

  const [error, setError] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  };

  const submitForm = async (event) => {
    event.preventDefault();

    const phoneNumbers = formData.phone.replace(/\D/g, "");

    if (formData.fullName.trim().length < 3) {
      setError("Lütfen adınızı ve soyadınızı girin.");
      return;
    }

    if (phoneNumbers.length !== 11 || !phoneNumbers.startsWith("05")) {
      setError(
        "Telefon numarası 05 ile başlayan 11 haneli bir numara olmalıdır.",
      );
      return;
    }

    if (!formData.subject) {
      setError("Lütfen mesaj konusunu seçin.");
      return;
    }

    if (formData.message.trim().length < 10) {
      setError("Mesajınız en az 10 karakter olmalıdır.");
      return;
    }

    if (!formData.kvkkAccepted) {
      setError("Lütfen KVKK Aydınlatma Metni'ni okuduğunuzu onaylayın.");
      return;
    }


    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, phone: phoneNumbers }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Mesaj gönderilemedi.");
      setIsCompleted(true);
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="glass-panel rounded-[2rem] p-8 text-center sm:p-12">
        <div className="red-glow mx-auto grid size-20 place-items-center rounded-full bg-tokyo-red text-white">
          <CheckCircle2 aria-hidden="true" className="size-10" />
        </div>

        <p className="mt-7 text-xs font-bold uppercase tracking-[0.25em] text-tokyo-red">
          Mesajınız Alındı
        </p>

        <h2 className="mt-4 font-display text-4xl font-extrabold uppercase text-white">
          Teşekkür Ederiz
        </h2>

        <p className="mt-5 text-sm leading-7 text-tokyo-silver">
          Mesajınız Auto Tokyo’ya ulaştı. Ekibimiz çalışma saatleri
          içerisinde sizinle iletişime geçecektir.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submitForm}
      className="glass-panel rounded-[2rem] p-6 sm:p-9"
    >
      <div className="flex items-center gap-4">
        <div className="grid size-12 place-items-center rounded-2xl bg-tokyo-red/10 text-tokyo-red">
          <MessageSquareText
            aria-hidden="true"
            className="size-6"
          />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-tokyo-red">
            İletişim Formu
          </p>

          <h2 className="mt-1 font-display text-3xl font-extrabold uppercase text-white">
            Bize Mesaj Gönderin
          </h2>
        </div>
      </div>

      <div className="mt-8 grid gap-6">
        <div>
          <label
            htmlFor="contact-full-name"
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
              id="contact-full-name"
              type="text"
              autoComplete="name"
              value={formData.fullName}
              onChange={(event) =>
                updateFormData("fullName", event.target.value)
              }
              placeholder="Adınız ve soyadınız"
              className="w-full rounded-2xl border border-white/10 bg-black/40 py-4 pl-12 pr-5 text-white outline-none placeholder:text-tokyo-muted focus:border-tokyo-red"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="contact-phone"
            className="text-sm font-semibold text-white"
          >
            Telefon numarası
          </label>

          <input
            id="contact-phone"
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
            className="mt-3 w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none placeholder:text-tokyo-muted focus:border-tokyo-red"
          />
        </div>

        <div>
          <label
            htmlFor="contact-subject"
            className="text-sm font-semibold text-white"
          >
            Konu
          </label>

          <select
            id="contact-subject"
            value={formData.subject}
            onChange={(event) =>
              updateFormData("subject", event.target.value)
            }
            className="mt-3 w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-tokyo-red"
          >
            <option value="">Konu seçiniz</option>

            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="text-sm font-semibold text-white"
          >
            Mesajınız
          </label>

          <textarea
            id="contact-message"
            rows={6}
            maxLength={1000}
            value={formData.message}
            onChange={(event) =>
              updateFormData("message", event.target.value)
            }
            placeholder="Size nasıl yardımcı olabiliriz?"
            className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none placeholder:text-tokyo-muted focus:border-tokyo-red"
          />

          <p className="mt-2 text-right text-xs text-tokyo-muted">
            {formData.message.length}/1000
          </p>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs leading-6 text-tokyo-silver">
          <input type="checkbox" checked={formData.kvkkAccepted} onChange={(event) => updateFormData("kvkkAccepted", event.target.checked)} className="mt-1 size-4 shrink-0 accent-red-600" />
          <span><a href="/kvkk" target="_blank" rel="noreferrer" className="font-semibold text-white underline">KVKK Aydınlatma Metni</a>&apos;ni okudum ve kişisel verilerimin iletişim talebim için işlenmesini kabul ediyorum.</span>
        </label>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-200"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="red-glow mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-tokyo-red px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-red-500"
      >
        {isSubmitting ? "Gönderiliyor…" : "Mesajı Gönder"}
        <Send aria-hidden="true" className="size-4" />
      </button>
    </form>
  );
}
