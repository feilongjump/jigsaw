import { Button, Navbar, NavbarContent, NavbarItem, useDisclosure } from '@heroui/react'
import { SearchModal } from '@/components/shared/SearchModal'
import { UserDropdown } from '@/components/shared/UserDropdown'
import { useSidebarStore } from '@/stores/useSidebarStore'
import { useThemeStore } from '@/stores/useThemeStore'

export function Header() {
  const { toggleMenu } = useSidebarStore()
  const { theme, toggleTheme } = useThemeStore()
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  return (
    <>
      <Navbar
        maxWidth="full"
        height="4.5rem"
        className="bg-white dark:bg-dark backdrop-blur-md"
      >
        <NavbarContent justify="start">
          <NavbarItem className="xl:hidden">
            <Button isIconOnly variant="light" onPress={toggleMenu}>
              <span className="icon-[solar--hamburger-menu-line-duotone] w-6 h-6 text-default-500" />
            </Button>
          </NavbarItem>
          <NavbarItem className="hidden xl:flex">
            <Button isIconOnly variant="light" radius="full" onPress={onOpen}>
              <span className="icon-[solar--magnifer-line-duotone] w-6 h-6 text-default-500" />
            </Button>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end" className="gap-4">
          <NavbarItem className="xl:hidden">
            <Button isIconOnly variant="light" radius="full" onPress={onOpen}>
              <span className="icon-[solar--magnifer-line-duotone] w-6 h-6 text-default-500" />
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button isIconOnly variant="light" radius="full" onPress={toggleTheme}>
              {theme === 'light'
                ? <span className="icon-[solar--sun-2-line-duotone] w-6 h-6 text-default-500" />
                : <span className="icon-[solar--moon-stars-line-duotone] w-6 h-6 text-default-500" />}
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button isIconOnly variant="light" radius="full">
              <span className="icon-[solar--bell-line-duotone] w-6 h-6 text-default-500" />
            </Button>
          </NavbarItem>
          <NavbarItem>
            <UserDropdown />
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <SearchModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
      />
    </>
  )
}
