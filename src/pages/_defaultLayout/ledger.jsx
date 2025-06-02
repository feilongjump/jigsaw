import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_defaultLayout/ledger')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/ledger"!</div>
}
