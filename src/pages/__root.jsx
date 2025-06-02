import { addToast, Link } from '@heroui/react'
import { createRootRoute, Outlet, redirect } from '@tanstack/react-router'
import CustomNavbar from '@/components/custom/Navbar.jsx'

export const Route = createRootRoute({
  component: RouteComponent,
  notFoundComponent,
  beforeLoad: ({ context, location }) => {
    const { user } = context.user.getState()

    if (!location.pathname.includes('/auth/') && !user) {
      addToast({
        description: '未通过身份认证！',
        color: 'danger',
      })

      throw redirect({
        to: '/auth/login',
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          // Since we'll be replacing the entire URL with what it was
          // router.history.push is better suited for this than router.navigate
          // router.history.push(search.redirect)
          redirect: location.href,
        },
      })
    }
  },
})

function RouteComponent() {
  return (
    <>
      <CustomNavbar />
      <Outlet />
    </>
  )
}

function notFoundComponent() {
  return (
    <div className="w-full h-dvh flex flex-col justify-center items-center">
      <h1 className="text-8xl font-bold">404</h1>
      <div className="mt-16 text-xl text-gray-500 text-center">
        <p>抱歉，你访问的页面不存在。</p>
        <p>
          你可以返回
          <Link href="/" className="mx-1 text-xl font-bold">首页</Link>
          继续浏览。
        </p>
      </div>
    </div>
  )
}
