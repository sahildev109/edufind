"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import {
	parseAsArrayOf,
	parseAsInteger,
	parseAsString,
	useQueryState,
} from "nuqs";
import { useMemo } from "react";

export type SortOption =
	| "nirf_rank"
	| "rating"
	| "fees_asc"
	| "fees_desc"
	| "package";

export type CollegeListItem = {
	id: string;
	slug: string;
	name: string;
	shortName: string | null;
	state: string;
	city: string;
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
	imageUrl: string | null;
};

export type CollegeFilters = {
	q: string;
	state: string[];
	type: string[];
	category: string[];
	naac: string[];
	feesMin: number;
	feesMax: number;
	sort: SortOption;
	limit: number;
};

export type CollegeListResponse = {
	data: CollegeListItem[];
	nextCursor: string | null;
	totalCount: number;
	hasMore: boolean;
};

const DEFAULT_FEES_MIN = 0;
const DEFAULT_FEES_MAX = 2_000_000;
const DEFAULT_LIMIT = 12;
const DEFAULT_SORT: SortOption = "nirf_rank";

const ensureArray = (value: string[] | null) => value ?? [];

export const useCollegeFilters = () => {
	const [q, setQ] = useQueryState("q", parseAsString);
	const [state, setState] = useQueryState(
		"state",
		parseAsArrayOf(parseAsString),
	);
	const [type, setType] = useQueryState(
		"type",
		parseAsArrayOf(parseAsString),
	);
	const [category, setCategory] = useQueryState(
		"category",
		parseAsArrayOf(parseAsString),
	);
	const [naac, setNaac] = useQueryState(
		"naac",
		parseAsArrayOf(parseAsString),
	);
	const [feesMin, setFeesMin] = useQueryState("feesMin", parseAsInteger);
	const [feesMax, setFeesMax] = useQueryState("feesMax", parseAsInteger);
	const [sort, setSort] = useQueryState("sort", parseAsString);
	const [limit, setLimit] = useQueryState("limit", parseAsInteger);

	const filters = useMemo<CollegeFilters>(
		() => ({
			q: q ?? "",
			state: ensureArray(state),
			type: ensureArray(type),
			category: ensureArray(category),
			naac: ensureArray(naac),
			feesMin: feesMin ?? DEFAULT_FEES_MIN,
			feesMax: feesMax ?? DEFAULT_FEES_MAX,
			sort: (sort as SortOption) ?? DEFAULT_SORT,
			limit: limit ?? DEFAULT_LIMIT,
		}),
		[q, state, type, category, naac, feesMin, feesMax, sort, limit],
	);

	return {
		filters,
		setQ,
		setState,
		setType,
		setCategory,
		setNaac,
		setFeesMin,
		setFeesMax,
		setSort,
		setLimit,
	};
};

const buildQueryParams = (filters: CollegeFilters, cursor?: string | null) => {
	const params = new URLSearchParams();

	if (filters.q) {
		params.set("q", filters.q);
	}

	filters.state.forEach((value) => params.append("state", value));
	filters.type.forEach((value) => params.append("type", value));
	filters.category.forEach((value) => params.append("category", value));
	filters.naac.forEach((value) => params.append("naac", value));

	if (filters.feesMin !== DEFAULT_FEES_MIN) {
		params.set("feesMin", String(filters.feesMin));
	}

	if (filters.feesMax !== DEFAULT_FEES_MAX) {
		params.set("feesMax", String(filters.feesMax));
	}

	if (filters.sort !== DEFAULT_SORT) {
		params.set("sort", filters.sort);
	}

	if (filters.limit !== DEFAULT_LIMIT) {
		params.set("limit", String(filters.limit));
	}

	if (cursor) {
		params.set("cursor", cursor);
	}

	return params;
};

const fetchColleges = async (filters: CollegeFilters, cursor?: string | null) => {
	const params = buildQueryParams(filters, cursor);
	const response = await fetch(`/api/colleges?${params.toString()}`);

	if (!response.ok) {
		throw new Error("Failed to load colleges");
	}

	return (await response.json()) as CollegeListResponse;
};

export const useColleges = () => {
	const { filters } = useCollegeFilters();

	const filtersKey = useMemo(
		() =>
			JSON.stringify({
				q: filters.q,
				state: filters.state.join("|"),
				type: filters.type.join("|"),
				category: filters.category.join("|"),
				naac: filters.naac.join("|"),
				feesMin: filters.feesMin,
				feesMax: filters.feesMax,
				sort: filters.sort,
				limit: filters.limit,
			}),
		[
			filters.q,
			filters.state,
			filters.type,
			filters.category,
			filters.naac,
			filters.feesMin,
			filters.feesMax,
			filters.sort,
			filters.limit,
		],
	);

	const query = useInfiniteQuery({
		queryKey: ["colleges", filtersKey],
		queryFn: ({ pageParam }) => fetchColleges(filters, pageParam),
		initialPageParam: null as string | null,
		getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
	});

	const items = useMemo(
		() => query.data?.pages.flatMap((page) => page.data) ?? [],
		[query.data],
	);

	const totalCount = query.data?.pages[0]?.totalCount ?? 0;

	return { ...query, items, totalCount, filters };
};
