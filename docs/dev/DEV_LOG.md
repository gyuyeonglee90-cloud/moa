# 개발 판단 기록

- `create-vite` CLI가 비대화형 쉘에서 디렉터리 비어있지 않음 확인 프롬프트 때문에 계속 취소됨 → 템플릿 파일을 직접 작성해서 대체함.
- `tsc -b`(project reference 빌드)는 추가 tsconfig 분리가 필요해 범위상 과함 → 단일 `tsconfig.json` + `tsc --noEmit` 방식의 `tsc`로 간소화.
- 크루 콤보를 "현재 콤보"(도메인: `calcCurrentCrewCombo`, 오늘까지 끊기지 않은 연속 일수)와 "최고 콤보"(`calcBestCrewCombo`, 전체 기간 중 최장 연속)로 분리함. PRD 5-3은 현재 콤보, 5-4 졸업 카드의 "최고 크루 콤보"는 최고 콤보를 가리켜서 둘 다 필요.
- `advanceDay()`는 순수 함수로 구현하고 `randomFn` 인자를 주입 가능하게 해서 Vitest에서 결정론적으로 테스트함. 스토어(`useAppStore.advanceDay`)는 이 순수 함수를 호출만 하는 얇은 래퍼.
- 데모 컨트롤의 '다음 날로'는 현재 ongoing 챌린지 중 첫 번째(배열 순서상 챌린지 B가 졸업 임박)를 대상으로 동작하도록 Phase 1에서는 단순화함. 여러 챌린지를 동시에 진행 중인 화면에서 어떤 챌린지를 대상으로 할지는 Phase 2에서 "상세 화면에 들어가 있을 때는 그 챌린지" 식으로 보완 필요 — PO 확인 필요.
- 더미 졸업 챌린지 3개의 `graduationResult`는 손으로 계산하지 않고 실제 도메인 함수(`calcProgress`, `calcGrowthStage`, `calcBestCrewCombo`, `calcPerfectAttendanceUserId`)를 더미 데이터 생성 시점에 그대로 호출해서 만듦 → 로직과 더미 데이터 불일치 위험 제거.
- GitHub Pages 활성화를 `gh api`로 수행하려다 "공개 저장소 생성"이 자동 모드에서 차단되어 대표에게 확인받고 진행함(PRD/DECISIONS에 이미 결정된 사항이라 승인받음).

## v2(D16~D20) 컨셉 변경 반영
- 성장 단계(0~3)/기분/크루 콤보/개근상/파츠 고르기 로직을 전부 삭제하고 새 도메인으로 교체: `partProgress`(부위별 진행), `bodyFill`(몸통 차오름), `traces`/`traceFromMissedCount`(흔적), `goodTraces`(좋은 흔적), `history`(다정한 문구 타임라인), `similarity`(목표와 닮은 정도), `goods`(굿즈 종류/가격 배분/가상 주문).
- 흔적 규칙 "3회 이상부터 1회마다 +10%"는 PRD 표현이 모호해서 "3회째부터 매 회마다 +10%, 최대 2배"로 해석해 구현함(`traceFromMissedCount`). 예: 3회→1.35, 4회→1.45 ... 최대 2.0. PO 확인 필요.
- `similarity`는 5개 부위의 `scale` 편차(1~2를 0~1로 정규화)의 평균으로만 계산하고 rotate/wavy는 반영하지 않음(scale이 미인증 누적에 따라 단조 증가하므로 심각도 대표값으로 충분하다고 판단). 다른 가중치를 원하면 PO 확인 필요.
- `history()`는 순수성을 유지하려고 `users` 배열을 인자로 받음(닉네임 치환용). 도메인이 `data/users`를 직접 import하지 않도록 유지.
- `partProgress`/`traces`는 "지금까지(1~currentDay)" 기준으로 계산함 — 오늘(currentDay)도 아직 인증 전이면 미인증으로 집계됨. `advanceDay()`가 오늘 치 친구 인증을 먼저 채우고 다음 날로 넘어가는 구조라 이 시점 정의가 일관됨.
- 더미 데이터(`data/challenges.ts`)의 완성된 챌린지 3개는 `similarity`/`goodTraces`/`traces`/`history`를 더미 데이터 생성 시점에 실제 도메인 함수로 호출해서 만듦(손계산 금지, v1과 동일한 원칙).
- 화면: `Graduation.tsx` → `Completion.tsx`(완성식)로 이름 변경, 라우트 `/graduation/:id` → `/completion/:id`. 도감/상세에 "굿즈로 만들기" 진입점과 `GoodsCreate.tsx`(S8) 추가.
- 가이드 체험 투어(PRD 8-1)는 이번 재작업 범위에서 제외함(스크립트 데이터 `TOUR_USERS`만 `data/users.ts`에 선반영). 투어 진행 상태(`tourStep`)와 코치 알약 UI는 디자인 v3 SVG가 나온 뒤 Phase 2에서 붙일 예정 — PO 확인 필요.
