
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  DatePicker,
} from "@heroui/react";
import { now, getLocalTimeZone } from "@internationalized/date";
import type { StockPosition } from "../data";

interface TradeModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  type: "buy" | "sell";
  position: StockPosition | null;
}

export function TradeModal({ isOpen, onOpenChange, type, position }: TradeModalProps) {
  if (!position) return null;

  const isBuy = type === "buy";
  const title = isBuy ? "补仓" : "止盈卖出";
  const actionColor = isBuy ? "success" : "danger";

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {title} - {position.name} ({position.symbol})
            </ModalHeader>
            <ModalBody>
              <div className="flex justify-between items-center p-3 bg-default-100 rounded-lg mb-2">
                 <div className="flex flex-col">
                    <span className="text-xs text-default-500">当前持仓</span>
                    <span className="text-sm font-semibold">{position.shares} 股</span>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-xs text-default-500">平均成本</span>
                    <span className="text-sm font-semibold">¥{position.avgCost.toFixed(2)}</span>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-xs text-default-500">现价</span>
                    <span className="text-sm font-semibold">¥{position.price.toFixed(2)}</span>
                 </div>
              </div>

              <div className="flex gap-4">
                <Input
                  label={isBuy ? "买入价格" : "卖出价格"}
                  placeholder="0.00"
                  type="number"
                  variant="bordered"
                  defaultValue={position.price.toString()}
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small"></span>
                    </div>
                  }
                />
                <Input
                  label={isBuy ? "买入数量" : "卖出数量"}
                  placeholder="0"
                  type="number"
                  variant="bordered"
                />
              </div>
              <DatePicker 
                label="交易日期" 
                variant="bordered" 
                defaultValue={now(getLocalTimeZone())}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="flat" onPress={onClose}>
                取消
              </Button>
              <Button color={actionColor} onPress={onClose}>
                确认{title}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
