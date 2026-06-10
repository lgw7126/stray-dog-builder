# 🐾 유기견 홍보 빌더

강아지 사진을 업로드하면 **Claude AI**가 홍보 포스터, SNS 카드뉴스, 입양 신청 페이지를 자동 생성해주는 웹앱

## 👉 [https://stray-dog-builder-z4nw.vercel.app](https://stray-dog-builder-z4nw.vercel.app)

<video src="https://github.com/user-attachments/assets/a636d81d-6e62-4fb7-b494-387d63cbc0bf" width="600" controls></video>

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flgw7126%2Fstray-dog-builder%2Ftree%2Fclaude%2Frescue-dog-promo-builder-gvhqF&env=ANTHROPIC_API_KEY&envDescription=Anthropic+API+키+%28console.anthropic.com%EC%97%90%EC%84%9C+%EB%B0%9C%EA%B8%89%29&project-name=stray-dog-builder&repository-name=stray-dog-builder-fork)

---

## 🚀 1분 배포 (Vercel)

> **위의 Deploy 버튼을 누르면 앱이 바로 실행됩니다:**

1. **Deploy with Vercel** 버튼 클릭
2. GitHub 로그인 후 → **Create** 클릭
3. `ANTHROPIC_API_KEY` 입력란에 API 키 붙여넣기  
   👉 키 발급: [console.anthropic.com](https://console.anthropic.com)
4. **Deploy** 클릭 → 1~2분 후 `https://your-app.vercel.app` 주소로 접속 가능

---

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| 📸 사진 업로드 | 드래그앤드롭 또는 클릭으로 강아지 사진 업로드 |
| 🤖 AI 분석 | Claude Vision으로 견종·나이·성격 자동 분석 |
| 📋 홍보 포스터 | 감동적인 스토리와 어필 포인트 자동 생성 |
| 📱 SNS 카드뉴스 | 공유하기 좋은 카드 5장 자동 생성 |
| 📄 입양 신청 페이지 | 조건·절차·연락처 포함 입양 안내 페이지 |
| 📋 원클릭 복사 | 생성된 텍스트 바로 복사 |

---

## 🛠️ 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI | Claude claude-opus-4-8 (Vision) via `@anthropic-ai/sdk` |

---

## 💻 로컬 개발

```bash
# 1. 저장소 클론
git clone https://github.com/lgw7126/stray-dog-builder.git
cd stray-dog-builder
git checkout claude/rescue-dog-promo-builder-gvhqF

# 2. 패키지 설치
npm install

# 3. 환경변수 설정
cp .env.example .env.local
# .env.local 파일에 ANTHROPIC_API_KEY 입력

# 4. 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

---

## 🔑 환경변수

| 변수 | 설명 | 필수 |
|------|------|------|
| `ANTHROPIC_API_KEY` | Anthropic API 키 ([발급](https://console.anthropic.com)) | ✅ |

---

## 📁 폴더 구조

```
stray-dog-builder/
├── app/
│   ├── api/generate/route.ts  # Anthropic API 호출
│   ├── layout.tsx
│   ├── page.tsx               # 메인 UI
│   └── globals.css
├── lib/
│   └── types.ts               # TypeScript 타입
└── .env.example
```

---

> 이 프로젝트는 유기견 입양을 돕기 위해 만들어졌습니다. 🐾
