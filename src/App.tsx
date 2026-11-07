import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import DemoControls from './components/DemoControls'
import CoachPill from './components/CoachPill'

const Onboarding = lazy(() => import('./pages/Onboarding'))
const Home = lazy(() => import('./pages/Home'))
const ChallengeCreate = lazy(() => import('./pages/ChallengeCreate'))
const ChallengeDetail = lazy(() => import('./pages/ChallengeDetail'))
const CheckIn = lazy(() => import('./pages/CheckIn'))
const Completion = lazy(() => import('./pages/Completion'))
const Dex = lazy(() => import('./pages/Dex'))
const DexDetail = lazy(() => import('./pages/DexDetail'))
const GoodsCreate = lazy(() => import('./pages/GoodsCreate'))

function PhoneApp() {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-canvas lg:mx-auto lg:max-w-[480px]">
      <div className="relative flex-1 overflow-hidden">
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Navigate to="/onboarding" replace />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/home" element={<Home />} />
            <Route path="/challenge/new" element={<ChallengeCreate />} />
            <Route path="/challenge/:id" element={<ChallengeDetail />} />
            <Route path="/challenge/:id/checkin" element={<CheckIn />} />
            <Route path="/completion/:id" element={<Completion />} />
            <Route path="/dex" element={<Dex />} />
            <Route path="/dex/:id" element={<DexDetail />} />
            <Route path="/goods/:id" element={<GoodsCreate />} />
          </Routes>
        </Suspense>
        <CoachPill />
        <DemoControls />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-canvas lg:gap-12 lg:bg-[#EDEBE8] lg:px-8">
      {/* 데스크톱 포트폴리오 레이아웃: 왼쪽 소개 (PRD 8). 1024px(lg) 미만에서는 프레임 없이 100% 폭. PhoneApp은 한 번만 마운트하고 폰 프레임은 CSS로만 둘렀다 */}
      <div className="hidden max-w-md lg:block">
        <p className="text-wordmark text-ink">moa</p>
        <h1 className="mt-4 text-display text-ink">
          친구들과 목표 캐릭터를 나눠 맡아
          <br />
          함께 완성하는 챌린지
        </h1>
        <p className="mt-4 text-body text-ink-2">
          혼자서는 작심삼일이라 포기하던 도전을, 크루가 부위를 나눠 맡아 함께 그려 나가요. 빠진
          날은 흔적으로 남고, 전원이 함께한 날은 반짝임으로 남아요. 오른쪽 화면에서 3분 안에
          전체 흐름을 체험해보세요.
        </p>
      </div>

      <div className="h-screen w-full max-w-full overflow-hidden bg-canvas lg:my-10 lg:h-[780px] lg:w-[390px] lg:shrink-0 lg:rounded-[40px] lg:border-8 lg:border-ink lg:shadow-level2">
        <PhoneApp />
      </div>
    </div>
  )
}
