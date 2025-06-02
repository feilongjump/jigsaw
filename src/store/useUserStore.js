import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { loginAPI, signUpAPI } from '@/api/auth'

const useUserStore = create(
  persist(
    set => ({
      user: null,
      setUser: user => set({ user }),
      logoutStore: () => set({ user: null }),
      loginStore: async (userAuthCreds) => {
        return loginAPI(userAuthCreds)
          .then((user) => {
            set({ user })
          })
      },
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
