import { addToast, Button, Divider, Input } from '@heroui/react'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, Link as RouterLink, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { login, setAuthToken } from '@/api/auth'
import { getApiErrorMessage, getApiFieldErrors } from '@/api/client'
import wechatLogo from '@/assets/wechat_logo.png'

export const Route = createFileRoute('/auth/sign-in')({
  component: SignIn,
})

function SignIn() {
  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)
  const navigate = useNavigate()
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ account?: string, password?: string, form?: string }>({})

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data?.token) {
        setAuthToken(data.token)
      }
      addToast({
        title: '登录成功',
        description: '欢迎回来',
        color: 'success',
      })
      navigate({ to: '/dashboard' })
    },
    onError: (error) => {
      const fieldErrors = getApiFieldErrors(error)
      const message = getApiErrorMessage(error)
      const nextErrors: { account?: string, password?: string, form?: string } = {}
      if (fieldErrors?.account?.length) {
        nextErrors.account = fieldErrors.account[0]
      }
      if (fieldErrors?.password?.length) {
        nextErrors.password = fieldErrors.password[0]
      }
      if (!nextErrors.account && !nextErrors.password) {
        nextErrors.form = message
      }
      setErrors(nextErrors)
    },
  })

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(e.currentTarget)
    const nextAccount = String(formData.get('account') ?? '').trim()
    const nextPassword = String(formData.get('password') ?? '').trim()

    setAccount(nextAccount)
    setPassword(nextPassword)

    const newErrors: { account?: string, password?: string } = {}

    if (!nextAccount) {
      newErrors.account = '请输入账号'
    }
    if (!nextPassword) {
      newErrors.password = '请输入密码'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      if (newErrors.account) {
        form.querySelector<HTMLInputElement>('input[name="account"]')?.focus()
      }
      else if (newErrors.password) {
        form.querySelector<HTMLInputElement>('input[name="password"]')?.focus()
      }
      return
    }

    setErrors({})
    loginMutation.mutate({
      account: nextAccount,
      password: nextPassword,
    })
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-4">
          <img src="/logo.png" alt="Jigsaw" className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold text-default-900">登录</h1>
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
          <p className="text-tiny text-default-400">或通过以下方式登录</p>
          <Divider className="flex-1" />
        </div>

        {errors.form && (
          <div className="rounded-lg border border-danger-200 bg-danger-50 px-3 py-2 text-small text-danger">
            {errors.form}
          </div>
        )}

        <form
          className="flex flex-col gap-4"
          onSubmit={handleLogin}
        >
          <Input
            label="账号"
            name="account"
            color="primary"
            labelPlacement="outside"
            placeholder="请输入账号"
            type="text"
            variant="bordered"
            classNames={{
              label: 'text-default-900',
            }}
            value={account}
            onValueChange={(value) => {
              setAccount(value)
              setErrors(prev => (prev.account ? { ...prev, account: undefined } : prev))
            }}
            isInvalid={!!errors.account}
            errorMessage={errors.account}
          />
          <Input
            label="密码"
            name="password"
            color="primary"
            labelPlacement="outside"
            placeholder="请输入密码"
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

          <div className="flex items-center justify-between px-1">
            <span className="text-small text-default-500">放心，我会帮您记住此设备的。</span>
            <RouterLink to="/auth/forgot-password" className="text-small text-primary font-medium hover:underline">
              忘记密码？
            </RouterLink>
          </div>

          <Button color="primary" type="submit" className="w-full font-medium shadow-lg shadow-primary/20" isLoading={loginMutation.isPending}>
            登录
          </Button>
        </form>

        <div className="flex items-center justify-center gap-2 mt-4">
          <span className="text-small text-default-500">还没有账号？</span>
          <RouterLink to="/auth/sign-up" className="text-small text-primary font-medium hover:underline">
            注册新账号
          </RouterLink>
        </div>
      </div>
    </div>
  )
}
