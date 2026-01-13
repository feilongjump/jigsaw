import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Header } from '@/components/Header'
import { useAuth } from '@/contexts/AuthContext'
import { useRef } from 'react'
import { addToast } from "@heroui/toast"

export const Route = createFileRoute('/profile/')({
  component: ProfilePage,
})

function ProfilePage() {
  const { user, logout, updateAvatar } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogout = () => {
    logout()
    navigate({ to: '/auth/login' })
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
        await updateAvatar(file);
    } catch (error) {
        console.error('上传头像失败', error)
        // 错误提示已在 context 中处理
    }
  }

  return (
    <div className="flex flex-col flex-1 h-full relative overflow-hidden">
      <div className="relative z-10 flex flex-col h-full">
          <Header showAvatar={false} />
          
          <main className="flex-1 overflow-y-auto px-5 pb-[120px] no-scrollbar">
            <div className="flex flex-col items-center py-10">
                <div 
                    className="relative w-[100px] h-[100px] mb-4 cursor-pointer group"
                    onClick={handleAvatarClick}
                >
                    <div className="absolute -inset-1.5 rounded-full bg-[#0984E3] opacity-30 blur-[10px] z-0"></div>
                    <img 
                        src={user?.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.username || `User`}`} 
                        alt="Avatar" 
                        className="w-full h-full rounded-full object-cover border-[4px] border-white/80 shadow-[0_10px_20px_rgba(0,0,0,0.1)] relative z-10 group-hover:opacity-90 transition-opacity" 
                    />
                    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    </div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
                <h2 className="text-[1.6rem] font-extrabold text-[#1A1A1A] mb-1">{user?.username || '未登录'}</h2>
            </div>

            <div className="flex flex-col gap-3 mt-5">
                <button 
                    onClick={() => navigate({ to: '/profile/change-password' })}
                    className="flex items-center px-6 py-4 bg-white/50 border border-white/60 rounded-[20px] text-[1rem] text-[#1A1A1A] cursor-pointer w-full gap-3 active:bg-white/80 active:scale-[0.98] transition-all"
                >
                    <span className="flex items-center text-[#636E72]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </span>
                    <span>修改密码</span>
                    <span className="ml-auto text-[#aaa]">→</span>
                </button>
                <button 
                    onClick={handleLogout}
                    className="flex items-center px-6 py-4 bg-white/50 border border-white/60 rounded-[20px] text-[1rem] text-[#d63031] cursor-pointer w-full gap-3 active:bg-white/80 active:scale-[0.98] transition-all"
                >
                    <span className="flex items-center text-[#d63031]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    </span>
                    <span>退出登录</span>
                </button>
            </div>
          </main>
      </div>
    </div>
  )
}
