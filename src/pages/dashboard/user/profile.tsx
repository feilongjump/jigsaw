import { addToast, Avatar, Button, Input } from '@heroui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { clearAuthToken } from '@/api/auth'
import { getApiErrorMessage } from '@/api/client'
import { uploadFile } from '@/api/files'
import { getCurrentUser, updatePassword, updateUser } from '@/api/users'
import { resolveAvatarUrl } from '@/utils/avatar'

export const Route = createFileRoute('/dashboard/user/profile')({
  component: UserProfile,
})

function UserProfile() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { data: user, isFetching, refetch } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  })
  const [avatarPreview, setAvatarPreview] = useState('')

  const displayName = useMemo(() => user?.username || '用户', [user?.username])
  const displayEmail = useMemo(() => user?.email || '', [user?.email])
  const displayAvatar = useMemo(() => resolveAvatarUrl(avatarPreview || user?.avatar), [avatarPreview, user?.avatar])
  const lastLogin = useMemo(() => user?.last_login_at || '-', [user?.last_login_at])
  const createdAt = useMemo(() => user?.created_at || '-', [user?.created_at])

  const updateMutation = useMutation({
    mutationFn: (payload: { avatar?: string, email?: string }) => {
      if (!user?.id)
        throw new Error('用户ID不存在')
      return updateUser(user.id, payload)
    },
    onSuccess: () => {
      addToast({
        title: '更新成功',
        description: '个人信息已保存',
        color: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      setAvatarPreview('')
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
      updateMutation.mutate({ avatar: nextAvatar })
    },
    onError: (error) => {
      addToast({
        title: '上传失败',
        description: getApiErrorMessage(error),
        color: 'danger',
      })
    },
  })

  const handleSelectAvatar = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadMutation.mutate(file)
    }
    event.target.value = ''
  }

  const [email, setEmail] = useState(displayEmail)

  useEffect(() => {
    if (displayEmail && email !== displayEmail) {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setEmail(displayEmail)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayEmail])

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-default-900">个人资料</h1>
          <p className="text-small text-default-500 mt-1">查看并更新你的账号信息</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="light"
            onPress={() => refetch()}
            isLoading={isFetching}
          >
            刷新
          </Button>
          <Button
            color="primary"
            variant="flat"
            isLoading={updateMutation.isPending}
            onPress={() => updateMutation.mutate({ email })}
          >
            保存
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-2xl border border-default-200 bg-white p-6 shadow-sm dark:bg-dark">
          <div className="flex flex-col items-center gap-4">
            <Avatar
              isBordered
              size="lg"
              name={displayName}
              src={displayAvatar || undefined}
              className="h-24 w-24"
            />
            <div className="text-center">
              <div className="text-lg font-semibold text-default-900">{displayName}</div>
              <div className="text-small text-default-500">{displayEmail}</div>
            </div>

            <div className="grid w-full grid-cols-1 gap-3 text-small text-default-600">
              <div className="flex items-center justify-between">
                <span>最近登录</span>
                <span className="text-default-900">{lastLogin}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>创建时间</span>
                <span className="text-default-900">{createdAt}</span>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3">
              <Button
                color="primary"
                variant="flat"
                onPress={handleSelectAvatar}
                isLoading={uploadMutation.isPending}
              >
                更换头像
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <p className="text-tiny text-default-400 text-center">支持 JPG/PNG，上传后自动保存</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-default-200 bg-white p-6 shadow-sm dark:bg-dark">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-semibold text-default-900">基本信息</h2>
              <p className="text-small text-default-500 mt-1">修改你的个人资料</p>
            </div>
            <Input
              label="邮箱"
              placeholder="请输入邮箱"
              value={email}
              onValueChange={setEmail}
              variant="underlined"
              labelPlacement="outside"
              classNames={{
                label: 'text-default-900',
              }}
            />

            <div>
              <h2 className="text-lg font-semibold text-default-900">安全设置</h2>
              <p className="text-small text-default-500 mt-1">修改你的登录密码</p>
            </div>
            <PasswordForm />
          </div>
        </div>
      </div>
    </div>
  )
}

function PasswordForm() {
  const navigate = useNavigate()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [errors, setErrors] = useState<{ old?: string, new?: string }>({})

  const mutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      addToast({
        title: '修改成功',
        description: '密码已更新，请重新登录',
        color: 'success',
      })
      setOldPassword('')
      setNewPassword('')
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
    const nextErrors: { old?: string, new?: string } = {}

    if (!oldPassword) {
      nextErrors.old = '请输入当前密码'
    }

    if (!newPassword) {
      nextErrors.new = '请输入新密码'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    mutation.mutate({
      old_password: oldPassword,
      new_password: newPassword,
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="当前密码"
          placeholder="请输入当前密码"
          type="password"
          value={oldPassword}
          onValueChange={(val) => {
            setOldPassword(val)
            if (errors.old)
              setErrors(prev => ({ ...prev, old: undefined }))
          }}
          isInvalid={!!errors.old}
          errorMessage={errors.old}
          variant="underlined"
          labelPlacement="outside"
          classNames={{
            label: 'text-default-900',
          }}
        />
        <Input
          label="新密码"
          placeholder="请输入新密码"
          type="password"
          value={newPassword}
          onValueChange={(val) => {
            setNewPassword(val)
            if (errors.new)
              setErrors(prev => ({ ...prev, new: undefined }))
          }}
          isInvalid={!!errors.new}
          errorMessage={errors.new}
          variant="underlined"
          labelPlacement="outside"
          classNames={{
            label: 'text-default-900',
          }}
        />
      </div>
      <div className="flex justify-end">
        <Button
          color="primary"
          variant="flat"
          onPress={handlePasswordSubmit}
          isLoading={mutation.isPending}
        >
          修改密码
        </Button>
      </div>
    </div>
  )
}
