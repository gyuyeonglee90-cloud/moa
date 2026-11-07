import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/home', label: '홈', icon: '🏠' },
  { to: '/dex', label: '도감', icon: '📖' },
]

export default function BottomTabs() {
  return (
    <nav
      role="tablist"
      aria-label="주요 화면"
      className="absolute inset-x-4 bottom-4 flex gap-1 rounded-full bg-surface p-1 shadow-level2"
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          role="tab"
          className={({ isActive }) =>
            `relative flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full text-title ${
              isActive ? 'text-ink' : 'text-ink-3'
            }`
          }
        >
          {({ isActive }) => (
            <span aria-current={isActive ? 'page' : undefined} className="flex items-center gap-1.5">
              <span aria-hidden="true">{tab.icon}</span>
              {tab.label}
              {isActive && (
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              )}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
