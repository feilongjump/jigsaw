import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { login as loginApi, register as registerApi, changePassword as changePasswordApi, updateAvatar as updateAvatarApi, getUserInfo } from '@/services/authService';
import { getStaticUrl } from '@/utils/url';

interface User {
  username: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { addToast } from "@heroui/toast"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  const fetchUserInfo = async () => {
      try {
          const res = await getUserInfo();
          if (res.code === 0 && res.data) {
              const { username, avatar } = res.data;
              const avatarUrl = getStaticUrl(avatar);
              setUser({ username, avatar: avatarUrl });
              localStorage.setItem('me', username);
              if (avatarUrl) {
                  localStorage.setItem('avatar', avatarUrl);
              } else {
                  localStorage.removeItem('avatar');
              }
          }
      } catch (error) {
          console.error("获取用户信息失败", error);
      }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        // 尝试获取最新用户信息
        fetchUserInfo();
    }
  }, []);

  const login = async (username: string, password: string) => {
    const res = await loginApi({ username, password });
    if (res.code === 0) {
      localStorage.setItem('token', res.data.token);
      // 登录成功后立即获取用户信息
      await fetchUserInfo();
    } else {
      throw new Error(res.msg || '登录失败');
    }
  };

  const updateAvatar = async (file: File) => {
    try {
        const res = await updateAvatarApi(file);
        if (res.code === 0 && res.data) {
            const avatarUrl = getStaticUrl(res.data.avatar);
            
            // 更新本地状态
            setUser(prev => prev ? { ...prev, avatar: avatarUrl } : null);
            
            // 更新 localStorage
            localStorage.setItem('avatar', avatarUrl);
            
            addToast({ title: '头像更新成功', color: 'success' });
        } else {
            addToast({ title: res.msg || '上传失败', color: 'danger' });
        }
    } catch (e) {
        console.error(e);
        addToast({ title: '上传出错', color: 'danger' });
        throw e;
    }
  };

  const register = async (username: string, password: string) => {
    const res = await registerApi({ username, password });
    if (res.code !== 0) {
      throw new Error(res.msg || '注册失败');
    }
  };

  const logout = () => {
    localStorage.removeItem('me');
    localStorage.removeItem('token');
    localStorage.removeItem('avatar');
    setUser(null);
    addToast({ title: '已退出登录', color: 'primary' });
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
     const res = await changePasswordApi({ old_password: oldPassword, new_password: newPassword });
     if (res.code !== 0) {
         throw new Error(res.msg || '修改密码失败');
     }
     
     // 修改密码后退出登录
     logout();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, changePassword, updateAvatar, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
