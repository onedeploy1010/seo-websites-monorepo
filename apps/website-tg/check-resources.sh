#!/bin/bash
echo "🔍 检查所有资源文件..."
echo ""

files=(
  "public/favicon.svg"
  "public/logo.svg"
  "public/og-image.svg"
  "public/robots.txt"
  "public/site.webmanifest"
  "public/images/blog/blog-1.svg"
  "public/images/blog/blog-2.svg"
  "public/images/blog/blog-3.svg"
  "public/images/blog/blog-4.svg"
  "public/images/blog/blog-5.svg"
  "public/images/blog/blog-6.svg"
  "public/images/blog/blog-7.svg"
  "public/images/blog/blog-8.svg"
  "public/images/blog/blog-9.svg"
)

all_good=true
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file (缺失)"
    all_good=false
  fi
done

echo ""
if [ "$all_good" = true ]; then
  echo "🎉 所有资源文件都存在！"
  exit 0
else
  echo "⚠️  有文件缺失，请检查上面的列表"
  exit 1
fi
