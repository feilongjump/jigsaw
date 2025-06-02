import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_defaultLayout/investment')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/investment"!</div>
}
