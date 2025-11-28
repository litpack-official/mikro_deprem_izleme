import requests
import sqlite3
from datetime import datetime, timedelta, UTC
from pathlib import Path

# --- 1. AYARLAR (SQLite Versiyonu) ---

# SQLite veritabanı dosyası (proje klasöründe)
DB_PATH = Path(__file__).parent / "sismik.db"

# Tarihleri belirle: Son 2 gün (Bugün ve Dün)
# Bu, Windows Görevi her 15 dakikada çalıştığında,
# bir önceki çalıştırmada kaçanları yakalamasını garantiler.
end_date = datetime.now(UTC).strftime("%Y-%m-%d")
start_date = (datetime.now(UTC) - timedelta(days=2)).strftime("%Y-%m-%d")

# EMSC FDSN API Adresi (TÜM TÜRKİYE / SON 2 GÜN)
EMSC_API_URL = (
    "https://www.seismicportal.eu/fdsnws/event/1/query?"
    "format=json"
    "&minlat=36&maxlat=42&minlon=26&maxlon=45"
    f"&starttime={start_date}" 
    f"&endtime={end_date}"     
    "&minmag=-1"
)

# VERİTABANI BAĞLANTI AYARLARI
DB_PASS = os.getenv("DB_PASSWORD") 

# --- 2. VERİ ÇEKME FONKSİYONU ---
def fetch_deprem_verisi():
    print(f"PROGRAM BAŞLADI (SQLite Versiyonu)")
    print(f"EMSC'den son 2 günün ({start_date} -> {end_date}) verisi çekiliyor...")

    try:
        headers = {'User-Agent': 'LitapackSismikProje/1.0 (Python)'}
        response = requests.get(EMSC_API_URL, headers=headers, timeout=15)

        if response.status_code == 200:
            print("Bağlantı başarılı. Veri alındı.")
            data = response.json()
            depremler_listesi = data.get('features', [])
            print(f"Son 2 günde {len(depremler_listesi)} adet deprem bulundu.")
            return depremler_listesi
        else:
            print(f"HATA: Siteye bağlanılamadı. Durum Kodu: {response.status_code}")
            return []

    except Exception as e:
        print(f"VERİ ÇEKME HATASI: {e}")
        return []

# --- 3. VERİ KAYDETME FONKSİYONU (Değişiklik YOK) ---
def kaydet_veritabani(conn, depremler_listesi):
    if not depremler_listesi:
        print("Kaydedilecek yeni deprem bulunamadı.")
        return 0 

    yeni_kayit_sayisi = 0
    total_depremler = len(depremler_listesi)

    try:
        cur = conn.cursor()
        print(f"Toplam {total_depremler} adet deprem veritabanına işleniyor (ON CONFLICT)...")

        for deprem in depremler_listesi:
            # (Kodun geri kalanı 'ingestor.py v2.1' ile aynı,
            # 'ON CONFLICT' sayesinde mükerrer kayıtları engelliyor)
            properties = deprem.get('properties', {})
            geometry = deprem.get('geometry', {})
            koordinatlar = geometry.get('coordinates', [None, None, None])
            event_id = deprem.get('id'); timestamp = properties.get('time')
            location_text = properties.get('place'); magnitude = properties.get('mag')
            longitude = koordinatlar[0]; latitude = koordinatlar[1]; depth = koordinatlar[2]

            if not all([event_id, timestamp, magnitude, longitude, latitude, depth]):
                continue

            sql_komutu = """
            INSERT OR IGNORE INTO earthquakes 
                (event_id, timestamp, latitude, longitude, depth, magnitude, location_text)
            VALUES (?, ?, ?, ?, ?, ?, ?);
            """
            cur.execute(sql_komutu, (event_id, timestamp, latitude, longitude, depth, magnitude, location_text))

            if cur.rowcount > 0:
                yeni_kayit_sayisi += 1

        conn.commit() 
        cur.close()
        print(f"İşlem tamamlandı. {yeni_kayit_sayisi} YENİ deprem eklendi.")
        print(f"{total_depremler - yeni_kayit_sayisi} adet deprem zaten günceldi.")
        return yeni_kayit_sayisi

    except sqlite3.Error as e:
        print(f"VERİTABANI HATASI: {e}")
        if conn: conn.rollback()
        return 0

# --- 4. VERİTABANI TABLO OLUŞTURMA ---
def create_database():
    """SQLite veritabanını ve tabloyu oluşturur"""
    conn = sqlite3.connect(str(DB_PATH))
    cur = conn.cursor()
    
    # Tablo oluştur
    cur.execute("""
        CREATE TABLE IF NOT EXISTS earthquakes (
            event_id TEXT PRIMARY KEY,
            timestamp TEXT NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            depth REAL NOT NULL,
            magnitude REAL NOT NULL,
            location_text TEXT
        )
    """)
    
    # İndeksler oluştur (hızlı sorgular için)
    cur.execute("CREATE INDEX IF NOT EXISTS idx_timestamp ON earthquakes(timestamp)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_location ON earthquakes(latitude, longitude)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_magnitude ON earthquakes(magnitude)")
    
    conn.commit()
    conn.close()
    print("✅ Veritabanı tablosu hazır.")

# --- 5. ANA PROGRAM ---
if __name__ == "__main__":
    conn = None
    try:
        # Veritabanını oluştur
        create_database()
        
        # Bağlan ve veri yükle
        conn = sqlite3.connect(str(DB_PATH))
        depremler = fetch_deprem_verisi()
        if depremler:
            kaydet_veritabani(conn, depremler)
        print("✅ Veri yükleme programı başarıyla tamamlandı.")
    except sqlite3.Error as e:
        print(f"❌ ANA BAĞLANTI HATASI: {e}")
    finally:
        if conn:
            conn.close()
            print("Veritabanı bağlantısı kapatıldı.")