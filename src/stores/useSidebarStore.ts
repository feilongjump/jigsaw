import { create } from 'zustand'

interface SidebarState {
  activeKey: string
  setActiveKey: (key: string) => void
  isMenuOpen: boolean
  toggleMenu: () => void
  setMenuOpen: (isOpen: boolean) => void
}

export const useSidebarStore = create<SidebarState>(set => ({
  activeKey: 'Dashboard',
  setActiveKey: key => set({ activeKey: key }),
  isMenuOpen: typeof window !== 'undefined' ? window.innerWidth >= 1280 : true,
  toggleMenu: () => set(state => ({ isMenuOpen: !state.isMenuOpen })),
  setMenuOpen: isOpen => set({ isMenuOpen: isOpen }),
}))
