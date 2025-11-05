import os
from dotenv import load_dotenv
load_dotenv()
import psycopg2
import psycopg2.extras
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

# --- 1. AYARLAR ---
DB_HOST = "localhost"; DB_PORT = "5432"; DB_NAME = "sismik_db"; DB_USER = "postgres"
DB_PASS = os.getenv("DB_PASSWORD", "0147258369")  # Environment variable veya default

# --- 2. FastAPI UYGULAMASINI BAŞLATMA ---
app = FastAPI(
    title="Litpack Sismik Analiz API",
    version="3.0.0 (Modern Desktop Edition)"
)

# CORS Middleware - Frontend ile iletişim için
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. VERİTABANI BAĞLANTI FONKSİYONU ---
def get_db_connection():
    try:
        conn = psycopg2.connect(host=DB_HOST, port=DB_PORT, dbname=DB_NAME, user=DB_USER, password=DB_PASS)
        return conn
    except psycopg2.Error as e:
        print(f"VERİTABANI BAĞLANTI HATASI: {e}")
        raise HTTPException(status_code=500, detail="Veritabanı bağlantı hatası.")

# --- 4. BİLİMSEL ANALİZ FONKSİYONU (b-değeri) ---
def calculate_b_value(magnitudes: list, m_min: float, delta_m: float = 0.1):
    if not magnitudes: return None, 0
    mag_complete = np.array([m for m in magnitudes if m >= m_min])
    n_complete = len(mag_complete)
    if n_complete < 50: # Güvenilir analiz için 50 deprem sınırı
        return None, n_complete
    m_mean = np.mean(mag_complete)
    denominator = m_mean - (m_min - (delta_m / 2))
    if denominator <= 0: return None, n_complete
    b_value = (1 / denominator) * np.log10(np.exp(1))
    return b_value, n_complete

# --- 5. YENİ API ADRESİ (ZAMAN TRENDİ) ---

@app.get("/b_value_over_time")
async def get_b_value_over_time(
    min_lat: float = Query(default=36.0), max_lat: float = Query(default=42.0),
    min_lon: float = Query(default=26.0), max_lon: float = Query(default=45.0),
    min_mag: float = Query(default=1.5)
):
    """
    Seçilen bölgedeki b-değerinin ZAMANA GÖRE DEĞİŞİMİNİ hesaplar.
    Veriyi 3 AYLIK (Quarterly) periyotlara böler.
    """
    print(f"İstek geldi: /b_value_over_time (Kutu: {min_lat}-{max_lat} | Mc = {min_mag})")
    conn = None
    try:
        conn = get_db_connection()
        # YENİ: Artık 'timestamp' (zaman) verisine de ihtiyacımız var
        sql_komutu = """
            SELECT magnitude, timestamp FROM earthquakes
            WHERE 
                latitude >= %s AND latitude <= %s AND
                longitude >= %s AND longitude <= %s;
        """
        # Veriyi Pandas DataFrame'e yükle (çok hızlıdır)
        df = pd.read_sql_query(sql_komutu, conn, params=(min_lat, max_lat, min_lon, max_lon))

        if df.empty:
            raise HTTPException(status_code=404, detail="Seçilen bölgede analiz edilecek deprem bulunamadı.")

        # Pandas'a 'timestamp' sütununun tarih olduğunu söyle
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        # Tarihi 'index' (anahtar) yap
        df = df.set_index('timestamp')

        # --- ZAMANSAL ANALİZ BURADA BAŞLIYOR ---
        # Veriyi '3M' (3 Aylık) periyotlara ayır ve her periyot için 'calculate_b_value' fonksiyonunu çalıştır

        def analyze_group(group):
            if group.empty:
                return None
            magnitudes_list = group['magnitude'].tolist()
            b_value, n_count = calculate_b_value(magnitudes_list, m_min=min_mag)
            if b_value is None:
                return None
            return pd.Series({'b_value': b_value, 'deprem_sayisi_N': n_count})

        # '3M' = 3 Aylık (Quarterly). '1M' (Aylık) de seçilebilirdi ama veri çok gürültülü (noisy) olur.
        trend_data = df.resample('3M').apply(analyze_group)

        # None (Yetersiz veri) olan ayları temizle
        trend_data = trend_data.dropna()

        # Grafiğe uygun format için sıfırla
        trend_data = trend_data.reset_index()
        # Tarihi '2024-03-31' gibi güzel bir formata çevir
        trend_data['timestamp'] = trend_data['timestamp'].dt.strftime('%Y-%m-%d')

        print("Zaman trendi analizi başarılı.")

        # Sonucu JSON listesi olarak döndür
        return {"status": "success", "data": trend_data.to_dict('records')}

    except Exception as e:
        print(f"API HATA (/b_value_over_time): {e}")
        raise HTTPException(status_code=500, detail=f"Sunucu hatası: {e}")
    finally:
        if conn: conn.close()

# --- 6. DİĞER API ADRESLERİ (DEĞİŞMEDİ) ---

@app.get("/b_value")
async def get_b_value_analysis(min_lat: float = Query(36.0), max_lat: float = Query(42.0), min_lon: float = Query(26.0), max_lon: float = Query(45.0), min_mag: float = Query(1.5)):
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        sql = "SELECT magnitude FROM earthquakes WHERE latitude >= %s AND latitude <= %s AND longitude >= %s AND longitude <= %s;"
        cur.execute(sql, (min_lat, max_lat, min_lon, max_lon))
        results = cur.fetchall()
        cur.close()
        if not results: raise HTTPException(404, "Seçilen bölgede deprem bulunamadı.")
        m_list = [r['magnitude'] for r in results]
        b_val, n_calc = calculate_b_value(m_list, m_min=min_mag)
        if b_val is None: raise HTTPException(500, f"b-değeri hesaplanamadı. Veri yetersiz (N={n_calc} < 50).")
        return {"status": "success", "analiz_parametreleri": {"bolgedeki_toplam_deprem": len(m_list), "analize_giren_deprem_sayisi_N": n_calc, "min_buyukluk_Mc": min_mag}, "b_value": b_val}
    except Exception as e: raise HTTPException(500, f"Sunucu hatası: {e}")
    finally:
        if conn: conn.close()

@app.get("/depremler")
async def get_son_depremler(min_lat: float = Query(36.0), max_lat: float = Query(42.0), min_lon: float = Query(26.0), max_lon: float = Query(45.0), max_mag: float = Query(9.9)):
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        sql = "SELECT event_id, timestamp, latitude, longitude, depth, magnitude, location_text FROM earthquakes WHERE latitude >= %s AND latitude <= %s AND longitude >= %s AND longitude <= %s AND magnitude <= %s ORDER BY timestamp DESC LIMIT 1000;"
        cur.execute(sql, (min_lat, max_lat, min_lon, max_lon, max_mag))
        depremler = cur.fetchall()
        cur.close()
        
        # Konum bilgisi yoksa koordinatlardan oluştur
        for deprem in depremler:
            if not deprem.get('location_text') or deprem['location_text'] == 'None':
                lat = deprem['latitude']
                lon = deprem['longitude']
                # Basit bölge tespiti
                if 40.2 <= lat <= 41.2 and 26.5 <= lon <= 29.5:
                    deprem['location_text'] = 'Marmara Bölgesi'
                elif 37.0 <= lat <= 40.5 and 26.0 <= lon <= 30.0:
                    deprem['location_text'] = 'Ege Bölgesi'
                elif 37.0 <= lat <= 39.0 and 36.0 <= lon <= 41.0:
                    deprem['location_text'] = 'Doğu Anadolu'
                elif 35.0 <= lat <= 37.0 and 27.0 <= lon <= 32.0:
                    deprem['location_text'] = 'Akdeniz Bölgesi'
                elif 39.0 <= lat <= 42.0 and 26.0 <= lon <= 35.0:
                    deprem['location_text'] = 'Karadeniz Bölgesi'
                elif 38.0 <= lat <= 41.0 and 32.0 <= lon <= 38.0:
                    deprem['location_text'] = 'İç Anadolu'
                elif 36.0 <= lat <= 39.0 and 38.0 <= lon <= 45.0:
                    deprem['location_text'] = 'Güneydoğu Anadolu'
                else:
                    deprem['location_text'] = f"{lat:.2f}°K, {lon:.2f}°D"
        
        return {"status": "success", "data": depremler}
    except Exception as e: raise HTTPException(500, f"Sunucu hatası: {e}")
    finally:
        if conn: conn.close()

@app.get("/")
async def root(): return {"mesaj": "Litpack Sismik Analiz API (v3.0 Modern Desktop Edition)."}