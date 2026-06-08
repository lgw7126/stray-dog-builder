import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "유기견 홍보 빌더 | AI 자동 생성",
  description: "강아지 사진을 업로드하면 AI가 홍보 포스터, SNS 카드뉴스, 입양 신청 페이지를 자동으로 만들어드립니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-amber-50 min-h-screen">{children}</body>
    </html>
  );
}
