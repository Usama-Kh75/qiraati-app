#!/usr/bin/env python3
"""
أداة بناء وتجميع واجهات الدروس لمنصة قراءتي التفاعلية الذكية
إعداد وتطوير: المهندس أسامة خليل هاشم

تعمل هذه الأداة بنمطين متكاملين:
1. البناء القياسي (inline_views=False): يبني index.html خفيفاً وسريعاً (~550 ك.ب) مع خريطة
   window.LESSON_VIEW_MANIFEST لتحميل الدروس الـ 46 كسولاً من مجلد views/ عند الطلب.
2. البناء الشامل (inline_views=True): يجمع كافة واجهات الدروس الـ 46 داخل HTML واحد
   لخدمة الحزمة الأحادية المستقلة (قراءتي_التفاعلية_الذكية.html) على بروتوكول file://.
"""

import os
import re
import glob
import json
import time

UNIT_ORDER = ['prep', 'unit1', 'unit2', 'unit3', 'unit4', 'unit5', 'unit6']
MANIFEST_MARKER = '<!-- LESSON_VIEW_MANIFEST_SLOT -->'


def collect_lesson_views(views_dir):
    """جمع كافة واجهات الدروس في مجلد views/ بالترتيب المنهجي المعتمد."""
    collected = []
    for u in UNIT_ORDER:
        u_dir = os.path.join(views_dir, u)
        if not os.path.exists(u_dir):
            continue
        for vf in sorted(glob.glob(os.path.join(u_dir, '*.html'))):
            with open(vf, 'r', encoding='utf-8') as f:
                content = f.read()
            m = re.search(r'id=["\']view-(tab-[^"\']+)["\']', content)
            if not m:
                raise ValueError(f"تعذر العثور على معرف الدرس id=\"view-tab-...\" في الملف: {vf}")
            lesson_id = m.group(1)
            rel_path = f"views/{u}/{os.path.basename(vf)}"
            collected.append((lesson_id, rel_path, content))
    return collected


def _compact_lines(raw_text):
    """تقليص الأسطر الفارغة المتكررة خارج وسوم <script> و<pre> و<textarea>."""
    output_lines = raw_text.splitlines(keepends=True)
    compact_lines = []
    in_raw_block = False
    prev_blank = False

    for line in output_lines:
        lower = line.lower()
        if any(tag in lower for tag in ('<script', '<pre', '<textarea')):
            in_raw_block = True
        is_blank = (line.strip() == '')
        if not in_raw_block and is_blank:
            if prev_blank:
                continue
            prev_blank = True
        else:
            prev_blank = False
        compact_lines.append(line)
        if any(tag in lower for tag in ('</script>', '</pre>', '</textarea>')):
            in_raw_block = False

    return ''.join(compact_lines), len(compact_lines), len(output_lines) - len(compact_lines)


def assemble_html(inline_views=False):
    """تجميع الهيكل الرئيسي وإنتاج النص الكامل مع حقن window.LESSON_VIEW_MANIFEST."""
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    views_dir = os.path.join(base_dir, 'views')

    top_shell = os.path.join(views_dir, 'app-shell-top.html')
    bottom_shell = os.path.join(views_dir, 'app-shell-bottom.html')

    if not os.path.exists(top_shell) or not os.path.exists(bottom_shell):
        raise FileNotFoundError("Missing app-shell-top.html or app-shell-bottom.html in views/")

    with open(top_shell, 'r', encoding='utf-8') as f:
        top_html = f.read()
    with open(bottom_shell, 'r', encoding='utf-8') as f:
        bottom_html = f.read()

    lesson_views = collect_lesson_views(views_dir)
    manifest_dict = {lesson_id: rel_path for lesson_id, rel_path, _ in lesson_views}
    manifest_json = json.dumps(manifest_dict, ensure_ascii=False, separators=(',', ':'))
    manifest_script = (
        f'<script id="lessonViewManifest">'
        f'window.LESSON_VIEW_MANIFEST = {manifest_json};'
        f'</script>'
    )

    if MANIFEST_MARKER in bottom_html:
        bottom_html = bottom_html.replace(MANIFEST_MARKER, manifest_script, 1)
    else:
        bottom_html = bottom_html.replace('</body>', f'    {manifest_script}\n</body>', 1)

    parts = [top_html]
    if inline_views:
        for _, _, view_content in lesson_views:
            parts.append(view_content)
    parts.append(bottom_html)

    raw_html = '\n'.join(parts)
    if not raw_html.endswith('\n'):
        raw_html += '\n'

    final_html, line_count, saved_blanks = _compact_lines(raw_html)
    return final_html, len(lesson_views), line_count, saved_blanks


def build_index(inline_views=False):
    t0 = time.time()
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    index_path = os.path.join(base_dir, 'index.html')

    final_html, total_views, line_count, saved_blanks = assemble_html(inline_views=inline_views)

    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(final_html)

    size_kb = os.path.getsize(index_path) / 1024.0
    t1 = time.time()
    mode_label = "شامل (مضمن)" if inline_views else "خفيف (تقسيم كسول)"
    print(f"✨ تم بناء وتجميع index.html [{mode_label}] بنجاح في {(t1 - t0) * 1000:.1f} مللي ثانية!")
    print(f"   حجم index.html: {size_kb:.1f} ك.ب | الواجهات المسجلة في LESSON_VIEW_MANIFEST: {total_views} واجهة")
    print(f"   إجمالي أسطر index.html: {line_count} سطر (وفّر {saved_blanks} سطراً فارغاً)")
    return index_path


if __name__ == '__main__':
    build_index(inline_views=False)
