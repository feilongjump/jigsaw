
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

interface AddPositionModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export function AddPositionModal({ isOpen, onOpenChange }: AddPositionModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">添加新持仓</ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label="股票代码"
                placeholder="例如: AAPL"
                variant="bordered"
              />
              <Input
                label="股票名称"
                placeholder="例如: Apple Inc."
                variant="bordered"
              />
              <div className="flex gap-4">
                <Input
                  label="买入价格"
                  placeholder="0.00"
                  type="number"
                  variant="bordered"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small"></span>
                    </div>
                  }
                />
                <Input
                  label="持仓数量"
                  placeholder="0"
                  type="number"
                  variant="bordered"
                />
              </div>
              <DatePicker 
                label="买入日期" 
                variant="bordered" 
                defaultValue={now(getLocalTimeZone())}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                取消
              </Button>
              <Button color="primary" onPress={onClose}>
                确认添加
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
