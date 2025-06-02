import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_defaultLayout/blog')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/blog"!</div>
}
