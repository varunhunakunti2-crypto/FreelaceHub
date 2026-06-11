'use client';

import { useState, useEffect } from 'react';
import ConversationList from '@/components/chat/ConversationList';
import ChatWindow from '@/components/chat/ChatWindow';
import { createClient } from '@/lib/supabase/client';

interface MessagesClientProps {
  userId: string;
}

export default function MessagesClient({ userId }: MessagesClientProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const supabase = createClient();

  // Handle presence globally for the messages page
  useEffect(() => {
    const presenceChannel = supabase.channel('online-users');

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const newState = presenceChannel.presenceState();
        const onlineIds = Object.values(newState)
          .flat()
          .map((p: any) => p.user_id);
        setOnlineUsers(onlineIds);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({ user_id: userId, online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, [userId, supabase]);

  return (
    <>
      <div className="w-80 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full overflow-hidden flex flex-col">
        <ConversationList 
          currentUserId={userId} 
          selectedId={selectedConversationId} 
          onSelect={setSelectedConversationId}
          onlineUsers={onlineUsers}
        />
      </div>
      <div className="flex-1 h-full overflow-hidden flex flex-col bg-slate-50 dark:bg-slate-950">
        <ChatWindow 
          conversationId={selectedConversationId} 
          currentUserId={userId}
          onlineUsers={onlineUsers}
        />
      </div>
    </>
  );
}
