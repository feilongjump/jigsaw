import type { Post, PostListResponse } from '@/types/post'
import { addToast, Button, closeToast, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure } from '@heroui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { deletePost, getPosts } from '@/api/post'
import { VditorPreview } from '@/components/shared/VditorPreview'

export const Route = createFileRoute('/dashboard/posts/list')({
  component: PostList,
})

const columns = [
  { name: '标题', uid: 'title' },
  { name: '摘要', uid: 'summary' },
  { name: '标签', uid: 'tags' },
  { name: '创建时间', uid: 'created_at' },
  { name: '操作', uid: 'actions' },
]

function PostList() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [page, setPage] = useState(1)
  const rowsPerPage = 10
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  const { data: postsData, isLoading } = useQuery({
    queryKey: ['posts', page, rowsPerPage],
    queryFn: () => getPosts({ page, page_size: rowsPerPage }),
  })

  const posts = useMemo(() => {
    if (!postsData)
      return []
    if (Array.isArray(postsData))
      return postsData
    return (postsData as PostListResponse).list
  }, [postsData])

  const total = useMemo(() => {
    if (!postsData)
      return 0
    if (Array.isArray(postsData))
      return postsData.length
    return (postsData as PostListResponse).total
  }, [postsData])

  const pages = useMemo(() => {
    return postsData ? Math.ceil(total / rowsPerPage) : 0
  }, [postsData, total, rowsPerPage])

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      addToast({
        title: '删除文章成功',
        color: 'success',
      })
    },
  })

  const handleDelete = (id: number) => {
    let toastKey: string | null = null
    toastKey = addToast({
      title: '确定要删除这篇文章吗？',
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

  const handleView = (post: Post) => {
    setSelectedPost(post)
    onOpen()
  }

  const renderCell = (post: Post, columnKey: React.Key) => {
    switch (columnKey) {
      case 'title':
        return post.title
      case 'summary':
        return post.summary || '-'
      case 'tags':
        if (!post.tags)
          return '-'
        if (Array.isArray(post.tags)) {
          const tagNames = post.tags.map(tag => typeof tag === 'string' ? tag : tag.name).filter(Boolean)
          return tagNames.length > 0 ? tagNames.join(', ') : '-'
        }
        return post.tags
      case 'created_at':
        return new Date(post.created_at).toLocaleDateString()
      case 'actions':
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="预览">
              <span
                className="cursor-pointer text-lg text-default-400 active:opacity-50 hover:text-secondary"
                onClick={() => handleView(post)}
              >
                <span className="icon-[solar--eye-line-duotone]" />
              </span>
            </Tooltip>
            <Tooltip content="编辑">
              <span
                className="cursor-pointer text-lg text-default-400 active:opacity-50 hover:text-primary"
                onClick={() => navigate({ to: `/dashboard/posts/edit/${post.id}` })}
              >
                <span className="icon-[solar--pen-new-square-line-duotone]" />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="删除">
              <span
                className="cursor-pointer text-lg text-danger active:opacity-50"
                onClick={() => handleDelete(post.id)}
              >
                <span className="icon-[solar--trash-bin-minimalistic-line-duotone]" />
              </span>
            </Tooltip>
          </div>
        )
      default:
        return typeof columnKey === 'string'
          ? String((post as unknown as Record<string, unknown>)[columnKey] ?? '-')
          : '-'
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="light"
            onPress={() => queryClient.invalidateQueries({ queryKey: ['posts'] })}
            startContent={<span className="icon-[solar--refresh-line-duotone]" />}
            isLoading={isLoading}
          >
            刷新
          </Button>
          <Button color="primary" onPress={() => navigate({ to: '/dashboard/posts/create' })} startContent={<span className="icon-[solar--add-circle-line-duotone]" />}>
            写文章
          </Button>
        </div>
      </div>

      <Table
        aria-label="Posts table"
        bottomContent={pages > 0
          ? (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={pages}
                  onChange={setPage}
                />
              </div>
            )
          : null}
      >
        <TableHeader columns={columns}>
          {column => <TableColumn key={column.uid}>{column.name}</TableColumn>}
        </TableHeader>
        <TableBody
          items={posts}
          emptyContent="暂无文章"
          loadingContent={<Spinner />}
          loadingState={isLoading ? 'loading' : 'idle'}
        >
          {item => (
            <TableRow key={item.id}>
              {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <DrawerContent>
          {onClose => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                {selectedPost?.title}
              </DrawerHeader>
              <DrawerBody>
                {selectedPost && (
                  <VditorPreview markdown={selectedPost.content_markdown || ''} />
                )}
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  关闭
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose()
                    navigate({ to: `/dashboard/posts/edit/${selectedPost?.id}` })
                  }}
                >
                  编辑
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  )
}
