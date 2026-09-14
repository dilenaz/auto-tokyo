import LegalPage from "@/components/ui/LegalPage";

export const metadata = { title: "Gizlilik Politikası", description: "Auto Tokyo internet sitesi gizlilik politikası." };
const heading = "text-xl font-bold text-white";

export default function Page() {
  return <LegalPage title="Gizlilik Politikası">
    <section><h2 className={heading}>Kapsam</h2><p className="mt-2">Bu politika, autotokyo.com.tr internet sitesinin ziyaret edilmesi ve sitedeki iletişim, randevu, araç satış ve takas hizmetlerinin kullanılması sırasında uygulanan gizlilik esaslarını açıklar. Kişisel veri işleme faaliyetlerinin ayrıntıları <a href="/kvkk" className="text-white underline">KVKK Aydınlatma Metni</a> içinde yer alır.</p></section>
    <section><h2 className={heading}>Toplanan Bilgiler</h2><p className="mt-2">Yalnızca kullanıcının formlarda paylaştığı kimlik, iletişim, talep, araç ve fotoğraf bilgileri ile sistem güvenliği için gerekli sınırlı teknik kayıtlar işlenir. Site, kullanıcı adına gizlice pazarlama profili oluşturmaz ve kişisel verileri satmaz.</p></section>
    <section><h2 className={heading}>Tarayıcı Depolaması</h2><p className="mt-2">Favoriler, karşılaştırma listesi ve son görüntülenen araçlar cihazınızdaki yerel depolamada; filtre ve açılış tercihleri oturum depolamasında tutulur. Bu tercihler cihazınızdan ayrılmaz ve tarayıcı ayarlarından silinebilir.</p></section>
    <section><h2 className={heading}>Güvenlik</h2><p className="mt-2">Verilere erişim yetkiyle sınırlandırılır; yönetici oturumları güvenli çerez, parola karmalama, hız sınırlama ve işlem kayıtlarıyla korunur. İletişimde HTTPS, dosya yüklemelerinde tür ve boyut kontrolleri uygulanır. İnternet üzerinden hiçbir aktarım yönteminin mutlak güvenlik sağlayamayacağı unutulmamalıdır.</p></section>
    <section><h2 className={heading}>Üçüncü Taraf Bağlantılar</h2><p className="mt-2">Google Haritalar, WhatsApp, Instagram ve ilan platformları gibi harici hizmetlere verilen bağlantılar kullanıcı isteğiyle açılır. Bu hizmetlerin veri işlemesi kendi gizlilik politikalarına tabidir; Auto Tokyo bu bağımsız hizmetlerin uygulamalarını kontrol etmez.</p></section>
    <section><h2 className={heading}>Değişiklikler ve İletişim</h2><p className="mt-2">Politika, hizmet veya mevzuat değişikliklerinde güncellenebilir; güncel tarih sayfanın üstünde gösterilir. Gizlilik talepleri için <a className="text-white underline" href="mailto:autotokyo68@gmail.com">autotokyo68@gmail.com</a> adresinden iletişime geçebilirsiniz.</p></section>
  </LegalPage>;
}
