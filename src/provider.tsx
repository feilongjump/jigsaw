import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { createRouter, RouterProvider, type NavigateOptions } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { AuthProvider } from './contexts/AuthContext'

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!, // We'll inject this if we use router context, but for now we use global guard
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
        radius: "lg",
        timeout: 2500,
        }}
      />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </HeroUIProvider>
  )
}
