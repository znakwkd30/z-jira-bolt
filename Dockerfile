# 서버 빌드
FROM arm64v8/node:18-slim AS builder
WORKDIR /app

# pnpm download
RUN npm install -g pnpm

# npm 모듈 캐싱
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# 코드가 수정된 경우
COPY ./ ./
RUN pnpm install && pnpm build

# 서버 실행
FROM arm64v8/node:18-slim
WORKDIR /app


COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist/ ./dist/
COPY --from=builder /app/node_modules ./node_modules/

CMD ["node", "dist/main"]

