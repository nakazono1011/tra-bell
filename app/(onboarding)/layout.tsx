import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function OnboardingLayout({
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

  // すでにオンボーディング完了している場合はダッシュボードへ
  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (dbUser?.onboardingCompletedAt) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
