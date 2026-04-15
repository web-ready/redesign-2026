"""Append the 3 corrected shadow rules with proper CSS comma escaping (\2c space)."""
# \2c is the CSS hex escape for comma (U+002C).
# After a hex escape, a space terminates it — so \2c 0 means comma then '0', not U+02C0.
BS = chr(92)  # single backslash

def escape_selector(name):
    """Convert a Tailwind class name to a CSS-escaped selector class string."""
    out = []
    for ch in name:
        if ch == ':':
            out.append(BS + ':')
        elif ch == '/':
            out.append(BS + '/')
        elif ch == '[':
            out.append(BS + '[')
        elif ch == ']':
            out.append(BS + ']')
        elif ch == '(':
            out.append(BS + '(')
        elif ch == ')':
            out.append(BS + ')')
        elif ch == '.':
            out.append(BS + '.')
        elif ch == ',':
            # Use hex escape with trailing space to avoid ambiguity with next hex digit
            out.append(BS + '2c ')
        elif ch == '%':
            out.append(BS + '%')
        else:
            out.append(ch)
    return ''.join(out)


SHADOW_BODY = ('--tw-shadow:{v};--tw-shadow-colored:{v2} var(--tw-shadow-color);'
               'box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),'
               'var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)')

rules = []

# shadow-[0_4px_12px_rgba(0,0,0,0.08)]
name1 = 'shadow-[0_4px_12px_rgba(0,0,0,0.08)]'
sel1 = escape_selector(name1)
val1 = '0 4px 12px rgba(0,0,0,.08)'
rules.append(f'.{sel1}{{{SHADOW_BODY.format(v=val1, v2=val1)}}}')

# shadow-[0_8px_20px_rgba(0,0,0,0.22)]
name2 = 'shadow-[0_8px_20px_rgba(0,0,0,0.22)]'
sel2 = escape_selector(name2)
val2 = '0 8px 20px rgba(0,0,0,.22)'
rules.append(f'.{sel2}{{{SHADOW_BODY.format(v=val2, v2=val2)}}}')

# hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]
name3 = 'shadow-[0_12px_40px_rgba(0,0,0,0.08)]'
sel3 = escape_selector(name3)
val3 = '0 12px 40px rgba(0,0,0,.08)'
rules.append(f'.hover{BS}:{sel3}:hover{{{SHADOW_BODY.format(v=val3, v2=val3)}}}')

supplement = ''.join(rules)
print(f'Generated {len(rules)} rules ({len(supplement)} bytes)')
print('Rules:')
for r in rules:
    print(' ', r[:100])

CSS_FILE = 'public/css/tailwind/tailwind.min.css'
with open(CSS_FILE, 'a', encoding='utf-8') as f:
    f.write(supplement)
print(f'\nAppended to {CSS_FILE}')
