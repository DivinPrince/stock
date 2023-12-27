import { create } from 'zustand';

interface useSellerModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useSellerModal = create<useSellerModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false}),
}));
