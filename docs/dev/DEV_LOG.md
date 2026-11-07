# 개발 판단 기록

- `create-vite` CLI가 비대화형 쉘에서 디렉터리 비어있지 않음 확인 프롬프트 때문에 계속 취소됨 → 템플릿 파일을 직접 작성해서 대체함.
- `tsc -b`(project reference 빌드)는 추가 tsconfig 분리가 필요해 범위상 과함 → 단일 `tsconfig.json` + `tsc --noEmit` 방식의 `tsc`로 간소화.
- 크루 콤보를 "현재 콤보"(도메인: `calcCurrentCrewCombo`, 오늘까지 끊기지 않은 연속 일수)와 "최고 콤보"(`calcBestCrewCombo`, 전체 기간 중 최장 연속)로 분리함. PRD 5-3은 현재 콤보, 5-4 졸업 카드의 "최고 크루 콤보"는 최고 콤보를 가리켜서 둘 다 필요.
- `advanceDay()`는 순수 함수로 구현하고 `randomFn` 인자를 주입 가능하게 해서 Vitest에서 결정론적으로 테스트함. 스토어(`useAppStore.advanceDay`)는 이 순수 함수를 호출만 하는 얇은 래퍼.
- 데모 컨트롤의 '다음 날로'는 현재 ongoing 챌린지 중 첫 번째(배열 순서상 챌린지 B가 졸업 임박)를 대상으로 동작하도록 Phase 1에서는 단순화함. 여러 챌린지를 동시에 진행 중인 화면에서 어떤 챌린지를 대상으로 할지는 Phase 2에서 "상세 화면에 들어가 있을 때는 그 챌린지" 식으로 보완 필요 — PO 확인 필요.
- 더미 졸업 챌린지 3개의 `graduationResult`는 손으로 계산하지 않고 실제 도메인 함수(`calcProgress`, `calcGrowthStage`, `calcBestCrewCombo`, `calcPerfectAttendanceUserId`)를 더미 데이터 생성 시점에 그대로 호출해서 만듦 → 로직과 더미 데이터 불일치 위험 제거.
- GitHub Pages 활성화를 `gh api`로 수행하려다 "공개 저장소 생성"이 자동 모드에서 차단되어 대표에게 확인받고 진행함(PRD/DECISIONS에 이미 결정된 사항이라 승인받음).
