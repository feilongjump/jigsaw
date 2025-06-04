import { addToast, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from '@heroui/react'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import AvatarJPG from '@/assets/avatar.jpg'
import useUserStore from '@/store/useUserStore'

function AuthComp({ user, signOut }) {
  if (user) {
    return (
      <Dropdown>
        <DropdownTrigger>
          <Image
            className="cursor-pointer"
            src={user.avatar || AvatarJPG}
            width={32}
          />
        </DropdownTrigger>
        <DropdownMenu variant="faded">
          <DropdownItem key="sign-out" className="text-danger" color="danger" onPress={signOut}>
            Sign out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    )
  }

  return (
    <>
      <NavbarItem className="hidden lg:flex">
        <Link href="/auth/login">Login</Link>
      </NavbarItem>
      <NavbarItem>
        <Button as={Link} color="primary" href="/auth/signup" variant="flat">
          Sign Up
        </Button>
      </NavbarItem>
    </>
  )
}

export default function App() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signOutStore } = useUserStore()
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

  const signOut = () => {
    signOutStore()
    addToast({
      description: '下次见！',
      color: 'primary',
    })

    router.history.push('/auth/login')
  }

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
          <Image src="/logo.png" radius="none" width={24} />
          <p className="font-bold text-foreground">{appTitle}</p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menus.map(menu => (
          <NavbarItem key={menu.link} isActive={menu.link === router.href}>
            <Link
              color={menu.link === router.href ? 'primary' : 'foreground'}
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

        <AuthComp user={user} signOut={signOut} />
      </NavbarContent>
      <NavbarMenu>
        {menus.map(menu => (
          <NavbarMenuItem key={menu.link} isActive={menu.link === router.href}>
            <Link
              className="w-full"
              color={menu.link === router.href ? 'primary' : 'foreground'}
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
