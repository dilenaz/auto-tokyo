"use client";
import { Check, Copy, MessageCircle, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
export default function VehicleShare({ title }) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");
  useEffect(() => {
    // The current URL is available only after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(window.location.href);
  }, []);
  async function copy() { try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2200); } catch { window.prompt("Bağlantıyı kopyalayın:", window.location.href); } }
  async function share() { if (navigator.share) { try { await navigator.share({ title, url: window.location.href }); } catch {} } else copy(); }
  const button = "inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-3 text-xs font-bold text-white hover:border-tokyo-red/50";
  return <div className="grid content-center gap-2 rounded-2xl border border-white/10 bg-black/25 p-4 sm:grid-cols-3" aria-label="Aracı paylaş"><a className={button} target="_blank" rel="noreferrer" href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}><MessageCircle className="size-4" aria-hidden="true" /> WhatsApp</a><button type="button" className={button} onClick={copy}>{copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />} {copied ? "Kopyalandı" : "Kopyala"}</button><button type="button" className={button} onClick={share}><Share2 className="size-4" aria-hidden="true" /> Paylaş</button><span className="sr-only" role="status" aria-live="polite">{copied ? "Bağlantı panoya kopyalandı" : ""}</span></div>;
}
