import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User } from '@heroui/react'

export function UserDropdown() {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="primary"
          name="Jason Hughes"
          size="sm"
          src="https://api.dicebear.com/7.x/notionists/svg?seed=man"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="个人资料操作" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <User
            name="Jason Hughes"
            description="zoey@example.com"
            classNames={{
              name: 'text-default-600',
              description: 'text-default-500',
            }}
            avatarProps={{
              size: 'sm',
              src: 'https://api.dicebear.com/7.x/notionists/svg?seed=man',
            }}
          />
        </DropdownItem>
        <DropdownItem
          key="settings"
        >
          我的设置
        </DropdownItem>
        <DropdownItem key="logout" color="danger" className="text-danger">
          退出登录
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
