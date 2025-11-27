import { create } from "zustand";

interface ModalStore {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
  resetState: () => void;
}

const createModalStore = () =>
  create<ModalStore>((set) => ({
    isModalOpen: false,
    openModal: () => set({ isModalOpen: true }),
    closeModal: () => set({ isModalOpen: false }),
    toggleModal: () => set((state) => ({ isModalOpen: !state.isModalOpen })),
    resetState: () => set({ isModalOpen: false }),
  }));

export const useRefundTicketModal = createModalStore();
