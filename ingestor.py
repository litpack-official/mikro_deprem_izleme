import requests
import json
import psycopg2
import time
from datetime import datetime, timedelta, UTC
from dateutil.relativedelta import relativedelta
import os # <<< GÜVENLİK
from dotenv import load_dotenv # <<< GÜVENLİK

# --- 1. AYARLAR (FAZ 11.6: CANLI GÜNCELLEME MODU) ---

# Güvenlik: .env dosyasındaki gizli bilgileri yükle
load_dotenv()

# Tarihleri belirle: Son 2 gün (Bugün ve Dün)
# Bu, Windows Görevi her 15 dakikada çalıştığında,
# bir önceki çalıştırmada kaçanları yakalamasını garantiler.
end_date = datetime.now(UTC).strftime("%Y-%m-%d")
start_date = (datetime.now(UTC) - timedelta(days=2)).strftime("%Y-%m-%d")

# EMSC FDSN API Adresi (TÜM TÜRKİYE / SON 2 GÜN)
EMSC_API_URL = (
    "https://www.seismicportal.eu/fdsnws/event/1/query?"
    "format=json"
    "&minlat=36&maxlat=42&minlon=26&maxlon=45" # Tüm Türkiye
    f"&starttime={start_date}" # Başlangıç: 2 Gün Önce
    f"&endtime={end_date}"     # Bitiş: Bugün
    "&minmag=-1"
)

# VERİTABANI BAĞLANTI AYARLARI
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "sismik_db"
DB_USER = "postgres"
# <<< GÜVENLİK: Parola artık gizli .env dosyasından okunuyor
DB_PASS = os.getenv("DB_PASSWORD") 

# --- 2. VERİ ÇEKME FONKSİYONU ---
def fetch_deprem_verisi():
    print(f"PROGRAM BAŞLADI (CANLI GÜNCELLEME MODU v2.2)")
    print(f"EMSC'den son 2 günün ({start_date} -> {end_date}) verisi çekiliyor...")

    if not DB_PASS:
        print("HATA: .env dosyasında DB_PASSWORD bulunamadı veya .env dosyası yok.")
        return []

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
            INSERT INTO earthquakes 
                (event_id, timestamp, latitude, longitude, depth, magnitude, location_text, geom)
            VALUES (%s, %s, %s, %s, %s, %s, %s, ST_SetSRID(ST_MakePoint(%s, %s), 4326))
            ON CONFLICT (event_id) DO NOTHING;
            """
            cur.execute(sql_komutu, (event_id, timestamp, latitude, longitude, depth, magnitude, location_text, longitude, latitude))

            if cur.rowcount > 0:
                yeni_kayit_sayisi += 1

        conn.commit() 
        cur.close()
        print(f"İşlem tamamlandı. {yeni_kayit_sayisi} YENİ deprem eklendi.")
        print(f"{total_depremler - yeni_kayit_sayisi} adet deprem zaten günceldi.")
        return yeni_kayit_sayisi

    except psycopg2.Error as e:
        print(f"VERİTABANI HATASI: {e}")
        if conn: conn.rollback()
        return 0

# --- 4. ANA PROGRAM (Canlı Mod) ---
if __name__ == "__main__":
    conn = None
    try:
        conn = psycopg2.connect(host=DB_HOST, port=DB_PORT, dbname=DB_NAME, user=DB_USER, password=DB_PASS)
        depremler = fetch_deprem_verisi()
        if depremler: # Sadece deprem bulunduysa kaydet
            kaydet_veritabani(conn, depremler)
        print("Canlı güncelleme programı başarıyla tamamlandı.")
    except psycopg2.Error as e:
        print(f"ANA BAĞLANTI HATASI: {e}")
    finally:
        if conn:
            conn.close()
            print("Veritabanı bağlantısı kapatıldı.")