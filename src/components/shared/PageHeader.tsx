import { BreadcrumbItem, Breadcrumbs } from '@heroui/react'
import { Link, useLocation } from '@tanstack/react-router'
import { useMemo } from 'react'
import { SubMenuData } from '@/config/menu'

export function PageHeader() {
  const location = useLocation()
  const pathname = location.pathname

  const currentRoute = useMemo(() => {
    // 扁平化菜单数据以查找当前项
    for (const key in SubMenuData) {
      const sections = SubMenuData[key]
      for (const section of sections) {
        for (const item of section.items) {
          if (item.path === pathname || pathname.startsWith(`${item.path}/`)) {
            // 简单匹配，如果可能的话优先精确匹配，但循环顺序很重要
            // 因为我们在第一次匹配时返回，所以要小心。
            // 但通常路径是不同的。
            if (item.path === pathname) {
              return {
                title: item.title,
                category: section.title,
              }
            }
          }
        }
      }
    }
    // 如果精确匹配失败，则回退搜索部分匹配
    for (const key in SubMenuData) {
      const sections = SubMenuData[key]
      for (const section of sections) {
        for (const item of section.items) {
          if (pathname.startsWith(item.path) && item.path !== '/') {
            return {
              title: item.title,
              category: section.title,
            }
          }
        }
      }
    }
    return null
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
