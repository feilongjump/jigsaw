import type { NavigateOptions, ToOptions } from '@tanstack/react-router'
import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

declare module '@react-types/shared' {
  interface RouterConfig {
    href: ToOptions['to']
    routerOptions: Omit<NavigateOptions, keyof ToOptions>
  }
}

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
      navigate={(to, options) => router.navigate({ to, ...options })}
      useHref={to => router.buildLocation({ to }).href}
    >
      <ToastProvider toastProps={{
        radius: 'lg',
        timeout: 2500,
      }}
      />
      <RouterProvider router={router} />
    </HeroUIProvider>
  )
}
