import { prisma } from "@/lib/prisma";

export type StudentProfile = {
	examType?: string | null;
	examRank?: number | null;
	budgetLpa?: number | null;
	preferredStates?: string[] | null;
	preferredBranches?: string[] | null;
};

export type CounselorContextItem = {
	name: string;
	city: string;
	state: string;
	nirfRank: number | null;
	feesPerYear: number;
	avgPackageLpa: number | null;
	jeeMainCutoff: number | null;
	jeeAdvCutoff: number | null;
	naacGrade: string | null;
	slug: string;
};

const normalizeList = (values?: string[] | null) => {
	if (!values?.length) {
		return undefined;
	}
	const normalized = values
		.map((value) => value.trim())
		.filter(Boolean);
	return normalized.length ? normalized : undefined;
};

export async function buildCounselorContext(profile: StudentProfile) {
	const preferredStates = normalizeList(profile.preferredStates ?? undefined);
	const preferredBranches = normalizeList(profile.preferredBranches ?? undefined);
	const maxFees =
		profile.budgetLpa && profile.budgetLpa > 0
			? Math.round(profile.budgetLpa * 100000)
			: undefined;

	const colleges = await prisma.college.findMany({
		where: {
			state: preferredStates ? { in: preferredStates } : undefined,
			feesMax: maxFees ? { lte: maxFees } : undefined,
			courses: preferredBranches
				? { some: { branch: { in: preferredBranches } } }
				: undefined,
		},
		include: {
			courses: preferredBranches
				? { where: { branch: { in: preferredBranches } } }
				: { take: 1 },
			placements: { orderBy: { year: "desc" }, take: 1 },
		},
		orderBy: { nirfRank: "asc" },
		take: 20,
	});

	return colleges.map<CounselorContextItem>((college) => ({
		name: college.name,
		city: college.city,
		state: college.state,
		nirfRank: college.nirfRank,
		feesPerYear: college.feesMin,
		avgPackageLpa: college.avgPackageLpa,
		jeeMainCutoff: college.courses[0]?.cutoffJeeMain ?? null,
		jeeAdvCutoff: college.courses[0]?.cutoffJeeAdv ?? null,
		naacGrade: college.naacGrade,
		slug: college.slug,
	}));
}

export const buildCounselorPrompt = (
	profile: StudentProfile,
	context: CounselorContextItem[],
) => `
You are EduFind's AI College Counselor for Indian students.
You have access to real college data from our database.
Always base recommendations on the DATA provided — never hallucinate.

STUDENT PROFILE:
${JSON.stringify(profile, null, 2)}

AVAILABLE COLLEGES (filtered for this student):
${JSON.stringify(context, null, 2)}

Rules:
- Recommend only colleges from the data above
- Explain cutoff safety (safe / borderline / risky) for each
- Format output as Markdown
- For every recommended college, output a <college> block with these keys on separate lines:
	name, city, state, nirfRank, feesPerYear, avgPackageLpa, jeeMainCutoff,
	jeeAdvCutoff, naacGrade, safety, reason, slug
- Do not use Markdown or bullet points inside <college> blocks
- After the <college> blocks, add a "### Guidance" section with short bullets
- Be concise but thorough; use a friendly, helpful tone
`;
