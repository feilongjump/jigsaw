import { addToast, Button, Divider, Input } from '@heroui/react'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, Link as RouterLink, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { register } from '@/api/auth'
import { getApiErrorMessage, getApiFieldErrors } from '@/api/client'
import wechatLogo from '@/assets/wechat_logo.png'

export const Route = createFileRoute('/auth/sign-up')({
  component: SignUp,
})

function SignUp() {
  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ username?: string, email?: string, password?: string, form?: string }>({})

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      addToast({
        title: '注册成功',
        description: '请使用账号登录',
        color: 'success',
      })
      navigate({ to: '/auth/sign-in' })
    },
    onError: (error) => {
      const fieldErrors = getApiFieldErrors(error)
      const message = getApiErrorMessage(error)
      const nextErrors: { username?: string, email?: string, password?: string, form?: string } = {}
      if (fieldErrors?.username?.length) {
        nextErrors.username = fieldErrors.username[0]
      }
      if (fieldErrors?.email?.length) {
        nextErrors.email = fieldErrors.email[0]
      }
      if (fieldErrors?.password?.length) {
        nextErrors.password = fieldErrors.password[0]
      }
      if (!nextErrors.username && !nextErrors.email && !nextErrors.password) {
        nextErrors.form = message
      }
      setErrors(nextErrors)
    },
  })

  const isValidEmail = (value: string) => {
    const atIndex = value.indexOf('@')
    if (atIndex <= 0) {
      return false
    }
    const dotIndex = value.lastIndexOf('.')
    return dotIndex > atIndex + 1 && dotIndex < value.length - 1
  }

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const nextUsername = String(formData.get('username') ?? '').trim()
    const nextEmail = String(formData.get('email') ?? '').trim()
    const nextPassword = String(formData.get('password') ?? '').trim()

    setUsername(nextUsername)
    setEmail(nextEmail)
    setPassword(nextPassword)

    const newErrors: { username?: string, email?: string, password?: string } = {}

    if (!nextUsername) {
      newErrors.username = '请输入用户名'
    }
    if (!nextEmail) {
      newErrors.email = '请输入邮箱'
    }
    else if (!isValidEmail(nextEmail)) {
      newErrors.email = '邮箱格式不正确'
    }
    if (!nextPassword) {
      newErrors.password = '请输入密码'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      if (newErrors.username) {
        form.querySelector<HTMLInputElement>('input[name="username"]')?.focus()
      }
      else if (newErrors.email) {
        form.querySelector<HTMLInputElement>('input[name="email"]')?.focus()
      }
      else if (newErrors.password) {
        form.querySelector<HTMLInputElement>('input[name="password"]')?.focus()
      }
      return
    }

    setErrors({})
    registerMutation.mutate({
      username: nextUsername,
      email: nextEmail,
      password: nextPassword,
    })
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-4">
          <img src="/logo.png" alt="Jigsaw" className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold text-default-900">注册</h1>
        <p className="text-small text-default-500">您的管理后台</p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          <Button
            className="flex-1 bg-default-50 text-default-600 font-medium border border-default-200"
            variant="flat"
            startContent={<img src={wechatLogo} className="w-5 h-5" alt="WeChat" />}
          >
            微信
          </Button>
          <Button
            className="flex-1 bg-default-50 text-default-600 font-medium border border-default-200"
            startContent={<span className="icon-[logos--github-icon] text-lg" />}
            variant="flat"
          >
            GitHub
          </Button>
        </div>

        <div className="flex items-center gap-4 py-2">
          <Divider className="flex-1" />
          <p className="text-tiny text-default-400">或通过以下方式注册</p>
          <Divider className="flex-1" />
        </div>

        {errors.form && (
          <div className="rounded-lg border border-danger-200 bg-danger-50 px-3 py-2 text-small text-danger">
            {errors.form}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSignUp} noValidate>
          <Input
            label="用户名"
            name="username"
            color="primary"
            labelPlacement="outside"
            placeholder="请输入用户名"
            type="text"
            variant="bordered"
            classNames={{
              label: 'text-default-900',
            }}
            value={username}
            onValueChange={(value) => {
              setUsername(value)
              setErrors(prev => (prev.username ? { ...prev, username: undefined } : prev))
            }}
            isInvalid={!!errors.username}
            errorMessage={errors.username}
          />
          <Input
            label="邮箱"
            name="email"
            color="primary"
            labelPlacement="outside"
            placeholder="请输入邮箱"
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
          <Input
            label="密码"
            name="password"
            color="primary"
            labelPlacement="outside"
            placeholder="请输入您的密码"
            endContent={(
              <button
                className="focus:outline-none flex items-center justify-center h-full"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible
                  ? (
                      <span className="icon-[solar--eye-bold-duotone] text-2xl text-default-400 pointer-events-none" />
                    )
                  : (
                      <span className="icon-[solar--eye-closed-bold-duotone] text-2xl text-default-400 pointer-events-none" />
                    )}
              </button>
            )}
            type={isVisible ? 'text' : 'password'}
            variant="bordered"
            classNames={{
              label: 'text-default-900',
            }}
            value={password}
            onValueChange={(value) => {
              setPassword(value)
              setErrors(prev => (prev.password ? { ...prev, password: undefined } : prev))
            }}
            isInvalid={!!errors.password}
            errorMessage={errors.password}
          />

          <Button color="primary" type="submit" className="w-full font-medium shadow-lg shadow-primary/20" isLoading={registerMutation.isPending}>
            注册
          </Button>
        </form>

        <div className="flex items-center justify-center gap-2 mt-4">
          <span className="text-small text-default-500">已有账号？</span>
          <RouterLink to="/auth/sign-in" className="text-small text-primary font-medium hover:underline">
            去登录
          </RouterLink>
        </div>
      </div>
    </div>
  )
}
