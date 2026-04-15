#!/bin/bash
for file in public/*.html public/blog/*.html; do
  [ -f "$file" ] || continue
  
  # Extract from file, find the pattern: first section bg-black with nav right after
  awk '
    /<section[^>]*bg-black/ && !found {
      section_line = $0
      found = 1
      next
    }
    found && /<nav[^>]*aria-label="Main"/ {
      print FILENAME ": "
      print "SECTION: " section_line
      print "NAV: " $0
      print "---"
      exit
    }
  ' FILENAME="$file" "$file"
done
