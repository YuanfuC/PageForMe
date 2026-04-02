// API Base URL 配置
// 开发模式: VITE_DEBUG=true → 使用 localhost:8080
// 生产模式: VITE_DEBUG=false → 使用 /api (Nginx 反向代理)
export const API_BASE: string = import.meta.env.VITE_DEBUG === 'true'
  ? 'http://localhost:8080/api'
  : '/api'
