import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$')({
  component: NotFound,
})

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-zinc-500">
      <div className="text-4xl mb-4">🚧</div>
      <h2 className="text-xl font-semibold mb-2">Page Under Construction</h2>
      <p>This page is not yet implemented.</p>
    </div>
  )
}
