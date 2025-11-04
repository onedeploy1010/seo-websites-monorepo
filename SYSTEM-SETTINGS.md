# 📝 系统设置功能文档

## 概述

系统设置功能允许管理员在后台可视化界面中配置 API Keys 和系统参数，无需修改环境变量和重新部署。

## 🎯 核心优势

### 1. 无需重新部署
- ✅ 修改配置后立即生效
- ✅ 不需要重启服务器
- ✅ 节省部署时间和成本

### 2. 安全性
- ✅ 敏感信息（API Keys）加密存储
- ✅ 使用 AES-256-CBC 加密算法
- ✅ 只有 ADMIN 角色可以访问

### 3. 集中管理
- ✅ 所有配置集中在一个页面
- ✅ 支持分类查看（API、SEO、分析等）
- ✅ 可视化管理界面

## 📦 功能特性

### 配置优先级
```
数据库配置 > 环境变量 > 默认值
```

这意味着：
1. 如果数据库中有配置，使用数据库配置
2. 如果数据库中没有，使用环境变量
3. 如果都没有，使用默认值（如果有）

### 支持的设置类型

#### API 配置
- **OpenAI API Key** (加密)
  - 用于 AI SEO 优化功能
  - 支持 GPT-4 Turbo、GPT-3.5 Turbo
- **OpenAI Model**
  - 选择使用的 AI 模型
  - 默认：`gpt-4-turbo`

#### SEO 工具
- **Google Search Console ID**
  - 网站验证码
- **Bing Webmaster Key** (加密)
  - Bing 站长工具 API Key

#### 分析工具
- **Google Analytics ID**
  - 格式：`G-XXXXXXXXXX`
- **百度统计 ID**
  - 用于百度统计集成

#### 通知设置（预留）
- SMTP 邮件配置
- Webhook 配置

## 🔐 安全性设计

### 加密机制

1. **加密算法**: AES-256-CBC
2. **密钥管理**: 从环境变量 `SETTINGS_ENCRYPTION_KEY` 读取
3. **IV (初始化向量)**: 每次加密生成随机 IV
4. **存储格式**: `iv:encrypted_data`

### 密钥生成

```bash
# 生成 32 字符加密密钥
openssl rand -base64 32
```

在 Vercel 环境变量中设置：
```env
SETTINGS_ENCRYPTION_KEY=your-generated-key-here
```

⚠️ **重要**:
- 如果丢失加密密钥，已加密的数据将无法解密
- 建议备份加密密钥
- 不同环境使用不同的密钥

### 权限控制

- 只有 `ADMIN` 角色可以访问 `/settings` 页面
- API 路由 `/api/settings/*` 需要 ADMIN 权限
- 普通用户和访客无法查看或修改设置

## 🚀 使用指南

### 首次配置

1. **登录管理后台**
   ```
   https://your-admin-domain.vercel.app/login
   ```

2. **访问设置页面**
   ```
   https://your-admin-domain.vercel.app/settings
   ```

3. **配置 OpenAI API Key**
   - 选择"API 配置"标签
   - 在"OpenAI API Key"字段输入密钥
   - 点击"保存设置"

4. **配置其他服务**
   - 切换到相应的分类标签
   - 填写对应的配置值
   - 保存

### 修改现有配置

1. 访问 `/settings` 页面
2. 找到要修改的配置项
3. 输入新值
4. 点击"保存设置"
5. 立即生效，无需重新部署

### 加密字段的特殊处理

对于加密字段（如 API Keys）：
- **显示**: 显示为 `••••••••`（不显示实际值）
- **修改**: 输入框为空，输入新值即更新
- **保留**: 留空表示不修改当前值

## 💻 开发者指南

### 数据库模型

```prisma
model SystemSetting {
  id          String   @id @default(cuid())
  key         String   @unique
  value       String   @db.Text
  description String?
  category    SettingCategory @default(GENERAL)
  isEncrypted Boolean  @default(false)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 使用设置服务

```typescript
import { getSetting, setSetting, SETTING_KEYS } from '@repo/database/lib/settings'

// 获取单个设置
const apiKey = await getSetting(SETTING_KEYS.OPENAI_API_KEY)

// 设置单个值（加密）
await setSetting('openai_api_key', 'sk-xxxx', {
  description: 'OpenAI API Key',
  category: 'API',
  isEncrypted: true,
})

// 批量获取
const settings = await getSettings([
  SETTING_KEYS.OPENAI_API_KEY,
  SETTING_KEYS.GOOGLE_ANALYTICS_ID,
])
```

### 在 API 路由中使用

```typescript
import { getOpenAIConfig } from '@/lib/openai-config'

// 自动从数据库或环境变量获取
const { apiKey, model } = await getOpenAIConfig()

// 使用配置
const response = await openai(model, { apiKey })
```

### 添加新的设置项

1. **在数据库中定义 key**

```typescript
// packages/database/lib/settings.ts
export const SETTING_KEYS = {
  // 添加新的 key
  NEW_API_KEY: 'new_api_key',
}
```

2. **在设置页面添加模板**

```typescript
// apps/admin/app/settings/page.tsx
const SETTING_TEMPLATES: SettingInput[] = [
  {
    key: 'new_api_key',
    value: '',
    description: '新的 API Key',
    category: 'API',
    isEncrypted: true,
  },
]
```

3. **使用配置**

```typescript
const newApiKey = await getSetting(SETTING_KEYS.NEW_API_KEY)
```

## 🔄 迁移指南

### 从环境变量迁移到系统设置

如果你已经在使用环境变量，可以这样迁移：

1. **登录管理后台**
2. **访问 `/settings`**
3. **复制环境变量的值到对应字段**
4. **保存设置**
5. **（可选）删除 Vercel 中的环境变量**

迁移后的好处：
- ✅ 无需每次修改后重新部署
- ✅ 所有配置集中管理
- ✅ 敏感信息加密存储

### 回退到环境变量

如果需要回退：

1. 访问 `/settings` 复制配置值
2. 在 Vercel Dashboard 中设置环境变量
3. 删除数据库中的对应设置（可选）

系统会自动 fallback 到环境变量。

## 🐛 故障排除

### 问题 1: 无法访问设置页面

**症状**: 访问 `/settings` 返回 404 或 Unauthorized

**解决方案**:
1. 确认已登录
2. 确认当前用户角色为 `ADMIN`
3. 检查浏览器控制台错误

### 问题 2: 加密设置无法解密

**症状**: 设置保存后无法正常使用

**原因**: `SETTINGS_ENCRYPTION_KEY` 环境变量缺失或不一致

**解决方案**:
1. 在 Vercel 中设置 `SETTINGS_ENCRYPTION_KEY`
2. 确保所有环境（Production/Preview）使用相同的密钥
3. 重新保存设置

### 问题 3: 修改设置后未生效

**检查清单**:
- [ ] 设置已成功保存（查看成功提示）
- [ ] API 路由正确使用 `getOpenAIConfig()` 或 `getSetting()`
- [ ] 数据库连接正常
- [ ] 清除浏览器缓存

### 问题 4: AI API 调用失败

**错误信息**: "OpenAI API Key 未配置"

**解决方案**:
1. 访问 `/settings` 检查 OpenAI API Key 是否已配置
2. 如果已配置，检查数据库连接
3. 验证 API Key 有效性
4. 检查 OpenAI 账户余额

## 📊 监控和日志

### 设置修改日志

每个设置都有 `updatedAt` 时间戳，记录最后修改时间。

在设置页面可以看到：
```
最后更新: 2025-11-05 14:30:25
```

### 安全审计

建议定期检查：
- 设置修改历史
- 异常访问日志
- API 使用情况

## 🔮 未来计划

### 即将推出的功能

- [ ] 设置修改历史记录
- [ ] 设置备份和恢复
- [ ] 设置导入/导出（JSON 格式）
- [ ] 设置版本控制
- [ ] 多环境配置管理
- [ ] 设置验证（API Key 有效性检查）
- [ ] 更多第三方服务集成

---

## 📞 技术支持

如有问题，请参考：
- [部署文档](./DEPLOYMENT.md)
- [快速部署清单](./DEPLOYMENT-CHECKLIST.md)
- [项目 README](./README.md)
