import streamlit as st
import requests
import pandas as pd
import plotly.graph_objects as go # <--- Hatanın kaynağı olan 'go' burada
import time

# --- 1. AYARLAR ---
API_URL_BVALUE = "http://127.0.0.1:8000/b_value"
API_URL_BVALUE_TREND = "http://127.0.0.1:8000/b_value_over_time" # Trend API adresi
API_URL_DEPREMLER = "http://127.0.0.1:8000/depremler"

st.set_page_config(
    page_title="Litapack Sismik Analiz Paneli",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- 2. YARDIMCI FONKSİYONLAR (API'den veri çekme) ---

@st.cache_data(ttl=60)
def get_b_value(lat_range, lon_range, min_mag):
    """API'den ANLIK b-değeri analizini çeker"""
    params = {"min_lat": lat_range[0], "max_lat": lat_range[1], "min_lon": lon_range[0], "max_lon": lon_range[1], "min_mag": min_mag}
    try:
        response = requests.get(API_URL_BVALUE, params=params, timeout=20)
        if response.status_code == 200: return response.json()
        else: return {"status": "error", "detail": f"{response.status_code} - {response.json().get('detail')}"}
    except requests.exceptions.RequestException:
        return {"status": "error", "detail": f"API sunucusuna ({API_URL_BVALUE}) bağlanılamıyor."}

@st.cache_data(ttl=300) 
def get_b_value_trend(lat_range, lon_range, min_mag):
    """API'den ZAMANSAL b-değeri analizini çeker."""
    params = {"min_lat": lat_range[0], "max_lat": lat_range[1], "min_lon": lon_range[0], "max_lon": lon_range[1], "min_mag": min_mag}
    try:
        response = requests.get(API_URL_BVALUE_TREND, params=params, timeout=60)
        if response.status_code == 200: return response.json()
        else: return {"status": "error", "detail": f"{response.status_code} - {response.json().get('detail')}"}
    except requests.exceptions.RequestException:
        return {"status": "error", "detail": f"API sunucusuna ({API_URL_BVALUE_TREND}) bağlanılamıyor."}

@st.cache_data(ttl=60)
def get_depremler(lat_range, lon_range, max_mag):
    """API'den harita verisini çeker"""
    params = {"min_lat": lat_range[0], "max_lat": lat_range[1], "min_lon": lon_range[0], "max_lon": lon_range[1], "max_mag": max_mag}
    try:
        response = requests.get(API_URL_DEPREMLER, params=params, timeout=20)
        if response.status_code == 200: return response.json()
        else: return {"status": "error", "detail": f"API Hatası: {response.status_code}"}
    except requests.exceptions.RequestException:
        return {"status": "error", "detail": f"API sunucusuna ({API_URL_DEPREMLER}) bağlanılamıyor."}

# --- 3. HIZLI FİLTRE FONKSİYONLARI (Callbackler) ---
def set_filter_region(lat, lon, mc=1.5, max_mag=9.9):
    st.session_state.lat_slider = lat; st.session_state.lon_slider = lon
    st.session_state.mc_input = mc; st.session_state.max_mag_slider = max_mag
    st.cache_data.clear() 

def set_marmara(): set_filter_region(lat=(40.2, 41.2), lon=(26.5, 29.5), mc=1.5)
def set_ege(): set_filter_region(lat=(37.0, 40.5), lon=(26.0, 30.0), mc=1.5)
def set_daf(): set_filter_region(lat=(37.0, 39.0), lon=(36.0, 41.0), mc=1.5)
def set_akdeniz(): set_filter_region(lat=(35.0, 37.0), lon=(27.0, 32.0), mc=1.5)
def set_turkey(): set_filter_region(lat=(36.0, 42.0), lon=(26.0, 45.0), max_mag=9.9)

# --- 4. ARAYÜZ (GÖSTERGE PANELİ v2.5 - Hata Düzeltildi) ---

# === YAN PANEL (Sidebar) ===
with st.sidebar:
    st.title("LİTAPACK"); st.subheader("Sismik Analiz Paneli v2.5")
    st.header("Bölge Seçimi (Filtre)")
    lat_range = st.slider("Enlem Aralığı (K-G)", 36.0, 42.0, st.session_state.get('lat_slider', (36.0, 42.0)), 0.1, key="lat_slider")
    lon_range = st.slider("Boylam Aralığı (B-D)", 26.0, 45.0, st.session_state.get('lon_slider', (26.0, 45.0)), 0.1, key="lon_slider")
    st.header("Analiz Ayarları")
    mc_value = st.number_input("b-Değeri (Stres) için Mc Eşiği", 0.1, 4.0, st.session_state.get('mc_input', 1.5), 0.1, help="Stres hesabı için MİNİMUM büyüklük.", key="mc_input")
    max_mag_filter = st.slider("Maks. Büyüklük Filtresi (Harita)", 1.0, 9.9, st.session_state.get('max_mag_slider', 9.9), 0.1, help="SADECE haritada gösterilecek MAKSİMUM büyüklük.", key="max_mag_slider")
    st.header("Hızlı Filtreler (Bölgesel)")
    st.button("Marmara Bölgesi", on_click=set_marmara); st.button("Ege Bölgesi", on_click=set_ege)
    st.button("Doğu Anadolu Fayı (DAF)", on_click=set_daf); st.button("Batı Akdeniz (Helen Yayı)", on_click=set_akdeniz)
    st.button("Tüm Türkiye (Sıfırla)", on_click=set_turkey)

# === ANA EKRAN ===
st.title("📈 Dinamik Sismik Stres ve Aktivite Gösterge Paneli")
st.write(f"Seçilen Bölge: **Enlem** ({lat_range[0]}° - {lat_range[1]}°), **Boylam** ({lon_range[0]}° - {lon_range[1]}°)")

# Sekmeleri oluştur
tab1, tab2 = st.tabs(["📊 Anlık Stres & Aktivite", "📉 Zamansal Stres Trendi (b-değeri)"])

# --- SEKME 1: ANLIK GÖSTERGE ---
with tab1:
    st.header(f"Anlık b-Değeri (Stres) Analizi (Mc = {mc_value})")
    b_value_data = get_b_value(lat_range, lon_range, mc_value) # ANLIK API'yi çağır

    if b_value_data.get("status") == "success":
        # Hatalı yorum satırı buradan kaldırıldı.
        b_value = b_value_data.get("b_value", 0); params = b_value_data.get("analiz_parametreleri", {})
        n_analiz = params.get("analize_giren_deprem_sayisi_N", 0); n_bolge = params.get("bolgedeki_toplam_deprem", 0)

        color = "green"; gauge_help = "Stres Seviyesi Normal (b >= 1.0)"
        if b_value < 0.8: color = "red"; gauge_help = "STRES YÜKSEK (b < 0.8): Enerji birikimi olasılığı yüksek."
        elif b_value < 1.0: color = "yellow"; gauge_help = "DİKKAT (0.8 <= b < 1.0): Stres seviyesi normalin üzerinde."

        col1, col2, col3 = st.columns(3)
        with col1:
            fig_gauge = go.Figure(go.Indicator( # 'go' artık burada tanınıyor olmalı
                mode = "gauge+number", value = b_value, number = {'valueformat': '.3f'},
                title = {'text': f"b-Değeri (Stres Katsayısı)", 'font': {'size': 20}},
                domain = {'x': [0, 1], 'y': [0, 1]},
                gauge = { 'axis': {'range': [0.5, 1.5], 'tickwidth': 1}, 'bar': {'color': color, 'thickness': 0.3},
                    'steps' : [ {'range': [0.5, 0.8], 'color': 'rgba(255, 0, 0, 0.2)'}, {'range': [0.8, 1.0], 'color': 'rgba(255, 255, 0, 0.2)'}, {'range': [1.0, 1.5], 'color': 'rgba(0, 255, 0, 0.2)'}],
                    'threshold': {'line': {'color': "black", 'width': 4}, 'thickness': 0.75, 'value': 1.0}
                }
            ))
            fig_gauge.update_layout(height=250, margin=dict(l=20, r=20, t=50, b=20))
            st.plotly_chart(fig_gauge, use_container_width=True); st.info(gauge_help)
        col2.metric(label=f"Analize Giren Deprem (N)", value=f"{n_analiz} (M >= {mc_value})")
        col3.metric(label="Bölgedeki Toplam Deprem", value=f"{n_bolge} (Son 1 Yıl)")
    else:
        st.error(f"b-Değeri analizi yüklenemedi: {b_value_data.get('detail')}")

    # --- HARİTA VE TABLO (ANLIK) ---
    st.header(f"Sismik Aktivite Haritası (Maksimum Büyüklük <= {max_mag_filter})")
    deprem_data = get_depremler(lat_range, lon_range, max_mag_filter)
    if deprem_data.get("status") == "success":
        df_map = pd.DataFrame(deprem_data.get("data", []))
        if not df_map.empty and 'latitude' in df_map.columns:
            map_df = df_map[['latitude', 'longitude', 'magnitude']].copy()
            lon_farki = lon_range[1] - lon_range[0]; zoom_level = 5
            if lon_farki < 15: zoom_level = 6
            if lon_farki < 6: zoom_level = 7
            st.map(map_df, latitude='latitude', longitude='longitude', size='magnitude', zoom=zoom_level)
            st.subheader("Ham Veri (Filtrelenmiş)")
            st.dataframe(df_map[['timestamp', 'latitude', 'longitude', 'magnitude', 'depth', 'location_text']])
        else:
            st.info(f"Seçilen bölgede M <= {max_mag_filter} olan deprem bulunamadı.")
    else:
        st.error(f"Deprem verisi yüklenemedi: {deprem_data.get('detail')}")

# --- SEKME 2: ZAMANSAL TREND ---
with tab2:
    st.header(f"Zamana Göre b-Değeri (Stres) Trendi (Mc = {mc_value})")
    st.write("Bu grafik, seçilen bölgedeki stres seviyesinin (b-değeri) son 1 yılda 3'er aylık periyotlarla nasıl değiştiğini gösterir.")

    trend_data_response = get_b_value_trend(lat_range, lon_range, mc_value)

    if trend_data_response.get("status") == "success":
        trend_data = trend_data_response.get("data", [])
        if trend_data:
            df_trend = pd.DataFrame(trend_data)
            fig_trend = go.Figure()
            fig_trend.add_trace(go.Scatter(
                x=df_trend['timestamp'], y=df_trend['b_value'],
                mode='lines+markers', name='b-Değeri (Stres)',
                line=dict(color='red', width=3)
            ))
            fig_trend.update_layout(
                title=f"Seçilen Bölge İçin 3 Aylık Stres Trendi (b-değeri)",
                xaxis_title="Tarih (Periyot Sonu)", yaxis_title="Hesaplanan b-Değeri",
                hovermode="x unified"
            )
            st.plotly_chart(fig_trend, use_container_width=True)
            st.subheader("Trend Analizi Ham Verisi (3 Aylık)")
            st.dataframe(df_trend)
        else:
            st.warning("Trend analizi için yeterli periyot (veri) bulunamadı. Lütfen bölgeyi genişletin.")
    else:
        st.error(f"Trend analizi yüklenemedi: {trend_data_response.get('detail')}")