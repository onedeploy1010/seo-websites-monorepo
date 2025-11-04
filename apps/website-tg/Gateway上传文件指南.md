# 🚀 JetBrains Gateway 上传文件完整指南

## 📌 适用场景
- 使用 JetBrains Gateway 连接远程服务器
- 需要从本地 Windows/Mac 上传文件到服务器
- 上传图片、配置文件、资源文件等

---

## 🎯 方法 1: 直接拖拽上传（最简单）⭐⭐⭐

### 步骤：
1. **打开 Gateway 连接的远程项目**
   - 确保 Gateway 已连接到远程服务器
   - 项目文件树显示在左侧

2. **准备要上传的文件**
   - 在 Windows 文件资源管理器中找到文件
   - 选中一个或多个文件

3. **直接拖拽**
   - 将文件从 Windows 资源管理器拖到 Gateway 的项目文件树
   - 拖到目标文件夹上（比如 `public/images/`）
   - 松开鼠标，文件自动上传

### 示例：
```
Windows 资源管理器:
C:\Users\YourName\Desktop\logo.png

拖拽到 Gateway:
└─ public/
   └─ (拖到这里)

结果:
└─ public/
   └─ logo.png ✅ 已上传
```

### 优点：
- ✅ 最简单直观
- ✅ 支持多文件同时上传
- ✅ 支持文件夹上传
- ✅ 实时显示上传进度

---

## 🎯 方法 2: 右键菜单上传

### 步骤：
1. **在 Gateway 项目树中右键点击目标文件夹**
   - 比如右键 `public/images/` 文件夹

2. **选择上传选项**
   - 选择 "Upload from..." 或 "上传..."
   - 或者使用快捷键（通常是 `Ctrl+Alt+U`）

3. **选择本地文件**
   - 在弹出的文件选择对话框中选择文件
   - 支持多选（Ctrl + 左键点击）

4. **确认上传**
   - 点击"打开"或"确定"
   - 文件开始上传到服务器

### 快捷键：
- Windows: `Ctrl + Alt + U`
- Mac: `Cmd + Option + U`

---

## 🎯 方法 3: 复制粘贴（适合小文件）

### 步骤：
1. **在本地 Windows 复制文件**
   - 右键文件 → 复制
   - 或 `Ctrl + C`

2. **在 Gateway 项目树粘贴**
   - 右键目标文件夹 → 粘贴
   - 或选中文件夹后按 `Ctrl + V`

3. **文件自动上传**
   - Gateway 会自动将文件上传到服务器

### 注意：
- 适合小文件（< 10MB）
- 大文件建议用拖拽方式

---

## 🎯 方法 4: 使用 Gateway 内置终端 + SCP

### 如果需要从其他机器上传：

1. **在 Gateway 中打开终端**
   - 点击底部 "Terminal" 标签
   - 或按 `Alt + F12`

2. **从本地机器上传（在本地 PowerShell 执行）**
   ```powershell
   # 上传单个文件
   scp C:\path\to\file.png ubuntu@your-server-ip:/home/ubuntu/WebstormProjects/TGwebsite/public/

   # 上传文件夹
   scp -r C:\path\to\folder ubuntu@your-server-ip:/home/ubuntu/WebstormProjects/TGwebsite/public/
   ```

3. **在 Gateway 终端验证**
   ```bash
   ls -lh /home/ubuntu/WebstormProjects/TGwebsite/public/
   ```

---

## 🎯 方法 5: 使用 Gateway 的 Deployment 功能

### 步骤：
1. **打开 Deployment 设置**
   - Tools → Deployment → Configuration
   - 或 `Ctrl + Alt + S` → Deployment

2. **配置映射**
   - Local path（本地路径）
   - Deployment path（远程路径）

3. **上传文件**
   - 右键文件 → Deployment → Upload to...
   - 或使用快捷键 `Ctrl + Shift + Alt + X`

4. **自动同步（可选）**
   - Tools → Deployment → Automatic Upload
   - 保存文件时自动上传

---

## 📝 实战示例

### 示例 1: 上传网站 Logo

#### 方法A - 拖拽上传：
```
1. Windows 中找到 logo.png
2. 在 Gateway 项目树中找到 public/ 文件夹
3. 直接拖拽 logo.png 到 public/
4. 完成！
```

#### 方法B - 右键上传：
```
1. Gateway 中右键 public/ 文件夹
2. 选择 "Upload from..."
3. 选择本地的 logo.png
4. 点击"打开"
5. 完成！
```

#### 验证：
在 Gateway 终端执行：
```bash
ls -lh /home/ubuntu/WebstormProjects/TGwebsite/public/logo.png
```

应该看到：
```
-rw-rw-r-- 1 ubuntu ubuntu 15K Oct 27 18:30 logo.png
```

---

### 示例 2: 批量上传博客图片

#### 步骤：
1. **准备图片**
   ```
   Windows 路径: C:\Users\YourName\Desktop\blog-images\
   包含: image1.jpg, image2.jpg, image3.jpg ...
   ```

2. **在 Gateway 中导航到目标文件夹**
   ```
   project/
   └─ public/
      └─ images/
         └─ blog/ ← 目标文件夹
   ```

3. **选择上传方法**

   **方法A - 拖拽所有图片：**
   - 在 Windows 文件管理器选中所有图片
   - 拖到 Gateway 的 `public/images/blog/` 文件夹
   - 等待上传完成

   **方法B - 右键上传：**
   - 右键 `public/images/blog/` 文件夹
   - "Upload from..."
   - 多选所有图片（Ctrl + 点击）
   - 确认上传

4. **验证上传**
   在 Gateway 终端：
   ```bash
   ls -lh /home/ubuntu/WebstormProjects/TGwebsite/public/images/blog/
   ```

---

### 示例 3: 替换 SVG 占位符为真实图片

当前项目使用 SVG 占位符，您可以替换为真实图片：

#### 需要替换的文件：
```
public/
├─ favicon.svg → favicon.png (或 .ico)
├─ logo.svg → logo.png
├─ og-image.svg → og-image.jpg
└─ images/blog/
   ├─ blog-1.svg → blog-1.jpg
   ├─ blog-2.svg → blog-2.jpg
   └─ ...
```

#### 替换步骤：
1. **准备真实图片**（推荐尺寸）
   - Logo: 512×512px (PNG)
   - OG Image: 1200×630px (JPG)
   - Blog Images: 800×450px (JPG)

2. **上传方式 1 - 直接替换**
   ```
   1. 在 Gateway 中删除旧的 SVG 文件
   2. 拖拽新的图片文件到同一位置
   3. 确保文件名匹配（或更新代码中的引用）
   ```

3. **上传方式 2 - 先上传后删除**
   ```
   1. 拖拽新图片到文件夹
   2. 在 Gateway 中删除旧 SVG
   3. 重命名新图片（如需要）
   ```

4. **更新代码引用（如果更改了文件扩展名）**
   ```typescript
   // 比如在 components/BlogList.tsx
   // 将 .svg 改为 .jpg
   image: `/images/blog/blog-1.jpg`  // 原来是 .svg
   ```

5. **在终端验证**
   ```bash
   ls -lh public/images/blog/
   file public/images/blog/blog-1.jpg  # 查看文件类型
   ```

---

## 🔧 常见问题和解决方案

### Q1: 拖拽上传没有反应？

**原因**：可能是 Gateway 权限问题

**解决方案**：
```bash
# 在 Gateway 终端执行：
sudo chown -R ubuntu:ubuntu /home/ubuntu/WebstormProjects/TGwebsite/
chmod -R 755 /home/ubuntu/WebstormProjects/TGwebsite/
```

---

### Q2: 上传后文件不显示？

**原因1**：文件路径不对

**解决方案**：
```bash
# 检查文件是否在正确位置
ls -la /home/ubuntu/WebstormProjects/TGwebsite/public/
```

**原因2**：需要刷新项目树

**解决方案**：
- 右键项目根目录 → Synchronize
- 或按 `Ctrl + Alt + Y`

---

### Q3: 上传速度很慢？

**解决方案**：

1. **压缩后上传**
   ```powershell
   # 在本地 Windows 压缩
   Compress-Archive -Path C:\images\* -DestinationPath C:\images.zip

   # 上传压缩包（通过拖拽）
   # 在 Gateway 终端解压
   unzip images.zip -d /home/ubuntu/WebstormProjects/TGwebsite/public/images/
   ```

2. **使用 rsync（如果配置了 SSH）**
   ```bash
   # 在本地 Git Bash 或 WSL
   rsync -avz C:/path/to/images/ ubuntu@server:/home/ubuntu/WebstormProjects/TGwebsite/public/images/
   ```

---

### Q4: 上传大文件（> 100MB）？

**推荐方式**：使用命令行 SCP

```powershell
# 在本地 Windows PowerShell
scp C:\large-file.zip ubuntu@server-ip:/home/ubuntu/WebstormProjects/TGwebsite/

# 然后在 Gateway 终端解压
cd /home/ubuntu/WebstormProjects/TGwebsite/
unzip large-file.zip -d public/
```

---

### Q5: 想自动同步文件？

**解决方案**：配置自动上传

1. **打开设置**
   - File → Settings → Build, Execution, Deployment → Deployment

2. **配置选项**
   ```
   ✅ Upload changed files automatically to the default server
   选择: On explicit save action (Ctrl+S)
   ```

3. **结果**：每次保存文件时自动上传到服务器

---

## 🎨 针对本项目的快速操作指南

### 当前项目路径：
```
远程服务器: /home/ubuntu/WebstormProjects/TGwebsite/
```

### 需要上传的常见文件：

#### 1. 网站图标和 Logo
```
上传到: public/
文件: favicon.png, logo.png, og-image.jpg
```

**操作**：
- 在 Gateway 项目树找到 `public/` 文件夹
- 拖拽您的 logo 文件到这里

#### 2. 博客文章图片
```
上传到: public/images/blog/
文件: blog-1.jpg, blog-2.jpg, ..., blog-9.jpg
```

**操作**：
- 展开 `public/images/blog/`
- 拖拽所有博客图片到这个文件夹

#### 3. 其他资源文件
```
上传到: public/images/
文件: 任何其他图片
```

---

## ✅ 上传后的验证清单

### 1. 检查文件是否存在
```bash
# 在 Gateway 终端执行
ls -lh /home/ubuntu/WebstormProjects/TGwebsite/public/
```

### 2. 检查文件权限
```bash
# 应该看到类似这样的权限：
# -rw-rw-r-- 1 ubuntu ubuntu
ls -la /home/ubuntu/WebstormProjects/TGwebsite/public/images/
```

### 3. 检查文件大小
```bash
# 确认文件大小合理
du -sh /home/ubuntu/WebstormProjects/TGwebsite/public/images/blog/*
```

### 4. 测试图片可访问性
```bash
# 启动开发服务器（如果没运行）
npm run dev

# 在浏览器访问：
# http://localhost:3000/logo.png
# http://localhost:3000/images/blog/blog-1.jpg
```

### 5. 清除浏览器缓存
- 按 `Ctrl + Shift + R` (Windows)
- 按 `Cmd + Shift + R` (Mac)

---

## 🚀 推荐工作流程

### 日常开发 - 上传少量文件
**推荐**: 拖拽上传
- 最快速
- 最直观
- 适合 1-10 个文件

### 初次部署 - 上传大量资源
**推荐**:
1. 本地压缩所有资源文件
2. 用拖拽上传压缩包
3. 在 Gateway 终端解压

```bash
# 在 Gateway 终端
cd /home/ubuntu/WebstormProjects/TGwebsite/public/
unzip resources.zip
rm resources.zip  # 删除压缩包
```

### 持续更新 - 频繁修改文件
**推荐**: 启用自动上传
- File → Settings → Deployment
- ✅ Automatic Upload

---

## 💡 最佳实践

### 1. 文件命名规范
```
✅ 好的命名:
- logo.png
- blog-hero-image.jpg
- user-avatar-default.svg

❌ 避免:
- 图片1.jpg (中文文件名)
- My Image.png (空格)
- logo (1).png (括号)
```

### 2. 推荐的图片格式
```
Logo/图标: PNG (支持透明)
照片/博客图: JPG (文件小)
矢量图: SVG (可缩放)
```

### 3. 优化图片大小
```powershell
# 上传前压缩图片
# 使用工具如 TinyPNG, ImageOptim
# 目标: < 200KB per image
```

### 4. 保持项目整洁
```
public/
├─ images/
│  ├─ blog/        # 博客图片
│  ├─ icons/       # 小图标
│  └─ gallery/     # 画廊图片
├─ fonts/          # 自定义字体
└─ documents/      # PDF等文档
```

---

## 🆘 遇到问题？

### 检查清单：
- [ ] Gateway 是否连接到服务器？
- [ ] 目标文件夹是否有写权限？
- [ ] 网络连接是否稳定？
- [ ] 文件路径是否正确？
- [ ] 文件名是否符合规范？

### 诊断命令：
```bash
# 检查 Gateway 连接
echo "Gateway 已连接" && pwd

# 检查目录权限
ls -la /home/ubuntu/WebstormProjects/TGwebsite/public/

# 检查磁盘空间
df -h

# 测试写权限
touch /home/ubuntu/WebstormProjects/TGwebsite/public/test.txt && rm test.txt && echo "✅ 有写权限" || echo "❌ 无写权限"
```

---

## 📞 总结

### 最推荐的方式 ⭐
**JetBrains Gateway 拖拽上传**
- 简单、快速、直观
- 完美集成在开发环境中
- 支持多文件、文件夹

### 立即开始：
1. 打开 Gateway 连接的项目
2. 找到 `public/` 文件夹
3. 从 Windows 拖拽文件到对应位置
4. 完成！

---

**现在您可以轻松上传任何文件到远程服务器了！** 🎉
