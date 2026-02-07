# 🌅 ZorSan Motors DMS - İlerleme Planı

## 🚨 1. Öncelikli Kontroller (Sabah İlk İş)
- [ ] **Sold Log Teyidi:** Admin Paneli > Inventory > Sold Log sekmesine bak. (Beklenen: 3 Araç).
- [ ] **Log İnceleme:** FTP Sunucusu gece sorunsuz çalışmış mı?
- [ ] **Veritabanı Temizliği:** `supabase_cleanup_pricing.sql` çalıştırılacak.
- [ ] **Mail Gönderimi:** Julius Pascua'ya (DealerCenter) yanıt gönderilecek.

---

## 🛠️ 2. Hata Düzeltmeleri ve UI İyileştirmeleri (Genel)
- [x] **UX (İmleç):** Site genelindeki yazılı alanlarda tıklayınca imlecin yanıp sönmesi kaldırıldı (`cursor-default`), inputlar düzeltildi.
- [x] **Görsel:** Inventory Status renk paleti modern (soft/glass) stilde güncellendi.
- [x] **UI:** Finance Tablosundaki başlıklar ve görünümler iyileştirildi.
- [x] **Bug (Hesaplama):** Total Inventory Cost güncelleme hatası giderilecek.
- [x] **Bug (Hesaplama):** Total Sales güncelleme hatası giderilecek.
- [x] **Bug (Hesaplama):** Net Profit güncelleme hatası giderilecek.
- [x] **Filter & Layout:** Admin panelindeki Inventory ve Finance tablolarına gelişmiş filtreleme (Available, Sold, Hidden vb.) ve buton düzeni güncellemesi yapıldı.

## 📊 3. Finansal Modül Geliştirmeleri
- [x] **Dışa Aktarım:** Financials tablosuna "Yazdır", "PDF İndir", "Excel İndir" butonları eklenecek.
- [x] **Kişiselleştirme:** Tablo sütunlarını gizleme/gösterme (Column Visibility) aracı düzenlenecek.
- [ ] **Gelişmiş Yazdırma:** Admin'in seçtiği sütunlara ve o anki görünümüne (filtrelere) göre özelleştirilmiş dinamik yazdırma (WYSIWYG Print) özelliği eklenecek.
- [ ] **Pending Workflow:** 'Pending' statüsündeki araçların satış sürecinin nasıl işleyeceğine dair detaylı akış (Deposit, Financing status vs.) planlanacak ve kodlanacak.

## 🔐 4. Admin Panel Güvenlik ve Yetkilendirme (Phase 3)
- [ ] **Auth Sistemi:** Tek şifreli giriş yerine, çoklu kullanıcı (Username/Password) sistemine geçilecek.
- [x] **Secrets:** Python scriptindeki FTP şifreleri `.env` dosyasına taşınacak. (Tamamlandı: V7 Sürümü)
- [ ] **Audit Log (İşlem Kaydı):** Hangi adminin ne zaman, hangi değişikliği yaptığını kaydeden log mekanizması kurulacak.
- [ ] **Güvenlik:** Admin paneli için genel güvenlik taraması ve sıkılaştırma yapılacak.

## 🚀 5. Büyüme ve SEO
- [ ] **SEO (Teknik - Phase 1):** 
    - [ ] **Dinamik Meta Tagler:** Her araç sayfası için özel başlık ve açıklama (örn: "Satılık 2012 Toyota Tundra - ZorSan Motors Chicago").
    - [ ] **Sitemap & Robots.txt:** Google botlarının siteyi tam taraması için harita oluşturulacak.
    - [ ] **Structured Data (Schema Markup):** Araçların Google'da "Ürün" olarak, fiyat/km bilgisiyle görünmesi (Rich Snippets) sağlanacak.
    - [ ] **Clean URL:** Link yapısı `/inventory/id` yerine `/inventory/2012-toyota-tundra-vin123` formatına çevrilecek (Slug).
    
- [ ] **SEO (Stratejik - Phase 2):**
    - [ ] **Google My Business:** Müşterinin harita kaydının doğrulanması ve siteye bağlanması.
    - [ ] **Blog/İçerik:** "Chicago'da 2. El Araç Alırken Nelere Dikkat Edilmeli?" gibi anahtar kelime odaklı içerikler için altyapı.
    - [ ] **Performans:** Görsellerin (DealerCenter'dan gelenlerin) Next.js Image Optimization ile hızlandırılması.
- [ ] **Feedback:** Müşteriden (ZorSan) sistem hakkında ilk geribildirim istenecek.
