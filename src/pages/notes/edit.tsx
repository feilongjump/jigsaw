import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import { useNotes } from '@/hooks/useNotes'
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import {VditorEditor} from '@/components/VditorEditor'
import { getNote } from '@/services/noteService';
import { addToast } from "@heroui/toast";

interface EditSearch {
  id?: number
}

export const Route = createFileRoute('/notes/edit')({
  validateSearch: (search: Record<string, unknown>): EditSearch => {
    return {
      id: Number(search.id) || undefined,
    }
  },
  component: EditorPage,
})

import { deleteFile } from '@/services/uploadService';
import { getRelativePath } from '@/utils/url';

function EditorPage() {
  const { id } = Route.useSearch();
  const { addNote, updateNote } = useNotes();
  const navigate = useNavigate();
  
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileIds, setFileIds] = useState<number[]>([]);
  // 追踪本次会话中看到的所有图片（原始 + 新增）
  const sessionImagesRef = useRef<Set<string>>(new Set());
  
  const [tagInput, setTagInput] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageInput, setImageInput] = useState('');

  useEffect(() => {
    const loadNote = async () => {
        if (id) {
            setLoading(true);
            try {
                // 直接请求 API，绕过缓存
                const res = await getNote(id);
                if (res.code === 0 && res.data) {
                    const n = res.data as any;
                    // 手动转换以匹配 Context 逻辑
                    const content = n.content || '';
                    const tags = n.tags || [];
                    const images = n.images || [];

                    setContent(content);
                    setTags(tags);
                    setImages(images);
                    
                    // 追踪原始图片
                    const imgRegex = /!\[.*?\]\((.*?)\)/g;
                    const matches = Array.from(content.matchAll(imgRegex)).map((m) => (m as RegExpMatchArray)[1]);
                    matches.forEach(img => sessionImagesRef.current.add(img));
                }
            } catch (error) {
                console.error("获取笔记失败:", error);
            }
            setLoading(false);
        }
    };
    loadNote();
  }, [id]); // 移除 fetchNote 依赖

  // 编辑期间追踪新添加的图片
  useEffect(() => {
    const imgRegex = /!\[.*?\]\((.*?)\)/g;
    const matches = Array.from(content.matchAll(imgRegex)).map((m: RegExpMatchArray) => m[1]);
    matches.forEach(img => sessionImagesRef.current.add(img));
  }, [content]);

  const handleUploadSuccess = (fileId: number) => {
    setFileIds(prev => [...prev, fileId]);
  };

  const handleSave = async () => {
    if (!content.trim()) {
        addToast({ title: '内容不能为空', color: 'warning' });
        // 不要跳转，让用户修改
        return;
    }

    // 处理删除的图片
    const currentImgRegex = /!\[.*?\]\((.*?)\)/g;
    const currentMatches = Array.from(content.matchAll(currentImgRegex)).map((m: RegExpMatchArray) => m[1]);
    const currentSet = new Set(currentMatches);
    
    // 识别在会话中出现过但不在当前内容中的图片
    const deletedImages = Array.from(sessionImagesRef.current).filter(img => !currentSet.has(img));

    if (deletedImages.length > 0) {
        try {
            const baseUrl = import.meta.env.VITE_STATIC_URL || '';
            await Promise.all(deletedImages.map(img => {
                // 仅当它是本地文件时才删除
                // 本地文件要么是相对路径（无 http），要么以 VITE_STATIC_URL 开头
                const isExternal = img.startsWith('http') && !img.startsWith(baseUrl);
                
                if (!isExternal) {
                    const relativePath = getRelativePath(img);
                    return deleteFile(relativePath, 'notes', id);
                }
                return Promise.resolve();
            }));
        } catch (e) {
            console.error("删除未使用的图片失败", e);
        }
    }

    if (id) {
        await updateNote(id, content);
    } else {
        await addNote(content, fileIds);
    }
    navigate({ to: '/notes' });
  };

  return (
    <div className="h-full absolute inset-0 z-50 bg-transparent">
        <Navbar 
            className="bg-white/40 backdrop-blur-xl border-b border-white/30 absolute top-0"
            maxWidth="full"
            height="64px"
        >
            <NavbarContent justify="start">
                <NavbarItem>
                    <Button isIconOnly variant="light" onPress={() => navigate({ to: "/notes" })} radius="full" className="text-[#1A1A1A]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    </Button>
                </NavbarItem>
            </NavbarContent>
            
            <NavbarContent justify="center">
                <NavbarBrand className="flex justify-center">
                    <span className="font-bold text-[1.1rem] text-[#1A1A1A]">{id ? "编辑笔记" : "新笔记"}</span>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem>
                    <Button 
                        className="bg-[#0984E3] font-semibold text-white shadow-lg shadow-blue-500/30" 
                        onPress={handleSave}
                        radius="full"
                        size="sm"
                    >
                        保存
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
        
        <div className="h-full p-6 pt-[80px] flex flex-col overflow-y-auto no-scrollbar">
            {loading ? (
                <div className="flex-1 w-full h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            ) : (
                <VditorEditor
                    placeholder="开始写作..."
                    value={content}
                    onChange={setContent}
                    className="flex-1 w-full h-full"
                    noteId={id}
                    onUploadSuccess={handleUploadSuccess}
                />
            )}
        </div>
    </div>
  )
}
