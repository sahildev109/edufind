"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCompareStore } from "@/store/compareStore";

export type CompareCollege = {
	id: string;
	slug: string;
	name: string;
	city: string;
	state: string;
	type: string;
	category: string;
	naacGrade: string | null;
	nirfRank: number | null;
	feesMin: number;
	feesMax: number;
	avgPackageLpa: number | null;
	maxPackageLpa: number | null;
	placementRate: number | null;
	overallRating: number;
	reviewCount: number;
	topRecruiters: string[];
};

type CompareResponse = {
	data: CompareCollege[];
};

const fetchCompare = async (ids: string[]): Promise<CompareResponse> => {
	const params = new URLSearchParams();
	ids.forEach((id) => params.append("ids", id));
	const response = await fetch(`/api/colleges/compare?${params.toString()}`);

	if (!response.ok) {
		throw new Error("Failed to load comparison");
	}

	return (await response.json()) as CompareResponse;
};

export const useCompare = () => {
	const { selectedIds, addCollege, removeCollege, clearAll } = useCompareStore();

	const idsKey = useMemo(() => selectedIds.join("|"), [selectedIds]);

	const query = useQuery({
		queryKey: ["compare", idsKey],
		queryFn: () => fetchCompare(selectedIds),
		enabled: selectedIds.length > 0,
	});

	return {
		...query,
		selectedIds,
		addCollege,
		removeCollege,
		clearAll,
		data: query.data?.data ?? [],
	};
};
