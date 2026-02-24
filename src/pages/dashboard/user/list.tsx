import type { User, UserListResponse } from '@/types/user'
import {
  Chip,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  User as UserComponent,
} from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useCallback, useMemo, useState } from 'react'
import { getCurrentUser, getUsers } from '@/api/users'
import { getAvatarUrl, resolveAvatarUrl } from '@/utils/avatar'

export const Route = createFileRoute('/dashboard/user/list')({
  component: UserList,
})

const columns = [
  { name: '用户', uid: 'user' },
  { name: '状态', uid: 'status' },
  { name: '创建时间', uid: 'created_at' },
  { name: '最后登录', uid: 'last_login_at' },
  { name: '操作', uid: 'actions' },
]

function UserList() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const rowsPerPage = 10

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  })

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, rowsPerPage],
    queryFn: () => getUsers({ page, page_size: rowsPerPage }),
  })

  // Normalize data to always treat it as a list
  const users: User[] = useMemo(() => {
    if (!data)
      return []
    if (Array.isArray(data))
      return data
    return (data as UserListResponse).list
  }, [data])

  const total = useMemo(() => {
    if (!data)
      return 0
    if (Array.isArray(data))
      return data.length
    return (data as UserListResponse).total
  }, [data])

  const pages = useMemo(() => {
    return data ? Math.ceil(total / rowsPerPage) : 0
  }, [data, total, rowsPerPage])

  const renderCell = useCallback((user: User, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof User]

    switch (columnKey) {
      case 'user':
        return (
          <UserComponent
            avatarProps={{ radius: 'lg', src: resolveAvatarUrl(user.avatar) || getAvatarUrl(user.username) }}
            description={user.email}
            name={user.username}
          >
            {user.email}
          </UserComponent>
        )
      case 'status':
        return (
          <Chip className="capitalize" color="success" size="sm" variant="flat">
            Active
          </Chip>
        )
      case 'created_at':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">{new Date(user.created_at).toLocaleDateString()}</p>
            <p className="text-tiny text-default-400">{new Date(user.created_at).toLocaleTimeString()}</p>
          </div>
        )
      case 'last_login_at':
        return user.last_login_at
          ? (
              <div className="flex flex-col">
                <p className="text-bold text-sm">{new Date(user.last_login_at).toLocaleDateString()}</p>
                <p className="text-tiny text-default-400">{new Date(user.last_login_at).toLocaleTimeString()}</p>
              </div>
            )
          : (
              <span className="text-default-400">-</span>
            )
      case 'actions': {
        const canEdit = currentUser?.id === user.id
        return (
          <div className="relative flex items-center justify-center gap-2">
            <Tooltip content={canEdit ? '编辑用户' : '只能编辑自己的资料'}>
              <span
                className={`text-lg transition-opacity ${
                  canEdit
                    ? 'cursor-pointer text-default-400 active:opacity-50'
                    : 'cursor-not-allowed text-default-200'
                }`}
                onClick={() => {
                  if (canEdit) {
                    navigate({ to: '/dashboard/user/profile' })
                  }
                }}
              >
                <span className="icon-[solar--pen-new-square-line-duotone]" />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="禁止删除用户">
              <span className="cursor-not-allowed text-lg text-default-200">
                <span className="icon-[solar--trash-bin-minimalistic-line-duotone]" />
              </span>
            </Tooltip>
          </div>
        )
      }
      default:
        return cellValue
    }
  }, [currentUser, navigate])

  return (
    <div className="h-full w-full">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Users</h1>
        </div>
        <Table
          aria-label="Example table with custom cells"
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
          classNames={{
            wrapper: 'min-h-[222px]',
          }}
        >
          <TableHeader columns={columns}>
            {column => (
              <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent="No users found"
            items={users}
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
      </div>
    </div>
  )
}
