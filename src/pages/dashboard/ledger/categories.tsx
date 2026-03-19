import type { CategoryType, CreateCategoryRequest } from '@/types/ledger'
import { addToast, Button, Card, CardBody, closeToast, Spinner, Tab, Tabs, useDisclosure } from '@heroui/react'
import { Icon } from '@iconify/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { createCategory, deleteCategory, getCategories } from '@/api/ledger'
import { CreateCategoryModal } from '@/components/ledger/CreateCategoryModal'
import { resolveAvatarUrl } from '@/utils/avatar'

export const Route = createFileRoute('/dashboard/ledger/categories')({
  component: Categories,
})

function Categories() {
  const queryClient = useQueryClient()
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const [selectedType, setSelectedType] = useState<CategoryType>('expense')

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories', selectedType],
    queryFn: () => getCategories(selectedType),
  })

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      onClose()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      addToast({
        title: '删除分类成功',
        color: 'success',
      })
    },
  })

  const handleDelete = (id: number) => {
    let toastKey: string | null = null
    toastKey = addToast({
      title: '确定要删除这个分类吗？',
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

  const handleSubmit = (data: CreateCategoryRequest) => {
    createMutation.mutate(data)
  }

  const getIconContent = (icon?: string) => {
    if (!icon)
      return <span className="icon-[solar--tag-line-duotone]" />
    const isImagePath = icon.startsWith('http')
      || icon.startsWith('/')
      || icon.startsWith('blob:')
      || icon.includes('/static/')
      || icon.startsWith('static/')
    if (isImagePath) {
      const src = resolveAvatarUrl(icon)
      return src ? <img src={src} alt="分类图标" className="h-8 w-8 rounded-lg object-cover" /> : <span className="icon-[solar--tag-line-duotone]" />
    }
    if (icon.includes(':'))
      return <Icon icon={icon} />
    return <span className="text-2xl leading-none">{icon}</span>
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">分类管理</h1>
        <Button color="primary" onPress={onOpen} startContent={<span className="icon-[solar--add-circle-line-duotone]" />}>
          创建分类
        </Button>
      </div>

      <Tabs
        selectedKey={selectedType}
        onSelectionChange={key => setSelectedType(key as CategoryType)}
        color="primary"
        variant="underlined"
      >
        <Tab key="expense" title="支出分类" />
        <Tab key="income" title="收入分类" />
      </Tabs>

      {isLoading
        ? (
            <div className="flex justify-center p-10"><Spinner /></div>
          )
        : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories?.map(category => (
                <Card key={category.id} isPressable onPress={() => {}} className="group relative">
                  <CardBody className="flex flex-col items-center justify-center gap-2 p-4">
                    <div className="text-3xl text-primary">
                      {getIconContent(category.icon)}
                    </div>
                    <div className="text-sm font-medium">{category.name}</div>
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        isIconOnly
                        size="sm"
                        color="danger"
                        variant="light"
                        onPress={() => handleDelete(category.id)}
                      >
                        <span className="icon-[solar--trash-bin-minimalistic-line-duotone]" />
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}

      <CreateCategoryModal
        key={`${selectedType}-${isOpen}`}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        onSubmit={handleSubmit}
        loading={createMutation.isPending}
      />

    </div>
  )
}
