import type { NavigateOptions, ToOptions } from '@tanstack/react-router'
import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { useState } from 'react'
import { routeTree } from '@/routeTree.gen'

declare module '@react-types/shared' {
  interface RouterConfig {
    href: ToOptions['to']
    routerOptions: Omit<NavigateOptions, keyof ToOptions>
  }
}

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
})

export default function Provider() {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider
        locale="zh-CN"
        navigate={(to, options) => router.navigate({ to, ...options })}
        useHref={to => router.buildLocation({ to }).href}
      >
        <ToastProvider
          placement="bottom-center"
          toastProps={{
            radius: 'lg',
            timeout: 2500,
          }}
        />
        <RouterProvider router={router} />
      </HeroUIProvider>
    </QueryClientProvider>
  )
}
