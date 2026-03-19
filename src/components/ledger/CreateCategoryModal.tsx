import type { CategoryType, CreateCategoryRequest } from '@/types/ledger'
import { addToast, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs } from '@heroui/react'
import { useMutation } from '@tanstack/react-query'
import { useMemo, useRef, useState } from 'react'
import { uploadFile } from '@/api/files'
import { resolveAvatarUrl } from '@/utils/avatar'

interface CreateCategoryModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
  onSubmit: (data: CreateCategoryRequest) => void
  loading?: boolean
}

export function CreateCategoryModal({ isOpen, onOpenChange, onClose, onSubmit, loading }: CreateCategoryModalProps) {
  const [name, setName] = useState('')
  const [type, setType] = useState<CategoryType>('expense')
  const [icon, setIcon] = useState('')
  const [iconType, setIconType] = useState<'iconify' | 'upload'>('iconify')
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const uploadMutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: (payload) => {
      setIcon(payload.path)
      setIconType('upload')
    },
    onError: (error) => {
      addToast({
        title: '上传失败',
        description: error instanceof Error ? error.message : '上传失败',
        color: 'danger',
      })
    },
  })

  const previewUrl = useMemo(() => {
    if (!icon || iconType !== 'upload')
      return ''
    return resolveAvatarUrl(icon) || ''
  }, [icon, iconType])

  const handleSubmit = () => {
    const nextIcon = iconType === 'iconify' ? icon : (icon || '')
    onSubmit({ name, type, icon: nextIcon })
  }

  const handleSelectFile = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadMutation.mutate(file)
    }
    event.target.value = ''
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>创建分类</ModalHeader>
            <ModalBody>
              <Tabs
                fullWidth
                selectedKey={type}
                onSelectionChange={key => setType(key as CategoryType)}
              >
                <Tab key="expense" title="支出" />
                <Tab key="income" title="收入" />
              </Tabs>
              <Input
                autoFocus
                label="分类名称"
                placeholder="例如：餐饮、交通"
                variant="bordered"
                value={name}
                onValueChange={setName}
              />
              <Tabs
                fullWidth
                selectedKey={iconType}
                onSelectionChange={key => setIconType(key as 'iconify' | 'upload')}
              >
                <Tab key="iconify" title="Iconify" />
                <Tab key="upload" title="上传图片" />
              </Tabs>
              {iconType === 'iconify'
                ? (
                    <Input
                      label="图标名称"
                      placeholder="例如：solar:home-smile-angle-linear"
                      variant="bordered"
                      value={icon}
                      onValueChange={setIcon}
                    />
                  )
                : (
                    <div className="flex flex-col gap-3">
                      <Button
                        color="primary"
                        variant="flat"
                        onPress={handleSelectFile}
                        isLoading={uploadMutation.isPending}
                      >
                        选择图片
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      {previewUrl && (
                        <img src={previewUrl} alt="分类图标" className="h-16 w-16 rounded-lg object-cover border border-default-200" />
                      )}
                    </div>
                  )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                取消
              </Button>
              <Button color="primary" onPress={handleSubmit} isLoading={loading}>
                创建
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
