import { createFileRoute, Outlet } from '@tanstack/react-router'
import { NotesProvider } from '@/contexts/NotesContext'

export const Route = createFileRoute('/notes')({
  component: NotesLayout,
})

function NotesLayout() {
  return (
    <NotesProvider>
      <div className="w-full h-full min-h-screen text-[#333] font-sans antialiased overflow-hidden relative flex flex-col">
        {/* 主内容区域 */}
        <div className="flex-1 w-full h-full overflow-hidden relative z-10">
          <Outlet />
        </div>
      </div>
    </NotesProvider>
  )
}
