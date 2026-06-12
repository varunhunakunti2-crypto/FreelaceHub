import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MessageWithSender, Profile } from '@/types';
import { RealtimeChannel } from '@supabase/supabase-js';

export function useRealtimeChat(conversationId: string | null, userId: string) {
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const supabase = createClient();
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;

    setLoading(true);
    const { data, error } = await (supabase.from('messages') as any)
      .select('*, sender:profiles(*)')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    // Fallback for mock data if no messages found for mock IDs
    if ((!data || data.length === 0) && conversationId.startsWith('mock-')) {
      const mockMessages: Record<string, MessageWithSender[]> = {
        'mock-1': [
          {
            id: 'm1',
            conversation_id: 'mock-1',
            sender_id: 'client-1',
            content: 'Hi Arun, we loved your proposal for the redesign!',
            file_url: null,
            read_at: null,
            created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            sender: { id: 'client-1', full_name: 'Urban Outfitters', avatar_url: null } as any
          },
          {
            id: 'm2',
            conversation_id: 'mock-1',
            sender_id: userId,
            content: 'Thank you! I am really excited about the potential of this project.',
            file_url: null,
            read_at: null,
            created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
            sender: { id: userId, full_name: 'Arun', avatar_url: null } as any
          }
        ],
        'mock-2': [
          {
            id: 'm3',
            conversation_id: 'mock-2',
            sender_id: 'client-2',
            content: 'Can we schedule a call for tomorrow?',
            file_url: null,
            read_at: null,
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            sender: { id: 'client-2', full_name: 'TechVision Inc.', avatar_url: null } as any
          }
        ]
      };
      setMessages(mockMessages[conversationId] || []);
      setLoading(false);
      return;
    }
    setLoading(false);
  }, [conversationId, userId, supabase]);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          const newMessage = payload.new;
          
          // Fetch sender info for the new message
          const { data: sender } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', newMessage.sender_id)
            .single();

          const messageWithSender = ({
            ...newMessage,
            sender,
          } as unknown) as MessageWithSender;

          setMessages((current) => {
            // Avoid duplicates
            if (current.find(m => m.id === messageWithSender.id)) return current;
            return [...current, messageWithSender];
          });

          // Mark as read if active
          if (newMessage.sender_id !== userId) {
            await (supabase.from('messages') as any)
              .update({ read_at: new Date().toISOString() })
              .eq('id', newMessage.id);
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, userId, supabase, fetchMessages]);

  // Presence for online indicators (Read-only view)
  useEffect(() => {
    const presenceChannel = supabase.channel('online-users-view');

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const newState = presenceChannel.presenceState();
        const onlineIds = Object.values(newState)
          .flat()
          .map((p: any) => p.user_id);
        setOnlineUsers(onlineIds);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, [supabase]);

  const sendMessage = async (content: string, fileUrl?: string) => {
    if (!conversationId || (!content.trim() && !fileUrl)) return;

    const { error } = await (supabase.from('messages') as any).insert({
      conversation_id: conversationId,
      sender_id: userId,
      content,
      file_url: fileUrl,
    });

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    onlineUsers,
  };
}
