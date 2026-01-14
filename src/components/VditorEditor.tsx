import { useEffect, useRef } from 'react'
import Vditor from 'vditor'
import { uploadFile } from '@/services/uploadService'

import { getStaticUrl } from '@/utils/url'
import 'vditor/dist/index.css'

interface VditorEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  noteId?: number
  onUploadSuccess?: (fileId: number) => void
}

export function VditorEditor({ value, onChange, className, placeholder, noteId, onUploadSuccess }: VditorEditorProps) {
  const vditorRef = useRef<Vditor | null>(null)
  const elementRef = useRef<HTMLDivElement>(null)
  const isInitializedRef = useRef(false)
  const latestValueRef = useRef(value)
  const latestNoteIdRef = useRef(noteId)
  const latestOnUploadSuccessRef = useRef(onUploadSuccess)

  // 保持 latestValueRef.current 为最新值
  latestValueRef.current = value
  latestNoteIdRef.current = noteId
  latestOnUploadSuccessRef.current = onUploadSuccess

  useEffect(() => {
    if (!elementRef.current || isInitializedRef.current)
      return

    const vditor = new Vditor(elementRef.current, {
      value: latestValueRef.current, // 使用当前的最新值初始化
      mode: 'ir', // 即时渲染模式
      height: '100%',
      width: '100%',
      placeholder,
      icon: 'ant',
      toolbarConfig: {
        pin: true,
      },
      cache: {
        enable: false,
      },
      upload: {
        accept: 'image/*',
        handler: async (files) => {
          const uploadedFiles: string[] = []
          for (const file of files) {
            try {
              const res = await uploadFile(file, 'notes', latestNoteIdRef.current ? String(latestNoteIdRef.current) : undefined)
              if (res.code === 0 && res.data) {
                // Vditor 期望的格式是 ![](url)
                const imageUrl = getStaticUrl(res.data.url)
                const name = res.data.name
                // 这里我们手动插入 Markdown 图片语法
                vditor.insertValue(`![${name}](${imageUrl})`)
                uploadedFiles.push(imageUrl)

                // 通知父组件文件上传成功
                if (res.data.id && latestOnUploadSuccessRef.current) {
                  latestOnUploadSuccessRef.current(res.data.id)
                }
              }
              else {
                console.error('上传失败:', res.msg)
              }
            }
            catch (error) {
              console.error('上传错误:', error)
            }
          }
          // 返回 null 阻止 Vditor 默认的上传处理，因为我们已经手动处理了
          return null
        },
      },
      preview: {
        markdown: {
          toc: true,
          codeBlockPreview: true,
        },
      },
      after: () => {
        isInitializedRef.current = true
        // 确保初始化后值是同步的，使用 latestValueRef 获取最新值
        if (latestValueRef.current && latestValueRef.current !== vditor.getValue()) {
          vditor.setValue(latestValueRef.current)
        }
      },
      input: (v) => {
        // 更新最新值引用，避免不必要的 setValue
        if (latestValueRef.current !== v) {
          latestValueRef.current = v
          onChange(v)
        }
      },
    })

    vditorRef.current = vditor

    return () => {
      try {
        const vditorInstance = vditorRef.current
        if (vditorInstance) {
          // 检查实例是否有 destroy 方法再调用，且忽略特定的销毁错误
          vditorInstance.destroy?.()
        }
      }
      catch (e) {
        // 忽略 destroy 时的错误，通常是由于 DOM 已经被移除导致的
      }
      vditorRef.current = null
      isInitializedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (vditorRef.current && isInitializedRef.current) {
      // 使用 latestValueRef.current 来判断是否需要 setValue，避免从 input 触发的循环更新
      if (latestValueRef.current !== value) {
        latestValueRef.current = value // 更新引用
        vditorRef.current.setValue(value)
      }
    }
  }, [value])

  return <div ref={elementRef} className={className} />
}
