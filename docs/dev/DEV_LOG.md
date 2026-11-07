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
- 터치: 드래그 회전은 몸통 탭과 구분하기 위해 처음엔 `gl.domElement`에 네이티브 pointer 이벤트를 직접 붙였으나, 부위 탭과 몸통 드래그가 서로 간섭하는 버그가 있어서(아래 "수정" 항목) 드래그 시작(`pointerdown`)만 R3F의 오브젝트 이벤트로 바꿈. 계속되는 이동/해제(`pointermove`/`pointerup`)는 드래그가 캔버스 밖으로 나가도 끊기지 않게 여전히 `window`에 붙인다. 관성+원위치 복귀는 매 프레임 `velocity += (-rotation*스프링 - velocity*감쇠)*dt` 한 줄로 구현(별도 라이브러리 없이 임계감쇠 스프링 근사).
- **수정(PO 지시)**: 부위를 탭하면 몸통 스쿼시도 같이 트리거되던 버그를 고쳤다. 원인은 드래그 시작 판정이 R3F 이벤트 체계 밖(캔버스 네이티브 리스너)에 있어서 부위의 `stopPropagation()`이 닿지 못했던 것. `BodyMesh`가 `onPointerDown`을 R3F 이벤트로 직접 받게 바꾸고, `PartMesh`도 `onClick` 대신 `onPointerDown`에서 `stopPropagation()`을 부르게 바꿔서, 레이캐스트 순서상 부위가 몸통보다 앞에 있으면 몸통까지 이벤트가 번지지 않게 했다. 이를 위해 부위 좌표도 몸통 표면(반지름 1)보다 바깥(1.15배)으로 옮겨서 레이캐스트가 부위를 먼저 맞히게 했다(`constants.ts PART_POSITION`). 실제 GLB 모델로 바뀌어도 "부위 메시가 몸통보다 앞서 레이캐스트에 맞아야 하고, 부위의 pointerdown이 stopPropagation을 부른다"는 이 구조만 유지하면 된다.
- **모델 교체 지점**: 몸통 지오메트리를 만드는 부분을 `character3d/bodyModel.ts`의 `useBodyGeometry(template)` 함수 하나로 모았다. VARCO 3D GLB(`public/models/body-<template>.glb` 예정)가 들어오면 이 함수 내부만 `useGLTF`로 바꾸면 되고, `BodyMesh`/`Scene` 등 호출부는 수정할 필요가 없다 — "항상 `THREE.BufferGeometry` 하나를 반환한다"는 계약만 지키면 된다. 부위 5개의 교체 지점은 아직 한 곳으로 모으지 않았음(PartMesh가 지오메트리를 직접 만듦) — 부위가 "따로 만든 5개"로 온다고 하셨으니, 파일이 오면 `PartMesh`도 같은 패턴(`usePartGeometry(partId)` 같은 훅)으로 정리할 계획.
- 성능/접근성: `Canvas`는 `ChallengeDetail`/`DexDetail`에서만, 동시에 최대 1개만 마운트(두 화면을 동시에 볼 수 없으므로). 목록(`Dex.tsx`)과 썸네일은 `StaticThumbnail`(CSS만 쓰는 2D 대체)을 재사용. 실제 지오메트리가 나오면 `Character3D`를 1회 렌더해 `toDataURL`로 캡처하는 방식으로 바꿀 수 있음 — 지금은 임시 도형이라 캡처 파이프라인을 만드는 비용이 아깝다고 판단해 보류함.
- 페이지 라우트를 전부 `React.lazy`로 쪼개서(App.tsx) three.js가 온보딩/홈 등 3D를 쓰지 않는 화면의 첫 로드에 섞여 들어가지 않게 했음. 빌드 결과 `Character3D` 전용 청크(three 포함, ~800KB)가 분리되어 `ChallengeDetail`/`DexDetail` 진입 시에만 로드됨.
- `role="img"` + `aria-label`을 캔버스 래퍼에 붙이고, 부위별 진행률/흔적 텍스트 타일(기존 Phase 1부터 있던 리스트)을 캔버스 아래에 그대로 유지해서 캔버스 없이도 같은 정보를 읽을 수 있게 함. WebGL 미지원이거나 `prefers-reduced-motion: reduce`이면 `StaticThumbnail`로 자동 대체.
- 실제 브라우저에서 드래그/탭 상호작용을 눈으로 확인하지 못했음(이 세션에 브라우저 도구가 없음) — `npm run build`/`tsc`만 통과를 확인함. QA 세션에서 실제 동작 확인 필요.

## PO 승인 사항 반영 + Phase 2(a·b) — D21~D23 확인 후속
- `similarity` 공식을 PO 지시대로 교체: 부위 감점 = (scale−1)×100 + (기울어짐 10) + (물결 15), 닮은 정도 = 100 − 평균 감점(최소 0). `partDeduction` 함수로 분리하고 테스트 추가(`similarity.test.ts`).
- 캐릭터 색 팔레트가 `DESIGN_SYSTEM.md` 1-3(라임/핑크/코랄/하늘/해바라기/라벤더)과 달랐던 걸 발견해서(원래 pink/yellow/mint/blue/purple/orange로 임시로 만들어둠) `BodyColor` 타입과 더미 데이터, `characterColor.ts`를 디자인 시스템 팔레트로 전부 맞춤.
- Tailwind에 DESIGN_SYSTEM 1~5장 토큰(색, 타이포, 간격, 라운드, 그림자)을 그대로 넣음(`tailwind.config.js`). Pretendard Variable은 CDN(`jsdelivr`)에서 로드.
- 데스크톱 포트폴리오 레이아웃: `App.tsx`에서 폰 UI(`PhoneApp`)는 **한 번만 마운트**하고, 데스크톱 폭에서만 CSS로 폰 프레임(테두리+그림자)과 좌측 소개 패널을 둘렀다. 처음에는 모바일용 div와 데스크톱용 div에 각각 `PhoneApp`을 넣어서 반응형 클래스로 하나만 보이게 했었는데, 그러면 둘 다 DOM에 마운트되어 캐릭터 3D 캔버스가 2개 동시에 떠서(S3/S7에서) "캔버스 최대 1~2개" 원칙을 어기는 걸 바로 알아채고 고쳤다.
- `DemoControls`/`CoachPill`/하단 탭/챌린지 상세 하단 CTA를 전부 `fixed`에서 `absolute`로 바꿈. `fixed`는 브라우저 뷰포트 기준이라 데스크톱 폰 프레임 안에서 쓰면 프레임 밖으로 떠버리는 버그였음 — `PhoneApp`의 `relative` 래퍼를 기준점으로 쓰도록 통일.
- 가이드 체험 투어(PRD 8-1)를 구현: `data/tour.ts`(스크립트: 날짜별로 어떤 친구가 인증하는지 고정), `domain/advanceDay.ts`에 `advanceDayWithPresence` 추가(확률 대신 정해진 명단으로 하루를 확정), 스토어에 `tourStep`/`startTour`/`skipTour`/`advanceTourDay` 추가, `CoachPill` 컴포넌트가 단계별 대사·버튼과 5일차 "오늘은 쉬기" 선택, 완성 시 자동 이동을 전부 담당.
- 투어 스크립트는 "서준이 4일차에만 쉬고, 나는 5일차에만 쉰다"로 고정해서 PRD 8-1 표의 "4일차 입이 커짐 / 5일차 내 왼쪽 눈이 커짐" 문구와 흔적 단계(1회 미스=+25%)가 정확히 맞아떨어지게 했다. 2일차 이전에 서준이 추가로 쉬면 4일차 흔적이 2회차(기울어짐)가 되어 문구와 안 맞았을 것.
- 시간이 부족해서 범위를 줄인 부분(PO가 미리 허락한 범위): 사진 업로드/600px 리사이즈는 아직 구현하지 않고 스탬프+메모만 지원함(Phase 2 item5, 다음 라운드로 미룸). 챌린지 만들기(S2) 3스텝 폼은 안내 문구로만 남겨두고(이 데모는 더미 챌린지 체험이 핵심이라 범위 밖으로 판단) 실제 생성 로직은 만들지 않음 — PRD의 "체험 투어"와 "자유 모드 더미 2개"만으로 성공 기준(3분 체험)을 충족할 수 있다고 봄. '데모 초기화' 확인은 커스텀 바텀시트 대신 `window.confirm`으로 간단히 처리함(디자인 시스템 9장 8번 규칙의 취지는 지키되 컴포넌트는 간소화) — PO 확인 필요.

## D25/P0~P2 수정 + D26 캐릭터 부위 전면 교체

- P0(390px 가로 넘침)는 PO가 자체 점검 도구 오차로 확인해줬지만, 넣어둔 안전장치(`overflow-x:hidden`, 폰 프레임을 `lg`(1024px) 전환 + `lg:` 접두사로만 고정폭 적용)는 그대로 유지함 — 재발 방지 비용이 거의 0이라 유지하는 쪽이 안전.
- D26: `PartId`를 `hair|eyeL|eyeR|cheek|mouth` → `earL|earR|eyes|nose|tail`(왼쪽 귀/오른쪽 귀/눈/코·입/꼬리)로 전면 교체. 타입, 도메인 상수(`PART_LABELS`), 더미 데이터(`data/challenges.ts`, `data/tour.ts`), 테스트 6개 파일, 3D 상수(`character3d/constants.ts`)를 전부 같이 바꿈.
- `history.ts`의 흔적 문구를 "다정한 덕분에" 톤으로 다시 쓰고(`{who} 쉬어간 덕분에 {부위}{조사} 25% 커졌어요`), 받침 유무로 "이/가" 조사를 고르는 `subjectJosa` 헬퍼를 추가함(유니코드 코드포인트로 종성 존재 여부 계산) — "왼쪽 귀가"/"눈이"처럼 부위 이름이 바뀌어도 조사가 자동으로 맞게.
- **부위 지오메트리 교체 지점을 하나로 모음**: `character3d/partModel.ts`의 `usePartGeometry(partId, template, wavy)` 하나가 "부위 기준점에서의 로컬 오프셋을 가진 서브 메시 배열"을 반환한다. 눈(공 2개)·코·입(공+곡선 튜브)처럼 부위 하나가 여러 프리미티브로 이뤄진 경우도 이 배열로 표현함. `PartMesh`는 이 배열을 받아 서브메시들을 그리고, 흔적(scale/rotate/흔들림)은 전부 부위 전체를 감싸는 바깥 `<group>`에만 적용해서 "부위 하나 = 여러 메시"와 "흔적은 부위 단위"를 분리함. GLB가 오면 이 함수 내부 switch문의 각 분기만 `useGLTF` 결과로 바꾸면 됨.
- 귀는 콘(`ConeGeometry`), 꼬리는 이코사헤드론(기존 blob 로직 재사용), 코는 구, 입은 곡선 튜브(기존 line-wavy 로직 재사용), 눈은 검정 구 2개(`color: '#111111'`로 부위색 대신 고정색 지정 — `PartSubShape.color`가 있으면 몸통 색을 무시하도록 `PartMesh`에서 처리). 부위 좌표는 여전히 몸통 표면(반지름 1)보다 바깥에 둬서 레이캐스트 우선순위 버그가 재발하지 않게 함(귀 쪽 좌표 크기 ≈1.10, 꼬리는 몸통 뒤쪽 -z로 둠).
- `npm run build`/`npm test` 통과 확인(테스트 32개, 이름만 바뀌었을 뿐 로직은 동일).
