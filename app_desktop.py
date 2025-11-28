"""
Litpack Sismik Analiz - Native Desktop Application
PyWebView ile FastAPI'yi desktop uygulamasına dönüştürür
"""
import sys
import threading
import webview
import uvicorn
from main import app
from config import DB_PATH


def start_fastapi_server():
    """FastAPI sunucusunu arka planda başlat"""
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
        log_level="error"  # Konsol çıktısını minimize et
    )


def main():
    """Ana desktop uygulama fonksiyonu"""
    
    # Veritabanı kontrolü
    if not DB_PATH.exists():
        # Veritabanı yoksa uyarı göster
        window = webview.create_window(
            'Deprem Takip Sistemi - Hata',
            html="""
            <html>
            <head>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    }
                    .error-box {
                        background: white;
                        padding: 40px;
                        border-radius: 10px;
                        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                        text-align: center;
                        max-width: 500px;
                    }
                    h1 { color: #e74c3c; margin-bottom: 20px; }
                    p { color: #555; line-height: 1.6; }
                    .icon { font-size: 60px; margin-bottom: 20px; }
                </style>
            </head>
            <body>
                <div class="error-box">
                    <div class="icon">⚠️</div>
                    <h1>Veritabanı Bulunamadı</h1>
                    <p>
                        <strong>sismik.db</strong> dosyası bulunamadı.<br><br>
                        Lütfen veritabanı dosyasının uygulama ile aynı klasörde olduğundan emin olun.
                    </p>
                    <p style="margin-top: 20px; color: #999; font-size: 12px;">
                        Beklenen konum: {db_path}
                    </p>
                </div>
            </body>
            </html>
            """.replace('{db_path}', str(DB_PATH)),
            width=600,
            height=400,
            resizable=False
        )
        webview.start()
        sys.exit(1)
    
    # FastAPI sunucusunu arka planda başlat
    server_thread = threading.Thread(target=start_fastapi_server, daemon=True)
    server_thread.start()
    
    # Desktop penceresi oluştur
    window = webview.create_window(
        'Litpack Sismik Analiz - Profesyonel Deprem İzleme v3.0',
        'http://127.0.0.1:8000',
        width=1400,
        height=900,
        resizable=True,
        fullscreen=False,
        min_size=(1024, 768),
        background_color='#1a1a2e',
        text_select=True
    )
    
    # Uygulamayı başlat
    webview.start(debug=False)


if __name__ == '__main__':
    main()
