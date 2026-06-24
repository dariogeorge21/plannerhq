import { createClient } from '@/lib/supabase/server';
import { PersonalCalendarClient } from './client';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Personal Calendar — PlannerHQ',
  description: 'Your unified personal calendar with events from all workspaces and personal schedule.',
};

export default async function PersonalCalendarPage() {
  const supabase = await createClient();
  const { data: userData, error } = await supabase.auth.getUser();

  if (error || !userData.user) {
    redirect('/login');
  }

  return <PersonalCalendarClient userId={userData.user.id} />;
}
