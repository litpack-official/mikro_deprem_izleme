"""
Otomatik Deprem Verisi Güncelleyici
Her 5 dakikada bir EMSC API'den son depremleri çeker ve veritabanına kaydeder
"""
import os
from dotenv import load_dotenv
load_dotenv()

import requests
import psycopg2
import time
from datetime import datetime, UTC, timedelta
from dateutil.relativedelta import relativedelta

# Veritabanı ayarları
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "sismik_db"
DB_USER = "postgres"
DB_PASS = os.getenv("DB_PASSWORD", "0147258369")

# EMSC API ayarları
EMSC_API_URL = "https://www.seismicportal.eu/fdsnws/event/1/query"
UPDATE_INTERVAL = 300  # 5 dakika (saniye cinsinden)

def get_db_connection():
    """Veritabanı bağlantısı oluştur"""
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )
        return conn
    except psycopg2.Error as e:
        print(f"❌ Veritabanı bağlantı hatası: {e}")
        return None

def fetch_recent_earthquakes():
    """Son 1 saatlik depremleri EMSC'den çek"""
    now = datetime.now(UTC)
    one_hour_ago = now - timedelta(hours=1)
    
    params = {
        'format': 'json',
        'minlat': 36,
        'maxlat': 42,
        'minlon': 26,
        'maxlon': 45,
        'starttime': one_hour_ago.strftime('%Y-%m-%d %H:%M:%S'),
        'endtime': now.strftime('%Y-%m-%d %H:%M:%S'),
        'minmag': -1
    }
    
    try:
        headers = {'User-Agent': 'Litpack Sismik Auto-Updater/3.0'}
        response = requests.get(EMSC_API_URL, params=params, headers=headers, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            earthquakes = data.get('features', [])
            print(f"✅ EMSC'den {len(earthquakes)} deprem kaydı alındı")
            return earthquakes
        else:
            print(f"⚠️ EMSC API hatası: {response.status_code}")
            return []
    except Exception as e:
        print(f"❌ Veri çekme hatası: {e}")
        return []

def save_to_database(conn, earthquakes):
    """Depremleri veritabanına kaydet"""
    if not earthquakes:
        return 0
    
    new_count = 0
    try:
        cur = conn.cursor()
        
        for eq in earthquakes:
            properties = eq.get('properties', {})
            geometry = eq.get('geometry', {})
            coordinates = geometry.get('coordinates', [None, None, None])
            
            event_id = eq.get('id')
            timestamp = properties.get('time')
            location_text = properties.get('place')
            magnitude = properties.get('mag')
            longitude = coordinates[0]
            latitude = coordinates[1]
            depth = coordinates[2]
            
            if not all([event_id, timestamp, magnitude, longitude, latitude, depth]):
                continue
            
            sql = """
            INSERT INTO earthquakes 
                (event_id, timestamp, latitude, longitude, depth, magnitude, location_text, geom)
            VALUES 
                (%s, %s, %s, %s, %s, %s, %s, ST_SetSRID(ST_MakePoint(%s, %s), 4326))
            ON CONFLICT (event_id) DO NOTHING;
            """
            
            cur.execute(sql, (
                event_id, timestamp, latitude, longitude, depth, magnitude, location_text,
                longitude, latitude
            ))
            
            if cur.rowcount > 0:
                new_count += 1
        
        conn.commit()
        cur.close()
        
        if new_count > 0:
            print(f"✨ {new_count} yeni deprem veritabanına eklendi!")
        else:
            print("ℹ️ Yeni deprem kaydı yok")
        
        return new_count
        
    except psycopg2.Error as e:
        print(f"❌ Veritabanı kayıt hatası: {e}")
        if conn:
            conn.rollback()
        return 0

def run_auto_updater():
    """Ana güncelleme döngüsü"""
    print("🚀 Litpack Sismik - Otomatik Güncelleme Servisi Başlatıldı")
    print(f"⏱️ Güncelleme aralığı: {UPDATE_INTERVAL} saniye ({UPDATE_INTERVAL/60} dakika)")
    print("=" * 60)
    
    while True:
        try:
            current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            print(f"\n🔄 [{current_time}] Güncelleme başlatılıyor...")
            
            # Veritabanı bağlantısı
            conn = get_db_connection()
            if not conn:
                print("⚠️ Veritabanı bağlantısı kurulamadı, 30 saniye sonra tekrar denenecek...")
                time.sleep(30)
                continue
            
            # Veri çek ve kaydet
            earthquakes = fetch_recent_earthquakes()
            new_count = save_to_database(conn, earthquakes)
            
            conn.close()
            
            # Sonraki güncellemeyi bekle
            print(f"⏳ Sonraki güncelleme: {UPDATE_INTERVAL} saniye sonra...")
            time.sleep(UPDATE_INTERVAL)
            
        except KeyboardInterrupt:
            print("\n\n⛔ Güncelleme servisi durduruldu (Ctrl+C)")
            break
        except Exception as e:
            print(f"❌ Beklenmeyen hata: {e}")
            print("⏳ 60 saniye sonra tekrar denenecek...")
            time.sleep(60)

if __name__ == "__main__":
    run_auto_updater()
