export const getStaticUrl = (path: string | undefined | null): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const baseUrl = import.meta.env.VITE_STATIC_URL || '';
  // 确保路径以 / 开头
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  // 如果 baseUrl 结尾有 /，则移除
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${cleanBaseUrl}${cleanPath}`;
};

export const getRelativePath = (url: string | undefined | null): string => {
  if (!url) return '';
  const baseUrl = import.meta.env.VITE_STATIC_URL || '';
  // 如果 baseUrl 结尾有 /，则移除
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  if (url.startsWith(cleanBaseUrl)) {
    let relative = url.slice(cleanBaseUrl.length);
    // 确保相对路径不以 / 开头，如果 API 期望如此
    // OpenAPI 示例: "image/2026..." (无前导斜杠)
    if (relative.startsWith('/')) {
        relative = relative.slice(1);
    }
    return relative;
  }
  // 如果已经是相对路径（不以 http 开头）
  if (!url.startsWith('http')) {
      if (url.startsWith('/')) return url.slice(1);
      return url;
  }
  return url;
};
