import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo, useRef } from 'react'
import { LogOut, Camera, Lock } from 'lucide-react'
import { fromNow } from '@/utils/date'
import { useAuth } from '@/contexts/AuthContext'
import bgProfile from '@/assets/bg-profile.png'

export const Route = createFileRoute('/profile/')({
  component: ProfilePage,
})

function ProfilePage() {
  const { user, logout, updateAvatar } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const joinedAt = useMemo(() => {
    if (!user?.created_at)
      return '刚刚'
    return fromNow(user.created_at)
  }, [user?.created_at])

  const handleLogout = () => {
    logout()
    navigate({ to: '/auth/login' })
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file)
      return

    try {
      await updateAvatar(file)
    }
    catch (error) {
      console.error('上传头像失败', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Header Background */}
      <div className="h-72 w-full relative overflow-hidden">
        <img
          src={bgProfile}
          alt="Profile Background"
          className="absolute inset-0 w-full h-[420px] object-cover"
        />

        {/* Top Icons */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-end items-center gap-3 text-white z-10">
          <button
            onClick={() => navigate({ to: '/profile/change-password' })}
            className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
          >
            <Lock size={20} />
          </button>
          <button
            onClick={handleLogout}
            className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-gray-100 rounded-t-[40px] -mt-10 relative px-6 pb-32 flex-1 flex flex-col items-center">
        {/* Avatar */}
        <div
          className="-mt-14 cursor-pointer group relative"
          onClick={handleAvatarClick}
        >
          <div className="w-28 h-28 rounded-full border-[6px] border-white shadow-xl overflow-hidden relative bg-gray-100">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.username || 'User'}`}
              alt="Avatar"
              className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
            />
            {/* Upload Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white w-8 h-8" />
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {/* User Info */}
        <div className="text-center mt-4 mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            @{user?.username || 'User'}
          </h1>
          <div className="text-sm text-gray-500 font-medium mt-1">
            注册于 {joinedAt}
          </div>
          <p className="text-gray-400 text-xs mt-3 italic max-w-xs mx-auto">
            "每一个微小的脚步都算数。继续前行，书写属于你自己的故事。"
          </p>
        </div>
      </div>
    </div>
  )
}




