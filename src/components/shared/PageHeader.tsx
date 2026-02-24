import { BreadcrumbItem, Breadcrumbs } from '@heroui/react'
import { Link, useLocation } from '@tanstack/react-router'
import { useMemo } from 'react'
import { SubMenuData } from '@/config/menu'

export function PageHeader() {
  const location = useLocation()
  const pathname = location.pathname

  const currentRoute = useMemo(() => {
    let matchedTitle = ''
    let matchedCategory = ''
    let matchedLength = -1

    Object.values(SubMenuData).forEach((sections) => {
      sections.forEach((section) => {
        section.items.forEach((item) => {
          if (pathname === item.path || pathname.startsWith(`${item.path}/`)) {
            if (item.path.length > matchedLength) {
              matchedLength = item.path.length
              matchedTitle = item.title
              matchedCategory = section.title
            }
          }
        })
      })
    })

    if (!matchedTitle) {
      return null
    }

    return {
      title: matchedTitle,
      category: matchedCategory,
    }
  }, [pathname])

  const title = currentRoute?.title || 'Dashboard'

  return (
    <div className="flex justify-between items-center bg-white dark:bg-dark rounded-2xl px-6 py-4 mb-6 shadow-sm">
      <h1 className="text-base font-bold text-default-900">{title}</h1>
      <Breadcrumbs
        separator="/"
        itemClasses={{
          separator: 'px-2',
        }}
      >
        <BreadcrumbItem>
          <Link to="/" className="flex items-center text-default-500 hover:text-primary">
            <span className="icon-[solar--home-2-line-duotone] text-lg" />
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-md text-xs font-medium">
            {title}
          </span>
        </BreadcrumbItem>
      </Breadcrumbs>
    </div>
  )
}
