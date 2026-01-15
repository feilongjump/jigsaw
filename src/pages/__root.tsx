import { addToast } from '@heroui/toast'
import { createRootRoute, Outlet, redirect, useLocation } from '@tanstack/react-router'
import { TabBar } from '@/components/TabBar'

export const Route = createRootRoute({
  component: RootComponent,
  beforeLoad: ({ location }) => {
    if (location.pathname === '/auth/login' || location.pathname === '/auth/register') {
      return
    }

    const isAuthenticated = !!localStorage.getItem('user_info')
    if (!isAuthenticated) {
      addToast({ title: '请先登录', color: 'danger' })
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: location.pathname,
        },
      })
    }
  },
})

function RootComponent() {
  const location = useLocation()
  // 在详情/编辑页面以及登录/注册/修改密码页面隐藏底部导航栏
  const hideTabBar = location.pathname.includes('/edit') || /\/notes\/\d+/.test(location.pathname) || location.pathname === '/auth/login' || location.pathname === '/auth/register' || location.pathname === '/profile/change-password'

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-[#FFFEF0] via-[#F3F8FC] to-[#E6F3FF]">
      <div className="flex-1 relative w-full flex flex-col">
        <Outlet />
      </div>
      {!hideTabBar && <TabBar />}
    </div>
  )
}
