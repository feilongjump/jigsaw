import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { loginAPI, signUpAPI } from '@/api/auth'

const useUserStore = create(
  persist(
    set => ({
      user: null,
      setUser: user => set({ user }),
      loginStore: async (userAuthCreds) => {
        return loginAPI(userAuthCreds)
          .then((user) => {
            set({ user })
          })
      },
      signOutStore: () => set({ user: null }),
      signUpStore: async (userAuthCreds) => {
        return signUpAPI(userAuthCreds)
          .then((user) => {
            set({ user })
          })
      },
    }),
    {
      // 本地存储
      name: 'user',
      whiteList: ['user'],
    },
  ),
)

export default useUserStore
