import os
import base64
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
        # Match both "./name" and "name"
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

    # Now replace the script tags:
    # <script src="audio_data.js"></script>
    # <script src="curriculum_data.js"></script>
    # with the actual inlined JavaScript
    script_audio_pattern = r'<script\s+src=["\']\./?audio_data\.js["\']\s*></script>'
    script_curriculum_pattern = r'<script\s+src=["\']\./?curriculum_data\.js["\']\s*></script>'

    inlined_audio = f"<script>\n/* AUDIO DATA INLINED - إعداد المهندس أسامة خليل هاشم */\n{audio_js}\n</script>"
    inlined_curriculum = f"<script>\n/* CURRICULUM DATA INLINED - إعداد المهندس أسامة خليل هاشم */\n{curriculum_js}\n</script>"

    html = re.sub(script_audio_pattern, inlined_audio, html)
    html = re.sub(script_curriculum_pattern, inlined_curriculum, html)

    # Disable service worker registration if running locally via file:// to avoid console warnings
    html = html.replace(
        "if ('serviceWorker' in navigator) {",
        "if ('serviceWorker' in navigator && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {"
    )

    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)

    size_mb = os.path.getsize(out_path) / (1024 * 1024)
    print(f"\n✨ تم بنجاح إنشاء التطبيق المستقل الشامل بنجاح!")
    print(f"الملف المباشر: {out_path}")
    print(f"الحجم الإجمالي: {size_mb:.2f} ميجابايت (يحتوي على كافة الصور والأصوات المدمجة بنسبة 100% وبدون أي حاجة للإنترنت)")

if __name__ == '__main__':
    bundle()
