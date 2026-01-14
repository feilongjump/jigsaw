# 使用 Bun 作为构建工具
FROM oven/bun:latest AS builder

WORKDIR /opt/app

# 1. 优化：利用 Docker 缓存层
# 先复制依赖描述文件，安装依赖。如果依赖没变，这一层会被缓存，加快构建速度。
COPY package.json bun.lock ./

# bunjs 国内代理
RUN echo '[install]' > ~/.bunfig.toml
RUN echo 'registry="https://registry.npmmirror.com/"' >> ~/.bunfig.toml

RUN bun install

# 2. 复制源代码
COPY . .

RUN bun run build

# 使用 Nginx Alpine 作为静态文件服务器 (体积更小)
FROM nginx:alpine

# 移除 Nginx 默认的网页内容
RUN rm -rf /usr/share/nginx/html/*

# 复制构建产物
COPY --from=builder /opt/app/dist/ /usr/share/nginx/html/

# 4. 优化：复制自定义 Nginx 配置
# 这对于 React Router 单页应用(SPA)是必须的，否则刷新非首页路径会 404
COPY dockerfiles/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
