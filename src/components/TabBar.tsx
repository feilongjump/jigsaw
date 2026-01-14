import { Link, useLocation } from '@tanstack/react-router'
import { motion } from 'framer-motion'

export function TabBar() {
  const location = useLocation()
  const isProfile = location.pathname.includes('/profile')
  const isNotes = location.pathname.includes('/notes') || location.pathname === '/' // 根路径也默认显示笔记

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[120px] h-[50px] rounded-full z-50 flex justify-around items-center px-1
        bg-white/40
        backdrop-blur-xl
        backdrop-saturate-150
        border border-white/60
        shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]
    "
    >

      {/* 选中状态指示器 */}
      <div className="absolute inset-0 flex justify-around items-center pointer-events-none px-1">
        <div className="w-1/2 flex justify-center">
          {isNotes && (
            <motion.div
              layoutId="tab-indicator"
              className="w-[40px] h-[40px] rounded-full bg-white/60 shadow-sm backdrop-blur-md"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
        </div>
        <div className="w-1/2 flex justify-center">
          {isProfile && (
            <motion.div
              layoutId="tab-indicator"
              className="w-[40px] h-[40px] rounded-full bg-white/60 shadow-sm backdrop-blur-md"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
        </div>
      </div>

      <Link
        to="/notes"
        className="w-1/2 h-full flex justify-center items-center z-10 relative active:scale-90 transition-transform duration-200"
      >
        <svg
          className={`transition-all duration-300 ${isNotes ? 'stroke-[#0984E3] stroke-[2.5px] drop-shadow-[0_0_8px_rgba(9,132,227,0.5)]' : 'stroke-[#636E72] stroke-2 opacity-60'}`}
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      </Link>

      <Link
        to="/profile"
        className="w-1/2 h-full flex justify-center items-center z-10 relative active:scale-90 transition-transform duration-200"
      >
        <svg
          className={`transition-all duration-300 ${isProfile ? 'stroke-[#0984E3] stroke-[2.5px] drop-shadow-[0_0_8px_rgba(9,132,227,0.5)]' : 'stroke-[#636E72] stroke-2 opacity-60'}`}
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </Link>
    </div>
  )
}
