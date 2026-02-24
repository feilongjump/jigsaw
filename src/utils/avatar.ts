export function getAvatarUrl(seed: string) {
  const url = new URL('https://api.dicebear.com/9.x/notionists/svg')
  url.searchParams.set('seed', seed)
  url.searchParams.set('backgroundColor', 'b6e3f4,c0aede,d1d4f9,ffdfbf')
  url.searchParams.set('backgroundType', 'gradientLinear,solid')
  return url.href
}

export function resolveAvatarUrl(path?: string) {
  if (!path)
    return undefined
  if (path.startsWith('http') || path.startsWith('blob:'))
    return path
  const baseUrl = import.meta.env.VITE_STATIC_BASE_URL || import.meta.env.VITE_API_BASE_URL
  return `${baseUrl}${path}`
}
