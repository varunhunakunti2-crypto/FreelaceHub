'use client';

import { useState, useRef } from 'react';
import { Send, Paperclip, Loader2, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';

interface MessageInputProps {
  onSendMessage: (content: string, fileUrl?: string) => Promise<void>;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleSend = async () => {
    if ((!content.trim() && !attachedFile) || isSending || isUploading) return;

    setIsSending(true);
    try {
      await onSendMessage(content, attachedFile?.url);
      setContent('');
      setAttachedFile(null);
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `chat/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('attachments')
        .getPublicUrl(filePath);

      setAttachedFile({ name: file.name, url: publicUrl });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      {attachedFile && (
        <div className="mb-2 flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 w-fit max-w-full">
          <Paperclip className="w-4 h-4 text-slate-400" />
          <span className="text-xs truncate max-w-[200px]">{attachedFile.name}</span>
          <button 
            onClick={() => setAttachedFile(null)}
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      
      <div className="flex items-end gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || isSending}
          className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
        >
          {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <textarea
          rows={1}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a message..."
          disabled={isSending}
          className="flex-1 max-h-32 resize-none bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-5 py-3 text-base focus:ring-2 focus:ring-blue-500 dark:text-slate-100 outline-none placeholder:text-slate-400"
        />
        
        <button
          type="button"
          onClick={handleSend}
          disabled={(!content.trim() && !attachedFile) || isSending || isUploading}
          className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:hover:bg-blue-600"
        >
          {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
