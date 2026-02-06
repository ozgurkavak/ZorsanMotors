# 🌅 ZorSan Motors DMS - İlerleme Planı

## 🚨 1. Öncelikli Kontroller (Sabah İlk İş)
- [ ] **Sold Log Teyidi:** Admin Paneli > Inventory > Sold Log sekmesine bak. (Beklenen: 3 Araç).
- [ ] **Log İnceleme:** FTP Sunucusu gece sorunsuz çalışmış mı?
- [ ] **Veritabanı Temizliği:** `supabase_cleanup_pricing.sql` çalıştırılacak.
- [ ] **Mail Gönderimi:** Julius Pascua'ya (DealerCenter) yanıt gönderilecek.

---

## 🛠️ 2. Hata Düzeltmeleri ve UI İyileştirmeleri (Genel)
- [ ] **UX (İmleç):** Site genelindeki yazılı alanlarda tıklayınca imlecin yanıp sönmesi (text-cursor) kaldırılacak (`cursor-default`).
- [ ] **Görsel:** Inventory Status bölümündeki renk paleti düzenlenecek.
- [ ] **UI:** Finance Tablosundaki "Sale Price" başlığı "Price" olarak düzeltilecek.
- [x] **Bug (Hesaplama):** Total Inventory Cost güncelleme hatası giderilecek.
- [x] **Bug (Hesaplama):** Total Sales güncelleme hatası giderilecek.
- [x] **Bug (Hesaplama):** Net Profit güncelleme hatası giderilecek.

## 📊 3. Finansal Modül Geliştirmeleri
- [x] **Dışa Aktarım:** Financials tablosuna "Yazdır", "PDF İndir", "Excel İndir" butonları eklenecek.
- [x] **Kişiselleştirme:** Tablo sütunlarını gizleme/gösterme (Column Visibility) aracı düzenlenecek.

## 🔐 4. Admin Panel Güvenlik ve Yetkilendirme (Phase 3)
- [ ] **Auth Sistemi:** Tek şifreli giriş yerine, çoklu kullanıcı (Username/Password) sistemine geçilecek.
- [x] **Secrets:** Python scriptindeki FTP şifreleri `.env` dosyasına taşınacak. (Tamamlandı: V7 Sürümü)
- [ ] **Audit Log (İşlem Kaydı):** Hangi adminin ne zaman, hangi değişikliği yaptığını kaydeden log mekanizması kurulacak.
- [ ] **Güvenlik:** Admin paneli için genel güvenlik taraması ve sıkılaştırma yapılacak.

## 🚀 5. Büyüme ve SEO
- [ ] **SEO:** Site içi SEO optimizasyonu (Meta tagler, sitemap, performans).
- [ ] **Feedback:** Müşteriden (ZorSan) sistem hakkında ilk geribildirim istenecek.
