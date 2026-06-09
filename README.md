# 🐾 Stray Dog Builder

> AI를 활용한 유기견 홍보 콘텐츠 자동 생성 웹앱

---

## 📌 프로젝트 소개

유기견 입양을 돕기 위한 홍보 콘텐츠를 **Claude AI**가 자동으로 생성해주는 웹 애플리케이션입니다.  
보호소나 봉사자가 손쉽게 유기견 소개 글, 홍보 문구 등을 만들 수 있습니다.

---

## 🛠️ 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 14 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI | Anthropic Claude API (`@anthropic-ai/sdk`) |
| Runtime | React 18 |

---

## 🚀 실행 방법

### 1. 패키지 설치
```bash
npm install
```

### 2. 환경변수 설정
```bash
cp .env.example .env.local
```
`.env.local` 파일에 Anthropic API 키 입력:
```
ANTHROPIC_API_KEY=your_api_key_here
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

---

## 📁 폴더 구조

```
stray-dog-builder/
├── app/          # Next.js 페이지 및 라우팅
├── lib/          # 유틸리티 및 AI 연동 로직
├── .env.example  # 환경변수 예시
└── ...
```

---

## ✨ 주요 기능

- 🤖 Claude AI 기반 유기견 홍보 문구 자동 생성
- 📝 입양 공고문 초안 작성 보조
- 🎨 Tailwind CSS 기반 반응형 UI

---

## 👤 개발자

**lgw7126** — [GitHub](https://github.com/lgw7126)

---

> 이 프로젝트는 Claude (Anthropic)의 도움으로 제작되었습니다.
