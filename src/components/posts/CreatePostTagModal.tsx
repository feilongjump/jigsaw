import type { CreateTagRequest } from '@/types/post'
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import { useEffect, useState } from 'react'

interface CreatePostTagModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
  onSubmit: (data: CreateTagRequest) => void
  loading?: boolean
}

export function CreatePostTagModal({ isOpen, onOpenChange, onClose, onSubmit, loading }: CreatePostTagModalProps) {
  const [name, setName] = useState('')

  useEffect(() => {
    if (isOpen)
      setName('')
  }, [isOpen])

  const handleSubmit = () => {
    const trimmed = name.trim()
    if (!trimmed)
      return
    onSubmit({ name: trimmed })
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>创建标签</ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label="标签名称"
                placeholder="输入标签名称"
                variant="bordered"
                value={name}
                onValueChange={setName}
              />
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
