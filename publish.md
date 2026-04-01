# 发布指南

## 构建

```bash
yarn build
```

构建产物在 `dist/` 目录。

## Nginx 配置

Vue Router 使用 History 模式，必须配置 `try_files` 否则 `/lobster` 等路由会 404。

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 路由说明

- `/` - 主页
- `/lobster` - 龙虾介绍页
- `/secret/crustacean` - 龙虾页别名

所有路由代码打包在 `dist/assets/index-*.js` 中，不会生成单独 HTML 文件。
