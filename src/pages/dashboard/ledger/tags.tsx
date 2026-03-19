import type { CreateLedgerTagRequest } from '@/types/ledger'
import { addToast, Button, Chip, closeToast, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, useDisclosure } from '@heroui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { createLedgerTag, deleteLedgerTag, getLedgerTags } from '@/api/ledger'

export const Route = createFileRoute('/dashboard/ledger/tags')({
  component: LedgerTags,
})

function LedgerTags() {
  const queryClient = useQueryClient()
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const { data: tags, isLoading } = useQuery({ queryKey: ['ledger_tags'], queryFn: getLedgerTags })

  const createMutation = useMutation({
    mutationFn: createLedgerTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ledger_tags'] })
      onClose()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteLedgerTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ledger_tags'] })
      addToast({
        title: '删除记账标签成功',
        color: 'success',
      })
    },
  })

  const handleDelete = (id: number) => {
    let toastKey: string | null = null
    toastKey = addToast({
      title: '确定要删除这个标签吗？',
      color: 'danger',
      timeout: 3000,
      shouldShowTimeoutProgress: true,
      endContent: (
        <Button
          size="sm"
          color="danger"
          variant="flat"
          onPress={() => {
            deleteMutation.mutate(id)
            if (toastKey)
              closeToast(toastKey)
          }}
        >
          Delete
        </Button>
      ),
    })
  }

  const handleSubmit = (data: CreateLedgerTagRequest) => {
    createMutation.mutate(data)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">记账标签管理</h1>
        <Button color="primary" onPress={onOpen} startContent={<span className="icon-[solar--add-circle-line-duotone]" />}>
          创建标签
        </Button>
      </div>

      {isLoading
        ? (
            <div className="flex justify-center p-10"><Spinner /></div>
          )
        : (
            <div className="flex flex-wrap gap-2">
              {tags?.map(tag => (
                <Chip
                  key={tag.id}
                  onClose={() => handleDelete(tag.id)}
                  variant="flat"
                  color="secondary"
                >
                  {tag.name}
                </Chip>
              ))}
              {(!tags || tags.length === 0) && <p className="text-default-500">暂无标签</p>}
            </div>
          )}

      <CreateLedgerTagModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        onSubmit={handleSubmit}
        loading={createMutation.isPending}
      />

    </div>
  )
}

interface CreateLedgerTagModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
  onSubmit: (data: CreateLedgerTagRequest) => void
  loading?: boolean
}

function CreateLedgerTagModal({ isOpen, onOpenChange, onClose, onSubmit, loading }: CreateLedgerTagModalProps) {
  const [name, setName] = useState('')

  const handleSubmit = () => {
    if (!name.trim())
      return
    onSubmit({ name })
    setName('')
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
