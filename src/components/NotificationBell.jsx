import { useState, useEffect, useRef } from 'react';
import { Bell, MessageSquare, UserPlus, FileText, Calendar, CheckCircle2, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const [resAll, resCount] = await Promise.all([
                api.get('/notifications'),
                api.get('/notifications/unread-count')
            ]);
            if (resAll.data.success) setNotifications(resAll.data.data);
            if (resCount.data.success) setUnreadCount(resCount.data.count);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkRead = async (id, lien) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id_notification === id ? { ...n, est_lu: 1 } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
            setIsOpen(false);
            if (lien) navigate(lien);
        } catch (error) {
            console.error('Failed to mark read', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, est_lu: 1 })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all read', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'MESSAGE': return <MessageSquare className="h-4 w-4 text-blue-500" />;
            case 'FRIEND_REQUEST': return <UserPlus className="h-4 w-4 text-emerald-500" />;
            case 'APPLICATION': return <FileText className="h-4 w-4 text-amber-500" />;
            case 'EVENT': return <Calendar className="h-4 w-4 text-purple-500" />;
            default: return <Bell className="h-4 w-4 text-slate-400" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
            >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-slate-950 animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-[60]"
                    >
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider"
                                >
                                    Tout marquer lu
                                </button>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((n) => (
                                    <div
                                        key={n.id_notification}
                                        onClick={() => handleMarkRead(n.id_notification, n.lien)}
                                        className={cn(
                                            "p-4 border-b border-slate-50 dark:border-slate-800/50 cursor-pointer transition-colors flex gap-3",
                                            n.est_lu === 0 ? "bg-blue-50/30 dark:bg-blue-900/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                        )}
                                    >
                                        <div className={cn(
                                            "h-9 w-9 rounded-full flex items-center justify-center shrink-0",
                                            n.est_lu === 0 ? "bg-white dark:bg-slate-800 shadow-sm" : "bg-slate-100 dark:bg-slate-800/50"
                                        )}>
                                            {getIcon(n.type)}
                                        </div>
                                        <div className="space-y-1 overflow-hidden">
                                            <p className={cn(
                                                "text-sm leading-tight",
                                                n.est_lu === 0 ? "text-slate-900 dark:text-white font-semibold" : "text-slate-500 dark:text-slate-400"
                                            )}>
                                                {n.contenu}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-medium">
                                                {new Date(n.date_creation).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        {n.est_lu === 0 && (
                                            <div className="shrink-0 pt-1">
                                                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center space-y-3">
                                    <Bell className="h-10 w-10 text-slate-200 dark:text-slate-700 mx-auto" />
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Aucune notification</p>
                                </div>
                            )}
                        </div>

                        <div className="p-3 text-center border-t border-slate-100 dark:border-slate-800">
                            <Link to="/dashboard/search" onClick={() => setIsOpen(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">
                                Voir tous les membres
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
