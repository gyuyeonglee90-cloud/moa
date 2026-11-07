import { Navigate, Route, Routes } from 'react-router-dom'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import ChallengeCreate from './pages/ChallengeCreate'
import ChallengeDetail from './pages/ChallengeDetail'
import CheckIn from './pages/CheckIn'
import Completion from './pages/Completion'
import Dex from './pages/Dex'
import DexDetail from './pages/DexDetail'
import GoodsCreate from './pages/GoodsCreate'
import DemoControls from './components/DemoControls'

export default function App() {
  return (
    <div className="mx-auto flex h-screen max-w-[480px] flex-col bg-white">
      <div className="relative flex-1 overflow-hidden">
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
        <DemoControls />
      </div>
    </div>
  )
}
