'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export async function completeOnboarding() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error('Unauthorized');
  }

  await db
    .update(users)
    .set({
      onboardingCompletedAt: new Date(),
    })
    .where(eq(users.id, session.user.id));

  redirect('/dashboard');
}
