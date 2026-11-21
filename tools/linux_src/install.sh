#!/bin/sh
# ==============================================================================
# سكربت تثبيت اختصارات سطح المكتب وقائمة التطبيقات لمنصة قراءتي الذكية (Linux)
# إعداد وتطوير: المهندس أسامة خليل هاشم
# ==============================================================================

set -e

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
APPDIR="$(dirname "$SCRIPT_DIR")"

echo "===================================================================="
echo "  منصة قراءتي التفاعلية الذكية - تثبيت اختصارات النظام (Linux)"
echo "  إعداد وتطوير: المهندس أسامة خليل هاشم"
echo "===================================================================="

# تحديد مسارات التثبيت للمستخدم الحالي
APPS_DIR="$HOME/.local/share/applications"
ICONS_DIR="$HOME/.local/share/icons/hicolor/512x512/apps"
DESKTOP_DIR="$HOME/Desktop"

mkdir -p "$APPS_DIR"
mkdir -p "$ICONS_DIR"

# نسخ الأيقونة
if [ -f "$APPDIR/qiraati-smart.png" ]; then
    cp "$APPDIR/qiraati-smart.png" "$ICONS_DIR/qiraati-smart.png"
    echo "✔ تم نسخ أيقونة التطبيق إلى: $ICONS_DIR"
fi

# إعداد ملف سطح المكتب
DESKTOP_SRC="$APPDIR/qiraati-smart.desktop"
DESKTOP_TARGET="$APPS_DIR/qiraati-smart.desktop"

if [ -f "$DESKTOP_SRC" ]; then
    sed -e "s|^Exec=AppRun|Exec=\"$APPDIR/AppRun\"|g" \
        -e "s|^Icon=qiraati-smart|Icon=$ICONS_DIR/qiraati-smart.png|g" \
        "$DESKTOP_SRC" > "$DESKTOP_TARGET"
    chmod +x "$DESKTOP_TARGET"
    echo "✔ تم تثبيت مدخل القائمة في: $DESKTOP_TARGET"

    # نسخ إلى سطح المكتب إذا وُجد مجلد Desktop
    if [ -d "$DESKTOP_DIR" ]; then
        cp "$DESKTOP_TARGET" "$DESKTOP_DIR/qiraati-smart.desktop"
        chmod +x "$DESKTOP_DIR/qiraati-smart.desktop"
        echo "✔ تم إنشاء اختصار سطح المكتب في: $DESKTOP_DIR/qiraati-smart.desktop"
    fi
fi

# تحديث قواعد بيانات سطح المكتب
if command -v update-desktop-database >/dev/null 2>&1; then
    update-desktop-database "$APPS_DIR" >/dev/null 2>&1 || true
fi
if command -v gtk-update-icon-cache >/dev/null 2>&1; then
    gtk-update-icon-cache -f -t "$HOME/.local/share/icons/hicolor" >/dev/null 2>&1 || true
fi

echo "✨ اكتمل التثبيت بنجاح! يمكنك الآن تشغيل قراءتي الذكية من قائمة التطبيقات."
