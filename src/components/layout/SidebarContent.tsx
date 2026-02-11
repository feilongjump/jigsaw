import { Image, Tab, Tabs, Tooltip } from '@heroui/react'
import { Link, useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'
import { MenuItem, SubMenuData } from '@/config/menu'
import { useSidebarStore } from '@/stores/useSidebarStore'
import '@/styles/sidebar.css'

export interface SidebarContentProps {
  className?: string
  isDrawer?: boolean
  onNavigate?: () => void
}

export function SidebarContent({ className, isDrawer, onNavigate }: SidebarContentProps) {
  const { activeKey, setActiveKey, isMenuOpen, toggleMenu } = useSidebarStore()
  const location = useLocation()

  useEffect(() => {
    // 仅同步路由状态（这里总是同步即可）
    // 如果在抽屉模式下，我们可能需要在导航时关闭抽屉？
    // 通常是的，但目前先保持简单。
    const pathname = location.pathname

    const foundKey = Object.keys(SubMenuData).find((key) => {
      const sections = SubMenuData[key]
      return sections.some(section =>
        section.items.some(item =>
          pathname === item.path || pathname.startsWith(`${item.path}/`),
        ),
      )
    })

    if (foundKey && foundKey !== activeKey) {
      setActiveKey(foundKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, setActiveKey])

  const currentSubMenu = SubMenuData[activeKey] || []

  return (
    <div className={`sidebar ${className || ''} ${isDrawer ? '!flex !h-full !w-full' : ''}`}>
      <div className={`sidebar-icon z-50 ${isDrawer ? '!relative !h-full' : ''}`}>
        <div className="w-full h-18 flex items-center justify-center cursor-pointer" onClick={toggleMenu}>
          <span className="icon-[solar--hamburger-menu-line-duotone] text-foreground text-2xl"></span>
        </div>
        {/* 侧边栏 icon 菜单 */}
        <Tabs
          selectedKey={activeKey}
          onSelectionChange={key => setActiveKey(key as string)}
          isVertical={true}
          color="primary"
          radius="lg"
          classNames={{
            tabList: 'bg-transparent -my-1 gap-2',
            tab: 'w-12 h-12 p-0 data-[hover-unselected=true]:bg-primary-light data-[hover-unselected=true]:opacity-100 group',
            tabContent: 'w-full h-full text-foreground group-data-[hover-unselected=true]:text-primary',
          }}
        >
          {MenuItem.map((item, index) => (
            <Tab
              key={item.key}
              className={(index + 1) % 3 === 0 && index !== MenuItem.length - 1 ? 'sidebar-icon-tab-driver' : ''}
              title={(
                <Tooltip key={item.key} color="secondary" content={item.title} placement="right" size="sm" radius="sm">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className={`${item.icon} w-6 h-6`} />
                  </div>
                </Tooltip>
              )}
            >
            </Tab>
          ))}
        </Tabs>
      </div>
      <aside className={`sidebar-menu ${!isMenuOpen ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'} ${isDrawer ? '!relative !left-0 !top-0 !h-full !translate-x-0 !opacity-100' : ''}`}>
        {/* 侧边栏 Logo */}
        <div className="w-full h-18 px-6 py-4 flex">
          <Link
            to="/dashboard"
            className="flex items-center justify-start gap-2"
          >
            <Image src="/vite.svg" alt="logo" />
            <span className="text-primary text-2xl font-bold">Logo</span>
          </Link>
        </div>
        {/* 侧边栏菜单 */}
        <div className="w-full px-3 flex-1 overflow-y-auto">
          {currentSubMenu.map(section => (
            <div key={section.title} className="mb-6">
              <h5 className="text-sm mb-2 text-default-500 font-medium px-3 uppercase tracking-wider">{section.title}</h5>
              <ul className="space-y-1">
                {section.items.map(item => (
                  <li key={item.key}>
                    <Link
                      to={item.path as any}
                      onClick={onNavigate}
                      activeOptions={{ exact: true }}
                      activeProps={{
                        className: 'bg-primary text-white shadow-lg shadow-primary/20',
                      }}
                      inactiveProps={{
                        className: 'text-default-600 hover:transform hover:translate-x-2 hover:bg-primary-light hover:text-primary',
                      }}
                      className="h-12 pl-3 rounded-xl flex gap-3 justify-start items-center cursor-pointer transition-all duration-200 ease-in-out"
                    >
                      <span className={`${item.icon} w-6 h-6`} />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}
