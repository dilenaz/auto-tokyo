import Image from "next/image";
import { Handshake, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import AboutGallery from "@/components/about/AboutGallery";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata = {
  title: "Hakkımızda",
  description:
    "Auto Tokyo'nun kuruluş hikâyesini, kurucu ortaklarını ve hizmet anlayışını tanıyın.",
};

const founders = [
  {
    name: "Tuğra Çevik",
    phone: "0545 552 07 86",
    image: "/images/founders/tugra-cevik.jpg",
    imagePosition: "object-[center_58%]",
  },
  {
    name: "Ali Tezcan",
    phone: "0546 774 95 09",
    image: "/images/founders/ali-tezcan.jpg",
    imagePosition: "object-[center_48%]",
  },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Güven",
    text: "Araç bilgilerini açık ve anlaşılır biçimde paylaşırız.",
  },
  {
    icon: Sparkles,
    title: "Kalite",
    text: "Portföyümüzü titizlikle değerlendiririz.",
  },
  {
    icon: Handshake,
    title: "Memnuniyet",
    text: "İhtiyaca uygun çözümleri merkeze alırız.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="py-20 text-center sm:py-24">
        <Container>
          <p className="text-xs font-bold uppercase tracking-[.28em] text-tokyo-red">
            30 Nisan 2026
          </p>
          <h1 className="mt-5 font-display text-6xl font-extrabold uppercase text-white sm:text-8xl">
            Auto Tokyo&apos;nun <span className="text-gradient">Hikâyesi</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl leading-8 text-tokyo-silver">
            Otomobile duyduğumuz tutkuyu güvenilir, şeffaf ve müşteri odaklı
            hizmet anlayışıyla Aksaray&apos;da buluşturduk.
          </p>
        </Container>
      </section>

      <AboutGallery />

      <section className="py-24">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <SectionHeading
                eyebrow="Kuruluş Hikâyemiz"
                title="Otomobile Duyulan Tutkudan Doğdu"
                description="Auto Tokyo, Tuğra Çevik ve Ali Tezcan tarafından Aksaray'da hayata geçirildi."
              />
              <p className="mt-6 leading-8 text-tokyo-silver">
                Araç alım, satım ve takas süreçlerini daha açık, güvenli ve
                kolay hâle getirmeyi amaçlıyoruz. Gerçek araç ve ekspertiz
                bilgilerini doğrulanmadan yayımlamıyoruz.
              </p>
              <div className="mt-7 flex gap-3 rounded-2xl border border-white/10 p-5">
                <MapPin className="size-5 shrink-0 text-tokyo-red" aria-hidden="true" />
                <p className="text-sm leading-6">
                  15 Temmuz Şehitler Bulvarı, B Blok No: 4, Otonomi,
                  Aksaray/Merkez
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {founders.map((founder) => (
                <article
                  key={founder.name}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-tokyo-surface"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-black">
                    <Image
                      src={founder.image}
                      alt={`${founder.name}, Auto Tokyo kurucu ortağı`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 28vw"
                      className={`object-cover transition duration-700 group-hover:scale-[1.03] ${founder.imagePosition}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-transparent" />
                    <span className="absolute bottom-5 left-5 rounded-full border border-white/15 bg-black/55 px-4 py-2 text-[.68rem] font-bold uppercase tracking-[.2em] text-white backdrop-blur-md">
                      Kurucu Ortak
                    </span>
                  </div>
                  <div className="p-6 sm:p-7">
                    <h2 className="font-display text-4xl font-bold uppercase text-white">
                      {founder.name}
                    </h2>
                    <a
                      className="mt-4 inline-block text-sm text-tokyo-silver transition hover:text-tokyo-red"
                      href={`tel:${founder.phone.replaceAll(" ", "")}`}
                    >
                      {founder.phone}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <figure className="relative mt-12 overflow-hidden rounded-[2rem] border border-white/10 bg-tokyo-surface">
            <div className="relative aspect-[16/10] sm:aspect-[16/8]">
              <Image
                src="/images/founders/tugra-cevik-ali-tezcan.jpg"
                alt="Auto Tokyo kurucu ortakları Tuğra Çevik ve Ali Tezcan"
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover object-[center_42%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/5" />
            </div>
            <figcaption className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[.25em] text-tokyo-red">
                Auto Tokyo
              </p>
              <p className="mt-2 font-display text-3xl font-bold uppercase text-white sm:text-5xl">
                Tuğra Çevik &amp; Ali Tezcan
              </p>
            </figcaption>
          </figure>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-white/[.02] py-24">
        <Container>
          <SectionHeading eyebrow="Değerlerimiz" title="Çalışma Anlayışımız" />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {values.map(({ icon: Icon, title, text }) => (
              <article key={title} className="glass-panel rounded-3xl p-7">
                <Icon className="size-7 text-tokyo-red" aria-hidden="true" />
                <h2 className="mt-5 font-display text-3xl font-bold uppercase">
                  {title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-tokyo-silver">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
