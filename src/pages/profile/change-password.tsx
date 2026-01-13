import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Input, Button } from "@heroui/react"
import { useAuth } from '@/contexts/AuthContext'
import { addToast } from "@heroui/toast"
import { AuthLayout } from '@/components/AuthLayout'

export const Route = createFileRoute('/profile/change-password')({
  component: ChangePasswordPage,
})

function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const { changePassword } = useAuth()
  const navigate = useNavigate()
  
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
        addToast({ title: '请输入旧密码和新密码', color: 'danger' });
        return;
    }

    try {
        await changePassword(oldPassword, newPassword)
        addToast({ title: '密码修改成功，请重新登录', color: 'success' })
        navigate({ to: '/auth/login' })
    } catch (e: any) {
        addToast({ title: e.message, color: 'danger' })
    }
  }

  const BackButton = (
    <Button 
        isIconOnly
        variant="light"
        onPress={() => navigate({ to: "/profile" })}
        className="absolute left-4 top-4 text-[#1A1A1A] data-[hover=true]:bg-black/5"
        radius="full"
        size="sm"
    >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
    </Button>
  );

  return (
    <AuthLayout title="修改密码" subtitle="更新您的账户密码" headerContent={BackButton}>
        <Input 
            label="旧密码" 
            type="password"
            value={oldPassword} 
            onValueChange={setOldPassword}
            variant="underlined"
            color="primary"
        />
        <Input 
            label="新密码" 
            type="password"
            value={newPassword} 
            onValueChange={setNewPassword}
            variant="underlined"
            color="primary"
        />
        <Button color="danger" className="w-full font-bold shadow-lg shadow-red-500/30" onPress={handleChangePassword}>
            确认修改
        </Button>
    </AuthLayout>
  )
}
