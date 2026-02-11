import { Drawer, DrawerContent } from '@heroui/react'
import { useEffect } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useSidebarStore } from '@/stores/useSidebarStore'
import { SidebarContent } from './SidebarContent'

export function Sidebar() {
  const { isMenuOpen, setMenuOpen } = useSidebarStore()
  const isDesktop = useMediaQuery('(min-width: 1280px)')

  // 随着屏幕尺寸变化同步菜单状态
  useEffect(() => {
    if (isDesktop) {
      // 移动端 -> 桌面端：强制展开侧边栏
      setMenuOpen(true)
    }
    else {
      // 桌面端 -> 移动端：强制关闭侧边栏（抽屉模式）
      setMenuOpen(false)
    }
  }, [isDesktop, setMenuOpen])

  return (
    <>
      <SidebarContent />
      {!isDesktop && (
        <Drawer
          isOpen={isMenuOpen}
          onOpenChange={open => !open && setMenuOpen(false)}
          placement="left"
          size="xs"
          classNames={{
            base: 'w-[20rem] !m-0',
            wrapper: 'xl:hidden',
            backdrop: 'xl:hidden',
          }}
        >
          <DrawerContent className="p-0">
            {() => <SidebarContent isDrawer onNavigate={() => setMenuOpen(false)} />}
          </DrawerContent>
        </Drawer>
      )}
    </>
  )
}
