import { Link } from '@tanstack/react-router'
import { useAuth } from '@/contexts/AuthContext'

interface HeaderProps {
  title?: string
  subtitle?: string
  showAvatar?: boolean
  userLink?: string
}

export function Header({ title, subtitle, showAvatar = true, userLink }: HeaderProps) {
  const { user } = useAuth()
  const displayTitle = title || user?.username || 'User'

  const AvatarContent = (
    <div className="w-10 h-10 rounded-full bg-[#eee] border-2 border-white shadow-sm overflow-hidden relative">
      <img
        src={user?.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${displayTitle}`}
        alt="Avatar"
        className="w-full h-full object-cover"
      />
    </div>
  )

  return (
    <header className="flex items-center justify-between px-4 py-4 bg-transparent z-50">
      <div className="flex items-center gap-3">
        {showAvatar && (
          userLink
            ? (
                <Link to={userLink} className="block">
                  {AvatarContent}
                </Link>
              )
            : (
                <Link to="/profile" className="block">
                  {AvatarContent}
                </Link>
              )
        )}
        <div className="flex flex-col items-start">
          {subtitle && <span className="text-xs text-[#636E72] font-medium">{subtitle}</span>}
          <span className="text-[1.1rem] font-bold text-[#1A1A1A]">{displayTitle}</span>
        </div>
      </div>
    </header>
  )
}
