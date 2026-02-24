import { addToast, Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure, User } from '@heroui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { clearAuthToken } from '@/api/auth'
import { getApiErrorMessage } from '@/api/client'
import { uploadFile } from '@/api/files'
import { getCurrentUser, updatePassword, updateUser } from '@/api/users'
import { getAvatarUrl, resolveAvatarUrl } from '@/utils/avatar'

export function UserDropdown() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const passwordModal = useDisclosure()
  const avatarModal = useDisclosure()
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  })
  const [avatarPreview, setAvatarPreview] = useState('')
  const [passwordForm, setPasswordForm] = useState({ old: '', next: '' })
  const [passwordErrors, setPasswordErrors] = useState<{ old?: string, next?: string }>({})

  const displayName = useMemo(() => user?.username || '用户', [user?.username])
  const displayEmail = useMemo(() => user?.email || '', [user?.email])
  const displayAvatar = useMemo(() => resolveAvatarUrl(avatarPreview || user?.avatar) || getAvatarUrl(user?.username || 'default'), [avatarPreview, user?.avatar, user?.username])

  const updateUserMutation = useMutation({
    mutationFn: (payload: { avatar?: string, email?: string }) => {
      if (!user?.id)
        throw new Error('用户ID不存在')
      return updateUser(user.id, payload)
    },
    onSuccess: () => {
      addToast({
        title: '更新成功',
        description: '头像已更新',
        color: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      setAvatarPreview('')
      avatarModal.onClose()
    },
    onError: (error) => {
      addToast({
        title: '更新失败',
        description: getApiErrorMessage(error),
        color: 'danger',
      })
    },
  })

  const uploadMutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: (payload) => {
      const nextAvatar = payload.path
      setAvatarPreview(nextAvatar)
      updateUserMutation.mutate({ avatar: nextAvatar })
    },
    onError: (error) => {
      addToast({
        title: '上传失败',
        description: getApiErrorMessage(error),
        color: 'danger',
      })
    },
  })

  const handleOpenPasswordModal = () => {
    setPasswordForm({ old: '', next: '' })
    setPasswordErrors({})
    passwordModal.onOpen()
  }

  const handleOpenAvatarModal = () => {
    setAvatarPreview(user?.avatar || '')
    avatarModal.onOpen()
  }

  const updatePasswordMutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      addToast({
        title: '修改成功',
        description: '密码已更新，请重新登录',
        color: 'success',
      })
      passwordModal.onClose()
      clearAuthToken()
      navigate({ to: '/auth/sign-in' })
    },
    onError: (error) => {
      addToast({
        title: '修改失败',
        description: getApiErrorMessage(error),
        color: 'danger',
      })
    },
  })

  const handlePasswordSubmit = () => {
    const nextErrors: { old?: string, next?: string } = {}
    if (!passwordForm.old) {
      nextErrors.old = '请输入当前密码'
    }
    if (!passwordForm.next) {
      nextErrors.next = '请输入新密码'
    }

    if (Object.keys(nextErrors).length > 0) {
      setPasswordErrors(nextErrors)
      return
    }

    setPasswordErrors({})
    updatePasswordMutation.mutate({
      old_password: passwordForm.old,
      new_password: passwordForm.next,
    })
  }

  return (
    <>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            color="primary"
            name={displayName}
            size="sm"
            src={displayAvatar || undefined}
          />
        </DropdownTrigger>
        <DropdownMenu
          aria-label="个人资料操作"
          variant="flat"
          onAction={(key) => {
            if (key === 'password') {
              handleOpenPasswordModal()
            }
            if (key === 'avatar') {
              handleOpenAvatarModal()
            }
            if (key === 'logout') {
              clearAuthToken()
              addToast({
                title: '退出登录',
                description: '已安全退出',
                color: 'success',
              })
              navigate({ to: '/auth/sign-in' })
            }
          }}
        >
          <DropdownItem key="profile" className="h-14 gap-2">
            <User
              name={displayName}
              description={displayEmail}
              classNames={{
                name: 'text-default-600',
                description: 'text-default-500',
              }}
              avatarProps={{
                size: 'sm',
                src: displayAvatar || undefined,
              }}
            />
          </DropdownItem>
          <DropdownItem key="password">修改密码</DropdownItem>
          <DropdownItem key="avatar">头像更新</DropdownItem>
          <DropdownItem key="logout" color="danger" className="text-danger">
            退出登录
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Modal
        isOpen={passwordModal.isOpen}
        onOpenChange={passwordModal.onOpenChange}
        placement="center"
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader>修改密码</ModalHeader>
              <ModalBody className="gap-4">
                <Input
                  label="新密码"
                  type="password"
                  value={passwordForm.next}
                  onValueChange={value => setPasswordForm(prev => ({ ...prev, next: value }))}
                  isInvalid={Boolean(passwordErrors.next)}
                  errorMessage={passwordErrors.next}
                  variant="underlined"
                  labelPlacement="outside"
                  classNames={{
                    label: 'text-default-900',
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={onClose}
                >
                  取消
                </Button>
                <Button
                  color="primary"
                  onPress={handlePasswordSubmit}
                  isLoading={updatePasswordMutation.isPending}
                >
                  保存
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={avatarModal.isOpen}
        onOpenChange={avatarModal.onOpenChange}
        placement="center"
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader>头像更新</ModalHeader>
              <ModalBody className="gap-4">
                <div className="flex items-center gap-4">
                  <Avatar
                    size="lg"
                    name={displayName}
                    src={displayAvatar || undefined}
                  />
                  <div className="text-small text-default-500">选择新头像后自动上传</div>
                </div>
                <Input
                  label="选择头像"
                  type="file"
                  accept="image/*"
                  variant="bordered"
                  labelPlacement="outside"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) {
                      uploadMutation.mutate(file)
                    }
                    event.target.value = ''
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={onClose}
                >
                  关闭
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                  isLoading={uploadMutation.isPending || updateUserMutation.isPending}
                  isDisabled={uploadMutation.isPending || updateUserMutation.isPending}
                >
                  完成
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
