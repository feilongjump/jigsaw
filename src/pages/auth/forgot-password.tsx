import { addToast, Button, Input } from '@heroui/react'
import { createFileRoute, Link as RouterLink } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/auth/forgot-password')({
  component: ForgotPassword,
})

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ email?: string }>({})

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const nextEmail = String(formData.get('email') ?? '').trim()

    setEmail(nextEmail)

    const newErrors: { email?: string } = {}
    if (!nextEmail) {
      newErrors.email = '请输入电子邮箱'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      form.querySelector<HTMLInputElement>('input[name="email"]')?.focus()
      return
    }

    setErrors({})
    addToast({
      title: '已发送',
      description: '重置链接已发送到邮箱',
      color: 'success',
    })
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-4">
          <img src="/logo.png" alt="Jigsaw" className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold text-default-900">忘记密码</h1>
        <p className="text-small text-default-500 mt-2">
          请输入您账号关联的电子邮箱，我们将向您发送重置密码的链接。
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            label="电子邮箱"
            name="email"
            color="primary"
            labelPlacement="outside"
            placeholder="请输入您的电子邮箱"
            type="email"
            variant="bordered"
            classNames={{
              label: 'text-default-900',
            }}
            value={email}
            onValueChange={(value) => {
              setEmail(value)
              setErrors(prev => (prev.email ? { ...prev, email: undefined } : prev))
            }}
            isInvalid={!!errors.email}
            errorMessage={errors.email}
          />

          <Button color="primary" type="submit" className="w-full font-medium shadow-lg shadow-primary/20">
            发送重置链接
          </Button>
        </form>

        <div className="flex items-center justify-center gap-2 mt-4">
          <RouterLink to="/auth/sign-in" className="text-small text-primary font-medium hover:underline">
            返回登录
          </RouterLink>
        </div>
      </div>
    </div>
  )
}
