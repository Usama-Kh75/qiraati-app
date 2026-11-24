package iq.usama.qiraati;

import android.app.Activity;
import android.content.res.AssetManager;
import android.media.AudioManager;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.ConsoleMessage;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import androidx.webkit.WebViewAssetLoader;

import java.io.IOException;
import java.io.InputStream;
import java.net.URLDecoder;

/**
 * المشغل الرئيسي لتطبيق أندرويد المستقل لمنصة قراءتي التفاعلية الذكية
 * الصف الأول الابتدائي - المنهج العراقي التفاعلي الشامل
 * يعمل أوفلاين 100% على الأجهزة اللوحية المدرسية والهواتف الذكية
 *
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 */
public class MainActivity extends Activity {

    private WebView webView;
    private long lastBackPressedTime = 0;
    private static final int BACK_PRESS_INTERVAL_MS = 2500;
    private static final String APP_URL = "https://appassets.androidplatform.net/assets/index.html";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // ضبط الشاشة الكاملة وإبقاء الإضاءة نشطة أثناء تفاعل التلميذ
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                             WindowManager.LayoutParams.FLAG_FULLSCREEN);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        // توجيه أزرار الصوت للتحكم بصوت الوسائط والمؤثرات مباشرة
        setVolumeControlStream(AudioManager.STREAM_MUSIC);

        // إنشاء وتكوين مستعرض الويب فائق السرعة
        webView = new WebView(this);
        setContentView(webView);

        configureWebSettings();
        setupWebViewClient();

        applyImmersiveMode();

        // تحميل المنصة مباشرة من الأصول المدمجة
        webView.loadUrl(APP_URL);
    }

    private void configureWebSettings() {
        WebSettings settings = webView.getSettings();

        // دعم JavaScript والوسائط والذاكرة المحلية
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);

        // تسريع التقديم والتكيف مع مقاسات الشاشات اللوحية والهواتف
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setSupportZoom(true);
        settings.setBuiltInZoomControls(true);
        settings.setDisplayZoomControls(false);

        // حماية الأمان والتشغيل من الأصول فقط
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        // تحسين الأداء
        webView.setBackgroundColor(0xFF0F172A);
        webView.setScrollBarStyle(View.SCROLLBARS_INSIDE_OVERLAY);
    }

    private void setupWebViewClient() {
        final WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        final AssetManager assetManager = getAssets();

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                // المحاولة الأولى: عبر WebViewAssetLoader القياسي
                WebResourceResponse response = assetLoader.shouldInterceptRequest(request.getUrl());
                if (response != null) {
                    return response;
                }

                // المحاولة الاحتياطية: في حال وجود استدعاء بمسار نسبي مباشر
                Uri uri = request.getUrl();
                String path = uri.getPath();
                if (path != null) {
                    try {
                        path = URLDecoder.decode(path, "UTF-8");
                        if (path.startsWith("/")) {
                            path = path.substring(1);
                        }
                        if (path.isEmpty() || path.equals("index.html")) {
                            path = "index.html";
                        }
                        InputStream is = assetManager.open(path);
                        String mimeType = getMimeType(path);
                        return new WebResourceResponse(mimeType, "UTF-8", is);
                    } catch (IOException ignored) {
                    }
                }

                return null;
            }

            private String getMimeType(String path) {
                String lower = path.toLowerCase();
                if (lower.endsWith(".html") || lower.endsWith(".htm")) return "text/html";
                if (lower.endsWith(".js")) return "application/javascript";
                if (lower.endsWith(".css")) return "text/css";
                if (lower.endsWith(".png")) return "image/png";
                if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
                if (lower.endsWith(".webp")) return "image/webp";
                if (lower.endsWith(".svg")) return "image/svg+xml";
                if (lower.endsWith(".mp3")) return "audio/mpeg";
                if (lower.endsWith(".wav")) return "audio/wav";
                if (lower.endsWith(".json")) return "application/json";
                if (lower.endsWith(".ico")) return "image/x-icon";
                if (lower.endsWith(".woff2")) return "font/woff2";
                if (lower.endsWith(".woff")) return "font/woff";
                if (lower.endsWith(".ttf")) return "font/ttf";
                return "application/octet-stream";
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
                Toast.makeText(MainActivity.this, message, Toast.LENGTH_SHORT).show();
                result.confirm();
                return true;
            }

            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                return true;
            }
        });
    }

    private void applyImmersiveMode() {
        View decorView = getWindow().getDecorView();
        int uiOptions = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
        decorView.setSystemUiVisibility(uiOptions);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            applyImmersiveMode();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (webView != null) {
            webView.onPause();
            webView.pauseTimers();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) {
            webView.onResume();
            webView.resumeTimers();
        }
        applyImmersiveMode();
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            long currentTime = System.currentTimeMillis();
            if (currentTime - lastBackPressedTime < BACK_PRESS_INTERVAL_MS) {
                super.onBackPressed();
            } else {
                lastBackPressedTime = currentTime;
                Toast.makeText(this, getString(R.string.exit_confirm), Toast.LENGTH_SHORT).show();
            }
        }
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
