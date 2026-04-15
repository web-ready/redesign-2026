"""Verify rendered footer paths look correct for sample pages."""
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from build import base_for, render  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent

samples = ['blog/wra-platform-launch.html', 'annual_report_2024_2025.html', 'nonprofits.html']

for sample in samples:
    src_page = ROOT / 'src' / 'pages' / sample
    public_page = ROOT / 'public' / sample
    rendered = render(src_page.read_text(encoding='utf-8'), {'base': base_for(sample)})

    s_new = rendered.find('<footer class="site-global-footer')
    e_new = rendered.find('</footer>', s_new) + len('</footer>')
    new_footer = rendered[s_new:e_new]

    print('=' * 72)
    print(f'SAMPLE: {sample}')
    print('=' * 72)
    print(f'  base placeholder value: {base_for(sample)!r}')
    print(f'  New footer length: {len(new_footer)} bytes')

    hrefs = re.findall(r'href="([^"]+)"', new_footer)[:8]
    print(f'  First 8 hrefs in footer: {hrefs}')

    srcs = re.findall(r'src="([^"]+)"', new_footer)[:3]
    print(f'  First 3 srcs in footer: {srcs}')
    print()
