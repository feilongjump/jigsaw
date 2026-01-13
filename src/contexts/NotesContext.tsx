import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { getNotes, createNote, updateNote as updateNoteApi, deleteNote as deleteNoteApi, getNote as getNoteApi } from '@/services/noteService';
import { addToast } from "@heroui/toast";

export interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
  updated_at?: string;
  tags?: string[];
  images?: string[];
}

interface NotesContextType {
  notes: Note[];
  addNote: (content: string, fileIds?: number[]) => Promise<void>;
  updateNote: (id: number, content: string) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
  getNote: (id: number) => Note | undefined;
  fetchNote: (id: number) => Promise<Note | undefined>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);

  // 从后端获取单条笔记
  const fetchNote = useCallback(async (id: number): Promise<Note | undefined> => {
      // 1. 即使本地有，也建议在编辑时重新获取最新数据，或者仅作为兜底
      const localNote = notes.find(n => n.id === id);
      
      // 如果本地有，先返回本地的（为了速度），但通常编辑页建议获取最新
      if (localNote) return localNote;

      // 2. 如果没有，则请求接口
      try {
          const res = await getNoteApi(id); // 使用别名调用 api
          if (res.code === 0 && res.data) {
             const n = res.data as any;
             const note = {
                 id: n.id,
                 title: n.title || n.content?.split('\n')[0]?.slice(0, 20) || '无标题',
                 content: n.content,
                 date: n.created_at ? n.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
                 updated_at: n.updated_at,
                 tags: n.tags || [], 
                 images: n.images || []
             };
             return note;
          }
      } catch (error) {
          console.error("获取单条笔记失败", error);
      }
      return undefined;
  }, [notes]); // 依赖 notes，因为用到了 notes.find

  const refreshNotes = useCallback(async () => {
    try {
      const res = await getNotes({ page: 1, size: 10 });
      if (res.code === 0 && res.data && res.data.data) {
         const mappedNotes = res.data.data.map((n: any) => ({
             id: n.id,
             title: n.title || n.content?.split('\n')[0]?.slice(0, 20) || '无标题',
             content: n.content,
             date: n.created_at ? n.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
             updated_at: n.updated_at,
             tags: n.tags || [], 
             images: n.images || []
         }));
         setNotes(mappedNotes);
      }
    } catch (error) {
      console.error("获取笔记失败", error);
      addToast({ title: '获取笔记失败', color: 'danger' });
    }
  }, []);

  useEffect(() => {
    refreshNotes();
  }, [refreshNotes]);

  const addNote = useCallback(async (content: string, fileIds?: number[]) => {
    try {
        await createNote({ content, file_ids: fileIds });
        addToast({ title: '笔记创建成功', color: 'success' });
        await refreshNotes();
    } catch (e) {
        addToast({ title: '创建失败', color: 'danger' });
        throw e;
    }
  }, [refreshNotes]);

  const updateNote = useCallback(async (id: number, content: string) => {
    try {
        await updateNoteApi(id, { content });
        addToast({ title: '笔记更新成功', color: 'success' });
        await refreshNotes();
    } catch (e) {
        addToast({ title: '更新失败', color: 'danger' });
        throw e;
    }
  }, [refreshNotes]);

  const deleteNote = useCallback(async (id: number) => {
    try {
        await deleteNoteApi(id);
        addToast({ title: '笔记删除成功', color: 'success' });
        await refreshNotes();
    } catch (e) {
        addToast({ title: '删除失败', color: 'danger' });
        throw e;
    }
  }, [refreshNotes]);

  const getNote = useCallback((id: number) => notes.find(n => n.id === id), [notes]);

  const value = useMemo(() => ({
    notes, addNote, updateNote, deleteNote, getNote, fetchNote
  }), [notes, addNote, updateNote, deleteNote, getNote, fetchNote]);

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
}

export const useNotesContext = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotesContext must be used within a NotesProvider');
  }
  return context;
};

