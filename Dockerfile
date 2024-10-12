# # 1. 빌드 스테이지
# FROM node:20-alpine AS builder

# WORKDIR /app

# # package.json과 package-lock.json 복사
# COPY package*.json ./

# # npm install 실행
# RUN npm install

# # 소스 코드 복사
# COPY . .

# # Next.js 애플리케이션 빌드
# RUN npm run build

# # 2. 실행 스테이지
# FROM node:20-alpine AS runner

# WORKDIR /app

# # 빌드된 파일 복사
# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/.next/static ./.next/static
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/package.json ./package.json

# # 포트 설정
# EXPOSE 3000

# # 애플리케이션 실행
# CMD ["npm", "start"]


# 1. Node.js 16 버전의 베이스 이미지 사용 (권장)
FROM node:20

# 2. 작업 디렉터리 생성
WORKDIR /app

# 3. package.json과 package-lock.json 복사
COPY package*.json ./

# 4. 의존성 설치
RUN npm install

# 5. 앱 소스 코드 복사
COPY . .

# 6. Next.js 빌드
RUN npm run build

# 7. 포트 설정
EXPOSE 3000

# 8. Next.js 서버 실행
CMD ["npm", "start"]

