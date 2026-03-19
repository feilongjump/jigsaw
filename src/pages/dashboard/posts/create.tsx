import type { CreateTagRequest, Tag } from '@/types/post'
import { addToast, Button, Input, Select, SelectItem, useDisclosure } from '@heroui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { createPost, createTag, getTags } from '@/api/post'
import { CreatePostTagModal } from '@/components/posts/CreatePostTagModal'
import { VditorEditor } from '@/components/shared/VditorEditor'

export const Route = createFileRoute('/dashboard/posts/create')({
  component: PostEditor,
})

function PostEditor() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isOpen: isCreateTagOpen, onOpen: onCreateTagOpen, onOpenChange: onCreateTagOpenChange, onClose: onCreateTagClose } = useDisclosure()
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<Set<string>>(() => new Set([]))

  const { data: tagsData } = useQuery({ queryKey: ['post_tags'], queryFn: getTags })

  const tags = useMemo(() => {
    if (!tagsData)
      return []
    if (Array.isArray(tagsData))
      return tagsData
    return (tagsData as { list: Tag[] }).list || []
  }, [tagsData])

  const tagOptions = useMemo(() => {
    return [
      ...tags.map(tag => ({ name: tag.name, isCreate: false })),
      { name: '__create_tag__', isCreate: true },
    ]
  }, [tags])

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      navigate({ to: '/dashboard/posts/list' })
    },
  })

  const createTagMutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post_tags'] })
      addToast({
        title: '创建标签成功',
        color: 'success',
      })
      onCreateTagClose()
    },
  })

  const handleSubmit = () => {
    if (!title || !content)
      return

    createMutation.mutate({
      title,
      summary,
      content_markdown: content,
      content_html: content,
      tags: Array.from(selectedTags),
    })
  }

  const handleCreateTag = (data: CreateTagRequest) => {
    createTagMutation.mutate(data)
  }

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">写文章</h1>
        <Button color="primary" onPress={handleSubmit} isLoading={createMutation.isPending}>
          发布
        </Button>
      </div>

      <Input
        label="标题"
        placeholder="输入文章标题"
        value={title}
        onValueChange={setTitle}
        variant="underlined"
        size="lg"
      />

      <Input
        label="摘要"
        placeholder="输入文章摘要（可选）"
        value={summary}
        onValueChange={setSummary}
        variant="underlined"
      />

      <Select
        label="标签"
        placeholder="选择标签"
        selectionMode="multiple"
        selectedKeys={selectedTags}
        onSelectionChange={(keys) => {
          const nextKeys = new Set(keys as Set<string>)
          if (nextKeys.has('__create_tag__')) {
            nextKeys.delete('__create_tag__')
            setSelectedTags(nextKeys)
            onCreateTagOpen()
            return
          }
          setSelectedTags(nextKeys)
        }}
        variant="underlined"
        items={tagOptions}
      >
        {item => (
          <SelectItem key={item.name}>
            {item.isCreate ? '新增标签' : item.name}
          </SelectItem>
        )}
      </Select>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-2">
          <h3 className="text-sm font-bold text-default-500">内容编辑</h3>
          <VditorEditor
            value={content}
            onChange={setContent}
            height={600}
            placeholder="开始写作..."
          />
        </div>
      </div>

      <CreatePostTagModal
        isOpen={isCreateTagOpen}
        onOpenChange={onCreateTagOpenChange}
        onClose={onCreateTagClose}
        onSubmit={handleCreateTag}
        loading={createTagMutation.isPending}
      />
    </div>
  )
}
