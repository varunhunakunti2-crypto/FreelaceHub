'use server';

import { createActionClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createNotification } from '@/lib/notifications';

export async function createProject(formData: FormData) {
  const supabase = createActionClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const budget_min = parseFloat(formData.get('budget_min') as string);
  const budget_max = parseFloat(formData.get('budget_max') as string);
  const deadline = formData.get('deadline') as string;
  const skills_required = (formData.get('skills_required') as string)
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const { data, error } = await (supabase
    .from('projects')
    .insert({
      client_id: user.id,
      title,
      description,
      category,
      budget_min,
      budget_max,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      skills_required,
      status: 'open',
    })
    .select()
    .single() as any);

  if (error) {
    console.error('Error creating project:', error);
    return { error: error.message };
  }

  // Create notification for client
  await createNotification(
    user.id,
    'task_updated',
    'Project Posted',
    `Your project "${title}" has been successfully posted and is now live for freelancers.`,
    { project_id: data.id }
  );

  // Notify all freelancers
  try {
    const { data: freelancers } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'freelancer');

    if (freelancers && freelancers.length > 0) {
      const freelancerNotifications = freelancers.map(f => ({
        user_id: f.id,
        type: 'project_posted',
        title: 'New Project Posted!',
        message: `A new project "${title}" has been posted in ${category || 'General'}.`,
        metadata: { project_id: data.id }
      }));

      await supabase.from('notifications').insert(freelancerNotifications);
    }
  } catch (notifyError) {
    console.error('Error notifying freelancers:', notifyError);
    // Don't fail the project creation if notifications fail
  }

  revalidatePath('/dashboard/client/projects');
  redirect(`/dashboard/client/projects/${data.id}`);
}

export async function updateProject(projectId: string, formData: FormData) {
  const supabase = createActionClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const budget_min = parseFloat(formData.get('budget_min') as string);
  const budget_max = parseFloat(formData.get('budget_max') as string);
  const deadline = formData.get('deadline') as string;
  const skills_required = (formData.get('skills_required') as string)
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const { error } = await (supabase
    .from('projects')
    .update({
      title,
      description,
      category,
      budget_min,
      budget_max,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      skills_required,
    } as any)
    .eq('id', projectId)
    .eq('client_id', user.id) as any);

  if (error) {
    console.error('Error updating project:', error);
    return { error: error.message };
  }

  revalidatePath(`/dashboard/client/projects/${projectId}`);
  revalidatePath('/dashboard/client/projects');
  redirect(`/dashboard/client/projects/${projectId}`);
}

export async function deleteProject(projectId: string) {
  const supabase = createActionClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('client_id', user.id);

  if (error) {
    console.error('Error deleting project:', error);
    return { error: error.message };
  }

  revalidatePath('/dashboard/client/projects');
  redirect('/dashboard/client/projects');
}

export async function updateProjectStatus(projectId: string, status: string) {
  const supabase = createActionClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { error } = await (supabase
    .from('projects')
    .update({ status } as any)
    .eq('id', projectId)
    .eq('client_id', user.id) as any);

  if (error) {
    console.error('Error updating project status:', error);
    return { error: error.message };
  }

  revalidatePath(`/dashboard/client/projects/${projectId}`);
  revalidatePath('/dashboard/client/projects');
  return { success: true };
}

export async function updateProfileAvatar(avatarUrl: string) {
  const supabase = createActionClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: avatarUrl } as any)
    .eq('id', user.id);

  if (error) {
    console.error('Error updating profile avatar:', error);
    return { error: error.message };
  }

  revalidatePath('/dashboard/client/profile');
  return { success: true };
}

export async function acceptProposal(proposalId: string, projectId: string) {
  const supabase = createActionClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  // 1. Get proposal details
  const { data: proposal, error: proposalError } = await (supabase
    .from('proposals')
    .select('*, projects(title)')
    .eq('id', proposalId)
    .single() as any);

  if (proposalError || !proposal) {
    throw new Error('Proposal not found');
  }

  const projectTitle = proposal.projects?.title || 'the project';

  // 2. Start transaction (sequential calls in this case, or use RPC for real transaction)
  // Update proposal status
  const { error: updateProposalError } = await (supabase
    .from('proposals')
    .update({ status: 'accepted' } as any)
    .eq('id', proposalId) as any);

  if (updateProposalError) throw updateProposalError;

  // Update project status
  const { error: updateProjectError } = await (supabase
    .from('projects')
    .update({ status: 'in_progress' } as any)
    .eq('id', projectId) as any);

  if (updateProjectError) throw updateProjectError;

  // Create contract
  const { error: contractError } = await (supabase
    .from('contracts')
    .insert({
      project_id: projectId,
      client_id: user.id,
      freelancer_id: proposal.freelancer_id,
      proposal_id: proposalId,
      agreed_amount: proposal.bid_amount,
      status: 'active',
    } as any) as any);

  if (contractError) throw contractError;

  // 3. Create notification for freelancer
  await createNotification(
    proposal.freelancer_id,
    'proposal_accepted',
    'Proposal Accepted!',
    `Your proposal for project "${projectTitle}" has been accepted. A contract has been created.`,
    { project_id: projectId, proposal_id: proposalId }
  );

  // 4. Create notification for client (himself)
  await createNotification(
    user.id,
    'proposal_accepted',
    'Proposal Accepted',
    `You have successfully accepted the proposal for "${projectTitle}".`,
    { project_id: projectId, proposal_id: proposalId }
  );

  // Optionally reject other proposals
  await (supabase
    .from('proposals')
    .update({ status: 'rejected' } as any)
    .eq('project_id', projectId)
    .neq('id', proposalId)
    .eq('status', 'pending') as any);

  revalidatePath(`/dashboard/client/projects/${projectId}`);
  return { success: true };
}

export async function rejectProposal(proposalId: string, projectId: string) {
  const supabase = createActionClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  // 1. Get proposal and project details
  const { data: proposal, error: proposalError } = await (supabase
    .from('proposals')
    .select('*, projects(title)')
    .eq('id', proposalId)
    .single() as any);

  if (proposalError || !proposal) {
    throw new Error('Proposal not found');
  }

  const projectTitle = proposal.projects?.title || 'the project';

  // 2. Update status
  const { error } = await (supabase
    .from('proposals')
    .update({ status: 'rejected' } as any)
    .eq('id', proposalId) as any);

  if (error) {
    console.error('Error rejecting proposal:', error);
    return { error: error.message };
  }

  // 3. Notify freelancer
  await createNotification(
    proposal.freelancer_id,
    'task_updated', // Using task_updated as a generic type or we could add a new one
    'Proposal Rejected',
    `Your proposal for project "${projectTitle}" has been rejected.`,
    { project_id: projectId, proposal_id: proposalId }
  );

  // 4. Notify client (self)
  await createNotification(
    user.id,
    'task_updated',
    'Proposal Rejected',
    `You have rejected the proposal for "${projectTitle}".`,
    { project_id: projectId, proposal_id: proposalId }
  );

  revalidatePath(`/dashboard/client/projects/${projectId}`);
  return { success: true };
}
