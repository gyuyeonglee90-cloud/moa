import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import DemoControls from './components/DemoControls'

const Onboarding = lazy(() => import('./pages/Onboarding'))
const Home = lazy(() => import('./pages/Home'))
const ChallengeCreate = lazy(() => import('./pages/ChallengeCreate'))
const ChallengeDetail = lazy(() => import('./pages/ChallengeDetail'))
const CheckIn = lazy(() => import('./pages/CheckIn'))
const Completion = lazy(() => import('./pages/Completion'))
const Dex = lazy(() => import('./pages/Dex'))
const DexDetail = lazy(() => import('./pages/DexDetail'))
const GoodsCreate = lazy(() => import('./pages/GoodsCreate'))

export default function App() {
  return (
    <div className="mx-auto flex h-screen max-w-[480px] flex-col bg-white">
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
        <DemoControls />
      </div>
    </div>
  )
}
