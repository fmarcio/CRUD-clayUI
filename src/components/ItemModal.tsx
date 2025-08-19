import React from "react";

import Button from "@clayui/button";
import { Heading } from "@clayui/core";
import { Text } from "@clayui/core";

interface IItemModalProps {
  isOpen: boolean;
  modalText: string;
  modalTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ItemModal: React.FC<IItemModalProps> = ({
  isOpen,
  modalText,
  modalTitle,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-200 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="text-center">
          <Heading level={3}>{modalTitle}</Heading>

          <div className="mt-3">
            <Text color={"secondary"} size={3}>
              {modalText}
            </Text>
          </div>

          <div className="items-center px-4 py-3">
            <Button className="mr-2" onClick={onConfirm}>
              Confirm
            </Button>

            <Button displayType="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;
