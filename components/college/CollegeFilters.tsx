"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useCollegeFilters } from "@/hooks/useColleges";

const stateOptions = [
	"Maharashtra",
	"Delhi",
	"Tamil Nadu",
	"Karnataka",
	"Uttar Pradesh",
	"Telangana",
	"West Bengal",
	"Kerala",
	"Rajasthan",
	"Madhya Pradesh",
	"Gujarat",
	"Odisha",
	"Bihar",
	"Jharkhand",
	"Assam",
	"Andhra Pradesh",
	"Haryana",
	"Uttarakhand",
];

const typeOptions = [
	{ label: "Government", value: "GOVERNMENT" },
	{ label: "Private", value: "PRIVATE" },
	{ label: "Deemed", value: "DEEMED" },
];

const categoryOptions = ["IIT", "NIT", "IIIT", "State", "Private"];
const naacOptions = ["A++", "A+", "A", "B++"];

const sortOptions = [
	{ label: "NIRF rank", value: "nirf_rank" },
	{ label: "Rating", value: "rating" },
	{ label: "Fees (low to high)", value: "fees_asc" },
	{ label: "Fees (high to low)", value: "fees_desc" },
	{ label: "Avg placement package", value: "package" },
];

const pageSizeOptions = [12, 24, 48];

const formatInr = (value: number) =>
	new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);

const toggleValue = (values: string[], value: string) =>
	values.includes(value)
		? values.filter((item) => item !== value)
		: [...values, value];

export default function CollegeFilters() {
	const {
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
	} = useCollegeFilters();

	const [searchInput, setSearchInput] = useState(filters.q);

	useEffect(() => {
		setSearchInput(filters.q);
	}, [filters.q]);

	useEffect(() => {
		const id = window.setTimeout(() => {
			const trimmed = searchInput.trim();
			setQ(trimmed ? trimmed : null);
		}, 300);
		return () => window.clearTimeout(id);
	}, [searchInput, setQ]);

	const feesRange = useMemo<[number, number]>(
		() => [filters.feesMin, filters.feesMax],
		[filters.feesMin, filters.feesMax],
	);

	const handleClear = () => {
		setQ(null);
		setState(null);
		setType(null);
		setCategory(null);
		setNaac(null);
		setFeesMin(null);
		setFeesMax(null);
		setSort(null);
		setLimit(null);
	};

	return (
		<section className="rounded-3xl border border-slate-200/70 bg-[radial-gradient(circle_at_top,rgba(255,214,165,0.35),transparent_60%),radial-gradient(circle_at_bottom,rgba(180,205,255,0.35),transparent_55%)] p-6 shadow-sm">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
						Filter colleges
					</p>
					<h2 className="text-lg font-semibold text-slate-900">
						Refine by fees, ranking, and location
					</h2>
				</div>
				<Button variant="outline" className="rounded-full" onClick={handleClear}>
					Clear all
				</Button>
			</div>

			<div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
				<div className="space-y-5">
					<div className="space-y-2">
						<label className="text-sm font-medium text-slate-700" htmlFor="search">
							Search colleges
						</label>
						<Input
							id="search"
							placeholder="Search by college name, city, or state"
							value={searchInput}
							onChange={(event) => setSearchInput(event.target.value)}
						/>
					</div>

					<div className="space-y-3">
						<p className="text-sm font-medium text-slate-700">State</p>
						<div className="flex flex-wrap gap-2">
							{stateOptions.map((state) => (
								<button
									key={state}
									type="button"
									onClick={() => {
										const next = toggleValue(filters.state, state);
										setState(next.length ? next : null);
									}}
									className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
										filters.state.includes(state)
											? "border-slate-900 bg-slate-900 text-white"
											: "border-slate-200 bg-white/70 text-slate-700"
									}`}
								>
									{state}
								</button>
							))}
						</div>
					</div>

					<div className="space-y-3">
						<p className="text-sm font-medium text-slate-700">College type</p>
						<div className="flex flex-wrap gap-2">
							{typeOptions.map((type) => (
								<button
									key={type.value}
									type="button"
									onClick={() => {
										const next = toggleValue(filters.type, type.value);
										setType(next.length ? next : null);
									}}
									className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
										filters.type.includes(type.value)
											? "border-slate-900 bg-slate-900 text-white"
											: "border-slate-200 bg-white/70 text-slate-700"
									}`}
								>
									{type.label}
								</button>
							))}
						</div>
					</div>

					<div className="space-y-3">
						<p className="text-sm font-medium text-slate-700">Category</p>
						<div className="flex flex-wrap gap-2">
							{categoryOptions.map((category) => (
								<button
									key={category}
									type="button"
									onClick={() => {
										const next = toggleValue(filters.category, category);
										setCategory(next.length ? next : null);
									}}
									className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
										filters.category.includes(category)
											? "border-slate-900 bg-slate-900 text-white"
											: "border-slate-200 bg-white/70 text-slate-700"
									}`}
								>
									{category}
								</button>
							))}
						</div>
					</div>
				</div>

				<div className="space-y-5">
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<p className="text-sm font-medium text-slate-700">Fees range</p>
							<p className="text-xs font-semibold text-slate-500">
								Rs {formatInr(feesRange[0])} - Rs {formatInr(feesRange[1])}
							</p>
						</div>
						<Slider
							value={feesRange}
							min={0}
							max={2_000_000}
							step={50_000}
							onValueChange={(values) => {
								const range = values as number[];
        	setFeesMin(range[0]);
        	setFeesMax(range[1]);
							}}
						/>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<p className="text-sm font-medium text-slate-700">NAAC grade</p>
							<Select
								value={filters.naac[0] ?? "any"}
								onValueChange={(value) =>
									setNaac(value && value !== "any" ? [value] : null)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select grade" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="any">Any grade</SelectItem>
									{naacOptions.map((grade) => (
										<SelectItem key={grade} value={grade}>
											{grade}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<p className="text-sm font-medium text-slate-700">Sort by</p>
							<Select
								value={filters.sort}
								onValueChange={(value) =>
									setSort(value === "nirf_rank" ? null : value)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Sort results" />
								</SelectTrigger>
								<SelectContent>
									{sortOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-2">
						<p className="text-sm font-medium text-slate-700">Page size</p>
						<div className="flex gap-2">
							{pageSizeOptions.map((size) => (
								<button
									key={size}
									type="button"
									  onClick={() => setLimit(size === 12 ? null : size)}
									className={`rounded-full border px-4 py-1 text-xs font-semibold transition ${
										filters.limit === size
											? "border-slate-900 bg-slate-900 text-white"
											: "border-slate-200 bg-white/70 text-slate-700"
									}`}
								>
									{size}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
