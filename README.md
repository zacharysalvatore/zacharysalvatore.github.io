# 🌿 Zach_Gao 的个人博客 & 工具站

> 拥抱 AI，热爱开源和技术分享。

基于 Vue 3 + Vite + TypeScript 构建的个人站点，集 **博客**、**在线开发工具箱**、**GitHub 数据展示** 与 **成就彩蛋系统** 于一体，支持 PWA 离线访问、多主题、国际化与 SEO 预渲染优化。

## 🌐 在线访问

- **主站：** [https://zacharysalvatore.github.io](https://zacharysalvatore.github.io)

## ✨ 功能特性

- **📝 博客系统**：在 `content/` 目录下编写 Markdown 文章，构建时自动渲染（`markdown-it` + `highlight.js`），支持 TOC 目录、阅读时间估算、全站搜索（`fuse.js`）与多路由预渲染 SEO。
- **🧰 在线工具箱**：内置 21 个纯前端开发工具（JSON 格式化、Base64、MD5/SHA、正则测试、代码差异对比、SQL 格式化、颜色/时间戳/Cron 工具、Token 用量图等），全部在浏览器本地运行。
- **🐙 GitHub 数据展示**：展示项目列表、仓库提交记录与发行版本。
- **🎮 个性化体验**：多套像素风主题（明暗自适应）、中英双语切换、成就系统、Konami Code 彩蛋、PWA 离线安装。

## 🚀 本地开发与部署

```bash
# 安装依赖
npm install

# 本地开发预览
npm run dev

# 类型检查
npm run typecheck

# 生产构建（自动生成文章索引、预渲染静态页与 sitemap.xml）
npm run build
```

推送代码到 `master` 分支后，GitHub Actions（`.github/workflows/deploy.yml`）会自动构建并部署到 GitHub Pages。

## ✍️ 撰写新文章

在 `content/` 目录下新建 `.md` 文件（如 `2026-11-24-my-post.md`），顶部添加 Frontmatter：

```markdown
---
title: 文章标题
date: 2026-11-24
tags:
  - AI
  - 开源
description: 一句话简介
---
```

## 🔧 可选配置

- **Gitalk 评论**：在 GitHub 创建 OAuth App 后，将 `VITE_GITALK_CLIENT_ID` 和 `VITE_GITALK_CLIENT_SECRET` 填入 `.env`（本地）以及仓库的 GitHub Actions Secrets（`GITALK_CLIENT_ID` / `GITALK_CLIENT_SECRET`）。
- **自定义域名**：如需绑定自定义域名，在仓库根目录添加 `CNAME` 文件，并同步更新 `.env` 与 GitHub Actions Variables 中的 `SITE_URL`。
- **关于页与项目页**：分别在 `src/views/AboutView.vue`、`src/data/projects.ts` 和 `src/data/releases.ts` 中维护个人技能、时间线、项目与发行仓库列表。
