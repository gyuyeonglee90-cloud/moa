import { Navigate, Route, Routes } from 'react-router-dom'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import ChallengeCreate from './pages/ChallengeCreate'
import ChallengeDetail from './pages/ChallengeDetail'
import CheckIn from './pages/CheckIn'
import Graduation from './pages/Graduation'
import Dex from './pages/Dex'
import DexDetail from './pages/DexDetail'
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
          <Route path="/graduation/:id" element={<Graduation />} />
          <Route path="/dex" element={<Dex />} />
          <Route path="/dex/:id" element={<DexDetail />} />
        </Routes>
        <DemoControls />
      </div>
    </div>
  )
}
