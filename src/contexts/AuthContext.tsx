import type { ReactNode } from 'react'
import { addToast } from '@heroui/toast'
import { createContext, use, useEffect, useState } from 'react'
import { changePassword as changePasswordApi, getUserInfo, login as loginApi, register as registerApi, updateAvatar as updateAvatarApi } from '@/services/authService'

import { getStaticUrl } from '@/utils/url'

interface User {
  username: string
  avatar?: string
  created_at?: string
  [key: string]: any
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>
  updateAvatar: (file: File) => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const fetchUserInfo = async () => {
    try {
      const res = await getUserInfo()
      if (res.code === 0 && res.data) {
        const { username, avatar, ...rest } = res.data
        const avatarUrl = getStaticUrl(avatar)
        const fullUserInfo = { ...rest, username, avatar: avatarUrl }
        
        setUser(fullUserInfo)
        localStorage.setItem('user_info', JSON.stringify(fullUserInfo))
        
        // Remove legacy keys
        localStorage.removeItem('me')
        localStorage.removeItem('avatar')
      }
    }
    catch (error) {
      console.error('获取用户信息失败', error)
    }
  }

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        // Load from cache first if available
        const cachedUser = localStorage.getItem('user_info')
        if (cachedUser) {
          try {
            setUser(JSON.parse(cachedUser))
          } catch (e) {
            console.error('Failed to parse user_info', e)
          }
        }
        // Then fetch latest
        await fetchUserInfo()
      }
    }
    init()
  }, [])

  const login = async (username: string, password: string) => {
    const res = await loginApi({ username, password })
    if (res.code === 0) {
      localStorage.setItem('token', res.data.token)
      // 登录成功后立即获取用户信息
      await fetchUserInfo()
    }
    else {
      throw new Error(res.msg || '登录失败')
    }
  }

  const updateAvatar = async (file: File) => {
    try {
      const res = await updateAvatarApi(file)
      if (res.code === 0 && res.data) {
        const avatarUrl = getStaticUrl(res.data.avatar)

        // 更新本地状态
        setUser(prev => {
          if (!prev) return null
          const newUser = { ...prev, avatar: avatarUrl }
          localStorage.setItem('user_info', JSON.stringify(newUser))
          return newUser
        })

        addToast({ title: '头像更新成功', color: 'success' })
      }
      else {
        addToast({ title: res.msg || '上传失败', color: 'danger' })
      }
    }
    catch (e) {
      console.error(e)
      addToast({ title: '上传出错', color: 'danger' })
      throw e
    }
  }

  const register = async (username: string, password: string) => {
    const res = await registerApi({ username, password })
    if (res.code !== 0) {
      throw new Error(res.msg || '注册失败')
    }
  }

  const logout = () => {
    localStorage.removeItem('user_info')
    localStorage.removeItem('token')
    // Clear legacy keys just in case
    localStorage.removeItem('me')
    localStorage.removeItem('avatar')
    setUser(null)
    addToast({ title: '已退出登录', color: 'primary' })
  }

  const changePassword = async (oldPassword: string, newPassword: string) => {
    const res = await changePasswordApi({ old_password: oldPassword, new_password: newPassword })
    if (res.code !== 0) {
      throw new Error(res.msg || '修改密码失败')
    }

    // 修改密码后退出登录
    logout()
  }

  return (
    <AuthContext value={{ user, login, register, logout, changePassword, updateAvatar, isAuthenticated: !!user }}>
      {children}
    </AuthContext>
  )
}

export function useAuth() {
  const context = use(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
