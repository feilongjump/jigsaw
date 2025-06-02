import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_defaultLayout/travel')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/travel"!</div>
}
