
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  DatePicker,
  Tabs,
  Tab,
} from "@heroui/react";
import { now, getLocalTimeZone } from "@internationalized/date";
import { useState } from "react";

interface AddTransactionModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

const EXPENSE_CATEGORIES = [
  { 
    key: "food", 
    label: "餐饮美食",
    children: [
      { key: "breakfast", label: "早餐" },
      { key: "lunch", label: "午餐" },
      { key: "dinner", label: "晚餐" },
      { key: "snack", label: "零食饮料" },
      { key: "groceries", label: "买菜" },
    ]
  },
  { 
    key: "transport", 
    label: "交通出行",
    children: [
      { key: "subway", label: "地铁/公交" },
      { key: "taxi", label: "打车" },
      { key: "fuel", label: "油费" },
      { key: "parking", label: "停车费" },
      { key: "maintenance", label: "保养维修" },
    ]
  },
  { 
    key: "shopping", 
    label: "购物消费",
    children: [
      { key: "clothing", label: "服饰鞋包" },
      { key: "digital", label: "数码产品" },
      { key: "home", label: "家居百货" },
      { key: "beauty", label: "美妆护肤" },
    ]
  },
  { 
    key: "entertainment", 
    label: "休闲娱乐",
    children: [
      { key: "movie", label: "电影/演出" },
      { key: "game", label: "游戏" },
      { key: "travel", label: "旅游度假" },
      { key: "sports", label: "运动健身" },
    ]
  },
  { 
    key: "living", 
    label: "生活日用",
    children: [
      { key: "rent", label: "房租/房贷" },
      { key: "utilities", label: "水电煤气" },
      { key: "phone", label: "话费网费" },
      { key: "maintenance", label: "物业管理" },
    ]
  },
  { key: "other", label: "其他支出", children: [] },
];

const INCOME_CATEGORIES = [
  { key: "salary", label: "工资收入" },
  { key: "bonus", label: "奖金补贴" },
  { key: "investment", label: "投资收益" },
  { key: "part_time", label: "兼职收入" },
  { key: "other", label: "其他收入" },
];

export function AddTransactionModal({ isOpen, onOpenChange }: AddTransactionModalProps) {
  const [type, setType] = useState<"expense" | "income">("expense");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");

  const currentCategories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const subCategories = type === "expense" 
    ? (EXPENSE_CATEGORIES.find(c => c.key === selectedCategory)?.children || [])
    : [];

  // Reset selections when type changes
  const handleTypeChange = (key: "expense" | "income") => {
    setType(key);
    setSelectedCategory("");
    setSelectedSubCategory("");
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">记一笔</ModalHeader>
            <ModalBody>
              <Tabs 
                fullWidth 
                size="md" 
                aria-label="Transaction Type"
                selectedKey={type}
                onSelectionChange={(key) => handleTypeChange(key as "expense" | "income")}
                classNames={{
                    cursor: type === "expense" ? "bg-emerald-500" : "bg-rose-500",
                    tabContent: "group-data-[selected=true]:text-white font-semibold"
                }}
              >
                <Tab key="expense" title="支出" />
                <Tab key="income" title="收入" />
              </Tabs>

              <Input
                autoFocus
                label="金额"
                placeholder="0.00"
                type="number"
                variant="underlined"
                color="primary"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-small">¥</span>
                  </div>
                }
              />

              <div className="flex gap-2">
                <Select 
                  label="分类" 
                  variant="underlined"
                color="primary"
                  selectedKeys={selectedCategory ? [selectedCategory] : []}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubCategory(""); // Reset sub-category
                  }}
                  classNames={{
                    base: "flex-1",
                    label: "text-default-400 text-small",
                    selectorIcon: "text-default-foreground"
                  }}
                >
                  {currentCategories.map((cat) => (
                    <SelectItem key={cat.key}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </Select>

                {type === "expense" && subCategories.length > 0 && (
                  <Select 
                    label="子分类" 
                    variant="underlined"
                    color="primary"
                    selectedKeys={selectedSubCategory ? [selectedSubCategory] : []}
                    onChange={(e) => setSelectedSubCategory(e.target.value)}
                    classNames={{
                      base: "flex-1",
                      label: "text-default-400 text-small",
                      selectorIcon: "text-default-foreground"
                    }}
                  >
                    {subCategories.map((sub) => (
                      <SelectItem key={sub.key}>
                        {sub.label}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              </div>

              <DatePicker 
                label="日期"
                variant="underlined" 
                color="primary"
                hideTimeZone
                defaultValue={now(getLocalTimeZone())}
                classNames={{
                  "label": "text-default-400 text-small"
                }}
              />

              <Input
                label="备注"
                color="primary"
                variant="underlined"
                classNames={{
                  "label": "text-default-400 text-small"
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                取消
              </Button>
              <Button
                color="primary"
                onPress={onClose}
              >
                确认
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
