import { Input, Modal, ModalContent } from '@heroui/react'
import { useNavigate } from '@tanstack/react-router'

interface SearchModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onClose: () => void
}

export function SearchModal({ isOpen, onOpenChange, onClose }: SearchModalProps) {
  const navigate = useNavigate()

  const quickLinks = [
    { title: '仪表盘', path: '/dashboard' },
    { title: '分析', path: '/dashboard/analytics' },
    { title: '电商', path: '/dashboard/ecommerce', active: true },
    { title: '项目', path: '/dashboard/project' },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top-center"
      hideCloseButton
      size="2xl"
      classNames={{
        base: 'bg-white dark:bg-dark shadow-2xl rounded-2xl overflow-hidden',
      }}
    >
      <ModalContent>
        {() => (
          <div className="w-full">
            <div className="p-4 border-b border-default-100">
              <Input
                classNames={{
                  base: 'w-full h-10',
                  mainWrapper: 'h-full',
                  input: 'text-base',
                  inputWrapper: 'h-full font-normal text-default-500 bg-transparent hover:bg-transparent group-data-[focus=true]:bg-transparent !cursor-text transition-colors border-2 border-default-200 group-data-[focus=true]:border-primary rounded-full px-6 shadow-none data-[hover=true]:bg-transparent',
                  innerWrapper: 'gap-3',
                }}
                placeholder="搜索仪表盘..."
                isClearable
                autoFocus
              />
            </div>
            <div className="px-6 py-4">
              <h3 className="text-lg font-semibold mb-4 text-default-900">快速页面链接</h3>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {quickLinks.map(item => (
                  <div
                    key={item.path}
                    className="group flex flex-col gap-1 cursor-pointer p-2 rounded-lg hover:bg-default-100 transition-colors"
                    onClick={() => {
                      navigate({ to: item.path })
                      onClose()
                    }}
                  >
                    <span className={`text-base font-medium ${item.active ? 'text-primary' : 'text-default-700'}`}>{item.title}</span>
                    <span className="text-sm text-default-400">{item.path}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  )
}
