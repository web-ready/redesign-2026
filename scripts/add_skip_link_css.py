"""Add the missing focus: CSS rules for the skip-to-content accessibility link."""
BS = chr(92)  # backslash

# Skip-to-content link uses:
# sr-only (exists), focus:not-sr-only, focus:fixed, focus:top-4, focus:left-4,
# focus:z-[9999], focus:px-6, focus:py-3, focus:bg-white, focus:text-black,
# focus:rounded-lg, focus:shadow-lg, focus:text-sm, focus:font-semibold,
# focus:outline-none (exists), focus:ring-4 (exists), focus:ring-green-500

rules = [
    f'.focus{BS}:not-sr-only:focus{{position:static;width:auto;height:auto;padding:0;margin:0;overflow:visible;clip:auto;white-space:normal}}',
    f'.focus{BS}:fixed:focus{{position:fixed}}',
    f'.focus{BS}:top-4:focus{{top:1rem}}',
    f'.focus{BS}:left-4:focus{{left:1rem}}',
    f'.focus{BS}:z-{BS}[9999{BS}]:focus{{z-index:9999}}',
    f'.focus{BS}:px-6:focus{{padding-left:1.5rem;padding-right:1.5rem}}',
    f'.focus{BS}:py-3:focus{{padding-top:.75rem;padding-bottom:.75rem}}',
    f'.focus{BS}:bg-white:focus{{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}}',
    f'.focus{BS}:text-black:focus{{--tw-text-opacity:1;color:rgb(0 0 0/var(--tw-text-opacity))}}',
    f'.focus{BS}:rounded-lg:focus{{border-radius:.5rem}}',
    f'.focus{BS}:shadow-lg:focus{{--tw-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1);--tw-shadow-colored:0 10px 15px -3px var(--tw-shadow-color),0 4px 6px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}}',
    f'.focus{BS}:text-sm:focus{{font-size:.875rem;line-height:1.25rem}}',
    f'.focus{BS}:font-semibold:focus{{font-weight:600}}',
    f'.focus{BS}:ring-green-500:focus{{--tw-ring-opacity:1;--tw-ring-color:rgb(34 197 94/var(--tw-ring-opacity))}}',
]

supplement = ''.join(rules)
print(f'Generated {len(rules)} focus: rules ({len(supplement)} bytes)')

CSS_FILE = 'public/css/tailwind/tailwind.min.css'
with open(CSS_FILE, 'a', encoding='utf-8') as f:
    f.write(supplement)
print(f'Appended to {CSS_FILE}')
