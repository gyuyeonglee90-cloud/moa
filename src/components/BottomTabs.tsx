import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/home', label: '홈', icon: '🏠' },
  { to: '/dex', label: '도감', icon: '📖' },
]

export default function BottomTabs() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex border-t border-gray-200 bg-white">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-2 text-xs ${
              isActive ? 'text-pink-500' : 'text-gray-400'
            }`
          }
        >
          <span className="text-lg">{tab.icon}</span>
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
