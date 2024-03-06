import { create } from 'zustand';

interface useModal {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useremameModal = create<useModal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export const usechangephone = create<useModal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
export const usechangeqty = create<useModal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));