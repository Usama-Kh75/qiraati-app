#!/usr/bin/env python3
"""
أداة بناء وتجميع واجهات الدروس لمنصة قراءتي التفاعلية الذكية
إعداد وتطوير: المهندس أسامة خليل هاشم

هذه الأداة تقوم بتجميع واجهات الدروس المستقلة من مجلد views/
ودمجها داخل ملف index.html في أجزاء من الثانية.
"""

import os
import glob
import time

def build_index():
    t0 = time.time()
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    views_dir = os.path.join(base_dir, 'views')
    index_path = os.path.join(base_dir, 'index.html')

    top_shell = os.path.join(views_dir, 'app-shell-top.html')
    bottom_shell = os.path.join(views_dir, 'app-shell-bottom.html')

    if not os.path.exists(top_shell) or not os.path.exists(bottom_shell):
        raise FileNotFoundError("Missing app-shell-top.html or app-shell-bottom.html in views/")

    output_lines = []

    # 1. Top Shell
    with open(top_shell, 'r', encoding='utf-8') as f:
        output_lines.extend(f.readlines())

    # 2. Units in order
    units = ['prep', 'unit1', 'unit2', 'unit3', 'unit4', 'unit5', 'unit6']
    total_views = 0
    for u in units:
        u_dir = os.path.join(views_dir, u)
        if os.path.exists(u_dir):
            view_files = sorted(glob.glob(os.path.join(u_dir, '*.html')))
            for vf in view_files:
                with open(vf, 'r', encoding='utf-8') as f:
                    output_lines.extend(f.readlines())
                total_views += 1

    # 3. Bottom Shell
    with open(bottom_shell, 'r', encoding='utf-8') as f:
        output_lines.extend(f.readlines())

    # تقليص الأسطر الفارغة المتكررة خارج وسوم <script> و<pre> و<textarea> لتسريع التحميل
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

    with open(index_path, 'w', encoding='utf-8') as f:
        f.writelines(compact_lines)

    t1 = time.time()
    print(f"✨ تم بناء وتجميع index.html بنجاح في {(t1-t0)*1000:.1f} مللي ثانية!")
    print(f"   عدد الواجهات المجمعة: {total_views} واجهة")
    print(f"   إجمالي أسطر index.html: {len(compact_lines)} سطر (وفّر {len(output_lines) - len(compact_lines)} سطراً فارغاً)")

if __name__ == '__main__':
    build_index()
