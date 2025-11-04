# SEO 优化指南

本项目已集成多种 SEO 优化功能，本指南将帮助您充分利用这些功能。

## 已实现的 SEO 功能

### 1. Meta 标签优化

所有页面都包含完整的 meta 标签：
- `title`: 页面标题
- `description`: 页面描述（限制在 160 字符内）
- `keywords`: 关键词
- Open Graph 标签（Facebook 分享优化）
- Twitter Cards（Twitter 分享优化）

**位置**: `app/layout.tsx`

### 2. 结构化数据 (JSON-LD)

使用 Schema.org 格式的结构化数据，帮助搜索引擎更好地理解网站内容。

**位置**: `components/JsonLd.tsx`

当前包含的结构化数据：
- Organization（组织信息）
- AggregateRating（评分）
- AggregateOffer（价格信息）

### 3. Sitemap 自动生成

动态生成 XML sitemap，包含所有页面的 URL、更新频率和优先级。

**位置**: `app/sitemap.ts`
**访问地址**: `/sitemap.xml`

### 4. Robots.txt

配置搜索引擎爬虫行为。

**位置**: `app/robots.ts`
**访问地址**: `/robots.txt`

### 5. SEO 友好的 URL 结构

使用 Next.js App Router，自动生成清晰的 URL 结构。

## 配置步骤

### 第一步：配置环境变量

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 并填写实际值：

```env
NEXT_PUBLIC_SITE_URL=https://www.telegramtgm.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-verification-code
```

### 第二步：Google Search Console 验证

1. 访问 [Google Search Console](https://search.google.com/search-console)
2. 添加您的网站
3. 选择"HTML 标签"验证方法
4. 复制验证代码
5. 在 `app/layout.tsx` 中更新 `verification.google` 字段

### 第三步：提交 Sitemap

1. 构建项目：`npm run build`
2. 部署到生产环境
3. 在 Google Search Console 中提交 sitemap：
   - URL: `https://yourdomain.com/sitemap.xml`

### 第四步：配置 Google Analytics（可选）

1. 创建 Google Analytics 账户
2. 获取 Measurement ID (G-XXXXXXXXXX)
3. 在 `app/layout.tsx` 的 `<head>` 中添加 GA 脚本：

```tsx
<head>
  {/* Google Analytics */}
  <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`} />
  <script
    dangerouslySetInnerHTML={{
      __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
      `,
    }}
  />
</head>
```

## SEO 最佳实践

### 1. 页面标题优化

- 每个页面使用唯一的标题
- 标题长度保持在 50-60 字符
- 包含主要关键词
- 使用分隔符（如 `|` 或 `-`）

### 2. Meta 描述优化

- 每个页面使用唯一的描述
- 长度保持在 150-160 字符
- 包含关键词和行动号召
- 使用 `lib/seo-utils.ts` 中的工具函数

### 3. 图片优化

使用 Next.js Image 组件：

```tsx
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="描述性的替代文本"
  width={1200}
  height={630}
  priority={true} // 对首屏图片使用
/>
```

### 4. URL 结构

- 使用短而有意义的 URL
- 包含关键词
- 使用连字符分隔单词
- 避免特殊字符

### 5. 页面性能

Next.js 已经提供了很多性能优化：
- 自动代码分割
- 图片优化
- 字体优化
- 静态生成（SSG）

检查性能：
```bash
npm run build
npm run start
# 访问 http://localhost:3000 并使用 Lighthouse 测试
```

## 内容优化建议

### 1. 关键词研究

使用工具：
- Google Keyword Planner
- Ahrefs
- SEMrush
- 百度指数（中文关键词）

### 2. 内容结构

- 使用语义化的 HTML 标签（`<h1>`, `<h2>`, `<article>`, `<section>`）
- 每个页面只使用一个 `<h1>` 标签
- 使用层级化的标题结构
- 包含相关的内部链接

### 3. 移动端优化

项目已使用 Tailwind CSS 实现响应式设计，但请注意：
- 测试所有设备尺寸
- 确保触摸目标足够大（至少 44x44px）
- 优化移动端加载速度

## 监控和分析

### 1. Google Search Console

监控：
- 搜索流量
- 索引覆盖率
- 移动设备可用性
- 核心网页指标

### 2. Google Analytics

跟踪：
- 用户行为
- 转化率
- 流量来源
- 页面性能

### 3. 核心网页指标（Core Web Vitals）

确保：
- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1

测试工具：
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Web Vitals Chrome Extension](https://chrome.google.com/webstore/detail/web-vitals/)

## 社交媒体优化

### Open Graph 图片

创建 1200x630px 的 OG 图片：
- 使用清晰的品牌标识
- 包含关键信息
- 避免文字过小
- 保存为 `/public/og-image.jpg`

### 测试分享效果

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

## 常见问题

### Q: 如何为不同页面设置不同的 SEO 信息？

A: 在每个页面的 `page.tsx` 中导出 `metadata`：

```tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '页面标题',
  description: '页面描述',
}

export default function Page() {
  return <div>页面内容</div>
}
```

### Q: 如何添加更多结构化数据？

A: 编辑 `components/JsonLd.tsx` 或创建新的结构化数据组件。参考 [Schema.org](https://schema.org/) 获取更多类型。

### Q: 如何优化加载速度？

A:
1. 使用 Next.js Image 组件
2. 实现动态导入（lazy loading）
3. 优化字体加载
4. 使用 CDN
5. 启用缓存

## 工具和资源

- [Next.js SEO 文档](https://nextjs.org/learn/seo/introduction-to-seo)
- [Google SEO 入门指南](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Schema.org](https://schema.org/)
- [Web.dev](https://web.dev/)
- [Moz SEO 学习中心](https://moz.com/learn/seo)

## 定期维护

每月检查：
- [ ] Google Search Console 中的错误
- [ ] 网站速度和性能
- [ ] 移动端可用性
- [ ] 索引覆盖率
- [ ] 关键词排名
- [ ] 竞争对手分析

每季度更新：
- [ ] 内容优化
- [ ] 结构化数据
- [ ] 内部链接结构
- [ ] Sitemap
