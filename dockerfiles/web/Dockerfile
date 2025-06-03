# 使用 Bun 作为构建工具
FROM oven/bun:latest AS builder

WORKDIR /opt/app

COPY . .

# bunjs 国内代理
RUN echo '[install]' > ~/.bunfig.toml
RUN echo 'registry="https://registry.npmmirror.com/"' >> ~/.bunfig.toml

RUN bun install

RUN bun run build

# 使用 Nginx 作为静态文件服务器
FROM nginx:latest

# 移除 Nginx 默认的网页内容
RUN rm -rf /usr/share/nginx/html/*

# 将上一阶段构建好的项目静态文件复制到 Nginx 的默认网页目录下
COPY --from=builder /opt/app/dist/ /usr/share/nginx/html/
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]