# 快速开始指南

欢迎使用 Telegram TGM 网站项目！本指南将帮助您在 5 分钟内启动并运行项目。

## 前置要求

- Node.js 18.x 或更高版本
- npm 或 yarn
- Git

## 安装

### 1. 克隆或下载项目

如果您还没有项目文件：

```bash
git clone <repository-url>
cd tg-website
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

就这么简单！您的网站已经运行了。

## 基本配置

### 修改网站信息

编辑 `app/layout.tsx` 修改 SEO 信息：

```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://你的域名.com'),
  title: '你的网站标题',
  description: '你的网站描述',
  // ...
}
```

### 修改颜色主题

编辑 `tailwind.config.ts`：

```typescript
colors: {
  telegram: {
    blue: '#0088cc',    // 主色调
    light: '#64b5ef',   // 浅色
    dark: '#006699',    // 深色
  },
}
```

### 修改网站内容

主要组件位于 `components/` 目录：

- `Header.tsx` - 导航栏
- `Hero.tsx` - 首屏横幅
- `Services.tsx` - 服务展示
- `Features.tsx` - 功能特点
- `Pricing.tsx` - 价格方案
- `Footer.tsx` - 页脚

### 添加图片

将图片放在 `public/` 目录下，例如：

```
public/
  ├── logo.png
  ├── og-image.jpg
  └── images/
      └── hero.jpg
```

在代码中使用：

```tsx
import Image from 'next/image'

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
/>
```

## 常用命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 代码检查
npm run lint
```

## 项目结构

```
tg-website/
├── app/                    # Next.js 页面
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   ├── globals.css        # 全局样式
│   ├── sitemap.ts         # Sitemap 生成
│   └── robots.ts          # Robots.txt 生成
├── components/            # React 组件
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Services.tsx
│   ├── Features.tsx
│   ├── Pricing.tsx
│   ├── Footer.tsx
│   ├── JsonLd.tsx        # 结构化数据
│   └── Analytics.tsx      # 分析追踪
├── lib/                   # 工具函数
│   └── seo-utils.ts      # SEO 工具
├── public/                # 静态资源
│   ├── robots.txt
│   └── site.webmanifest
├── docs/                  # 文档
│   ├── SEO-GUIDE.md
│   ├── DEPLOYMENT.md
│   └── QUICK-START.md
├── next.config.mjs        # Next.js 配置
├── tailwind.config.ts     # Tailwind 配置
├── tsconfig.json          # TypeScript 配置
└── package.json           # 项目依赖
```

## 下一步

### 定制化

1. **修改页面内容**
   - 编辑 `components/` 下的组件
   - 更新文本、图片和链接

2. **添加新页面**
   ```bash
   mkdir app/about
   touch app/about/page.tsx
   ```

3. **修改样式**
   - 使用 Tailwind CSS 类
   - 编辑 `app/globals.css` 添加自定义样式

### SEO 优化

1. **配置 Google Analytics**
   - 见 `docs/SEO-GUIDE.md`

2. **提交 Sitemap**
   - 部署后访问 `/sitemap.xml`
   - 在 Google Search Console 提交

3. **优化图片**
   - 使用 WebP 格式
   - 添加 alt 文本
   - 使用 Next.js Image 组件

### 部署

最简单的部署方式是使用 Vercel：

```bash
npm install -g vercel
vercel
```

详细部署指南见 `docs/DEPLOYMENT.md`

## 获取帮助

### 文档

- [SEO 优化指南](./SEO-GUIDE.md)
- [部署指南](./DEPLOYMENT.md)

### 外部资源

- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [TypeScript 文档](https://www.typescriptlang.org/docs)

### 问题排查

#### 端口已被占用

```bash
# 使用不同端口
PORT=3001 npm run dev
```

#### 安装依赖失败

```bash
# 清除缓存重新安装
rm -rf node_modules package-lock.json
npm install
```

#### 构建失败

```bash
# 清除 .next 缓存
rm -rf .next
npm run build
```

## 常见任务

### 更改网站标题

编辑 `app/layout.tsx`：
```typescript
title: '你的新标题'
```

### 添加新的服务项

编辑 `components/Services.tsx`，在 `services` 数组添加：
```typescript
{
  icon: '🎯',
  title: '新服务',
  description: '服务描述',
}
```

### 修改价格方案

编辑 `components/Pricing.tsx`，在 `plans` 数组修改价格和功能

### 更换 Logo

1. 将新 logo 放在 `public/`
2. 编辑 `components/Header.tsx`
3. 更新 logo 引用

## 性能优化提示

1. **优化图片**
   - 使用现代格式（WebP、AVIF）
   - 压缩图片文件
   - 使用适当的尺寸

2. **代码分割**
   - Next.js 自动处理
   - 使用动态导入大型组件

3. **缓存策略**
   - 配置 CDN
   - 使用浏览器缓存

## 开发技巧

### 热重载

开发服务器支持热重载，保存文件后自动刷新浏览器

### TypeScript 类型检查

```bash
npm run lint
```

### 格式化代码

推荐使用 Prettier：

```bash
npm install -D prettier
npx prettier --write .
```

## 更新项目

定期更新依赖：

```bash
npm update
npm audit fix
```

## 贡献

如果您想为项目做贡献：

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

## 许可证

MIT License

---

**祝您使用愉快！** 🚀

如有问题，请参考详细文档或联系支持团队。
