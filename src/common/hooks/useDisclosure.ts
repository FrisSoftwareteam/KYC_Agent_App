import {useState} from 'react';

interface DisclosureState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}

export const useDisclosure = (initialState = false): DisclosureState => {
  const [isOpen, setIsOpen] = useState<boolean>(initialState);

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const onToggle = () => {
    setIsOpen(prevState => !prevState);
  };

  return {isOpen, onClose, onOpen, onToggle};
};
