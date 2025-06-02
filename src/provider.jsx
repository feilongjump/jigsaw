import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import useUserStore from '@/store/useUserStore'
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    user: useUserStore,
  },
})
// 全局 Toast 配置
const toastProps = {
  radius: 'lg',
  timeout: 2500,
}

export default function Provider() {
  return (
    <HeroUIProvider
      locale="zh-CN"
      navigate={(to, options) => router.navigate({ to, ...options })}
      useHref={to => router.buildLocation({ to }).href}
    >
      <ToastProvider toastProps={toastProps} />
      <RouterProvider router={router} />
    </HeroUIProvider>
  )
}
