# 🫧 无用星球

一个反焦虑、去爹味的情绪角落。

**不贩卖焦虑。不灌鸡汤。不教做人。**

## 产品理念

大多数互联网产品在告诉你「你要变得更好」，这个产品告诉你「你已经够好了，停下来也没关系」。

在这里：
- 你的平庸被接纳
- 你的放弃被收容
- 你的愿望在星河里慢慢漂

## 功能

| 模块 | 原来名称 | 说明 |
|------|---------|------|
| 🏠 发呆处 | 首页 | 进来发发呆，看看心情语录 |
| ✨ 愿望星河 | — | 写下愿望，变成漂浮的气泡 |
| 🫂 原来不只我 | 撞车报告 | 搜索你的梦想，看看有多少人和你一样 |
| 🧮 做到的人数 | 转化率统计 | 想做 vs 做到的真相 |
| 📦 放弃收容站 | 未完成博物馆 | 收容别人的半途而废，给你一个台阶 |

## 技术栈

- **纯原生 JS + CSS**，零框架，零依赖
- 单页面应用（Hash 路由）
- Canvas 粒子系统（愿望星河文字气泡 + 🫧 logo 破碎动画）
- Canvas 海报生成器（6 套主题配色自动匹配）
- Web Audio API 音效（气泡破裂声）
- 移动端优先设计（max-width: 480px）

## 项目结构

```
emotion-product/
├── index.html          # 入口页面
├── css/
│   ├── reset.css       # 基础重置 + CSS 变量
│   ├── base.css        # 布局、排版、导航栏
│   ├── components.css  # 通用组件（按钮、弹窗等）
│   ├── pages.css       # 各页面独有样式
│   └── animations.css  # 动效定义
├── js/
│   ├── utils.js        # 工具函数
│   ├── store.js        # 全局数据状态 + 假数据（55+23+28 条）
│   ├── router.js       # Hash 路由
│   ├── effects/
│   │   ├── particles.js  # Canvas 文字气泡引擎 + 戳破系统
│   │   └── poster.js     # 6 主题海报生成器
│   └── pages/
│       ├── home.js         # 发呆处（含 🫧 logo 动效）
│       ├── wish-galaxy.js  # 愿望星河
│       ├── crash-report.js # 原来不只我
│       ├── conversion.js   # 做到的人数
│       └── museum.js       # 放弃收容站
├── assets/             # 静态资源（预留）
└── README.md
```

## 部署

单页面应用，纯静态：

```bash
cd emotion-product
python3 -m http.server 8000
# 打开 http://localhost:8000
```

推荐：GitHub Pages / Netlify / Vercel

---

> 「人生有很多可能性，接受平庸是常态。」
