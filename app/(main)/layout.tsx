import MainSidebar from "@/components/layout/MainSidebar";

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-[#f8f6f0]">
			<div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-8">
				<aside className="hidden w-64 shrink-0 lg:block">
					<MainSidebar />
				</aside>
				<main className="flex-1">{children}</main>
			</div>
		</div>
	);
}
