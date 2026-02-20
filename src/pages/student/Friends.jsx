import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Check, X, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export function Friends() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('friends');

    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);

    const fetchData = async () => {
        try {
            const [friendsRes, requestsRes] = await Promise.all([
                api.get('/friends'),
                api.get('/friends/requests')
            ]);

            console.log('Friends response:', friendsRes.data);
            console.log('Requests response:', requestsRes.data);

            if (friendsRes.data.success) {
                // The API returns {success: true, friends: [...]} not {success: true, data: [...]}
                setFriends(friendsRes.data.friends || friendsRes.data.data || []);
            }
            if (requestsRes.data.success) {
                // The API returns {success: true, requests: [...]} not {success: true, data: [...]}
                setRequests(requestsRes.data.requests || requestsRes.data.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch friends data", error);
            // Set empty arrays to prevent undefined errors
            setFriends([]);
            setRequests([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAccept = async (userId) => {
        try {
            console.log('Accepting friend request from user:', userId);
            const response = await api.put(`/friends/accept/${userId}`);
            console.log('Accept response:', response.data);
            alert(t.friends.acceptedAlert);
            fetchData(); // Refresh list
        } catch (err) {
            console.error('Accept error:', err);
            console.error('Error response:', err.response?.data);
            alert('Failed to accept request: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleReject = async (userId) => {
        try {
            console.log('Rejecting friend request from user:', userId);
            const response = await api.delete(`/friends/reject/${userId}`);
            console.log('Reject response:', response.data);
            alert(t.friends.rejectedAlert);
            fetchData();
        } catch (err) {
            console.error('Reject error:', err);
            console.error('Error response:', err.response?.data);
            alert('Failed to reject request: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.friends.title}</h1>
                <div className="flex space-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('friends')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'friends' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                    >
                        {t.friends.tabs.mine}
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'requests' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                    >
                        {t.friends.tabs.requests}
                        <span className="ml-2 bg-supnum-blue text-white text-xs px-1.5 py-0.5 rounded-full">{requests.length}</span>
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                {activeTab === 'friends' ? (
                    friends.length > 0 ? (
                        friends.map((friend) => (
                            <Card key={friend.id_user} className="bg-white dark:bg-slate-800 border-none shadow-sm">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                            {friend.avatar ? (
                                                <img src={friend.avatar} alt={friend.prenom} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center font-bold text-slate-400 dark:text-slate-500">
                                                    {friend.prenom?.[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white">{friend.prenom} {friend.nom}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{friend.role === 'student' ? t.profile.student : t.profile.graduate}</p>
                                        </div>
                                    </div>
                                    <Link to="/dashboard/messages">
                                        <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                                            <MessageSquare className="mr-2 h-4 w-4" />
                                            {t.friends.message}
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="text-center text-slate-500 py-8">{t.friends.noFriends}</p>
                    )
                ) : (
                    requests.length > 0 ? (
                        requests.map((request) => (
                            <Card key={request.id_user} className="bg-white dark:bg-slate-800 border-none shadow-sm">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                            {request.avatar ? (
                                                <img src={request.avatar} alt={request.prenom} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center font-bold text-slate-400 dark:text-slate-500">
                                                    {request.prenom?.[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white">{request.prenom} {request.nom}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{t.friends.sentRequest}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button size="sm" onClick={() => handleAccept(request.id_user)} className="bg-green-600 hover:bg-green-700 text-white">
                                            <Check className="mr-2 h-4 w-4" />
                                            {t.friends.accept}
                                        </Button>
                                        <Button size="sm" onClick={() => handleReject(request.id_user)} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20">
                                            <X className="mr-2 h-4 w-4" />
                                            {t.friends.reject}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="text-center text-slate-500 py-8">{t.friends.noRequests}</p>
                    )
                )}
            </div>
        </div>
    );
}
