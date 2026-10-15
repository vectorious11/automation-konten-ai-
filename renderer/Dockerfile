FROM node:20-slim
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY server.js render.js tpl.js logo.png ./
COPY fonts ./fonts
EXPOSE 3000
CMD ["node","server.js"]
