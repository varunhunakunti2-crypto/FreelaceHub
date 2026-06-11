'use client';

import { formatDistanceToNow } from 'date-fns';
import { 
  FileText, 
  CheckCircle, 
  MessageSquare, 
  CreditCard, 
  RefreshCw,
  BellOff,
  Briefcase
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Database } from '@/types/database';

type Notification = Database['public']['Tables']['notifications']['Row'];

interface NotificationDropdownProps {
  notifications: Notification[];
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  onClose: () => void;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'proposal_received':
      return <FileText className="h-5 w-5 text-blue-500" />;
    case 'proposal_accepted':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'new_message':
      return <MessageSquare className="h-5 w-5 text-purple-500" />;
    case 'payment_received':
      return <CreditCard className="h-5 w-5 text-emerald-500" />;
    case 'task_updated':
      return <RefreshCw className="h-5 w-5 text-amber-500" />;
    case 'project_posted':
      return <Briefcase className="h-5 w-5 text-blue-600" />;
    default:
      return <FileText className="h-5 w-5 text-gray-500" />;
  }
};

const getRedirectUrl = (notification: Notification) => {
  const metadata = notification.metadata as any;
  switch (notification.type) {
    case 'proposal_received':
      return `/dashboard/client/projects/${metadata.project_id}`;
    case 'proposal_accepted':
      return `/dashboard/freelancer/contracts/${metadata.contract_id}`;
    case 'new_message':
      return `/messages/${metadata.conversation_id}`;
    case 'payment_received':
      return `/dashboard/freelancer/payments`;
    case 'task_updated':
      return `/dashboard/contracts/${metadata.contract_id}/kanban`;
    case 'project_posted':
      return `/dashboard/freelancer/browse/${metadata.project_id}`;
    default:
      return '/dashboard';
  }
};

export default function NotificationDropdown({
  notifications,
  markAsRead,
  markAllAsRead,
  onClose,
}: NotificationDropdownProps) {
  const router = useRouter();

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
    const url = getRedirectUrl(notification);
    router.push(url);
    onClose();
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
        <button
          onClick={() => markAllAsRead()}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          Mark all as read
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <BellOff className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No notifications yet</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.is_read ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className="flex gap-3">
                  <div className="mt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notification.is_read ? 'font-semibold' : 'font-medium'} text-gray-900 truncate`}>
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-0.5">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <div className="mt-2 h-2 w-2 bg-blue-600 rounded-full flex-shrink-0" />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
        <button
          onClick={onClose}
          className="text-sm text-gray-600 hover:text-gray-900 font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
}
