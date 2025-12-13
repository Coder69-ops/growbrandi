import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Bell, CheckCircle, Briefcase, Info, AlertTriangle } from 'lucide-react';

interface NotificationItemProps {
    notification: any;
    onClick: () => void;
    onMarkAsRead?: (e: React.MouseEvent) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick, onMarkAsRead }) => {

    const getIcon = () => {
        if (notification.type === 'message') {
            if (notification.senderPhoto) {
                return <img src={notification.senderPhoto} alt="" className="w-8 h-8 rounded-full object-cover" />;
            }
            return <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400"><MessageSquare size={14} /></div>;
        }

        // System notification icons
        switch (notification.type) {
            case 'task_assigned':
                return <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400"><Briefcase size={14} /></div>;
            case 'task_updated':
                return <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400"><Info size={14} /></div>;
            case 'task_completed':
                return <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400"><CheckCircle size={14} /></div>;
            case 'system_alert':
                return <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400"><AlertTriangle size={14} /></div>;
            default:
                return <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"><Bell size={14} /></div>;
        }
    };

    return (
        <div
            onClick={onClick}
            className={`p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group relative ${!notification.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
        >
            <div className="flex gap-3">
                <div className="shrink-0 mt-0.5">
                    {getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                        <h4 className={`text-sm ${!notification.isRead ? 'font-semibold text-slate-800 dark:text-slate-200' : 'font-medium text-slate-700 dark:text-slate-300'} truncate pr-2`}>
                            {notification.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0 whitespace-nowrap">
                            {notification.timestamp ? formatDistanceToNow(notification.timestamp instanceof Date ? notification.timestamp : (notification.timestamp.toDate ? notification.timestamp.toDate() : notification.timestamp), { addSuffix: true }).replace('about ', '') : ''}
                        </span>
                    </div>
                    <p className={`text-xs ${!notification.isRead ? 'text-slate-600 dark:text-slate-400' : 'text-slate-500 dark:text-slate-500'} line-clamp-2`}>
                        {notification.message}
                    </p>
                </div>
            </div>

            {!notification.isRead && onMarkAsRead && (
                <button
                    onClick={onMarkAsRead}
                    className="absolute right-2 bottom-2 p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Mark as read"
                >
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                </button>
            )}
        </div>
    );
};
