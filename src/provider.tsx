import type { NavigateOptions } from '@tanstack/react-router'
import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { AuthProvider } from './contexts/AuthContext'
import { routeTree } from './routeTree.gen'

// 创建新的路由实例
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!, // 如果使用路由上下文，我们将注入此内容，但目前我们使用全局守卫
  },
})

export default function Provider() {
  return (
    <HeroUIProvider
      locale="zh-CN"
      navigate={(to, options: NavigateOptions | undefined) => router.navigate({ to, ...options })}
      useHref={to => router.buildLocation({ to }).href}
    >
      <ToastProvider toastProps={{
        radius: 'lg',
        timeout: 2500,
      }}
      />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </HeroUIProvider>
  )
}
