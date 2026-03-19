import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'

interface ConfirmModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
  onConfirm: () => void
  title: string
  content: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
}

export function ConfirmModal({
  isOpen,
  onOpenChange,
  onClose,
  onConfirm,
  title,
  content,
  confirmText = '确定',
  cancelText = '取消',
  loading = false,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
              <p>{content}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                {cancelText}
              </Button>
              <Button color="primary" onPress={onConfirm} isLoading={loading}>
                {confirmText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
