'use server';

import { createActionClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { createNotification } from '@/lib/notifications';

export async function submitProposal(formData: {
  projectId: string;
  coverLetter: string;
  bidAmount: number;
  estimatedDays: number;
}) {
  const supabase = createActionClient() as any;
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  // 1. Get project details to find the client_id and title
  const { data: project, error: projectError } = await (supabase
    .from('projects')
    .select('client_id, title')
    .eq('id', formData.projectId)
    .single() as any);

  if (projectError || !project) {
    throw new Error('Project not found');
  }

  // 2. Insert the proposal
  const { data: proposal, error: proposalError } = await (supabase
    .from('proposals')
    .insert({
      project_id: formData.projectId,
      freelancer_id: user.id,
      cover_letter: formData.coverLetter,
      bid_amount: formData.bidAmount,
      estimated_days: formData.estimatedDays,
      status: 'pending'
    })
    .select()
    .single() as any);

  if (proposalError) {
    if (proposalError.code === '23505') {
      return { error: 'You have already submitted a proposal for this project' };
    }
    throw proposalError;
  }

  // 3. Create notification for the client
  await createNotification(
    project.client_id,
    'proposal_received',
    'New Proposal Received',
    `A new proposal has been submitted for your project "${project.title}" by ${user.user_metadata?.full_name || 'a freelancer'}.`,
    { project_id: formData.projectId, proposal_id: proposal.id }
  );

  revalidatePath(`/dashboard/freelancer/proposals`);
  revalidatePath(`/dashboard/client/projects/${formData.projectId}`);
  
  return { success: true };
}
