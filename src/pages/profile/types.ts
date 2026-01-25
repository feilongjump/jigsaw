export const UserWalletType = {
  Cash: 1,
  BankCard: 2,
  WeChat: 3,
  Alipay: 4,
  CreditCard: 5,
  StoredValue: 6,
  Investment: 7,
  Margin: 8,
  Add: 99 // Special type for Add button
} as const;

export type UserWalletType = typeof UserWalletType[keyof typeof UserWalletType];

export interface WalletExtraConfig {
  // Credit Card
  bill_date?: number;
  repayment_date?: number;
  // Investment & Margin
  commission_rate?: number;
  stamp_duty_rate?: number;
  transfer_fee_rate?: number;
  interest_rate?: number; // Margin only
}

export type AccountType = 'wechat' | 'alipay' | 'bank' | 'credit' | 'investment' | 'margin' | 'cash' | 'stored' | 'add';

export interface AccountData {
  id: string;
  // Backend fields
  name: string; // -> title
  type: UserWalletType;
  balance: string; // decimal(15,2) -> string for frontend display
  liability: string; // decimal(15,2) -> string
  extra_config?: WalletExtraConfig;
  sort?: number;
  remark?: string; // -> subTitle
  is_hidden?: boolean;

  // Frontend helper fields (derived or stored for UI consistency)
  uiType: AccountType; // Helper to map backend type to frontend string type for logic
  title: string; // Keep for compatibility, maps to name
  subTitle: string; // Keep for compatibility, maps to remark
  leftText: string[];
  rightText: string[];
  mainText: string;
  bottomText: string;
  icon: string;
  stampText: string;
  color: string;
  createdDays?: number;
}
