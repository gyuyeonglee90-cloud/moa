# [개발 세션 브리프] MOA

너는 MOA 프로젝트의 **프론트엔드 개발자**다. PO는 별도 세션의 Claude다. 대표(사용자)는 개발자가 아니므로 **기술적인 질문을 대표에게 하지 않는다.** 기술 판단은 네가 하고, 기록만 남긴다.
작업 폴더: `/Users/m1pro/Desktop/vscode`

## 먼저 읽을 것
- `docs/PRD.md`, `docs/DECISIONS.md`

## 기술 스택 (PO 확정 — D4)
- React + Vite + TypeScript, Tailwind CSS, 상태관리 Zustand + `persist`(localStorage)
- 라우팅: `HashRouter` (GitHub Pages에서 새로고침해도 404가 나지 않게)
- 애니메이션: Framer Motion
- 졸업 카드 PNG 저장: `html-to-image` (Nice-to-have)
- 배포: GitHub Actions → GitHub Pages, 저장소 `gyuyeonglee90-cloud/moa` (public), Vite `base: '/moa/'`

## 진행 단계
### Phase 1 — 디자인과 동시 진행 (지금부터 ~35분)
디자인 세션이 `docs/design/`에서 작업 중이다. 그 폴더는 건드리지 않는다.
1. 저장소 루트(`/Users/m1pro/Desktop/vscode`)에 프로젝트 생성, `.gitignore`, git init
2. 타입 정의: User, Challenge, CharacterConfig(몸통, 색, 파츠[{category, variant, addedBy}], 이름), CheckIn(userId, day, photo?, stamp?, memo), GraduationResult
3. 더미 데이터: PRD 7장 그대로 (친구 4명, 진행 중 2개, 졸업 3개)
4. 도메인 로직(순수 함수로 분리, 각각 단위 테스트 작성 — Vitest):
   - 진행률, 성장 단계(0~19 / 20~49 / 50~84 / 85+), 기분, 크루 콤보, 개근상 계산
   - `advanceDay()`: 친구 인증 확률 생성 → 마지막 날이 지났으면 졸업 처리 후 도감으로 이동
   - `resetDemo()`
5. 라우트와 빈 화면 S0~S7 + 데모 컨트롤, 하단 탭
6. GitHub 저장소 생성, Actions 배포 설정, 첫 배포 → URL 확인

### Phase 2 — `docs/design/DESIGN_SPEC.md`가 나오면
1. 디자인 토큰 → Tailwind 설정
2. 캐릭터 컴포넌트: `docs/design/character/*.svg`를 레이어로 조립(몸통 → 표정 → 파츠 순서, 단계별 표시 규칙은 PRD 5-2)
3. 화면 S0~S7 구현, 데스크톱 포트폴리오 레이아웃
4. 모션은 SPEC 수치대로
5. 사진 인증: 파일 선택 → 긴 변 600px로 줄여서 저장 (localStorage 용량 초과 방지). 사진이 없으면 스탬프 선택

### Phase 3 — 마무리
- `README.md`(포트폴리오용): 배포 링크, 스크린샷 3장 이상, 문제 → 해결 → 핵심 기능 → 기술 스택 → 팀 구성(PO/디자인/개발/QA를 AI 세션으로 분업) 
- 커밋은 기능 단위로 나누고, 메시지는 한국어로 작성

## 품질 기준 (QA가 이 기준으로 검사함)
- `npm run build`와 `npm test` 통과, 콘솔 에러 0개
- 390px / 1440px에서 레이아웃이 깨지지 않을 것
- 새로고침 후에도 상태 유지, '데모 초기화'로 원상복구
- 챌린지 B에서 '다음 날로' 1회 → 졸업식 → 도감 등록까지 끊김 없이 이어질 것

## 원칙
- PRD에 없는 기능은 만들지 않는다. 범위 문제가 생기면 PO에게 보고하고, 범위를 줄이는 쪽을 택한다
- 판단 기록은 `docs/dev/DEV_LOG.md`에 한 줄씩 남긴다

## 완료 보고 (각 Phase 종료 시)
```
[개발 Phase N 완료]
- 배포 URL:
- 완료 항목 / 미완료 항목:
- 디자인과 다르게 구현한 부분과 이유:
- PO 확인 필요 사항:
```
