import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const COMPARE_MAX = 3;

type CompareState = {
	selectedIds: string[];
	addCollege: (id: string) => void;
	removeCollege: (id: string) => void;
	clearAll: () => void;
};
type ComparePersistedState = {
  selectedIds: string[];
};

const storage = createJSONStorage<ComparePersistedState>(() => {
	if (typeof window === "undefined") {
		return undefined as unknown as Storage;
	}
	return window.localStorage;
});

export const useCompareStore = create<CompareState>()(
	persist(
		(set, get) => ({
			selectedIds: [],
			addCollege: (id) => {
				const { selectedIds } = get();
				if (selectedIds.includes(id)) {
					return;
				}
				if (selectedIds.length >= COMPARE_MAX) {
					return;
				}
				set({ selectedIds: [...selectedIds, id] });
			},
			removeCollege: (id) => {
				set((state) => ({
					selectedIds: state.selectedIds.filter((item) => item !== id),
				}));
			},
			clearAll: () => set({ selectedIds: [] }),
		}),
		{
			name: "edufind-compare",
			storage,
			partialize: (state) => ({ selectedIds: state.selectedIds }),
		},
	),
);
