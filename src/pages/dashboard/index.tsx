import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: Dashboard,
})

export function Dashboard() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      这是 Dashboard 页面
    </div>
  )
}
