const RAW_STATIC_BASE_URL = import.meta.env.VITE_STATIC_BASE_URL ?? ''
const STATIC_BASE_URL = RAW_STATIC_BASE_URL ? RAW_STATIC_BASE_URL.replace(/\/$/, '') : ''

export const getStaticUrl = (url: string) => {
  if (!url)
    return url
  if (/^(https?:)?\/\//i.test(url) || /^data:/i.test(url) || /^blob:/i.test(url))
    return url
  if (STATIC_BASE_URL && url.startsWith(STATIC_BASE_URL))
    return url
  if (!STATIC_BASE_URL)
    return url
  if (url.startsWith('/'))
    return `${STATIC_BASE_URL}${url}`
  return `${STATIC_BASE_URL}/${url}`
}
