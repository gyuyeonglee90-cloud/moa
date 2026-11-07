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

## 3D 캐릭터(D21~D23) 반영
- React 18을 유지하기로 했기 때문(D4) `@react-three/fiber`를 최신 v9(React19 요구)가 아니라 React18과 맞는 `@react-three/fiber@8` + `@react-three/drei@9` + `three@0.169`로 고정 설치함.
- `Character3D` 컴포넌트는 몸통(구, 클리핑 평면으로 bodyFill만큼 색이 차오름) + 부위 5개(선 부위 hair/mouth는 TubeGeometry, 면 부위 eyeL/eyeR/cheek는 Icosahedron)를 각각 독립 메시로 조립함. 생김새가 확정 전이라 전부 임시 도형이고, 실제 레퍼런스가 오면 지오메트리/머티리얼만 교체하면 되도록 `template`별 스케일만 다르게 둠(round/soft/chubby).
- `progress`는 고스트(와이어프레임, opacity 역비례) + 솔리드(opacity 비례) 두 메시를 겹쳐서 표현. `wavy`는 선 부위는 곡선을 사인파로, 면 부위는 버텍스를 시드 기반으로 변형해서 표현(머티리얼 교체 없이 지오메트리만 바뀜).
- 터치: 드래그 회전은 `gl.domElement`에 네이티브 pointer 이벤트를 직접 붙여서 구현(React Three Fiber의 오브젝트별 포인터 이벤트는 캔버스 밖으로 드래그가 나가면 끊기기 때문). 관성+원위치 복귀는 매 프레임 `velocity += (-rotation*스프링 - velocity*감쇠)*dt` 한 줄로 구현(별도 라이브러리 없이 임계감쇠 스프링 근사).
- 알려진 한계(PO 확인 필요): 부위를 탭하면 그 부위의 `onClick`(R3F 합성 이벤트, `click`에서 발생)과 몸통의 네이티브 `pointerup` 드래그-판정이 이벤트 발생 순서상 서로를 모를 수 있어, 부위를 탭해도 몸통 스쿼시가 같이 트리거될 수 있음. 지오메트리가 임시 도형인 지금 단계에서는 시각적으로 크게 어색하지 않아 우선순위를 낮췄고, 실제 모델 교체 시점에 `pointerdown`에서 레이캐스트로 부위 히트 여부를 먼저 판정하는 방식으로 정리할 계획.
- 성능/접근성: `Canvas`는 `ChallengeDetail`/`DexDetail`에서만, 동시에 최대 1개만 마운트(두 화면을 동시에 볼 수 없으므로). 목록(`Dex.tsx`)과 썸네일은 `StaticThumbnail`(CSS만 쓰는 2D 대체)을 재사용. 실제 지오메트리가 나오면 `Character3D`를 1회 렌더해 `toDataURL`로 캡처하는 방식으로 바꿀 수 있음 — 지금은 임시 도형이라 캡처 파이프라인을 만드는 비용이 아깝다고 판단해 보류함.
- 페이지 라우트를 전부 `React.lazy`로 쪼개서(App.tsx) three.js가 온보딩/홈 등 3D를 쓰지 않는 화면의 첫 로드에 섞여 들어가지 않게 했음. 빌드 결과 `Character3D` 전용 청크(three 포함, ~800KB)가 분리되어 `ChallengeDetail`/`DexDetail` 진입 시에만 로드됨.
- `role="img"` + `aria-label`을 캔버스 래퍼에 붙이고, 부위별 진행률/흔적 텍스트 타일(기존 Phase 1부터 있던 리스트)을 캔버스 아래에 그대로 유지해서 캔버스 없이도 같은 정보를 읽을 수 있게 함. WebGL 미지원이거나 `prefers-reduced-motion: reduce`이면 `StaticThumbnail`로 자동 대체.
- 실제 브라우저에서 드래그/탭 상호작용을 눈으로 확인하지 못했음(이 세션에 브라우저 도구가 없음) — `npm run build`/`tsc`만 통과를 확인함. QA 세션에서 실제 동작 확인 필요.
