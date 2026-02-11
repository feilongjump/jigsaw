import type { ReactNode } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { useSidebarStore } from '@/stores/useSidebarStore'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { isMenuOpen } = useSidebarStore()

  return (
    <div className="flex w-full min-h-screen dark:bg-dark">
      <div className={`page-wrapper flex flex-col ${!isMenuOpen ? 'xl:!ml-20' : ''}`}>
        <Sidebar />
        <div className="px-4 flex-1 flex flex-col min-w-0">
          <Header />
          <main className="bg-light-gray dark:bg-dark-gray flex-1 p-6 overflow-auto rounded-3xl">
            <div className="container">
              <PageHeader />
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
