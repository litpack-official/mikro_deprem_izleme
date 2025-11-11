import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Earthquake, BValueAnalysis } from '@/types';

// Türkçe karakterleri ASCII'ye çevir
function convertTurkishChars(text: string): string {
  return text
    .replace(/ç/g, 'c').replace(/Ç/g, 'C')
    .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
    .replace(/ı/g, 'i').replace(/İ/g, 'I')
    .replace(/ö/g, 'o').replace(/Ö/g, 'O')
    .replace(/ş/g, 's').replace(/Ş/g, 'S')
    .replace(/ü/g, 'u').replace(/Ü/g, 'U');
}

// Koordinatlara göre bölge tespit et
function detectRegion(latRange: [number, number], lonRange: [number, number]): string {
  const [minLat, maxLat] = latRange;
  const [minLon, maxLon] = lonRange;
  
  // Marmara Bölgesi
  if (minLat >= 40.0 && maxLat <= 41.5 && minLon >= 26.0 && maxLon <= 30.0) {
    return 'Marmara Bolgesi';
  }
  // Ege Bölgesi
  if (minLat >= 37.0 && maxLat <= 40.5 && minLon >= 26.0 && maxLon <= 30.0) {
    return 'Ege Bolgesi';
  }
  // Doğu Anadolu Fayı
  if (minLat >= 37.0 && maxLat <= 39.0 && minLon >= 36.0 && maxLon <= 41.0) {
    return 'Dogu Anadolu Fayi';
  }
  // Batı Akdeniz
  if (minLat >= 35.0 && maxLat <= 37.0 && minLon >= 27.0 && maxLon <= 32.0) {
    return 'Bati Akdeniz';
  }
  // Karadeniz
  if (minLat >= 40.5 && maxLat <= 42.0 && minLon >= 26.0 && maxLon <= 42.0) {
    return 'Karadeniz Bolgesi';
  }
  // Türkiye geneli
  if (minLat <= 36.5 && maxLat >= 41.5 && minLon <= 26.5 && maxLon >= 44.0) {
    return 'Turkiye Geneli';
  }
  
  return 'Ozel Bolge';
}

interface ReportData {
  earthquakes: Earthquake[];
  bValueData: BValueAnalysis | null;
  filters: {
    latRange: [number, number];
    lonRange: [number, number];
    minMag: number;
    maxMag: number;
    startDate?: string;
    endDate?: string;
  };
  selectedRegion?: string; // Seçilen bölge adı
}

export function generatePDFReport(data: ReportData) {
  const doc = new jsPDF();
  const { earthquakes, bValueData, filters } = data;

  // Bölge tespiti
  const detectedRegion = detectRegion(filters.latRange, filters.lonRange);
  const selectedRegion = data.selectedRegion || detectedRegion;

  // Sayfa genişliği
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Başlık - Bölge adıyla birlikte
  doc.setFontSize(20);
  doc.setTextColor(20, 184, 166); // Teal color
  doc.text(convertTurkishChars(`LITPACK Sismik Analiz Raporu`), pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text(convertTurkishChars(`${selectedRegion} Bolge Analizi`), pageWidth / 2, 30, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(convertTurkishChars(`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')}`), pageWidth / 2, 38, { align: 'center' });

  // Çizgi
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 42, pageWidth - 20, 42);

  // Filtre Bilgileri
  let yPos = 50;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(convertTurkishChars('Analiz Parametreleri:'), 20, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  
  // Bölge bilgisi
  doc.text(convertTurkishChars(`• Hedef Bolge: ${selectedRegion}`), 25, yPos);
  yPos += 6;
  doc.text(convertTurkishChars(`• Enlem: ${filters.latRange[0].toFixed(1)}° - ${filters.latRange[1].toFixed(1)}°`), 25, yPos);
  yPos += 6;
  doc.text(convertTurkishChars(`• Boylam: ${filters.lonRange[0].toFixed(1)}° - ${filters.lonRange[1].toFixed(1)}°`), 25, yPos);
  yPos += 6;
  
  // Büyüklük filtreleri
  doc.text(convertTurkishChars(`• Minimum Buyukluk (Mc): ${filters.minMag.toFixed(1)}`), 25, yPos);
  yPos += 6;
  doc.text(convertTurkishChars(`• Maksimum Buyukluk: ${filters.maxMag.toFixed(1)}`), 25, yPos);
  yPos += 6;
  
  if (filters.startDate || filters.endDate) {
    const startStr = filters.startDate || 'Baslangic yok';
    const endStr = filters.endDate || 'Bitis yok';
    doc.text(convertTurkishChars(`• Tarih Araligi: ${startStr} -> ${endStr}`), 25, yPos);
    yPos += 6;
  }

  // Özet İstatistikler
  yPos += 5;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(convertTurkishChars('Ozet Istatistikler:'), 20, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(convertTurkishChars(`• Toplam Deprem Sayisi: ${earthquakes.length}`), 25, yPos);
  yPos += 6;

  // Büyüklük dağılımı
  const magnitudes = earthquakes.map(eq => eq.magnitude);
  const avgMag = magnitudes.length > 0 ? magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length : 0;
  const maxMag = magnitudes.length > 0 ? Math.max(...magnitudes) : 0;
  const minMag = magnitudes.length > 0 ? Math.min(...magnitudes) : 0;

  doc.text(convertTurkishChars(`• Ortalama Buyukluk: ${avgMag.toFixed(2)}`), 25, yPos);
  yPos += 6;
  doc.text(convertTurkishChars(`• Maksimum Buyukluk: ${maxMag.toFixed(2)}`), 25, yPos);
  yPos += 6;
  doc.text(convertTurkishChars(`• Minimum Buyukluk: ${minMag.toFixed(2)}`), 25, yPos);
  yPos += 6;

  // b-değeri analizi
  if (bValueData) {
    yPos += 3;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(convertTurkishChars('Stres Analizi (b-degeri):'), 20, yPos);
    
    yPos += 8;
    doc.setFontSize(10);
    const bValue = bValueData.b_value;
    doc.text(convertTurkishChars(`• b-degeri: ${bValue.toFixed(3)}`), 25, yPos);
    yPos += 6;

    // Stres seviyesi değerlendirmesi
    let stressLevel = '';
    let stressColor: [number, number, number] = [0, 0, 0];
    
    if (bValue < 0.8) {
      stressLevel = 'YUKSEK STRES - Enerji birikimi fazla, dikkat gerektirir';
      stressColor = [220, 38, 38]; // Kırmızı
    } else if (bValue < 1.0) {
      stressLevel = 'ORTA STRES - Normal seviyenin altinda';
      stressColor = [234, 88, 12]; // Turuncu
    } else if (bValue < 1.2) {
      stressLevel = 'NORMAL - Saglikli sismik aktivite';
      stressColor = [34, 197, 94]; // Yeşil
    } else {
      stressLevel = 'DUSUK STRES - Enerji bosalimi fazla';
      stressColor = [59, 130, 246]; // Mavi
    }

    doc.setTextColor(...stressColor);
    doc.text(convertTurkishChars(`• Degerlendirme: ${stressLevel}`), 25, yPos);
    yPos += 6;

    doc.setTextColor(60, 60, 60);
    doc.text(convertTurkishChars(`• Analiz Edilen Deprem: ${bValueData.analiz_parametreleri.analize_giren_deprem_sayisi_N}`), 25, yPos);
    yPos += 6;
  }

  // Otomatik Rapor Metni
  yPos += 5;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(convertTurkishChars('Degerlendirme:'), 20, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  
  // Rapor metni olustur
  const reportText = generateReportText(earthquakes, bValueData, filters, selectedRegion);
  const splitText = doc.splitTextToSize(convertTurkishChars(reportText), pageWidth - 50);
  doc.text(splitText, 25, yPos);
  yPos += splitText.length * 5 + 10;

  // Yeni sayfa - Deprem Tablosu
  doc.addPage();
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(convertTurkishChars('Deprem Kayitlari'), 20, 20);

  // Tablo
  const tableData = earthquakes.slice(0, 100).map(eq => [
    new Date(eq.timestamp).toLocaleDateString('tr-TR'),
    new Date(eq.timestamp).toLocaleTimeString('tr-TR'),
    eq.magnitude.toFixed(1),
    eq.depth.toFixed(1),
    `${eq.latitude.toFixed(2)}°`,
    `${eq.longitude.toFixed(2)}°`,
    convertTurkishChars(eq.location_text || 'Bilinmiyor')
  ]);

  autoTable(doc, {
    startY: 25,
    head: [[convertTurkishChars('Tarih'), convertTurkishChars('Saat'), convertTurkishChars('Buyukluk'), convertTurkishChars('Derinlik (km)'), convertTurkishChars('Enlem'), convertTurkishChars('Boylam'), convertTurkishChars('Konum')]],
    body: tableData,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [20, 184, 166], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { top: 25 },
  });

  if (earthquakes.length > 100) {
    const finalY = (doc as any).lastAutoTable.finalY || 280;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(convertTurkishChars(`Not: Tabloda ilk 100 deprem gosterilmektedir. Toplam: ${earthquakes.length}`), 20, finalY + 10);
  }

  // PDF'i indir
  const fileName = `Sismik_Analiz_Raporu_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

function generateReportText(
  earthquakes: Earthquake[], 
  bValueData: BValueAnalysis | null,
  filters: any,
  selectedRegion: string
): string {
  const count = earthquakes.length;
  const dateRange = filters.startDate && filters.endDate 
    ? `${filters.startDate} ile ${filters.endDate} tarihleri arasinda`
    : `${selectedRegion} bolgesi`;

  let text = `${dateRange} toplam ${count} adet deprem kaydedilmistir. `;

  if (count === 0) {
    return text + 'Bu donemde sismik aktivite gozlenmemistir.';
  }

  // Büyüklük analizi
  const magnitudes = earthquakes.map(eq => eq.magnitude);
  const avgMag = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;
  const maxMag = Math.max(...magnitudes);
  
  text += `Ortalama deprem buyuklugu ${avgMag.toFixed(2)}, en buyuk deprem ${maxMag.toFixed(2)} buyuklugunde gerceklesmistir. `;

  // Büyük depremler
  const largeEarthquakes = earthquakes.filter(eq => eq.magnitude >= 4.0).length;
  if (largeEarthquakes > 0) {
    text += `Donem icinde ${largeEarthquakes} adet 4.0 ve uzeri buyuklukte deprem meydana gelmistir. `;
  }

  // Bölgeye özel yorum
  text += getRegionSpecificComment(selectedRegion, count, avgMag);

  // b-değeri yorumu
  if (bValueData) {
    const bValue = bValueData.b_value;
    text += `Gutenberg-Richter analizi sonucunda b-degeri ${bValue.toFixed(3)} olarak hesaplanmistir. `;
    
    if (bValue < 0.8) {
      text += 'Bu deger, bolgede yuksek stres birikimi oldugunu ve enerji bosaliminin yetersiz oldugunu gostermektedir. Dikkatli izleme onerilir.';
    } else if (bValue < 1.0) {
      text += 'Bu deger, normal seviyenin altinda bir stres durumunu isaret etmektedir. Bolge izlenmeye devam edilmelidir.';
    } else if (bValue < 1.2) {
      text += 'Bu deger, saglikli bir sismik aktivite ve normal stres seviyesini gostermektedir.';
    } else {
      text += 'Bu deger, bolgede yogun enerji bosalimi oldugunu ve stresin dusuk oldugunu gostermektedir.';
    }
  }

  return text;
}

// Bölgeye özel yorumlar
function getRegionSpecificComment(region: string, count: number, avgMag: number): string {
  switch (region) {
    case 'Marmara Bolgesi':
      return `Marmara Bolgesi, Kuzey Anadolu Fayi uzerinde yer alan yuksek sismik risk bolgesidirdir. ${count} depremlik veri seti, bolgenin aktif tektonik yapisini yansitmaktadir. `;
    
    case 'Ege Bolgesi':
      return `Ege Bolgesi, graben sistemi ile karakterize edilen genisleme rejimi altindadir. Bolgedeki ${count} deprem, normal faylanma mekanizmasinin etkisini gostermektedir. `;
    
    case 'Dogu Anadolu Fayi':
      return `Dogu Anadolu Fayi, sol yanal dogru atimli transform fay sistemidir. Analiz edilen ${count} deprem, fayın surekli aktivitesini dogrulamaktadir. `;
    
    case 'Bati Akdeniz':
      return `Bati Akdeniz, Helen Yayi yitim zonu etkisi altindadir. Bolgedeki ${count} deprem, subduksiyon sureci ile iliskilidir. `;
    
    case 'Karadeniz Bolgesi':
      return `Karadeniz Bolgesi, nispeten dusuk sismik aktivite gosteren kararlı bir bolgedirdir. ${count} depremlik veri, bolgenin jeolojik yapisini yansitmaktadir. `;
    
    case 'Turkiye Geneli':
      return `Turkiye, aktif tektonik plaka sinirlarinda yer alan yuksek sismik aktiviteli bir ulkedir. ${count} depremlik kapsamli veri seti, ulke genelindeki sismik davranisi karakterize etmektedir. `;
    
    default:
      return `Secilen bolge, ${avgMag.toFixed(2)} ortalama buyuklukte ${count} deprem ile karakterize edilmektedir. `;
  }
}
