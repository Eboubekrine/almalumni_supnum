import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Search as SearchIcon, UserPlus, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

export function Search() {
    const { t } = useLanguage();
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/users');
                if (res.data.success) {
                    setUsers(res.data.users);
                }
            } catch (err) {
                console.error("Failed to fetch users", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => {
        const fullName = `${user.prenom} ${user.nom}`.toLowerCase();
        const search = query.toLowerCase();
        return user.role !== 'admin' && (
            fullName.includes(search) ||
            user.email.toLowerCase().includes(search)
        );
    });

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.search.title}</h1>

            <div className="relative">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                    placeholder={t.search.placeholder}
                    className="pl-10 h-12 text-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <div className="col-span-full text-center py-12">{t.search.loading}</div>
                ) : filteredUsers.map((user, index) => (
                    <motion.div
                        key={user.id_user}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="overflow-hidden hover:shadow-md transition-shadow bg-white dark:bg-slate-800 border-none shadow-sm">
                            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                <Link to={`/dashboard/profile/${user.id_user}`} className="group relative">
                                    <div className="h-24 w-24 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-4 ring-white dark:ring-slate-700 shadow-sm group-hover:ring-supnum-blue/20 dark:group-hover:ring-supnum-blue/40 transition-all">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt={user.prenom} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-slate-400 dark:text-slate-500">
                                                {user.prenom[0]}{user.nom[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 rounded-full transition-colors">
                                        <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </Link>
                                <div>
                                    <Link to={`/dashboard/profile/${user.id_user}`} className="hover:underline hover:text-supnum-blue dark:hover:text-blue-400">
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{user.prenom} {user.nom}</h3>
                                    </Link>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full capitalize">
                                        {user.role}
                                    </span>
                                    {user.disponible_mentorat === 1 && (
                                        <div className="mt-2">
                                            <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase rounded-md border border-amber-200 dark:border-amber-800">
                                                Mentor
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex w-full gap-2">
                                    <Link to={`/dashboard/profile/${user.id_user}`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                                            {t.search.viewProfile}
                                        </Button>
                                    </Link>
                                    <Button
                                        size="sm"
                                        className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100"
                                        onClick={async () => {
                                            try {
                                                console.log('Sending friend request to user:', user.id_user);
                                                const response = await api.post(`/friends/request/${user.id_user}`);
                                                console.log('Friend request response:', response.data);
                                                alert(t.search.sentSuccess);
                                            } catch (err) {
                                                console.error('Friend request error:', err);
                                                console.error('Error details:', err.response?.data);
                                                alert('Failed to send request: ' + (err.response?.data?.message || err.message));
                                            }
                                        }}
                                    >
                                        <UserPlus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
                {filteredUsers.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">
                        {t.search.noResults}
                    </div>
                )}
            </div>
        </div>
    );
}
