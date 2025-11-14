# 🎉 系统设置功能已添加！

## 新增功能

现在你可以在管理后台的可视化界面中配置 API Keys，无需修改环境变量和重新部署！

## 🚀 快速开始

### 1. 运行数据库迁移

```bash
cd packages/database
npm run db:push
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 访问设置页面

1. 登录管理后台：http://localhost:3100/login
2. 使用默认账户：
   - Email: `admin@example.com`
   - Password: `admin123`
3. 点击侧边栏的 "⚙️ Settings" 菜单（仅 ADMIN 可见）
4. 配置 OpenAI API Key 和其他设置

## ✨ 主要改进

### 1. 数据库新增 SystemSettings 表

```sql
-- 存储系统配置
CREATE TABLE system_settings (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  is_encrypted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### 2. 设置管理界面

- 位置：`/settings`
- 权限：仅 ADMIN 角色可访问
- 功能：
  - 按分类查看配置（API、SEO、分析等）
  - 敏感信息自动加密（API Keys）
  - 可视化编辑和保存
  - 实时生效，无需重启

### 3. 配置优先级

```
数据库配置 > 环境变量 > 默认值
```

### 4. 修改的文件

```
packages/database/
  ├── prisma/schema.prisma          [新增 SystemSetting 模型]
  └── lib/settings.ts                [新增设置服务]

apps/admin/
  ├── app/(dashboard)/settings/page.tsx    [新增设置页面]
  ├── app/api/settings/route.ts            [新增 API - 获取设置]
  ├── app/api/settings/update/route.ts     [新增 API - 更新设置]
  ├── lib/openai-config.ts                 [新增配置助手]
  ├── app/api/ai/optimize-seo/route.ts     [修改为使用数据库配置]
  ├── app/api/ai/batch-optimize/route.ts   [修改为使用数据库配置]
  ├── app/api/ai/generate-keywords/route.ts [修改为使用数据库配置]
  ├── app/api/ai/analyze-content/route.ts  [修改为使用数据库配置]
  └── components/Sidebar.tsx               [添加设置菜单]
```

## 🔐 安全性

### 加密机制

- 算法：AES-256-CBC
- 密钥：从环境变量 `SETTINGS_ENCRYPTION_KEY` 读取
- 存储：IV 和密文一起存储（`iv:encrypted_data`）

### 生成加密密钥

```bash
openssl rand -base64 32
```

在 `.env` 中添加：
```env
SETTINGS_ENCRYPTION_KEY=your-generated-key-here
```

⚠️ **重要**：备份此密钥！如果丢失，已加密的数据将无法解密。

## 📝 使用示例

### 在代码中获取配置

```typescript
// 方法 1: 使用 OpenAI 配置助手（推荐）
import { getOpenAIConfig } from '@/lib/openai-config'

const { apiKey, model } = await getOpenAIConfig()
// 自动从数据库获取，fallback 到环境变量

// 方法 2: 直接使用设置服务
import { getSetting, SETTING_KEYS } from '@repo/database/lib/settings'

const apiKey = await getSetting(SETTING_KEYS.OPENAI_API_KEY)
```

### 设置配置

```typescript
import { setSetting } from '@repo/database/lib/settings'

await setSetting('openai_api_key', 'sk-xxxxx', {
  description: 'OpenAI API Key',
  category: 'API',
  isEncrypted: true,
})
```

## 🌐 Vercel 部署配置

### 必需的环境变量

```env
# 数据库（必需）
DATABASE_URL=postgresql://...

# NextAuth（必需）
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://your-domain.vercel.app

# 设置加密密钥（可选但推荐）
SETTINGS_ENCRYPTION_KEY=your-generated-key

# OpenAI（可选，可在设置页面配置）
OPENAI_API_KEY=sk-...
```

### 部署后配置

1. 首次部署后，访问 `/settings`
2. 配置 OpenAI API Key（如未在环境变量中设置）
3. 立即生效，无需重新部署

## 🎯 功能清单

- [x] SystemSettings 数据库模型
- [x] 设置 CRUD API
- [x] 加密/解密服务
- [x] 设置管理页面 UI
- [x] 按分类查看（API、SEO、分析等）
- [x] 权限控制（仅 ADMIN）
- [x] 修改所有 AI API 使用数据库配置
- [x] 侧边栏导航菜单
- [x] 完整文档

## 📚 文档

- [系统设置功能详细文档](./SYSTEM-SETTINGS.md)
- [部署指南](./DEPLOYMENT.md)
- [快速部署清单](./DEPLOYMENT-CHECKLIST.md)

## 🔄 迁移步骤（从环境变量）

如果你已经在使用环境变量：

1. 运行 `npm run db:push` 更新数据库
2. 登录管理后台，访问 `/settings`
3. 复制环境变量的值到对应字段
4. 保存设置
5. （可选）删除环境变量

优点：
- 修改后立即生效
- 无需重新部署
- 集中管理

## 🆘 故障排除

### 无法访问设置页面

1. 确认已登录
2. 确认用户角色为 ADMIN
3. 检查浏览器控制台

### 加密设置无法使用

1. 设置 `SETTINGS_ENCRYPTION_KEY` 环境变量
2. 重新保存设置

### AI 功能失效

1. 检查 `/settings` 中的 OpenAI API Key
2. 验证 API Key 有效性
3. 检查 OpenAI 账户余额

---

## 🎉 完成！

现在你可以：
- ✅ 在后台界面配置 API Keys
- ✅ 修改配置无需重新部署
- ✅ 安全存储敏感信息
- ✅ 集中管理所有系统设置

享受更便捷的配置管理体验！
