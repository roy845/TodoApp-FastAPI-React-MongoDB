import { create } from "zustand";

type ModalType = "delete" | "deleteAll" | "edit";

type ModalState = {
  isOpen: boolean;
  modalType: ModalType | null;
  modalData?: string | null | undefined;
  openModal: (type: ModalType, data: string | null) => void;
  closeModal: () => void;
};

export const useModal = create<ModalState>((set) => ({
  isOpen: false,
  modalType: null,
  modalData: null,
  openModal: (type, data) =>
    set({ isOpen: true, modalType: type, modalData: data }),
  closeModal: () => set({ isOpen: false, modalType: null }),
}));
