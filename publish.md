# 发布指南

## 发布

构建产物在 `dist/` 目录：

- `dist/index.html` - 主页
- `dist/lobster.html` - 龙虾介绍页

## 部署

两个都是静态 HTML 文件，直接用 nginx serve `dist/` 目录。

### Nginx 配置

yuanfu.cloud 和 www.yuanfu.cloud 都指向同一个 dist 目录：

```nginx
server {
    listen 80;
    server_name yuanfu.cloud www.yuanfu.cloud;
    root /path/to/dist;
    index index.html;
}
```

### 文件结构

```
dist/
├── index.html      # 主页 - yuanfu.cloud/ 或 yuanfu.cloud/index.html
├── lobster.html     # 龙虾页 - yuanfu.cloud/lobster.html
└── assets/          # 静态资源
```

## 页面说明

| 页面 | 访问地址 |
|------|----------|
| 主页 | https://yuanfu.cloud/ |
| 龙虾页 | https://yuanfu.cloud/lobster.html |
