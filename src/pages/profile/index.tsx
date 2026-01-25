import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo, useRef, useState } from 'react'
import { LogOut, Camera, Lock, Plus, Trash2, Edit2, EyeOff } from 'lucide-react'
import { fromNow } from '@/utils/date'
import { useAuth } from '@/contexts/AuthContext'
import bgProfile from '@/assets/bg-profile.png'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { UserWalletType, type AccountData, type AccountType, type WalletExtraConfig } from './types';

export const Route = createFileRoute('/profile/')({
  component: ProfilePage,
})

// --- Wallet Components & Data ---



const mapBackendTypeToFrontend = (type: UserWalletType): AccountType => {
  switch (type) {
    case UserWalletType.WeChat: return 'wechat';
    case UserWalletType.Alipay: return 'alipay';
    case UserWalletType.BankCard: return 'bank';
    case UserWalletType.CreditCard: return 'credit';
    case UserWalletType.Investment: return 'investment';
    case UserWalletType.Margin: return 'margin';
    case UserWalletType.Cash: return 'cash';
    case UserWalletType.StoredValue: return 'stored';
    default: return 'bank';
  }
};

const mapFrontendTypeToBackend = (type: AccountType): UserWalletType => {
  switch (type) {
    case 'wechat': return UserWalletType.WeChat;
    case 'alipay': return UserWalletType.Alipay;
    case 'bank': return UserWalletType.BankCard;
    case 'credit': return UserWalletType.CreditCard;
    case 'investment': return UserWalletType.Investment;
    case 'margin': return UserWalletType.Margin;
    case 'cash': return UserWalletType.Cash;
    case 'stored': return UserWalletType.StoredValue;
    default: return UserWalletType.BankCard;
  }
};

const INITIAL_ACCOUNTS: AccountData[] = [
  {
    id: '1',
    name: '微信',
    type: UserWalletType.WeChat,
    uiType: 'wechat',
    title: '微信',
    subTitle: '社交支付，生活无忧',
    remark: '社交支付，生活无忧',
    balance: '8,888.88',
    liability: '0.00',
    leftText: ['随时随地，畅享生活', '红包传情，连接你我'],
    rightText: ['绿色支付，低碳出行', '智慧生活，触手可及'],
    mainText: '社交',
    bottomText: '微信钱包',
    icon: '💬',
    stampText: '即时\n到账',
    color: '#07c160',
    createdDays: 1280,
    is_hidden: false
  },
  {
    id: '2',
    name: '支付',
    type: UserWalletType.Alipay,
    uiType: 'alipay',
    title: '支付',
    subTitle: '信用生活，点滴积累',
    remark: '信用生活，点滴积累',
    balance: '12,345.00',
    liability: '0.00',
    leftText: ['蚂蚁森林，种下希望', '信用生活，点滴珍贵'],
    rightText: ['数字金融，普惠大众', '支付无忧，安全便捷'],
    mainText: '信用',
    bottomText: '支付宝',
    icon: '💳',
    stampText: '快捷\n支付',
    color: '#1677ff',
    createdDays: 985,
    is_hidden: false
  },
  {
    id: '3',
    name: '储蓄',
    type: UserWalletType.BankCard,
    uiType: 'bank',
    title: '储蓄',
    subTitle: '积少成多，有备无患',
    remark: '积少成多，有备无患',
    balance: '**** 8888',
    liability: '0.00',
    leftText: ['稳健理财，安享未来', '精打细算，财富增值'],
    rightText: ['安全保障，贴心服务', '随时存取，灵活便捷'],
    mainText: '财富',
    bottomText: '招商银行',
    icon: '🏦',
    stampText: '储蓄\n有道',
    color: '#b92b27',
    createdDays: 2100,
    is_hidden: false
  },
  {
    id: '4',
    name: '透支',
    type: UserWalletType.CreditCard,
    uiType: 'credit',
    title: '透支',
    subTitle: '先享后付，量入为出',
    remark: '先享后付，量入为出',
    balance: '50,000.00',
    liability: '2,300.00',
    extra_config: { bill_date: 10, repayment_date: 25 },
    leftText: ['精彩生活，即刻启程', '信用消费，尽在掌握'],
    rightText: ['尊贵礼遇，专属特权', '积分回馈，好礼相送'],
    mainText: '额度',
    bottomText: '白金卡',
    icon: '💎',
    stampText: '信用\n至上',
    color: '#722ed1',
    createdDays: 450,
    is_hidden: false
  },
  {
    id: '5',
    name: '投资',
    type: UserWalletType.Investment,
    uiType: 'investment',
    title: '投资',
    subTitle: '复利增长，财富自由',
    remark: '复利增长，财富自由',
    balance: '10,000.00',
    liability: '0.00',
    extra_config: { commission_rate: 0.00025, stamp_duty_rate: 0.001, transfer_fee_rate: 0.00002 },
    leftText: ['价值投资，穿越牛熊', '资产配置，分散风险'],
    rightText: ['理性决策，长期持有', '时间玫瑰，静待花开'],
    mainText: '增长',
    bottomText: '证券账户',
    icon: '📈',
    stampText: '复利\n增长',
    color: '#fa8c16',
    createdDays: 120,
    is_hidden: false
  },
  {
    id: '6',
    name: '杠杆',
    type: UserWalletType.Margin,
    uiType: 'margin',
    title: '杠杆',
    subTitle: '风险管理，以小博大',
    remark: '风险管理，以小博大',
    balance: '200,000.00',
    liability: '100,000.00',
    extra_config: { commission_rate: 0.0003, stamp_duty_rate: 0.001, transfer_fee_rate: 0.00002, interest_rate: 0.06 },
    leftText: ['敬畏市场，顺势而为', '严格止损，控制回撤'],
    rightText: ['专业工具，助力交易', '把握机会，乘风破浪'],
    mainText: '博弈',
    bottomText: '两融账户',
    icon: '⚖️',
    stampText: '风险\n自担',
    color: '#eb2f96',
    createdDays: 60,
    is_hidden: false
  }
];

const ACCOUNT_TYPES = [
  { value: 'wechat', label: '微信', color: '#07c160', icon: '💬', type: UserWalletType.WeChat },
  { value: 'alipay', label: '支付宝', color: '#1677ff', icon: '💳', type: UserWalletType.Alipay },
  { value: 'bank', label: '储蓄卡', color: '#b92b27', icon: '🏦', type: UserWalletType.BankCard },
  { value: 'credit', label: '信用卡', color: '#722ed1', icon: '💎', type: UserWalletType.CreditCard },
  { value: 'investment', label: '投资账户', color: '#fa8c16', icon: '📈', type: UserWalletType.Investment },
  { value: 'margin', label: '两融账户', color: '#eb2f96', icon: '⚖️', type: UserWalletType.Margin },
  { value: 'cash', label: '现金', color: '#20c997', icon: '💵', type: UserWalletType.Cash },
  { value: 'stored', label: '储值卡', color: '#fd7e14', icon: '🎫', type: UserWalletType.StoredValue },
];

interface AccountCardProps {
  data: AccountData;
  isActive: boolean;
  onEdit: (data: AccountData) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onAdd?: () => void;
}

const AccountCard = ({ data, isActive, onEdit, onDelete, onArchive, onAdd }: AccountCardProps) => {
  if (data.uiType === 'add') {
    return (
      <div 
        className={`relative w-[340px] h-[215px] rounded-[16px] shadow-xl overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-stone-300 origin-center cursor-pointer hover:border-stone-400 transition-colors ${isActive ? 'z-20' : 'z-10'}`}
        style={{
          backgroundColor: '#fdfbf7',
          boxShadow: isActive 
            ? '0 20px 40px -12px rgba(0, 0, 0, 0.2)'
            : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        }}
        onClick={onAdd}
      >
        <div className="flex flex-col items-center text-stone-400">
          <div className="w-16 h-16 rounded-full border-2 border-stone-300 flex items-center justify-center mb-4">
            <Plus size={32} />
          </div>
          <span className="font-serif tracking-widest text-lg">添加新卡片</span>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`relative w-[340px] h-[215px] rounded-[16px] shadow-xl overflow-hidden flex flex-col border border-[#e8e4d9] origin-center ${isActive ? 'z-20' : 'z-10'} group`}
      style={{
        backgroundColor: '#fdfbf7',
        boxShadow: isActive 
          ? '0 20px 40px -12px rgba(0, 0, 0, 0.2), inset 0 0 30px rgba(185, 163, 131, 0.15)'
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1), inset 0 0 20px rgba(185, 163, 131, 0.05)',
      }}
    >
       {/* 纸质纹理噪点 */}
       <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-multiply bg-noise"></div>
       
       {/* 背景大图标 */}
       <div className="absolute -right-4 -bottom-4 text-[12rem] opacity-5 pointer-events-none select-none filter sepia grayscale" style={{ color: data.color }}>
          {data.icon}
       </div>

       {/* 顶部栏 */}
       <div className="flex justify-between items-start px-6 pt-5 relative z-10">
          <div>
            <div className="text-[10px] font-serif tracking-[0.2em] text-stone-500 uppercase mb-1">
              {data.uiType.replace('_', ' ')} ACCOUNT
            </div>
            <div className="text-3xl font-serif font-bold text-stone-800 tracking-wide" style={{ color: data.color }}>
              {data.title}
            </div>
            <div className="text-xs font-serif text-stone-500 mt-1 tracking-wider opacity-80">
              {data.subTitle}
            </div>
          </div>

          {/* 右上角创建时间 */}
          <div className="flex flex-col items-end gap-2">
            <div className="w-16 h-10 border rounded-[2px] flex flex-col items-center justify-center opacity-80 bg-[#fdfbf7]/50" style={{ borderColor: data.color, color: data.color }}>
              <span className="text-[8px] font-serif leading-none scale-90 opacity-80 mb-0.5">已陪伴</span>
              <span className="text-xs font-serif font-bold leading-none">{data.createdDays} 天</span>
            </div>
            
            {/* 操作按钮 - H5 环境下直接显示 */}
            <div className="flex gap-2 transition-opacity">
              <button 
                className="p-1 rounded-full bg-stone-100/50 text-stone-400 hover:text-stone-600 transition-colors"
                onClick={(e) => { e.stopPropagation(); onEdit(data); }}
              >
                <Edit2 size={14} />
              </button>
              <button 
                className="p-1 rounded-full bg-stone-100/50 text-stone-400 hover:text-stone-600 transition-colors"
                onClick={(e) => { e.stopPropagation(); onArchive(data.id); }}
                title="隐藏/归档"
              >
                <EyeOff size={14} />
              </button>
              <button 
                className="p-1 rounded-full bg-red-50/50 text-stone-400 hover:text-red-500 transition-colors"
                onClick={(e) => { e.stopPropagation(); onDelete(data.id); }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
       </div>

       {/* 中间内容 */}
       <div className="flex-1 px-6 flex items-center relative z-10">
          {/* 装饰虚线 */}
          <div className="w-full h-[1px] border-t border-dashed border-stone-300/60 absolute top-1/2 left-0 transform -translate-y-1/2"></div>
          
          {/* 红色印章 */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 border-2 border-double rounded-full flex items-center justify-center opacity-90 rotate-[-12deg] bg-[#fdfbf7]/80 backdrop-blur-[1px]" 
               style={{ borderColor: data.color, color: data.color, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
             <div className="text-[10px] font-serif text-center leading-tight font-bold whitespace-pre-line">
               {data.stampText}
             </div>
          </div>
       </div>

       {/* 底部栏 */}
       <div className="px-6 pb-5 flex justify-between items-end relative z-10">
          <div>
             <div className="text-[10px] text-stone-400 mb-1 tracking-widest font-sans">BALANCE</div>
             <div className="text-2xl font-mono font-medium text-stone-800 tracking-tight flex items-baseline">
                <span className="text-lg mr-1 opacity-80">¥</span>
                {data.balance}
             </div>
          </div>
          
          <div className="flex flex-col items-end">
             <div className="text-sm font-serif font-bold text-stone-700 tracking-widest">
                {data.bottomText}
             </div>
             <div className="h-1 w-8 mt-1 opacity-40 rounded-full" style={{ backgroundColor: data.color }}></div>
          </div>
       </div>
       
       {/* 装饰性条纹 */}
       <div className="absolute left-0 top-6 w-1 h-8 opacity-60" style={{ backgroundColor: data.color }}></div>
    </div>
  );
};


const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.9,
    zIndex: 0,
    rotateY: direction > 0 ? 45 : -45
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.9,
    rotateY: direction < 0 ? 45 : -45
  })
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

// Utility to wrap index
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

// --- Profile Page ---


function ProfilePage() {
  const { user, logout, updateAvatar } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Wallet State
  const [accounts, setAccounts] = useState<AccountData[]>(INITIAL_ACCOUNTS);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [editingAccount, setEditingAccount] = useState<AccountData | null>(null);
  const [formData, setFormData] = useState<Partial<AccountData>>({});

  const displayAccounts = useMemo(() => {
    const active = accounts.filter(a => !a.is_hidden);
    return [...active, { id: 'add', type: UserWalletType.Add, uiType: 'add' } as AccountData];
  }, [accounts]);

  const [[page, direction], setPage] = useState([0, 0]);
  const index = wrap(0, displayAccounts.length, page);
  
  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const handleAdd = () => {
    setEditingAccount(null);
    setFormData({
      type: UserWalletType.BankCard,
      uiType: 'bank',
      color: '#b92b27',
      icon: '🏦',
      title: '新账户',
      subTitle: '描述文本',
      balance: '0.00',
      createdDays: 0,
      leftText: ['规划未来', '理性消费'],
      rightText: ['积少成多', '财富增值'],
      mainText: '账户',
      bottomText: '储蓄卡',
      stampText: '新\n账户'
    });
    onOpen();
  };

  const handleEdit = (account: AccountData) => {
    setEditingAccount(account);
    setFormData({ ...account });
    onOpen();
  };

  const handleDelete = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
    // Reset page if needed to avoid index out of bounds
    setPage([0, 0]);
  };

  const handleArchive = (id: string) => {
    setAccounts(prev => prev.map(a => 
      a.id === id ? { ...a, is_hidden: true } : a
    ));
    setPage([0, 0]);
  };

  const handleSave = () => {
    if (editingAccount) {
      // Update
      setAccounts(prev => prev.map(a => 
        a.id === editingAccount.id ? { ...a, ...formData } as AccountData : a
      ));
    } else {
      // Add
      const newAccount = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        createdDays: 0,
      } as AccountData;
      setAccounts(prev => [...prev, newAccount]);
    }
    onClose();
  };

  const handleTypeChange = (value: string) => {
    const typeConfig = ACCOUNT_TYPES.find(t => t.value === value);
    if (typeConfig) {
      setFormData(prev => ({
        ...prev,
        type: typeConfig.type,
        uiType: value as AccountType,
        color: typeConfig.color,
        icon: typeConfig.icon,
        title: typeConfig.label
      }));
    }
  };

  const joinedAt = useMemo(() => {
    if (!user?.created_at)
      return '刚刚'
    return fromNow(user.created_at)
  }, [user?.created_at])

  const handleLogout = () => {
    logout()
    navigate({ to: '/auth/login' })
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file)
      return

    try {
      await updateAvatar(file)
    }
    catch (error) {
      console.error('上传头像失败', error)
    }
  }

  return (
    <div className="min-h-screen font-sans flex flex-col">
      {/* Header Background */}
      <div className="h-72 w-full relative overflow-hidden">
        <img
          src={bgProfile}
          alt="Profile Background"
          className="absolute inset-0 w-full h-[420px] object-cover"
        />

        {/* Top Icons */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-end items-center gap-3 text-white z-10">
          <button
            onClick={() => navigate({ to: '/profile/change-password' })}
            className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
          >
            <Lock size={20} />
          </button>
          <button
            onClick={handleLogout}
            className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-gray-100 rounded-t-[40px] -mt-10 relative px-6  flex-1 flex flex-col items-center">
        {/* Avatar */}
        <div
          className="-mt-14 cursor-pointer group relative"
          onClick={handleAvatarClick}
        >
          <div className="w-28 h-28 rounded-full border-[6px] border-white shadow-xl overflow-hidden relative bg-gray-100">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.username || 'User'}`}
              alt="Avatar"
              className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
            />
            {/* Upload Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white w-8 h-8" />
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {/* User Info */}
        <div className="text-center my-4">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            @{user?.username || 'User'}
          </h1>
          <div className="text-sm text-gray-500 font-medium mt-1">
            注册于 {joinedAt}
          </div>
          <p className="text-gray-400 text-xs mt-3 italic max-w-xs mx-auto">
            "每一个微小的脚步都算数。继续前行，书写属于你自己的故事。"
          </p>
        </div>

        {/* Wallet Section */}
            <div className="relative w-full h-[300px] flex items-center justify-center overflow-x-hidden">
                <AnimatePresence initial={false} custom={direction} mode='popLayout'>
                    <motion.div
                        key={page}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);

                            if (swipe < -swipeConfidenceThreshold) {
                                paginate(1);
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(-1);
                            }
                        }}
                        className="absolute cursor-grab active:cursor-grabbing w-full flex justify-center"
                        style={{ perspective: 1000 }}
                    >
                        <AccountCard 
                            data={displayAccounts[index]} 
                            isActive={true}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onArchive={handleArchive}
                            onAdd={handleAdd}
                        />
                    </motion.div>
                </AnimatePresence>
        </div>

        {/* Edit/Add Modal */}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {editingAccount ? '编辑账户' : '添加新账户'}
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-4">
                    <Select 
                      label="账户类型" 
                      selectedKeys={formData.type ? [formData.type] : []}
                      onChange={(e) => handleTypeChange(e.target.value)}
                    >
                      {ACCOUNT_TYPES.map((type) => (
                        <SelectItem key={type.value} startContent={<span>{type.icon}</span>}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </Select>
                    
                    <Input
                      label="标题"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value, title: e.target.value})}
                    />
                    
                    <Input
                      label="备注/副标题"
                      value={formData.remark || ''}
                      onChange={(e) => setFormData({...formData, remark: e.target.value, subTitle: e.target.value})}
                    />

                    <div className="flex gap-4">
                      <Input
                        label="余额"
                        value={formData.balance || ''}
                        onChange={(e) => setFormData({...formData, balance: e.target.value})}
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">¥</span>
                          </div>
                        }
                        className="flex-1"
                      />
                      {(formData.uiType === 'credit' || formData.uiType === 'margin') && (
                        <Input
                          label="负债/已用"
                          value={formData.liability || ''}
                          onChange={(e) => setFormData({...formData, liability: e.target.value})}
                          startContent={
                            <div className="pointer-events-none flex items-center">
                              <span className="text-default-400 text-small">¥</span>
                            </div>
                          }
                          className="flex-1"
                        />
                      )}
                    </div>

                    {/* Extra Config Fields */}
                    {formData.uiType === 'credit' && (
                      <div className="flex gap-4">
                        <Input
                          label="账单日"
                          type="number"
                          value={formData.extra_config?.bill_date?.toString() || ''}
                          onChange={(e) => setFormData({
                            ...formData, 
                            extra_config: { ...formData.extra_config, bill_date: parseInt(e.target.value) || undefined }
                          })}
                          endContent={<span className="text-default-400 text-small">日</span>}
                        />
                        <Input
                          label="还款日"
                          type="number"
                          value={formData.extra_config?.repayment_date?.toString() || ''}
                          onChange={(e) => setFormData({
                            ...formData, 
                            extra_config: { ...formData.extra_config, repayment_date: parseInt(e.target.value) || undefined }
                          })}
                          endContent={<span className="text-default-400 text-small">日</span>}
                        />
                      </div>
                    )}

                    {(formData.uiType === 'investment' || formData.uiType === 'margin') && (
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="佣金率"
                          value={formData.extra_config?.commission_rate?.toString() || ''}
                          onChange={(e) => setFormData({
                            ...formData, 
                            extra_config: { ...formData.extra_config, commission_rate: parseFloat(e.target.value) || undefined }
                          })}
                        />
                        <Input
                          label="印花税率"
                          value={formData.extra_config?.stamp_duty_rate?.toString() || ''}
                          onChange={(e) => setFormData({
                            ...formData, 
                            extra_config: { ...formData.extra_config, stamp_duty_rate: parseFloat(e.target.value) || undefined }
                          })}
                        />
                        <Input
                          label="过户费率"
                          value={formData.extra_config?.transfer_fee_rate?.toString() || ''}
                          onChange={(e) => setFormData({
                            ...formData, 
                            extra_config: { ...formData.extra_config, transfer_fee_rate: parseFloat(e.target.value) || undefined }
                          })}
                        />
                        {formData.uiType === 'margin' && (
                          <Input
                            label="利率"
                            value={formData.extra_config?.interest_rate?.toString() || ''}
                            onChange={(e) => setFormData({
                              ...formData, 
                              extra_config: { ...formData.extra_config, interest_rate: parseFloat(e.target.value) || undefined }
                            })}
                          />
                        )}
                      </div>
                    )}

                    <Input
                      label="底部文字"
                      value={formData.bottomText || ''}
                      onChange={(e) => setFormData({...formData, bottomText: e.target.value})}
                      placeholder="例如：招商银行"
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    取消
                  </Button>
                  <Button color="primary" onPress={handleSave}>
                    保存
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  )
}




