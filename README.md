<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# YanjiJob0131 - 연길 알바천국

연길 지역의 알바 및 파트타임 일자리 정보를 제공하는 웹 애플리케이션입니다.

## 🌐 URLs

- **Production**: https://huan.my (Main Domain)
- **Latest Deployment**: https://48da9e0f.yanjijob0131.pages.dev
- **GitHub**: https://github.com/langsb16-collab/YanjiJob0131

## ✨ 주요 기능

- 연길 지역 9가지 카테고리 정보 검색 및 조회 (구인/구직/알바/비즈니스/홍보/부동산/사진자랑/중고거래/동업&제휴)
- **관리자 페이지**: 아이디/비번 없이 ⚙️ 버튼으로 즉시 접속 가능
- 게시글/댓글 CRUD 관리, 파트너십 승인/거절, 블랙리스트 관리
- Google Gemini AI 기반 채팅 인터페이스
- Pretendard 폰트 + Lucide 아이콘 + 크몽 스타일 UI
- 반응형 디자인으로 모바일/데스크톱 지원

## 🛠 기술 스택

- **Frontend**: React 19 + TypeScript + Vite
- **UI**: Pretendard 폰트 + Lucide 아이콘 + 크몽 스타일 컬러
- **AI Integration**: Google Gemini API
- **Storage**: LocalStorage 기반 데이터 관리
- **Deployment**: Cloudflare Pages
- **Version Control**: Git + GitHub

## 📦 로컬 실행

**Prerequisites:**  Node.js 18+

1. 저장소 클론:
   ```bash
   git clone https://github.com/langsb16-collab/YanjiJob0131.git
   cd YanjiJob0131
   ```

2. 의존성 설치:
   ```bash
   npm install
   ```

3. 환경 변수 설정:
   `.env.local` 파일을 생성하고 `GEMINI_API_KEY`를 설정합니다:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. 개발 서버 실행:
   ```bash
   npm run dev
   ```

5. 브라우저에서 `http://localhost:3000` 접속

## 🚀 배포

Cloudflare Pages에 자동 배포됩니다:

```bash
# 프로젝트 빌드
npm run build

# Cloudflare Pages에 배포
npx wrangler pages deploy dist --project-name yanjijob0131
```

## 📝 배포 상태

- **플랫폼**: Cloudflare Pages
- **상태**: ✅ Active
- **메인 도메인**: https://huan.my
- **프로젝트 이름**: yanjijob0131
- **마지막 업데이트**: 2026-01-31

## 🔑 관리자 페이지 접속 방법

**관리자 페이지 URL**: https://huan.my/admin

- 아이디/비밀번호 없이 즉시 접속 가능
- 등록된 게시글 27개 확인 가능
- 게시글 삭제 및 블랙리스트 관리 기능
- 전체 통계: 게시글 수, 프리미엄 수, 승인 대기 수

## 📄 라이선스

이 프로젝트는 개인 프로젝트입니다.
