import { createAdminClient } from './supabase/server';
import { Database } from '@/types/database';

export type NotificationType = 
  | 'proposal_received' 
  | 'proposal_accepted' 
  | 'new_message' 
  | 'payment_received' 
  | 'task_updated'
  | 'project_posted';

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  metadata: Record<string, any> = {}
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type,
      title,
      message,
      metadata,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating notification:', error);
    return null;
  }

  return data;
}
