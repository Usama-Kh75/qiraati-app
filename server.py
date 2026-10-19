import http.server
import socketserver
import socket
import webbrowser
import os
import qrcode

PORT = 8080

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

def generate_qr(url):
    try:
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=3,
        )
        qr.add_data(url)
        qr.make(fit=True)
        img = qr.make_image(fill_color='#1e3a8a', back_color='white')
        img.save('mobile_qr.png')
    except Exception as e:
        print(f"تعذر إنشاء رمز QR تلقائياً: {e}")

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS and disable cache during active testing if needed
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def run():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    local_ip = get_local_ip()
    mobile_url = f"http://{local_ip}:{PORT}"
    localhost_url = f"http://localhost:{PORT}"
    
    generate_qr(mobile_url)

    print("=" * 72)
    print("      منصة قراءتي التفاعلية الذكية - الصف الأول الابتدائي (PWA)")
    print("      إعداد: المهندس أسامة خليل هاشم")
    print("=" * 72)
    print(f"\n💻 للتشغيل والتثبيت على الحاسوب (Windows):")
    print(f"   الرابط: {localhost_url}")
    print(f"\n📱 للتشغيل والتثبيت على الهاتف أو الجهاز اللوحي (نفس شبكة الواي فاي):")
    print(f"   الرابط: {mobile_url}")
    print(f"   (تم تحديث رمز QR في التطبيق وفي ملف mobile_qr.png)")
    print(f"\n✨ الخادم يعمل الآن... اضغط Ctrl+C للإيقاف في أي وقت.")
    print("=" * 72 + "\n")

    # Automatically open in default browser
    try:
        webbrowser.open(localhost_url)
    except Exception:
        pass

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("0.0.0.0", PORT), CustomHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nتم إيقاف الخادم بنجاح. مع السلامة!")

if __name__ == '__main__':
    run()
