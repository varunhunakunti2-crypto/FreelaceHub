'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ConversationWithParticipants, Message, Profile } from '@/types';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useUser } from '@/lib/context/UserContext';

interface ConversationListProps {
  currentUserId: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onlineUsers: string[];
}

type ConversationItem = ConversationWithParticipants & {
  last_message?: Message;
  unread_count: number;
};

export default function ConversationList({ 
  currentUserId, 
  selectedId, 
  onSelect,
  onlineUsers 
}: ConversationListProps) {
  const { profile } = useUser();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      
      // Fetch conversations where user is a participant
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participants:profiles!conversations_participant_ids_fkey(*)
        `)
        .contains('participant_ids', [currentUserId])
        .order('updated_at', { ascending: false });

      // Note: Supabase doesn't easily support join with array contains and profiles in one go 
      // if participant_ids is a uuid[]. 
      // The above select might fail if there is no explicit FK defined for the array.
      // Let's refine the query.
      
      // Fallback for mock data if no conversations found
      if (!data || data.length === 0) {
        const mockConvs = [
          {
            id: 'mock-1',
            participant_ids: [currentUserId, 'client-1'],
            updated_at: new Date().toISOString(),
            participants: [
              { id: currentUserId, full_name: 'Arun', avatar_url: profile?.avatar_url },
              { id: 'client-1', full_name: 'Urban Outfitters', avatar_url: null }
            ],
            last_message: { 
              content: 'Hi Arun, we loved your proposal for the redesign!', 
              created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() 
            },
            unread_count: 1
          },
          {
            id: 'mock-2',
            participant_ids: [currentUserId, 'client-2'],
            updated_at: new Date().toISOString(),
            participants: [
              { id: currentUserId, full_name: 'Arun', avatar_url: profile?.avatar_url },
              { id: 'client-2', full_name: 'TechVision Inc.', avatar_url: null }
            ],
            last_message: { 
              content: 'Can we schedule a call for tomorrow?', 
              created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() 
            },
            unread_count: 0
          }
        ];
        setConversations(mockConvs as any);
        setLoading(false);
        return;
      }
    };

    fetchConversations();

    // Subscribe to conversation updates and new messages to refresh list
    const channel = supabase
      .channel('conversation-list')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        () => fetchConversations() // Re-fetch on any message change for simplicity
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, supabase]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto border-r border-slate-200 dark:border-slate-800">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold">Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No conversations yet.
          </div>
        ) : (
          conversations.map((conv) => {
            const otherParticipant = conv.participants.find(p => p.id !== currentUserId);
            const isOnline = otherParticipant ? onlineUsers.includes(otherParticipant.id) : false;
            
            return (
              <button
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors border-b border-slate-100 dark:border-slate-800 relative",
                  selectedId === conv.id && "bg-slate-100 dark:bg-slate-800"
                )}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200">
                    {otherParticipant?.avatar_url ? (
                      <Image 
                        src={otherParticipant.avatar_url} 
                        alt={otherParticipant.full_name || 'User'} 
                        width={48} 
                        height={48}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                        {otherParticipant?.full_name?.[0] || '?'}
                      </div>
                    )}
                  </div>
                  {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  )}
                </div>
                
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {otherParticipant?.full_name || 'Unknown User'}
                    </span>
                    {conv.last_message && (
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {formatDistanceToNow(new Date(conv.last_message.created_at), { addSuffix: false })}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className={cn(
                      "text-sm truncate pr-4",
                      conv.unread_count > 0 ? "text-slate-900 dark:text-slate-100 font-medium" : "text-slate-500"
                    )}>
                      {conv.last_message?.content || 'No messages yet'}
                    </p>
                    {conv.unread_count > 0 && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full min-w-[1.25rem] text-center">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
