# 安装Node.js
FROM node:latest

# 创建工作目录
WORKDIR /app

# 将node_modules添加到工作目录
COPY . .
RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev"]