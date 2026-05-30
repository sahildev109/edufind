import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";

const prisma = new PrismaClient();
type CollegeType =
  | "GOVERNMENT"
  | "PRIVATE"
  | "DEEMED";

const createRng = (seed: number) => {
	let value = seed;
	return () => {
		value = (value * 9301 + 49297) % 233280;
		return value / 233280;
	};
};

const slugify = (value: string) =>
	value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

const round1 = (value: number) => Math.round(value * 10) / 10;

const rng = createRng(42);
const pick = <T>(items: T[]) => items[Math.floor(rng() * items.length)];

const pickMany = <T>(items: T[], count: number) => {
	const copy = [...items];
	const selected: T[] = [];
	while (selected.length < count && copy.length) {
		const index = Math.floor(rng() * copy.length);
		selected.push(copy.splice(index, 1)[0]);
	}
	return selected;
};

const gradePool = ["A++", "A+", "A", "B++"];
const recruiterPool = [
	"TCS",
	"Infosys",
	"Wipro",
	"Accenture",
	"Cognizant",
	"HCL",
	"Tech Mahindra",
	"LTIMindtree",
	"Amazon",
	"Microsoft",
	"Google",
	"Flipkart",
	"Reliance",
	"Adani",
	"Deloitte",
	"KPMG",
	"Capgemini",
	"IBM",
];

const courseCatalog = [
	{ name: "B.Tech Computer Science", degree: "B.Tech", branch: "CSE", durationYrs: 4 },
	{
		name: "B.Tech Electronics and Communication",
		degree: "B.Tech",
		branch: "ECE",
		durationYrs: 4,
	},
	{ name: "B.Tech Mechanical Engineering", degree: "B.Tech", branch: "ME", durationYrs: 4 },
	{ name: "B.Tech Civil Engineering", degree: "B.Tech", branch: "CE", durationYrs: 4 },
	{ name: "B.Tech Information Technology", degree: "B.Tech", branch: "IT", durationYrs: 4 },
	{ name: "M.Tech Computer Science", degree: "M.Tech", branch: "CSE", durationYrs: 2 },
	{ name: "MBA", degree: "MBA", branch: "MBA", durationYrs: 2 },
];

const reviewTemplates = [
	{
		title: "Strong academics and placements",
		pros: "Good faculty, strong coding culture",
		cons: "Hostel rooms could be better",
		body: "Courses are well structured and placements are consistent for core branches.",
	},
	{
		title: "Great campus life",
		pros: "Active clubs, supportive peers",
		cons: "Some labs need upgrades",
		body: "The campus is lively with events and clubs, and seniors are helpful.",
	},
	{
		title: "Value for money",
		pros: "Affordable fees, decent placements",
		cons: "Limited electives",
		body: "Overall a good option with balanced academics and fees.",
	},
	{
		title: "Industry exposure is solid",
		pros: "Guest lectures, internship support",
		cons: "Administrative delays",
		body: "Industry talks are frequent and internship guidance is practical.",
	},
	{
		title: "Good for core engineering",
		pros: "Strong fundamentals",
		cons: "Less focus on startups",
		body: "Core subjects are taught well and projects are encouraged.",
	},
];

const users = [
	{ name: "Aarav Mehta", email: "aarav.mehta@example.com" },
	{ name: "Isha Rao", email: "isha.rao@example.com" },
	{ name: "Vihaan Sharma", email: "vihaan.sharma@example.com" },
	{ name: "Anaya Singh", email: "anaya.singh@example.com" },
	{ name: "Arjun Nair", email: "arjun.nair@example.com" },
	{ name: "Diya Patel", email: "diya.patel@example.com" },
	{ name: "Kabir Das", email: "kabir.das@example.com" },
	{ name: "Sara Khan", email: "sara.khan@example.com" },
	{ name: "Rohan Gupta", email: "rohan.gupta@example.com" },
	{ name: "Nidhi Verma", email: "nidhi.verma@example.com" },
	{ name: "Neil Fernandes", email: "neil.fernandes@example.com" },
	{ name: "Maya Iyer", email: "maya.iyer@example.com" },
	{ name: "Karan Malhotra", email: "karan.malhotra@example.com" },
	{ name: "Ritika Joshi", email: "ritika.joshi@example.com" },
	{ name: "Siddharth Bose", email: "siddharth.bose@example.com" },
];

const collegeDefinitions = [
	{ name: "Indian Institute of Technology Bombay", shortName: "IIT Bombay", city: "Mumbai", state: "Maharashtra", category: "IIT", type: "GOVERNMENT" },
	{ name: "Indian Institute of Technology Delhi", shortName: "IIT Delhi", city: "New Delhi", state: "Delhi", category: "IIT", type: "GOVERNMENT" },
	{ name: "Indian Institute of Technology Kanpur", shortName: "IIT Kanpur", city: "Kanpur", state: "Uttar Pradesh", category: "IIT", type: "GOVERNMENT" },
	{ name: "Indian Institute of Technology Kharagpur", shortName: "IIT Kharagpur", city: "Kharagpur", state: "West Bengal", category: "IIT", type: "GOVERNMENT" },
	{ name: "Indian Institute of Technology Madras", shortName: "IIT Madras", city: "Chennai", state: "Tamil Nadu", category: "IIT", type: "GOVERNMENT" },
	{ name: "Indian Institute of Technology Roorkee", shortName: "IIT Roorkee", city: "Roorkee", state: "Uttarakhand", category: "IIT", type: "GOVERNMENT" },
	{ name: "Indian Institute of Technology Guwahati", shortName: "IIT Guwahati", city: "Guwahati", state: "Assam", category: "IIT", type: "GOVERNMENT" },
	{ name: "Indian Institute of Technology Hyderabad", shortName: "IIT Hyderabad", city: "Hyderabad", state: "Telangana", category: "IIT", type: "GOVERNMENT" },

	{ name: "National Institute of Technology Tiruchirappalli", shortName: "NIT Trichy", city: "Tiruchirappalli", state: "Tamil Nadu", category: "NIT", type: "GOVERNMENT" },
	{ name: "National Institute of Technology Karnataka", shortName: "NITK Surathkal", city: "Mangalore", state: "Karnataka", category: "NIT", type: "GOVERNMENT" },
	{ name: "National Institute of Technology Warangal", shortName: "NIT Warangal", city: "Warangal", state: "Telangana", category: "NIT", type: "GOVERNMENT" },
	{ name: "National Institute of Technology Calicut", shortName: "NIT Calicut", city: "Kozhikode", state: "Kerala", category: "NIT", type: "GOVERNMENT" },
	{ name: "National Institute of Technology Rourkela", shortName: "NIT Rourkela", city: "Rourkela", state: "Odisha", category: "NIT", type: "GOVERNMENT" },
	{ name: "National Institute of Technology Jaipur", shortName: "MNIT Jaipur", city: "Jaipur", state: "Rajasthan", category: "NIT", type: "GOVERNMENT" },
	{ name: "National Institute of Technology Bhopal", shortName: "MANIT Bhopal", city: "Bhopal", state: "Madhya Pradesh", category: "NIT", type: "GOVERNMENT" },
	{ name: "National Institute of Technology Durgapur", shortName: "NIT Durgapur", city: "Durgapur", state: "West Bengal", category: "NIT", type: "GOVERNMENT" },

	{ name: "Indian Institute of Information Technology Hyderabad", shortName: "IIIT Hyderabad", city: "Hyderabad", state: "Telangana", category: "IIIT", type: "GOVERNMENT" },
	{ name: "Indian Institute of Information Technology Bangalore", shortName: "IIIT Bangalore", city: "Bengaluru", state: "Karnataka", category: "IIIT", type: "GOVERNMENT" },
	{ name: "Indian Institute of Information Technology Delhi", shortName: "IIIT Delhi", city: "New Delhi", state: "Delhi", category: "IIIT", type: "GOVERNMENT" },
	{ name: "Indian Institute of Information Technology Allahabad", shortName: "IIIT Allahabad", city: "Prayagraj", state: "Uttar Pradesh", category: "IIIT", type: "GOVERNMENT" },
	{ name: "Indian Institute of Information Technology Gwalior", shortName: "IIIT Gwalior", city: "Gwalior", state: "Madhya Pradesh", category: "IIIT", type: "GOVERNMENT" },
	{ name: "Indian Institute of Information Technology Pune", shortName: "IIIT Pune", city: "Pune", state: "Maharashtra", category: "IIIT", type: "GOVERNMENT" },

	{ name: "State Engineering College Pune", shortName: "SEC Pune", city: "Pune", state: "Maharashtra", category: "State", type: "GOVERNMENT" },
	{ name: "State Engineering College Lucknow", shortName: "SEC Lucknow", city: "Lucknow", state: "Uttar Pradesh", category: "State", type: "GOVERNMENT" },
	{ name: "State Engineering College Jaipur", shortName: "SEC Jaipur", city: "Jaipur", state: "Rajasthan", category: "State", type: "GOVERNMENT" },
	{ name: "State Engineering College Patna", shortName: "SEC Patna", city: "Patna", state: "Bihar", category: "State", type: "GOVERNMENT" },
	{ name: "State Engineering College Ranchi", shortName: "SEC Ranchi", city: "Ranchi", state: "Jharkhand", category: "State", type: "GOVERNMENT" },
	{ name: "State Engineering College Bhubaneswar", shortName: "SEC Bhubaneswar", city: "Bhubaneswar", state: "Odisha", category: "State", type: "GOVERNMENT" },
	{ name: "State Engineering College Coimbatore", shortName: "SEC Coimbatore", city: "Coimbatore", state: "Tamil Nadu", category: "State", type: "GOVERNMENT" },
	{ name: "State Engineering College Indore", shortName: "SEC Indore", city: "Indore", state: "Madhya Pradesh", category: "State", type: "GOVERNMENT" },
	{ name: "State Engineering College Thiruvananthapuram", shortName: "SEC TVM", city: "Thiruvananthapuram", state: "Kerala", category: "State", type: "GOVERNMENT" },
	{ name: "State Engineering College Ahmedabad", shortName: "SEC Ahmedabad", city: "Ahmedabad", state: "Gujarat", category: "State", type: "GOVERNMENT" },

	{ name: "Apex Institute of Technology", shortName: "Apex IT", city: "Noida", state: "Uttar Pradesh", category: "Private", type: "PRIVATE" },
	{ name: "Harmony College of Engineering", shortName: "Harmony CE", city: "Bengaluru", state: "Karnataka", category: "Private", type: "PRIVATE" },
	{ name: "Riverdale Institute of Technology", shortName: "Riverdale IT", city: "Hyderabad", state: "Telangana", category: "Private", type: "PRIVATE" },
	{ name: "Sunrise University of Technology", shortName: "Sunrise Tech", city: "Pune", state: "Maharashtra", category: "Private", type: "DEEMED" },
	{ name: "Greenfield Institute of Engineering", shortName: "Greenfield IE", city: "Chennai", state: "Tamil Nadu", category: "Private", type: "PRIVATE" },
	{ name: "Vistara Institute of Technology", shortName: "Vistara IT", city: "Kolkata", state: "West Bengal", category: "Private", type: "PRIVATE" },
	{ name: "Northstar Engineering College", shortName: "Northstar EC", city: "Surat", state: "Gujarat", category: "Private", type: "PRIVATE" },
	{ name: "Bluechip Institute of Technology", shortName: "Bluechip IT", city: "Nagpur", state: "Maharashtra", category: "Private", type: "PRIVATE" },
	{ name: "Crescent School of Engineering", shortName: "Crescent SE", city: "Visakhapatnam", state: "Andhra Pradesh", category: "Private", type: "PRIVATE" },
	{ name: "Lotus Valley Institute of Technology", shortName: "Lotus Valley IT", city: "Mysuru", state: "Karnataka", category: "Private", type: "PRIVATE" },
	{ name: "Pioneer College of Engineering", shortName: "Pioneer CE", city: "Jaipur", state: "Rajasthan", category: "Private", type: "PRIVATE" },
	{ name: "Silver Oak Institute of Technology", shortName: "Silver Oak IT", city: "Kochi", state: "Kerala", category: "Private", type: "PRIVATE" },
	{ name: "Galaxy Institute of Technology", shortName: "Galaxy IT", city: "Bhopal", state: "Madhya Pradesh", category: "Private", type: "PRIVATE" },
	{ name: "Meridian College of Engineering", shortName: "Meridian CE", city: "Indore", state: "Madhya Pradesh", category: "Private", type: "PRIVATE" },
	{ name: "Nirmal Institute of Technology", shortName: "Nirmal IT", city: "Delhi", state: "Delhi", category: "Private", type: "PRIVATE" },
	{ name: "Orchid College of Engineering", shortName: "Orchid CE", city: "Gurugram", state: "Haryana", category: "Private", type: "PRIVATE" },
	{ name: "Prime Tech University", shortName: "Prime Tech", city: "Vadodara", state: "Gujarat", category: "Private", type: "DEEMED" },
	{ name: "Zenith Institute of Technology", shortName: "Zenith IT", city: "Ahmedabad", state: "Gujarat", category: "Private", type: "DEEMED" },
];

const placementBase = (category: string) => {
	switch (category) {
		case "IIT":
			return { avg: 20, max: 45, rate: 92 };
		case "NIT":
			return { avg: 13, max: 30, rate: 88 };
		case "IIIT":
			return { avg: 15, max: 35, rate: 90 };
		case "State":
			return { avg: 8, max: 20, rate: 78 };
		default:
			return { avg: 7, max: 18, rate: 72 };
	}
};

const feeRange = (category: string, type: string) => {
	if (category === "IIT" || category === "NIT" || category === "IIIT") {
		return { min: 110000, max: 240000 };
	}
	if (type === "DEEMED") {
		return { min: 220000, max: 420000 };
	}
	if (category === "State") {
		return { min: 90000, max: 180000 };
	}
	return { min: 160000, max: 320000 };
};

const cutoffRange = (category: string) => {
	if (category === "IIT") {
		return { advMin: 200, advMax: 8000, mainMin: null, mainMax: null };
	}
	if (category === "NIT" || category === "IIIT") {
		return { advMin: null, advMax: null, mainMin: 2000, mainMax: 35000 };
	}
	return { advMin: null, advMax: null, mainMin: 15000, mainMax: 120000 };
};

const buildSlugMap = () => {
	const counts = new Map<string, number>();
	return (value: string) => {
		const base = slugify(value);
		const next = (counts.get(base) ?? 0) + 1;
		counts.set(base, next);
		return next === 1 ? base : `${base}-${next}`;
	};
};

const buildCollegeData = async () => {
	const slugger = buildSlugMap();
	const passwordHash = await bcrypt.hash("Password123!", 10);

	const userRecords = users.map((user) => ({
		id: randomUUID(),
		email: user.email,
		name: user.name,
		passwordHash,
	}));

	const collegeRecords: {
		id: string;
		slug: string;
		name: string;
		shortName?: string;
		state: string;
		city: string;
		type: CollegeType;
		category: string;
		naacGrade?: string;
		nirfRank?: number;
		establishedYear?: number;
		description?: string;
		imageUrl?: string;
		websiteUrl?: string;
		feesMin: number;
		feesMax: number;
		avgPackageLpa?: number;
		maxPackageLpa?: number;
		placementRate?: number;
		overallRating: number;
		reviewCount: number;
	}[] = [];

	const courseRecords: {
		id: string;
		collegeId: string;
		name: string;
		degree: string;
		branch: string;
		durationYrs: number;
		feesPerYear: number;
		seats?: number;
		cutoffJeeMain?: number | null;
		cutoffJeeAdv?: number | null;
	}[] = [];

	const placementRecords: {
		id: string;
		collegeId: string;
		year: number;
		avgPackageLpa: number;
		maxPackageLpa: number;
		medianPackageLpa?: number;
		placedStudents: number;
		totalStudents: number;
		topRecruiters: string[];
	}[] = [];

	const reviewRecords: {
		id: string;
		collegeId: string;
		userId: string;
		rating: number;
		title: string;
		body: string;
		pros?: string;
		cons?: string;
		batch?: number;
		isVerified?: boolean;
		createdAt?: Date;
	}[] = [];

	collegeDefinitions.forEach((definition, index) => {
		const collegeId = randomUUID();
		const slug = slugger(definition.name);
		const fees = feeRange(definition.category, definition.type);
		const basePlacement = placementBase(definition.category);
		const rate = basePlacement.rate + Math.floor(rng() * 8) - 3;
		const avg = basePlacement.avg + rng() * 4 - 1.5;
		const max = basePlacement.max + rng() * 6 - 2;
		const reviewRating1 = 3 + Math.floor(rng() * 3);
		const reviewRating2 = 3 + Math.floor(rng() * 3);
		const reviewCount = 2;
		const overallRating = round1((reviewRating1 + reviewRating2) / reviewCount);

		collegeRecords.push({
			id: collegeId,
			slug,
			name: definition.name,
			shortName: definition.shortName,
			state: definition.state,
			city: definition.city,
			type: definition.type as CollegeType,
			category: definition.category,
			naacGrade: pick(gradePool),
			nirfRank: definition.category === "IIT" ? 1 + index : 20 + index,
			establishedYear: 1955 + Math.floor(rng() * 60),
			description: `A leading ${definition.category} institute in ${definition.city}, ${definition.state}.`,
			websiteUrl: `https://${slug}.ac.in`,
			feesMin: fees.min,
			feesMax: fees.max,
			avgPackageLpa: round1(avg),
			maxPackageLpa: round1(max),
			placementRate: Math.min(98, Math.max(55, rate)),
			overallRating,
			reviewCount,
		});

		const cutoff = cutoffRange(definition.category);
		const courseChoices = pickMany(courseCatalog.slice(0, 5), 4);
		const addPostGrad = definition.category === "IIT" || definition.category === "NIT" || definition.category === "IIIT";
		if (addPostGrad && rng() > 0.6) {
			courseChoices[courseChoices.length - 1] = courseCatalog[5];
		} else if (!addPostGrad && rng() > 0.6) {
			courseChoices[courseChoices.length - 1] = courseCatalog[6];
		}

		courseChoices.forEach((course) => {
			const feesPerYear = Math.round(fees.min + rng() * (fees.max - fees.min));
			const isBTech = course.degree === "B.Tech";
			const cutoffJeeMain = isBTech && cutoff.mainMin !== null
				? Math.round(cutoff.mainMin + rng() * (cutoff.mainMax! - cutoff.mainMin))
				: null;
			const cutoffJeeAdv = isBTech && cutoff.advMin !== null
				? Math.round(cutoff.advMin + rng() * (cutoff.advMax! - cutoff.advMin))
				: null;

			courseRecords.push({
				id: randomUUID(),
				collegeId,
				name: course.name,
				degree: course.degree,
				branch: course.branch,
				durationYrs: course.durationYrs,
				feesPerYear,
				seats: 60 + Math.floor(rng() * 120),
				cutoffJeeMain,
				cutoffJeeAdv,
			});
		});

		[2023, 2024].forEach((year) => {
			const yearFactor = year === 2024 ? 1.03 : 0.98;
			const avgPackageLpa = round1(avg * yearFactor + rng());
			const maxPackageLpa = round1(max * yearFactor + rng() * 2);
			const medianPackageLpa = round1(avgPackageLpa * 0.92);
			const totalStudents = 400 + Math.floor(rng() * 700);
			const placedStudents = Math.round(totalStudents * (rate / 100));
			const topRecruiters = pickMany(recruiterPool, 5);

			placementRecords.push({
				id: randomUUID(),
				collegeId,
				year,
				avgPackageLpa,
				maxPackageLpa,
				medianPackageLpa,
				placedStudents,
				totalStudents,
				topRecruiters,
			});
		});

		[reviewRating1, reviewRating2].forEach((rating, reviewIndex) => {
			const template = pick(reviewTemplates);
			const user = pick(userRecords);
			reviewRecords.push({
				id: randomUUID(),
				collegeId,
				userId: user.id,
				rating,
				title: template.title,
				body: template.body,
				pros: template.pros,
				cons: template.cons,
				batch: 2019 + Math.floor(rng() * 6),
				isVerified: reviewIndex === 0,
				createdAt: new Date(Date.now() - Math.floor(rng() * 365) * 24 * 60 * 60 * 1000),
			});
		});
	});

	return { userRecords, collegeRecords, courseRecords, placementRecords, reviewRecords };
};

const main = async () => {
	const { userRecords, collegeRecords, courseRecords, placementRecords, reviewRecords } =
		await buildCollegeData();

	await prisma.user.createMany({ data: userRecords });
	await prisma.college.createMany({ data: collegeRecords });
	await prisma.course.createMany({ data: courseRecords });
	await prisma.placementStat.createMany({ data: placementRecords });
	await prisma.review.createMany({ data: reviewRecords });
};

main()
	.catch((error) => {
		console.error(error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
