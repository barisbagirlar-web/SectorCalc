echo "=== GeneratedToolFormView KULLANAN ARAÇLAR (Legacy / Pro / Universal) ==="
for file in data/pro-tools/*.json data/pro-tools-universal/*.json; do
  if [[ "$file" != *"_merged.json"* ]]; then
    # Yalnızca tool_slug varsa yazdır
    slug=$(grep -m 1 '"tool_slug"' "$file" | cut -d'"' -f4)
    if [ ! -z "$slug" ]; then
      echo "- $slug"
    fi
  fi
done | sort | uniq
