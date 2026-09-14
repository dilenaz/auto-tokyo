import LegalPage from "@/components/ui/LegalPage";

export const metadata = {
  title: "KVKK Aydınlatma Metni",
  description: "Auto Tokyo internet sitesi kişisel verilerin işlenmesine ilişkin aydınlatma metni.",
};

const heading = "text-xl font-bold text-white";
const list = "mt-3 list-disc space-y-2 pl-5";

export default function Page() {
  return <LegalPage title="KVKK Aydınlatma Metni">
    <section><h2 className={heading}>1. Veri Sorumlusu</h2><p className="mt-2">6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında veri sorumlusu Auto Tokyo işletmesidir. Adres: 15 Temmuz Şehitler Bulvarı, B Blok No: 4, Otonomi, Aksaray/Merkez. E-posta: <a className="text-white underline" href="mailto:autotokyo68@gmail.com">autotokyo68@gmail.com</a>. Telefon: <a className="text-white underline" href="tel:+905455520786">0545 552 07 86</a>.</p></section>
    <section><h2 className={heading}>2. İşlenen Kişisel Veriler</h2><ul className={list}><li>Kimlik bilgileri: ad ve soyadı.</li><li>İletişim bilgileri: telefon numarası ve isteğe bağlı e-posta adresi.</li><li>Talep ve işlem bilgileri: iletişim mesajı, randevu türü ve zamanı, ilgilenilen araç, satış veya takas tercihi.</li><li>Araç bilgileri: marka, model, yıl, kilometre, teknik ve hasar bilgileri ile yüklenen araç fotoğrafları.</li><li>İşlem güvenliği bilgileri: IP adresi, tarih-saat, hız sınırı ve yönetim işlem kayıtları.</li></ul></section>
    <section><h2 className={heading}>3. İşleme Amaçları</h2><ul className={list}><li>İletişim, randevu, araç satış ve takas taleplerini almak, değerlendirmek ve sonuçlandırmak.</li><li>Talep sahibiyle iletişime geçmek ve müşteri ilişkilerini yürütmek.</li><li>Bilgi güvenliğini, kötüye kullanımın önlenmesini ve sistem sürekliliğini sağlamak.</li><li>Hukuki yükümlülükleri yerine getirmek, uyuşmazlıklarda hakları tesis etmek, kullanmak veya korumak.</li></ul></section>
    <section><h2 className={heading}>4. Toplama Yöntemi ve Hukuki Sebepler</h2><p className="mt-2">Veriler; internet sitesindeki iletişim, randevu ve araç değerlendirme formları, telefon görüşmeleri ve ilgili kişinin doğrudan iletişimi yoluyla elektronik veya fiziki ortamda toplanır. KVKK’nın 5/2-c maddesinde düzenlenen sözleşmenin kurulması veya ifasıyla doğrudan ilgili olma, 5/2-ç maddesindeki hukuki yükümlülüğün yerine getirilmesi ve 5/2-f maddesindeki ilgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla veri sorumlusunun meşru menfaati hukuki sebeplerine dayanılarak işlenir.</p></section>
    <section><h2 className={heading}>5. Aktarım ve Alıcı Grupları</h2><p className="mt-2">Kişisel veriler; yalnızca belirtilen amaçların gerektirdiği ölçüde barındırma, altyapı, yedekleme ve teknik destek hizmeti sağlayan veri işleyenlere; mali ve hukuki danışmanlara; kanunen yetkili kamu kurumlarına ve adli mercilere aktarılabilir. Pazarlama amacıyla veri satışı yapılmaz. Site üzerindeki harita, WhatsApp, Instagram ve benzeri harici bağlantılar kullanıcı tarafından açıldığında ilgili hizmet sağlayıcının kendi gizlilik koşulları uygulanır.</p></section>
    <section><h2 className={heading}>6. Saklama ve İmha</h2><p className="mt-2">Veriler, ilgili talebin yürütülmesi için gerekli süre ile uygulanabilir kanuni saklama ve zamanaşımı süreleri boyunca tutulur. İşleme amacı ve hukuki saklama gerekliliği sona erdiğinde kişisel veriler periyodik kontroller kapsamında silinir, yok edilir veya anonim hâle getirilir.</p></section>
    <section><h2 className={heading}>7. KVKK Kapsamındaki Haklarınız</h2><p className="mt-2">KVKK’nın 11. maddesi kapsamındaki haklarınıza ilişkin taleplerinizi kimliğinizi ve talebinizi belirten bir başvuruyla yukarıdaki adrese elden veya yazılı olarak ya da kayıtlı e-posta adresiniz üzerinden <a className="text-white underline" href="mailto:autotokyo68@gmail.com">autotokyo68@gmail.com</a> adresine iletebilirsiniz. Başvurular, talebin niteliğine göre en geç 30 gün içinde ücretsiz sonuçlandırılır; işlemin ayrıca maliyet gerektirmesi hâlinde mevzuattaki ücret tarifesi uygulanabilir.</p></section>
    <section><h2 className={heading}>8. Dayanak</h2><p className="mt-2">Ayrıntılı bilgi için Kişisel Verileri Koruma Kurumunun <a className="text-white underline" href="https://www.kvkk.gov.tr/Icerik/2033/Aydinlatma-Yukumlulugu-" target="_blank" rel="noreferrer">Aydınlatma Yükümlülüğü</a> açıklamasını inceleyebilirsiniz.</p></section>
  </LegalPage>;
}
