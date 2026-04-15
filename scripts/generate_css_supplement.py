"""
Generates CSS supplement for missing Tailwind classes and writes it to tailwind.min.css.
Custom color palette derived from existing CSS:
  gray:   50=240 240 240, 100=228 228 228, 200=209 209 209, 300=184 184 184,
          400=163 163 163, 500=140 140 140, 600=106 106 106, 700=90 90 90,
          800=61 61 61, 900=40 40 40
  green:  50=202 244 217, 100=106 223 149, 200=42 209 104, 400=21 102 51,
          500=17 85 42, 600=14 68 34, 700=10 51 25
  red:    50=251 214 208, 100=244 139 124, 200=239 89 68, 600=84 31 23, 700=60 23 17
"""

# Breakpoints
SM = '(min-width:640px)'
MD = '(min-width:768px)'
LG = '(min-width:1024px)'
XL = '(min-width:1280px)'

# Reusable snippets
RING_SHADOW = ('--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 '
               'var(--tw-ring-offset-width) var(--tw-ring-offset-color);'
               '--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 '
               'calc({w} + var(--tw-ring-offset-width)) var(--tw-ring-color);'
               'box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),'
               'var(--tw-shadow,0 0 #0000)')

TRANSITION_BASE = ('transition-property:{p};'
                   'transition-timing-function:cubic-bezier(.4,0,.2,1);'
                   'transition-duration:.15s')

SPACE_Y = ('> :not([hidden])~ :not([hidden]){--tw-space-y-reverse:0;'
           'margin-bottom:calc({v}*var(--tw-space-y-reverse));'
           'margin-top:calc({v}*(1 - var(--tw-space-y-reverse)))}')

rules = []  # list of raw CSS strings


def r(selector, props):
    """Add a plain rule."""
    rules.append(f'.{selector}{{{props}}}')


def hover(selector, props):
    rules.append(f'.hover\\:{selector}:hover{{{props}}}')


def focus(selector, props):
    rules.append(f'.focus\\:{selector}:focus{{{props}}}')


def fv(selector, props):
    """focus-visible variant."""
    rules.append(f'.focus-visible\\:{selector}:focus-visible{{{props}}}')


def gh(selector, props):
    """group-hover variant."""
    rules.append(f'.group:hover .group-hover\\:{selector}{{{props}}}')


def mq(breakpoint, selector, props):
    """Responsive breakpoint variant."""
    prefix = {SM: 'sm', MD: 'md', LG: 'lg', XL: 'xl'}[breakpoint]
    rules.append(f'@media {breakpoint}{{.{prefix}\\:{selector}{{{props}}}}}')


# ─── SPACING ────────────────────────────────────────────────────────────────

r('gap-0\\.5', 'gap:.125rem')
r('h-1\\.5', 'height:.375rem')
r('h-2', 'height:.5rem')
r('h-6', 'height:1.5rem')
r('inset-x-0', 'left:0;right:0')
r('min-h-0', 'min-height:0px')
r('ml-3', 'margin-left:.75rem')
r('mt-14', 'margin-top:3.5rem')
r('pb-3', 'padding-bottom:.75rem')
r('pb-4', 'padding-bottom:1rem')
r('pb-14', 'padding-bottom:3.5rem')
r('pb-20', 'padding-bottom:5rem')
r('pt-7', 'padding-top:1.75rem')
r('px-1', 'padding-left:.25rem;padding-right:.25rem')
r('py-9', 'padding-top:2.25rem;padding-bottom:2.25rem')
r('w-1\\.5', 'width:.375rem')
r('w-2', 'width:.5rem')
r('w-6', 'width:1.5rem')

# min-h arbitrary
r('min-h-\\[280px\\]', 'min-height:280px')

# ─── LAYOUT ─────────────────────────────────────────────────────────────────

r('items-baseline', 'align-items:baseline')
r('list-disc', 'list-style-type:disc')
r('pointer-events-auto', 'pointer-events:auto')
r('pointer-events-none', 'pointer-events:none')
r('scroll-mt-28', 'scroll-margin-top:7rem')
r('space-y-2>:not\\(\\[hidden\\]\\)~:not\\(\\[hidden\\]\\)',
  '--tw-space-y-reverse:0;margin-bottom:calc(.5rem*var(--tw-space-y-reverse));'
  'margin-top:calc(.5rem*(1 - var(--tw-space-y-reverse)))')
r('z-30', 'z-index:30')

# ─── TYPOGRAPHY ─────────────────────────────────────────────────────────────

r('font-normal', 'font-weight:400')
r('leading-\\[1\\.03\\]', 'line-height:1.03')
r('leading-\\[1\\.06\\]', 'line-height:1.06')
r('text-\\[10px\\]', 'font-size:10px')
r('tracking-\\[0\\.06em\\]', 'letter-spacing:.06em')

# ─── BORDERS & RADIUS ───────────────────────────────────────────────────────

r('rounded-lg', 'border-radius:.5rem')
r('rounded-t-none', 'border-top-left-radius:0px;border-top-right-radius:0px')

# ─── COLORS — BACKGROUNDS ───────────────────────────────────────────────────

r('bg-\\[\\#f3f4f3\\]', 'background-color:#f3f4f3')
r('bg-gray-900', '--tw-bg-opacity:1;background-color:rgb(40 40 40/var(--tw-bg-opacity,1))')
r('bg-green-100', '--tw-bg-opacity:1;background-color:rgb(106 223 149/var(--tw-bg-opacity,1))')
r('bg-green-400', '--tw-bg-opacity:1;background-color:rgb(21 102 51/var(--tw-bg-opacity,1))')
r('bg-green-50\\/50', 'background-color:rgb(202 244 217/.5)')
r('bg-red-100', '--tw-bg-opacity:1;background-color:rgb(244 139 124/var(--tw-bg-opacity,1))')
r('bg-red-50\\/50', 'background-color:rgb(251 214 208/.5)')
r('bg-white\\/\\[0\\.04\\]', 'background-color:hsla(0,0%,100%,.04)')

# ─── COLORS — BORDERS ───────────────────────────────────────────────────────

r('border-gray-900', '--tw-border-opacity:1;border-color:rgb(40 40 40/var(--tw-border-opacity,1))')
r('border-green-200\\/60', 'border-color:rgb(42 209 104/.6)')
r('border-red-200\\/60', 'border-color:rgb(239 89 68/.6)')
r('border-white\\/15', 'border-color:hsla(0,0%,100%,.15)')

# ─── COLORS — TEXT ──────────────────────────────────────────────────────────

r('text-green-400', '--tw-text-opacity:1;color:rgb(21 102 51/var(--tw-text-opacity,1))')
r('text-green-600\\/70', 'color:rgb(14 68 34/.7)')
r('text-red-600\\/70', 'color:rgb(84 31 23/.7)')

# ─── RINGS ──────────────────────────────────────────────────────────────────

r('ring-1', RING_SHADOW.format(w='1px'))
r('ring-black\\/\\[0\\.06\\]', '--tw-ring-color:rgba(0,0,0,.06)')

# ─── SHADOWS ────────────────────────────────────────────────────────────────

r('shadow-\\[0_4px_12px_rgba\\(0\\2c0\\2c0\\2c0\\.08\\)\\]',
  '--tw-shadow:0 4px 12px rgba(0,0,0,.08);--tw-shadow-colored:0 4px 12px var(--tw-shadow-color);'
  'box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)')
r('shadow-\\[0_8px_20px_rgba\\(0\\2c0\\2c0\\2c0\\.22\\)\\]',
  '--tw-shadow:0 8px 20px rgba(0,0,0,.22);--tw-shadow-colored:0 8px 20px var(--tw-shadow-color);'
  'box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)')

# ─── OBJECT POSITION ────────────────────────────────────────────────────────

r('object-\\[center_78\\%\\]', 'object-position:center 78%')

# ─── TRANSITIONS ────────────────────────────────────────────────────────────

r('transition-opacity',
  'transition-property:opacity;transition-timing-function:cubic-bezier(.4,0,.2,1);'
  'transition-duration:.15s')

# ─── HOVER VARIANTS ─────────────────────────────────────────────────────────

hover('bg-gray-300', '--tw-bg-opacity:1;background-color:rgb(184 184 184/var(--tw-bg-opacity,1))')
hover('bg-white\\/15', 'background-color:hsla(0,0%,100%,.15)')
hover('bg-white\\/5', 'background-color:hsla(0,0%,100%,.05)')
hover('border-gray-900', '--tw-border-opacity:1;border-color:rgb(40 40 40/var(--tw-border-opacity,1))')
hover('shadow-\\[0_12px_40px_rgba\\(0\\2c0\\2c0\\2c0\\.08\\)\\]',
      '--tw-shadow:0 12px 40px rgba(0,0,0,.08);--tw-shadow-colored:0 12px 40px var(--tw-shadow-color);'
      'box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)')
hover('shadow-sm',
      '--tw-shadow:0 1px 2px 0 rgb(0 0 0/.05);--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color);'
      'box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)')
hover('text-green-600', '--tw-text-opacity:1;color:rgb(14 68 34/var(--tw-text-opacity,1))')

# ─── FOCUS VARIANTS ─────────────────────────────────────────────────────────

focus('bg-green-400', '--tw-bg-opacity:1;background-color:rgb(21 102 51/var(--tw-bg-opacity,1))')
focus('outline-none', 'outline:2px solid transparent;outline-offset:2px')
focus('ring-gray-400', '--tw-ring-opacity:1;--tw-ring-color:rgb(163 163 163/var(--tw-ring-opacity,1))')
focus('ring-green-200', '--tw-ring-opacity:1;--tw-ring-color:rgb(42 209 104/var(--tw-ring-opacity,1))')

# ─── FOCUS-VISIBLE VARIANTS ─────────────────────────────────────────────────

fv('outline-none', 'outline:2px solid transparent;outline-offset:2px')
fv('ring-2', RING_SHADOW.format(w='2px'))
fv('ring-black', '--tw-ring-opacity:1;--tw-ring-color:rgb(0 0 0/var(--tw-ring-opacity,1))')
fv('ring-gray-300', '--tw-ring-opacity:1;--tw-ring-color:rgb(184 184 184/var(--tw-ring-opacity,1))')
fv('ring-gray-900', '--tw-ring-opacity:1;--tw-ring-color:rgb(40 40 40/var(--tw-ring-opacity,1))')
fv('ring-offset-2', '--tw-ring-offset-width:2px')
fv('ring-offset-white', '--tw-ring-offset-color:#fff')

# ─── GROUP-HOVER VARIANTS ───────────────────────────────────────────────────

gh('gap-3', 'gap:.75rem')

# ─── RESPONSIVE: SM ─────────────────────────────────────────────────────────

mq(SM, 'gap-6', 'gap:1.5rem')
mq(SM, 'gap-7', 'gap:1.75rem')
mq(SM, 'gap-8', 'gap:2rem')
mq(SM, 'h-16', 'height:4rem')
mq(SM, 'leading-9', 'line-height:2.25rem')
mq(SM, 'leading-tight', 'line-height:1.25')
mq(SM, 'max-h-\\[380px\\]', 'max-height:380px')
mq(SM, 'mb-10', 'margin-bottom:2.5rem')
mq(SM, 'min-h-\\[360px\\]', 'min-height:360px')
mq(SM, 'mt-6', 'margin-top:1.5rem')
mq(SM, 'p-6', 'padding:1.5rem')
mq(SM, 'p-7', 'padding:1.75rem')
mq(SM, 'pt-10', 'padding-top:2.5rem')
mq(SM, 'pt-20', 'padding-top:5rem')
mq(SM, 'pt-4', 'padding-top:1rem')
mq(SM, 'px-5', 'padding-left:1.25rem;padding-right:1.25rem')
mq(SM, 'px-7', 'padding-left:1.75rem;padding-right:1.75rem')
mq(SM, 'py-4', 'padding-top:1rem;padding-bottom:1rem')
mq(SM, 'py-7', 'padding-top:1.75rem;padding-bottom:1.75rem')
mq(SM, 'py-8', 'padding-top:2rem;padding-bottom:2rem')
mq(SM, 'py-12', 'padding-top:3rem;padding-bottom:3rem')
mq(SM, 'py-28', 'padding-top:7rem;padding-bottom:7rem')

# ─── RESPONSIVE: MD ─────────────────────────────────────────────────────────

mq(MD, 'border-white\\/10', 'border-color:hsla(0,0%,100%,.1)')
mq(MD, 'border-x', 'border-left-width:1px;border-right-width:1px')
mq(MD, 'col-span-2', 'grid-column:span 2/span 2')
mq(MD, 'gap-6', 'gap:1.5rem')
mq(MD, 'gap-12', 'gap:3rem')
mq(MD, 'grid-cols-\\[1fr_auto\\]', 'grid-template-columns:1fr auto')
mq(MD, 'mb-8', 'margin-bottom:2rem')
mq(MD, 'mb-20', 'margin-bottom:5rem')
mq(MD, 'min-h-\\[240px\\]', 'min-height:240px')
mq(MD, 'min-h-\\[270px\\]', 'min-height:270px')
mq(MD, 'mt-16', 'margin-top:4rem')
mq(MD, 'pb-28', 'padding-bottom:7rem')
mq(MD, 'pt-14', 'padding-top:3.5rem')
mq(MD, 'px-7', 'padding-left:1.75rem;padding-right:1.75rem')
mq(MD, 'py-36', 'padding-top:9rem;padding-bottom:9rem')
mq(MD, 'text-\\[2rem\\]', 'font-size:2rem;line-height:1')
mq(MD, 'w-auto', 'width:auto')

# ─── RESPONSIVE: LG ─────────────────────────────────────────────────────────

mq(LG, 'h-\\[360px\\]', 'height:360px')
mq(LG, 'leading-\\[0\\.92\\]', 'line-height:.92')
mq(LG, 'leading-tight', 'line-height:1.25')
mq(LG, 'max-w-\\[8\\.5ch\\]', 'max-width:8.5ch')
mq(LG, 'mb-6', 'margin-bottom:1.5rem')
mq(LG, 'mb-16', 'margin-bottom:4rem')
mq(LG, 'p-10', 'padding:2.5rem')
mq(LG, 'px-14', 'padding-left:3.5rem;padding-right:3.5rem')
mq(LG, 'py-20', 'padding-top:5rem;padding-bottom:5rem')
mq(LG, 'text-3xl', 'font-size:1.875rem;line-height:2.25rem')

# ─── RESPONSIVE: XL ─────────────────────────────────────────────────────────

mq(XL, 'px-20', 'padding-left:5rem;padding-right:5rem')
mq(XL, 'text-4xl', 'font-size:2.25rem;line-height:2.5rem')

# ─── MAX / MIN HEIGHT ARBITRARIES ───────────────────────────────────────────

r('max-h-\\[320px\\]', 'max-height:320px')
r('max-w-\\[24ch\\]', 'max-width:24ch')
r('max-w-none', 'max-width:none')

# ─── WRITE TO CSS FILE ───────────────────────────────────────────────────────

CSS_FILE = 'public/css/tailwind/tailwind.min.css'

supplement = ''.join(rules)
print(f'Generated {len(rules)} CSS rules ({len(supplement)} bytes)')

with open(CSS_FILE, 'a', encoding='utf-8') as f:
    f.write(supplement)

print(f'Appended to {CSS_FILE}')
print('First few rules preview:')
for rule in rules[:5]:
    print(' ', rule)
