import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_defaultLayout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="max-w-[1024px] w-full min-h-[calc(100dvh-4rem-1px)] h-[calc(100dvh-4rem-1px)] px-6 mx-auto">
      <Outlet />
    </div>
  )
}
