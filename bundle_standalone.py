import os
import base64
import json
import re

def file_to_base64(filepath):
    if not os.path.exists(filepath):
        print(f"Warning: File not found: {filepath}")
        return ""
    with open(filepath, 'rb') as f:
        data = f.read()
    ext = os.path.splitext(filepath)[1].lower()
    mime = "image/png"
    if ext in ['.jpg', '.jpeg']:
        mime = "image/jpeg"
    elif ext == '.svg':
        mime = "image/svg+xml"
    b64 = base64.b64encode(data).decode('utf-8')
    return f"data:{mime};base64,{b64}"

def bundle():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    index_path = os.path.join(base_dir, 'index.html')
    curriculum_path = os.path.join(base_dir, 'curriculum_data.js')
    audio_path = os.path.join(base_dir, 'audio_data.js')
    manifest_path = os.path.join(base_dir, 'manifest.json')
    out_path = os.path.join(base_dir, 'قراءتي_التفاعلية_الذكية.html')

    with open(index_path, 'r', encoding='utf-8') as f:
        html = f.read()

    with open(curriculum_path, 'r', encoding='utf-8') as f:
        curriculum_js = f.read()

    with open(audio_path, 'r', encoding='utf-8') as f:
        audio_js = f.read()

    # Pre-encode images that are referenced
    image_files = [
        'activity_nasheed_box.png',
        'activity_3_items.png',
        'activity_4.png',
        'activity_5_diff.png',
        'activity_5.png',
        'activity_6.png',
        'activity_7_places.png',
        'activity_8_directions.png',
        'activity_w_showcase.png',
        'activity_w_words.png',
        'activity_w_fill.png',
        'activity_y_showcase.png',
        'activity_y_words.png',
        'activity_y_fill.png',
        'mobile_qr.png',
        'icons/icon-192.png',
        'icons/icon-512.png'
    ]

    image_b64_map = {}
    for img_name in image_files:
        full_path = os.path.join(base_dir, img_name)
        if os.path.exists(full_path):
            image_b64_map[img_name] = file_to_base64(full_path)
            print(f"Encoded {img_name} -> {len(image_b64_map[img_name])} chars")

    # Replace image URLs inside curriculum_js
    for img_name, b64_val in image_b64_map.items():
        curriculum_js = curriculum_js.replace(f"'{img_name}'", f"'{b64_val}'")
        curriculum_js = curriculum_js.replace(f'"{img_name}"', f'"{b64_val}"')
        curriculum_js = curriculum_js.replace(f"'./{img_name}'", f"'{b64_val}'")
        curriculum_js = curriculum_js.replace(f'"./{img_name}"', f'"{b64_val}"')

    # Replace image URLs inside HTML
    for img_name, b64_val in image_b64_map.items():
        html = html.replace(f'src="{img_name}"', f'src="{b64_val}"')
        html = html.replace(f'src="./{img_name}"', f'src="{b64_val}"')
        html = html.replace(f'href="{img_name}"', f'href="{b64_val}"')
        html = html.replace(f'href="./{img_name}"', f'href="{b64_val}"')

    # Inline manifest.json if exists
    if os.path.exists(manifest_path):
        with open(manifest_path, 'r', encoding='utf-8') as f:
            manifest_content = f.read()
        for img_name, b64_val in image_b64_map.items():
            manifest_content = manifest_content.replace(f'"{img_name}"', f'"{b64_val}"')
        manifest_b64 = base64.b64encode(manifest_content.encode('utf-8')).decode('utf-8')
        manifest_data_uri = f"data:application/manifest+json;base64,{manifest_b64}"
        html = html.replace('href="manifest.json"', f'href="{manifest_data_uri}"')
        html = html.replace('href="./manifest.json"', f'href="{manifest_data_uri}"')
        print("Manifest inlined as Data URI.")

    # Now replace the script tags directly and reliably:
    inlined_audio = f"<script>\n/* AUDIO DATA INLINED - إعداد المهندس أسامة خليل هاشم */\n{audio_js}\n</script>"
    inlined_curriculum = f"<script>\n/* CURRICULUM DATA INLINED - إعداد المهندس أسامة خليل هاشم */\n{curriculum_js}\n</script>"

    # Direct replacements
    html = re.sub(r'<script\s+src=["\'](?:\./)?audio_data\.js["\']\s*></script>', lambda m: inlined_audio, html)
    html = re.sub(r'<script\s+src=["\'](?:\./)?curriculum_data\.js["\']\s*></script>', lambda m: inlined_curriculum, html)

    # Disable service worker registration if running locally via file:// or content://
    html = html.replace(
        "if ('serviceWorker' in navigator) {",
        "if ('serviceWorker' in navigator && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {"
    )

    # STRICT VALIDATION: Ensure audio and curriculum are present
    if 'window.AUDIO_DATA =' not in html:
        raise RuntimeError("CRITICAL ERROR: window.AUDIO_DATA is missing from output HTML!")
    if 'window.CURRICULUM_DATA =' not in html:
        raise RuntimeError("CRITICAL ERROR: window.CURRICULUM_DATA is missing from output HTML!")

    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)

    size_mb = os.path.getsize(out_path) / (1024 * 1024)
    print(f"\n✨ تم بنجاح إنشاء التطبيق المستقل الشامل بنجاح!")
    print(f"الملف المباشر: {out_path}")
    print(f"الحجم الإجمالي: {size_mb:.2f} ميجابايت (يحتوي على كافة الصور والأصوات المدمجة بنسبة 100% وبدون أي حاجة للإنترنت)")

if __name__ == '__main__':
    bundle()
