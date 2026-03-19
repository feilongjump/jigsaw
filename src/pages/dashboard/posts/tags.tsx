import type { CreateTagRequest, Tag, UpdateTagRequest } from '@/types/post'
import { addToast, Button, Chip, closeToast, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, useDisclosure } from '@heroui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { createTag, deleteTag, getTags, updateTag } from '@/api/post'

export const Route = createFileRoute('/dashboard/posts/tags')({
  component: PostTags,
})

function PostTags() {
  const queryClient = useQueryClient()
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const { data: tagsData, isLoading } = useQuery({ queryKey: ['post_tags'], queryFn: getTags })
  const [editingTag, setEditingTag] = useState<Tag | null>(null)

  const tags = useMemo(() => {
    if (!tagsData)
      return []
    if (Array.isArray(tagsData))
      return tagsData
    return (tagsData as { list: Tag[] }).list || []
  }, [tagsData])

  const createMutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post_tags'] })
      onClose()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: UpdateTagRequest }) => updateTag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post_tags'] })
      onClose()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post_tags'] })
      addToast({
        title: '删除标签成功',
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

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag)
    onOpen()
  }

  const handleCreate = () => {
    setEditingTag(null)
    onOpen()
  }

  const handleSubmit = (data: CreateTagRequest) => {
    if (editingTag) {
      updateMutation.mutate({ id: editingTag.id, data })
    }
    else {
      createMutation.mutate(data)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">文章标签管理</h1>
        <Button color="primary" onPress={handleCreate} startContent={<span className="icon-[solar--add-circle-line-duotone]" />}>
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
                  onClick={() => handleEdit(tag)}
                  variant="flat"
                  color="warning"
                  className="cursor-pointer hover:opacity-80"
                >
                  {tag.name}
                </Chip>
              ))}
              {(!tags || tags.length === 0) && <p className="text-default-500">暂无标签</p>}
            </div>
          )}

      <CreateTagModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        onSubmit={handleSubmit}
        initialData={editingTag}
        loading={createMutation.isPending || updateMutation.isPending}
      />

    </div>
  )
}

interface CreateTagModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
  onSubmit: (data: CreateTagRequest) => void
  initialData?: Tag | null
  loading?: boolean
}

function CreateTagModal({ isOpen, onOpenChange, onClose, onSubmit, initialData, loading }: CreateTagModalProps) {
  const [name, setName] = useState('')

  if (isOpen && initialData && name !== initialData.name && !name) {
    setName(initialData.name)
  }

  useMemo(() => {
    if (isOpen) {
      setName(initialData ? initialData.name : '')
    }
  }, [isOpen, initialData])

  const handleSubmit = () => {
    if (!name.trim())
      return
    onSubmit({ name })
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>{initialData ? '编辑标签' : '创建标签'}</ModalHeader>
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
                {initialData ? '更新' : '创建'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
