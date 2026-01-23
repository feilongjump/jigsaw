import { Link, useLocation } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, PieChart, User } from 'lucide-react'

export function TabBar() {
  const location = useLocation()
  
  const tabs = [
    { id: 'notes', path: '/notes', icon: Home, label: 'Home' },
    { id: 'finance', path: '/finance', icon: PieChart, label: 'Finance' },
    { id: 'profile', path: '/profile', icon: User, label: 'Profile' },
  ]

  // Determine active tab
  const activeTab = tabs.find(tab => {
    if (tab.path === '/notes' && (location.pathname === '/' || location.pathname.startsWith('/notes'))) return true
    if (tab.path !== '/notes' && location.pathname.startsWith(tab.path)) return true
    return false
  }) || tabs[0]

  return (
    <>
    <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <defs>
            <filter id="liquid-glass" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="1" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
            </filter>
        </defs>
    </svg>
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[220px] h-[50px] rounded-[25px] z-50 flex justify-around items-center px-2
        bg-white/5 dark:bg-black/5
        backdrop-blur-md
        backdrop-saturate-150
        border border-white/10 dark:border-white/5
        shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]
    "
    style={{ backdropFilter: 'blur(16px) saturate(180%)' }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab.id === tab.id
        return (
            <Link
                key={tab.id}
                to={tab.path}
                className="w-10 h-10 flex flex-col justify-center items-center z-10 relative"
            >
                <motion.div
                    whileTap={{ scale: 0.9 }}
                    animate={{
                        y: isActive ? -14 : 0,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25
                    }}
                    className={`relative p-2.5 rounded-full transition-colors duration-300 ${
                        isActive 
                            ? 'bg-gradient-to-br from-[#0984E3] to-[#00a8ff] text-white shadow-[0_10px_20px_-5px_rgba(9,132,227,0.4)]' 
                            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                    }`}
                >
                    <tab.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>
                
                <AnimatePresence>
                    {isActive && (
                        <motion.span 
                            initial={{ opacity: 0, scale: 0.5, y: 10 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute -bottom-1 text-[10px] font-bold text-[#0984E3]"
                        >
                            {tab.label}
                        </motion.span>
                    )}
                </AnimatePresence>
            </Link>
        )
      })}
    </div>
    </>
  )
}
