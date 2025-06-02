import { addToast, Button, Form, Image, Input, Link } from '@heroui/react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import GithubLogo from '@/assets/github_logo.png'
import WechatLogo from '@/assets/wechat_logo.png'
import useUserStore from '@/store/useUserStore'
import { passwordValidate, usernameValidate } from '@/validate/auth'

export const Route = createFileRoute('/_defaultLayout/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const [errors, setErrors] = useState()
  const [loading, setLoading] = useState(false)
  const { loginStore } = useUserStore()

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const data = Object.fromEntries(new FormData(e.currentTarget))
    const to = router.latestLocation.search.redirect || '/'

    // 接口请求
    await loginStore(data)
      .then(() => {
        addToast({
          description: '那就为这个世界多添加一点色彩吧！',
          color: 'primary',
        })
        router.history.push(to)
      })
      .catch((err) => {
        if (err.code === 422 && err.errors) {
          setErrors(err.errors)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="w-full h-full flex justify-center items-center px-2">
      <div className="max-w-80 w-full flex flex-col items-center">
        <Image
          className="mb-2 w-12 h-12"
          radius="none"
          src="/logo.png"
        />
        <span className="text-lg font-semibold">你好啊！</span>
        <span className="text-xs text-gray-400">最近的笑容真的很不错呢🎉</span>
        <Form
          className="mt-6 w-full flex flex-col gap-y-3"
          validationBehavior="native"
          onSubmit={onSubmit}
          validationErrors={errors}
        >
          <Input
            name="username"
            type="text"
            label="邮箱 | 用户名"
            validate={usernameValidate}
          />
          <Input
            name="password"
            type="password"
            label="密码"
            validate={passwordValidate}
          />
          <div className="my-1 w-full flex justify-end">
            <Link href="#" underline="hover" color="foreground" className="text-xs">你这是忘记密码了？</Link>
          </div>
          <Button className="w-full" color="primary" type="submit" isLoading={loading}>
            登录
          </Button>
        </Form>
        <div className="w-full flex items-center gap-4 my-6">
          <hr className="flex-grow" />
          <span className="text-xs text-gray-500">或者</span>
          <hr className="flex-grow" />
        </div>
        <div className="w-full flex flex-col gap-y-2 mb-4">
          <Button variant="faded">
            <Image
              src={GithubLogo}
              alt="github"
              width={28}
              height={28}
            />
            <span className="w-36">使用 GitHub 登录</span>
          </Button>
          <Button variant="faded">
            <Image
              src={WechatLogo}
              alt="wechat"
              width={28}
              height={28}
            />
            <span className="w-36">使用 WeChat 登录</span>
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          <span>你这是还没有账号吗？</span>
          <Link href="/auth/signup" className="text-xs">注册一个吧</Link>
        </p>
      </div>
    </div>
  )
}
