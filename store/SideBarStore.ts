import { create } from "zustand";

interface SideBarStore {
  isSideBarOpen: boolean;
  openSideBar: () => void;
  closeSideBar: () => void;
  toggleSideBar: () => void;
  resetState: () => void; // Reset function
}

export const useSideBarStore = create<SideBarStore>((set) => ({
  isSideBarOpen: false,
  openSideBar: () => set({ isSideBarOpen: true }),
  closeSideBar: () => set({ isSideBarOpen: false }),
  toggleSideBar: () =>
    set((state) => ({ isSideBarOpen: !state.isSideBarOpen })),
  // Reset to default state
  resetState: () => set({ isSideBarOpen: false }),
}));
