#!/bin/bash
for file in public/*.html public/blog/*.html; do
  [ -f "$file" ] || continue
  
  # Find the first section with bg-black and the nav right after it
  line_num=$(grep -n "^\s*<section class=\".*bg-black" "$file" | head -1 | cut -d: -f1)
  
  if [ -n "$line_num" ]; then
    # Extract section and nav starting from that line
    sed -n "${line_num},$((line_num+5))p" "$file" | grep -E "section|nav aria-label=\"Main" | head -2
    echo "FILE: $file"
  fi
done
