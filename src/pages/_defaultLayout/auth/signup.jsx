import { addToast, Button, Form, Image, Input, Link } from '@heroui/react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import GithubLogo from '@/assets/github_logo.png'
import WechatLogo from '@/assets/wechat_logo.png'
import useUserStore from '@/store/useUserStore'
import { emailValidate, passwordValidate, usernameValidate } from '@/validate/auth'

export const Route = createFileRoute('/_defaultLayout/auth/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const [errors, setErrors] = useState()
  const [loading, setLoading] = useState(false)
  const { signUpStore } = useUserStore()

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const data = Object.fromEntries(new FormData(e.currentTarget))
    const to = router.latestLocation.search.redirect || '/'

    // 接口请求
    await signUpStore(data)
      .then(() => {
        addToast({
          description: '既然做好准备了，那就开始启航吧！',
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
      <div className="max-w-80 w-full flex flex-col items-center tracking-wider">
        <Image
          src="/logo.png"
          className="mb-2"
          width={38}
          height={38}
        />
        <span className="text-lg font-semibold">你好啊！</span>
        <span className="text-xs text-gray-400">祝你每一天的笑容都是非常灿烂😄</span>
        <Form
          className="mt-6 w-full flex flex-col gap-y-3"
          validationBehavior="native"
          onSubmit={onSubmit}
          validationErrors={errors}
        >
          <Input
            name="email"
            type="email"
            label="邮箱"
            validate={emailValidate}
          />
          <Input
            name="username"
            type="text"
            label="用户名"
            validate={usernameValidate}
          />
          <Input
            name="password"
            type="password"
            label="密码"
            validate={passwordValidate}
          />
          <Button color="primary" className="w-full mt-2" type="submit" isLoading={loading}>
            注册
          </Button>
        </Form>
        <div className="w-full flex items-center gap-4 my-6">
          <hr className="flex-grow" />
          <span className="text-xs text-gray-500">
            我好像把账号想起来了！
            <Link href="/auth/login" className="text-xs">我再去试试</Link>
          </span>
          <hr className="flex-grow" />
        </div>
        <div className="w-full flex flex-col gap-y-2">
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
      </div>
    </div>
  )
}
