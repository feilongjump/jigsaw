import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/finance/investment/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/finance/investment/"!</div>
}
