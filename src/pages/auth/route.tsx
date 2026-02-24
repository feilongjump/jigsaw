import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import bg1 from '@/assets/bg-1.jpg'
import bg2 from '@/assets/bg-2.jpg'

import 'swiper/css'
import 'swiper/css/autoplay'

export const Route = createFileRoute('/auth')({
  beforeLoad: ({ location }) => {
    if (location.pathname === '/auth') {
      throw redirect({
        to: '/auth/sign-in',
      })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  const images = [bg1, bg2]

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* 左侧 - 表单 */}
      <div className="flex w-full flex-col justify-center bg-white px-4 py-12 sm:px-6 lg:w-1/3 lg:px-8 xl:px-12 dark:bg-background">
        <div className="mx-auto w-full max-w-sm">
          <Outlet />
        </div>
      </div>

      {/* 右侧 - 轮播图 */}
      <div className="hidden lg:relative lg:block lg:w-2/3">
        <div className="absolute inset-0 h-full w-full bg-default-900 overflow-hidden">
          <Swiper
            modules={[Autoplay]}
            autoplay={{
              delay: 6000,
              disableOnInteraction: false,
            }}
            loop
            className="h-full w-full"
          >
            {images.map((img, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <SwiperSlide key={index}>
                <img
                  src={img}
                  alt="Background"
                  className="h-full w-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="absolute bottom-0 left-0 right-0 p-20 z-10 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-md">
                欢迎使用 Jigsaw
              </h2>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
