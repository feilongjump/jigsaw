export interface MenuItemConfig {
  key: string
  title: string
  icon: string
}

export interface SubMenuItemConfig {
  key: string
  title: string
  icon: string
  path: string
  matchPaths?: string[]
}

export interface SubMenuSectionConfig {
  title: string
  items: SubMenuItemConfig[]
}

export const MenuItem: MenuItemConfig[] = [
  {
    key: 'Dashboard',
    title: '仪表盘',
    icon: 'icon-[solar--star-rings-line-duotone]',
  },
  {
    key: 'Post',
    title: '文章',
    icon: 'icon-[solar--document-text-line-duotone]',
  },
  {
    key: 'Investment',
    title: '投资',
    icon: 'icon-[solar--diagram-up-bold-duotone]',
  },
  {
    key: 'Weather',
    title: '天气',
    icon: 'icon-[solar--sun-fog-line-duotone]',
  },
  {
    key: 'Map',
    title: '地图',
    icon: 'icon-[solar--point-on-map-line-duotone]',
  },
  {
    key: 'Ledger',
    title: '记账',
    icon: 'icon-[solar--wallet-money-line-duotone]',
  },
  {
    key: 'User',
    title: '用户',
    icon: 'icon-[solar--user-hand-up-line-duotone]',
  },
  {
    key: 'Setting',
    title: '设置',
    icon: 'icon-[solar--tuning-square-2-line-duotone]',
  },
]

export const SubMenuData: Record<string, SubMenuSectionConfig[]> = {
  Dashboard: [
    {
      title: '仪表盘',
      items: [
        { key: 'dashboard', title: '仪表盘', icon: 'icon-[solar--star-rings-line-duotone]', path: '/dashboard' },
        { key: 'analytics', title: '分析', icon: 'icon-[solar--chart-square-line-duotone]', path: '/dashboard/analytics' },
        { key: 'ecommerce', title: '电商', icon: 'icon-[solar--cart-large-2-line-duotone]', path: '/dashboard/ecommerce' },
        { key: 'project', title: '项目', icon: 'icon-[solar--clipboard-list-line-duotone]', path: '/dashboard/project' },
        { key: 'crm', title: '客户管理', icon: 'icon-[solar--users-group-two-rounded-line-duotone]', path: '/dashboard/crm' },
      ],
    },
  ],
  Investment: [
    {
      title: 'Investment',
      items: [
        { key: 'portfolio', title: 'Portfolio', icon: 'icon-[solar--pie-chart-2-line-duotone]', path: '/investment/portfolio' },
        { key: 'stocks', title: 'Stocks', icon: 'icon-[solar--graph-up-line-duotone]', path: '/investment/stocks' },
      ],
    },
  ],
  Weather: [
    {
      title: 'Weather',
      items: [
        { key: 'today', title: 'Today', icon: 'icon-[solar--sun-fog-line-duotone]', path: '/weather/today' },
        { key: 'forecast', title: 'Forecast', icon: 'icon-[solar--calendar-line-duotone]', path: '/weather/forecast' },
      ],
    },
  ],
  Map: [
    {
      title: 'Map',
      items: [
        { key: 'google-map', title: 'Google Map', icon: 'icon-[solar--map-point-line-duotone]', path: '/map/google' },
        { key: 'vector-map', title: 'Vector Map', icon: 'icon-[solar--global-line-duotone]', path: '/map/vector' },
      ],
    },
  ],
  Ledger: [
    {
      title: '记账管理',
      items: [
        { key: 'overview', title: '概览', icon: 'icon-[solar--chart-square-line-duotone]', path: '/dashboard/ledger/overview' },
        { key: 'wallets', title: '钱包', icon: 'icon-[solar--wallet-line-duotone]', path: '/dashboard/ledger/wallets' },
        { key: 'transactions', title: '流水', icon: 'icon-[solar--bill-list-line-duotone]', path: '/dashboard/ledger/transactions' },
        { key: 'categories', title: '分类', icon: 'icon-[solar--tag-line-duotone]', path: '/dashboard/ledger/categories' },
        { key: 'tags', title: '标签', icon: 'icon-[solar--bookmark-circle-line-duotone]', path: '/dashboard/ledger/tags' },
      ],
    },
  ],
  Post: [
    {
      title: '文章管理',
      items: [
        { key: 'list', title: '文章列表', icon: 'icon-[solar--document-text-line-duotone]', path: '/dashboard/posts/list', matchPaths: ['/dashboard/posts/edit'] },
        { key: 'create', title: '写文章', icon: 'icon-[solar--pen-new-square-line-duotone]', path: '/dashboard/posts/create' },
        { key: 'tags', title: '文章标签', icon: 'icon-[solar--tag-line-duotone]', path: '/dashboard/posts/tags' },
      ],
    },
  ],
  User: [
    {
      title: '用户管理',
      items: [
        { key: 'list', title: '用户列表', icon: 'icon-[solar--users-group-two-rounded-line-duotone]', path: '/dashboard/user/list' },
        { key: 'profile', title: '个人资料', icon: 'icon-[solar--user-circle-line-duotone]', path: '/dashboard/user/profile' },
      ],
    },
  ],
  Setting: [
    {
      title: 'Settings',
      items: [
        { key: 'general', title: 'General', icon: 'icon-[solar--settings-minimalistic-line-duotone]', path: '/settings/general' },
        { key: 'security', title: 'Security', icon: 'icon-[solar--shield-check-line-duotone]', path: '/settings/security' },
        { key: 'notifications', title: 'Notifications', icon: 'icon-[solar--bell-line-duotone]', path: '/settings/notifications' },
      ],
    },
  ],
}
