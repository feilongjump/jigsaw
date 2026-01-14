import { Button, Input } from '@heroui/react'
import { addToast } from '@heroui/toast'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { FaGithub, FaWeixin } from 'react-icons/fa'
import { AuthLayout } from '@/components/AuthLayout'
import { useAuth } from '@/contexts/AuthContext'

interface LoginSearch {
  redirect?: string
}

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: (search.redirect as string) || '/notes',
    }
  },
})

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const search = Route.useSearch()

  const handleLogin = async () => {
    if (!username || !password) {
      addToast({ title: '请输入用户名和密码', color: 'danger' })
      return
    }

    try {
      await login(username, password)
      addToast({ title: '登录成功', color: 'success' })
      navigate({ to: search.redirect || '/notes' })
    }
    catch (e: any) {
      addToast({ title: e.message, color: 'danger' })
    }
  }

  return (
    <AuthLayout title="欢迎回来" subtitle="请登录您的账号">
      <Input
        label="用户名"
        value={username}
        onValueChange={setUsername}
        variant="underlined"
        color="primary"
        onKeyDown={e => e.key === 'Enter' && handleLogin()}
      />
      <Input
        label="密码"
        type="password"
        value={password}
        onValueChange={setPassword}
        variant="underlined"
        color="primary"
        onKeyDown={e => e.key === 'Enter' && handleLogin()}
      />
      <Button color="primary" className="w-full font-bold shadow-lg shadow-blue-500/30" onPress={handleLogin}>
        登录
      </Button>

      <div className="flex items-center gap-4 my-1">
        <div className="h-[1px] bg-default-200 flex-1"></div>
        <span className="text-default-400 text-xs">或</span>
        <div className="h-[1px] bg-default-200 flex-1"></div>
      </div>

      <div className="flex gap-4 justify-center mb-2">
        <Button isIconOnly variant="flat" className="bg-[#07c160]/10 text-[#07c160]">
          <FaWeixin size={20} />
        </Button>
        <Button isIconOnly variant="flat" className="bg-black/10 text-black">
          <FaGithub size={20} />
        </Button>
      </div>

      <div className="flex justify-center gap-2 text-small">
        <span className="text-default-500">还没有账号？</span>
        <Link to="/auth/register" className="text-[#0984E3] font-bold hover:underline">立即注册</Link>
      </div>
    </AuthLayout>
  )
}
