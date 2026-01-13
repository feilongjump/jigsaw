import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Input, Button } from "@heroui/react"
import { useAuth } from '@/contexts/AuthContext'
import { addToast } from "@heroui/toast"
import { AuthLayout } from '@/components/AuthLayout'

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()
  
  const handleRegister = async () => {
    if (!username || !password) {
        addToast({ title: '请输入用户名和密码', color: 'danger' });
        return;
    }

    try {
        await register(username, password)
        addToast({ title: '注册成功，请登录', color: 'success' })
        navigate({ to: '/auth/login' })
    } catch (e: any) {
        addToast({ title: e.message, color: 'danger' })
    }
  }

  return (
    <AuthLayout title="创建账号" subtitle="注册您的新账号">
        <Input 
            label="用户名" 
            value={username} 
            onValueChange={setUsername}
            variant="underlined"
            color="primary"
            onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
        />
        <Input 
            label="密码" 
            type="password"
            value={password} 
            onValueChange={setPassword}
            variant="underlined"
            color="primary"
            onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
        />
        <Button color="primary" className="w-full font-bold shadow-lg shadow-blue-500/30" onPress={handleRegister}>
            注册
        </Button>
        <div className="flex justify-center gap-2 text-small">
            <span className="text-default-500">已有账号？</span>
            <Link to="/auth/login" className="text-[#0984E3] font-bold hover:underline">立即登录</Link>
        </div>
    </AuthLayout>
  )
}
