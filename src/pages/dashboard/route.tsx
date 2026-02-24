import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getAuthToken } from '@/api/token'
import { Layout } from '@/components/layout/Layout'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => {
    if (!getAuthToken()) {
      throw redirect({
        to: '/auth/sign-in',
      })
    }
  },
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
})
