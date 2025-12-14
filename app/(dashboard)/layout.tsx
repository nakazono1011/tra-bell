import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import { FooterNav } from "@/components/dashboard/footer-nav";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  // オンボーディング完了チェック
  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!dbUser?.onboardingCompletedAt) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-[var(--bg-warm)] flex flex-col">
      <DashboardHeader user={session.user} />
      <main className="flex-1 pb-20 md:pb-6">
        <div className="max-w-md mx-auto py-6">{children}</div>
      </main>
      <FooterNav />
    </div>
  );
}
