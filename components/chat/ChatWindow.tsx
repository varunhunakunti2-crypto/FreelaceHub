'use client';

import { useEffect, useRef } from 'react';
import { useRealtimeChat } from '@/lib/hooks/useRealtimeChat';
import Image from 'next/image';
import { format } from 'date-fns';
import MessageInput from './MessageInput';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ChatWindowProps {
  conversationId: string | null;
  currentUserId: string;
  onlineUsers: string[];
}

export default function ChatWindow({ conversationId, currentUserId, onlineUsers }: ChatWindowProps) {
  const { messages, loading, sendMessage } = useRealtimeChat(conversationId, currentUserId);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">
        <p>Select a conversation to start chatting</p>
      </div>
    );
  }

  if (loading && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900">
      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message, index) => {
          const isMe = message.sender_id === currentUserId;
          const showAvatar = index === 0 || messages[index - 1].sender_id !== message.sender_id;
          const isOnline = onlineUsers.includes(message.sender_id);

          return (
            <div 
              key={message.id} 
              className={cn(
                "flex items-end gap-2",
                isMe ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className="w-8 h-8 flex-shrink-0">
                {showAvatar && !isMe && (
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200">
                      {message.sender?.avatar_url ? (
                        <Image 
                          src={message.sender.avatar_url} 
                          alt={message.sender.full_name || 'User'} 
                          width={32} 
                          height={32}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-bold">
                          {message.sender?.full_name?.[0] || '?'}
                        </div>
                      )}
                    </div>
                    {isOnline && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
                    )}
                  </div>
                )}
              </div>

              <div className={cn(
                "max-w-[70%] flex flex-col",
                isMe ? "items-end" : "items-start"
              )}>
                <div className={cn(
                  "px-4 py-2 rounded-2xl text-sm",
                  isMe 
                    ? "bg-blue-600 text-white rounded-br-none" 
                    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none"
                )}>
                  {message.content}
                  {message.file_url && (
                    <div className="mt-2">
                      <a 
                        href={message.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs underline flex items-center gap-1 opacity-80 hover:opacity-100"
                      >
                        View Attachment
                      </a>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">
                  {format(new Date(message.created_at), 'p')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
}
