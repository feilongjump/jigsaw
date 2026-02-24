export const MenuItem = [
  {
    key: 'Dashboard',
    title: '仪表盘',
    icon: 'icon-[solar--star-rings-line-duotone]',
  },
  {
    key: 'Bookmark',
    title: '书签',
    icon: 'icon-[solar--book-bookmark-line-duotone]',
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

export const SubMenuData: Record<string, { title: string, items: { key: string, title: string, icon: string, path: string }[] }[]> = {
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
  Bookmark: [
    {
      title: 'Bookmark',
      items: [
        { key: 'all', title: 'All Bookmarks', icon: 'icon-[solar--bookmark-square-line-duotone]', path: '/bookmark/all' },
        { key: 'favorites', title: 'Favorites', icon: 'icon-[solar--heart-line-duotone]', path: '/bookmark/favorites' },
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
