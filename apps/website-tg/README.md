# Telegram TGM 营销服务平台

这是一个使用 Next.js 14 + TypeScript + Tailwind CSS 构建的专业 Telegram 营销服务平台。

## 功能特点

- ✅ Next.js 14 App Router
- ✅ TypeScript 支持
- ✅ Tailwind CSS 样式
- ✅ SEO 优化（next-seo）
- ✅ 响应式设计
- ✅ 自动生成 sitemap
- ✅ 优化的性能和加载速度

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看网站。

### 生产构建

```bash
npm run build
npm start
```

## 项目结构

```
.
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   ├── globals.css        # 全局样式
│   └── sitemap.ts         # 动态 sitemap
├── components/            # React 组件
│   ├── Header.tsx        # 头部导航
│   ├── Hero.tsx          # 英雄区域
│   ├── Services.tsx      # 服务展示
│   ├── Features.tsx      # 功能特点
│   ├── Pricing.tsx       # 价格方案
│   └── Footer.tsx        # 页脚
├── public/               # 静态资源
│   ├── robots.txt       # SEO robots
│   └── site.webmanifest # PWA manifest
├── next-seo.config.ts   # SEO 配置
└── tailwind.config.ts   # Tailwind 配置
```

## SEO 优化

项目已集成多种 SEO 优化：

- Meta 标签优化
- Open Graph 标签
- Twitter Cards
- 自动生成 sitemap.xml
- robots.txt 配置
- 结构化数据准备

## 定制化

### 修改颜色主题

编辑 `tailwind.config.ts`:

```typescript
colors: {
  telegram: {
    blue: '#0088cc',
    light: '#64b5ef',
    dark: '#006699',
  },
}
```

### 修改 SEO 信息

编辑 `next-seo.config.ts` 和 `app/layout.tsx`。

### 添加新页面

在 `app/` 目录下创建新的文件夹和 `page.tsx`。

## 技术栈

- **框架**: Next.js 14
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **SEO**: next-seo
- **部署**: Vercel（推荐）

## 部署

### Vercel 部署

最简单的部署方式是使用 [Vercel](https://vercel.com):

```bash
npm install -g vercel
vercel
```

## License

MIT
# tgwebsite-
