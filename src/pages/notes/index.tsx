import type { Note } from '@/contexts/NotesContext'
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { memo, useEffect, useRef, useState } from 'react'
import { Header } from '@/components/Header'
import { VditorPreview } from '@/components/VditorPreview'
import { useAuth } from '@/contexts/AuthContext'
import { useNotes } from '@/hooks/useNotes'
import { fromNow } from '@/utils/date'
import { getStaticUrl } from '@/utils/url'

export const Route = createFileRoute('/notes/')({
  component: NotesPage,
})

const NoteItem = memo(({ note, onDelete, onPin }: { note: Note, onDelete: (id: number) => void, onPin: (id: number, pinned: boolean) => void }) => {
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showExpandBtn, setShowExpandBtn] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const timeAgo = fromNow(note.date)
  const hasImage = note.images && note.images.length > 0

  useEffect(() => {
    if (!contentRef.current)
      return

    const observer = new ResizeObserver(() => {
      if (contentRef.current) {
        setShowExpandBtn(contentRef.current.scrollHeight > 300)
      }
    })

    observer.observe(contentRef.current)
    return () => observer.disconnect()
  }, [note.content, note.images])

  const toggleExpand = () => setIsExpanded(!isExpanded)

  return (
    <div className="relative flex flex-col gap-4 group px-2">
      {/* Meta Info & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-[#2d3436]">{timeAgo}</span>
          {note.updated_at && (
            <span className="text-xs text-[#b2bec3]">
              更新于
              {fromNow(note.updated_at)}
            </span>
          )}
          {(note.tags && note.tags.length > 0) && (
            <div className="flex gap-2">
              {note.tags.map((tag: string) => (
                <span key={tag} className="text-[#0984E3] bg-[#0984E3]/10 px-2 py-0.5 rounded-md text-xs whitespace-nowrap">
                  #
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 移动端默认显示，桌面端 hover 显示 */}
        <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button
            className={`p-1.5 rounded-full hover:bg-black/5 transition-colors ${note.pinned_at ? 'text-[#0984E3] bg-[#0984E3]/10' : 'text-[#636E72]'}`}
            onClick={() => onPin(note.id, !note.pinned_at)}
            title={note.pinned_at ? '取消置顶' : '置顶'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11.2V22H12.8V16H18V14L16 12Z" fill={note.pinned_at ? 'currentColor' : 'none'} />
            </svg>
          </button>
          <button
            className="p-1.5 rounded-full hover:bg-black/5 text-[#636E72] transition-colors"
            onClick={() => navigate({ to: '/notes/edit', search: { id: note.id } })}
            title="编辑"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button
            className="p-1.5 rounded-full hover:bg-red-50 text-[#636E72] hover:text-red-500 transition-colors"
            onClick={() => onDelete(note.id)}
            title="删除"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      <div
        ref={contentRef}
        className={`relative transition-all duration-300 ${!isExpanded ? 'max-h-[300px] overflow-hidden' : ''}`}
      >
        <div className="text-[1.05rem] leading-[1.8] text-[#2d3436]">
          <VditorPreview markdown={note.content} className="bg-transparent" />
        </div>

        {hasImage && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            {note.images!.map((img, idx) => (
              <div key={`${img}-${idx}`} className="rounded-xl overflow-hidden border border-black/5">
                <img src={getStaticUrl(img)} alt="attachment" className="w-full h-auto object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* 折叠状态的渐变遮罩 */}
        {showExpandBtn && !isExpanded && (
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#f5f6fa] to-transparent pointer-events-none"></div>
        )}
      </div>

      {/* 展开/收起按钮 */}
      {showExpandBtn && (
        <div className="flex justify-center mt-2">
          <button
            onClick={toggleExpand}
            className="text-sm font-medium text-[#0984E3] hover:text-[#74b9ff] transition-colors flex items-center gap-1 bg-white/50 px-4 py-1 rounded-full shadow-sm border border-white/60 backdrop-blur-sm"
          >
            {isExpanded
              ? (
                  <>
                    收起
                    {' '}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                  </>
                )
              : (
                  <>
                    展开全文
                    {' '}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </>
                )}
          </button>
        </div>
      )}

      {/* 分割线 */}
      <div className="h-[1px] w-full bg-black/5 mt-4"></div>
    </div>
  )
})

function NotesPage() {
  const { notes, deleteNote, pinNote, refreshNotes } = useNotes()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [deleteId, setDeleteId] = useState<number | null>(null)

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      refreshNotes({ keyword: searchTerm })
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, refreshNotes])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 5)
      return '凌晨了，要注意休息 🌙'
    if (hour < 11)
      return '早上好啊！新的一天，新的快乐！ ☀️'
    if (hour < 13)
      return '中午好，有空要小憩一会 ☕'
    if (hour < 19)
      return '下午好，饿了就吃点东西垫巴垫巴 🍪'
    return '晚上好，准备睡觉咯 🛌'
  }

  const allTags = Array.from(new Set(notes.flatMap(n => n.tags || []))).sort()

  const confirmDelete = (id: number) => {
    setDeleteId(id)
    onOpen()
  }

  const handleDeleteAction = () => {
    if (deleteId) {
      deleteNote(deleteId)
      setDeleteId(null)
    }
  }

  const filteredNotes = notes.filter((note: Note) => {
    // 搜索逻辑已移至服务端，这里仅保留客户端的 Tag 筛选
    const matchesTag = selectedTag ? note.tags?.includes(selectedTag) : true
    return matchesTag
  })

  return (
    <div className="flex flex-col flex-1 h-full">
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">确认删除</ModalHeader>
              <ModalBody>
                <p>您确定要删除这条笔记吗？此操作无法撤销。</p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button color="danger" onPress={() => {
                  handleDeleteAction()
                  onClose()
                }}
                >
                  删除
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="pt-4 pb-2 z-10 relative">
        <Header
          title={user?.username || 'Guest'}
          subtitle={getGreeting()}
          userLink="/profile"
        />
      </div>

      <main className="flex-1 overflow-y-auto px-4 pt-2 pb-24 no-scrollbar">
        <div className="mb-4 px-1 flex justify-between items-end">
          <div>
            <h3 className="text-[1.2rem] font-extrabold text-[#1A1A1A] mb-1.5">我的笔记</h3>
            <div className="h-[3px] w-6 bg-[#0984E3] rounded-full"></div>
          </div>
          <Link
            to="/notes/edit"
            className="w-8 h-8 bg-[#0984E3] rounded-2xl flex justify-center items-center text-white shadow-lg shadow-blue-500/30 cursor-pointer active:scale-95 transition-transform"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"></path></svg>
          </Link>
        </div>

        {/* 搜索框 */}
        <div className="mb-5">
          <Input
            type="text"
            placeholder="搜索笔记..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            startContent={(
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            )}
            classNames={{
              base: 'w-full',
              mainWrapper: 'h-full',
              input: 'text-small text-[#1A1A1A]',
              inputWrapper: 'h-[48px] bg-white/40 backdrop-blur-xl border border-white/50 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:bg-white/60 focus-within:bg-white/80 transition-all data-[hover=true]:bg-white/60 group-data-[focus=true]:bg-white/80',
            }}
          />
        </div>

        {/* 标签过滤器 */}
        {allTags.length > 0 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar mask-gradient-r">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
                selectedTag === null
                  ? 'bg-[#0984E3] text-white shadow-md'
                  : 'bg-white/50 text-[#636E72] active:bg-white/80'
              }`}
            >
              全部
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
                  selectedTag === tag
                    ? 'bg-[#0984E3] text-white shadow-md'
                    : 'bg-white/50 text-[#636E72] active:bg-white/80'
                }`}
              >
                #
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* 笔记列表 */}
        <div className="flex flex-col gap-8 pb-10">
          {filteredNotes.map((note: Note) => (
            <NoteItem key={note.id} note={note} onDelete={confirmDelete} onPin={pinNote} />
          ))}
        </div>
      </main>
    </div>
  )
}
