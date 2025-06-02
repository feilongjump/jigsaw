import { Button, Image, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from '@heroui/react'
import { useLocation } from '@tanstack/react-router'
import { useState } from 'react'
import useUserStore from '@/store/useUserStore'

function Logo() {
  return (
    <Image
      src="/logo.png"
      radius="none"
      width={24}
    />
  )
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const user = useUserStore()
  const location = useLocation()
  const appTitle = import.meta.env.VITE_APP_TITLE

  const menus = [
    {
      title: '博客',
      link: '/blog',
    },
    {
      title: '投资',
      link: '/investment',
    },
    {
      title: '账本',
      link: '/ledger',
    },
    {
      title: '旅行',
      link: '/travel',
    },
  ]

  return (
    <Navbar
      shouldHideOnScroll
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent>
        <NavbarBrand
          as={Link}
          className="flex gap-x-2"
          href="/"
        >
          <Logo />
          <p className="font-bold text-foreground">{appTitle}</p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menus.map(menu => (
          <NavbarItem key={menu.link} isActive={menu.link === location.href}>
            <Link
              color={menu.link === location.href ? 'primary' : 'foreground'}
              href={menu.link}
            >
              {menu.title}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarMenuToggle
          className="sm:hidden"
        />

        <NavbarItem className="hidden lg:flex">
          <Link href="/auth/login">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="/auth/signup" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menus.map(menu => (
          <NavbarMenuItem key={menu.link} isActive={menu.link === location.href}>
            <Link
              className="w-full"
              color={menu.link === location.href ? 'primary' : 'foreground'}
              href={menu.link}
              size="lg"
              onPress={() => setIsMenuOpen(false)}
            >
              {menu.title}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  )
}
