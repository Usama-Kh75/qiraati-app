# Qiraati Smart Android ProGuard Rules
# إعداد المهندس أسامة خليل هاشم
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
