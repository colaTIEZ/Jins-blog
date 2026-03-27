# Coze AI Agent 集成
---
title: Coze AI Agent 集成
publishDate: 2026-03-27 17:00:00
description: '本文档说明如何在你的 Astro 博客中集成 Coze AI Agent，实现点击按钮打开聊天窗口的功能。'
tags:
  - Markdown
heroImage: { src: './thumbnail.jpg', color: '#5a0c9b' }
language: '中文'
---


## 📋 前置要求

- Coze 平台账户（https://www.coze.cn）
- 已创建的 Bot/Agent
- Coze API Token (PAT)
- Cloudflare Workers (用来代理 API)

---

## 🚀 快速开始

### 1. 获取凭证 (Credentials)

1. 登录 [Coze 开发者平台](https://www.coze.cn/open)
2. 进入你的 Bot 管理页面
3. 复制 **Bot ID** 
4. 目前新版Agent为product ID，无法快捷绑定知识库，似乎也无法自定义聊天UI！！！
5. 同时获取 API Token (PAT)

### 2. 配置环境变量

在项目根目录的 `.env` 文件中添加：

```env
# Coze Bot 配置
PUBLIC_COZE_PROJECT_ID=your_project_id_here

# Coze API Token 
COZE_PAT=your_coze_pat_token_here

# 你的博客域名（可选，用于防盗刷）
MY_BLOG_DOMAIN=yourdomain.com
```

```vars
# Cloudflare Pages Functions 模拟wrangler开发环境变量模板
# 复制本文件为 .dev/.vars，并填入真实密钥

# 获取地址：https://www.coze.cn/open/oauth/pats
COZE_PAT=your_coze_pat_here

# 【选填】允许访问 /api/coze/token 的域名白名单
# 本地开发可留空
MY_BLOG_DOMAIN=
```

[更严格的鉴权方式](https://www.coze.cn/open/docs/developer_guides/authentication)

### 3. Cloudflare Workers 配置

项目已在 `functions/api/coze/aiGenerate.js` 中配置了 API 代理，这样可以：
- 在服务端安全地保存 API Token
- 防止浏览器暴露敏感信息
- 支持流式响应

在 Cloudflare 仪表板中设置以下环境变量：
- `COZE_PAT`: 你的 Coze API Token
- `MY_BLOG_DOMAIN`: 你的博客域名（用于 CORS 检查）

### 4. 完成！

CozeChat 组件已在 `BaseLayout.astro` 中自动加载，所有页面都会显示聊天按钮。

---

## 📚 相关资源

- [Coze 官方文档](https://www.coze.cn/open/docs)
- [Coze WebSDK 文档](https://www.coze.cn/open/docs/developer_guides/vibe_coding_websdk)
- [Astro 官方文档](https://docs.astro.build)
- [Cloudflare Workers 文档](https://workers.cloudflare.com)

---

## 💡 建议和反馈

如果你有任何建议或遇到问题，欢迎：
- 提交 Issue
- 发起 Pull Request
- 联系开发者

---

## 📄 许可

本集成遵循 MIT License。详见 LICENSE 文件。
