import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Search as SearchIcon, UserPlus, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

export function Search() {
    const { t } = useLanguage();
    const [query, setQuery] = useState('');
    const [filterRole, setFilterRole] = useState('ALUMNI');
    const [filterPromotion, setFilterPromotion] = useState('');
    const [filterSpeciality, setFilterSpeciality] = useState('');
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
        const matchesSearch = fullName.includes(search) || user.email.toLowerCase().includes(search);
        const matchesRole = filterRole === 'All' || user.role === filterRole;
        const matchesPromo = !filterPromotion ||
            (user.promotion && user.promotion.toString() === filterPromotion) ||
            (user.annee_diplome && user.annee_diplome.toString() === filterPromotion) ||
            (user.role === 'STUDENT' && new Date(user.date_inscription).getFullYear().toString() === filterPromotion);
        const matchesSpeciality = !filterSpeciality || user.domaine === filterSpeciality;

        return matchesRole && matchesSearch && matchesPromo && matchesSpeciality;
    });

    const promotions = [...new Set(users.map(u => u.promotion || u.annee_diplome || new Date(u.date_inscription).getFullYear()).filter(Boolean))].sort().reverse();
    const specialities = ['DSI', 'RSS', 'DWM'];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.search.title}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder={t.search.placeholder}
                        className="pl-10 h-10 bg-slate-50 dark:bg-slate-900 border-none"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="h-10 rounded-md border-none bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm text-slate-600 dark:text-slate-300"
                >
                    <option value="All">{t.admin.users.allStatus || 'Tout le monde'}</option>
                    <option value="ALUMNI">Alumni</option>
                    <option value="STUDENT">Étudiant</option>
                </select>

                <select
                    value={filterPromotion}
                    onChange={(e) => setFilterPromotion(e.target.value)}
                    className="h-10 rounded-md border-none bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm text-slate-600 dark:text-slate-300"
                >
                    <option value="">{t.admin.users.allStatus || 'Toute Promotion'}</option>
                    {promotions.map(promo => (
                        <option key={promo} value={promo}>{promo}</option>
                    ))}
                </select>

                <select
                    value={filterSpeciality}
                    onChange={(e) => setFilterSpeciality(e.target.value)}
                    className="h-10 rounded-md border-none bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm text-slate-600 dark:text-slate-300"
                >
                    <option value="">{t.auth.signUp.selectDomaine || 'Toute Spécialité'}</option>
                    {specialities.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                    ))}
                </select>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <div className="col-span-full text-center py-12">{t.search.loading}</div>
                ) : filteredUsers.map((user, index) => (
                    <motion.div
                        key={user.id_user}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="overflow-hidden hover:shadow-xl transition-all border-none bg-white dark:bg-slate-800 shadow-sm group">
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <Link to={`/dashboard/profile/${user.id_user}`} className="relative mb-4">
                                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-900 overflow-hidden ring-4 ring-white dark:ring-slate-800 shadow-inner group-hover:ring-blue-100 dark:group-hover:ring-blue-900/30 transition-all">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt={user.prenom} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700/50">
                                                {user.prenom[0]}{user.nom[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 rounded-full transition-colors">
                                        <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </Link>

                                <div className="space-y-1 mb-6">
                                    <Link to={`/dashboard/profile/${user.id_user}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{user.prenom} {user.nom}</h3>
                                    </Link>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{user.email}</p>

                                    <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                                        <span className={cn(
                                            "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border",
                                            user.role === 'ALUMNI'
                                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30"
                                                : "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/30"
                                        )}>
                                            {user.role === 'ALUMNI' ? 'Alumni' : 'Étudiant'}
                                        </span>
                                        {(user.promotion || user.annee_diplome || user.role === 'STUDENT') && (
                                            <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                                                {user.role === 'ALUMNI' ? `Promotion ${user.promotion || user.annee_diplome}` : `Entrée ${new Date(user.date_inscription).getFullYear()}`}
                                            </span>
                                        )}
                                        {user.domaine && (
                                            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-slate-200 dark:border-slate-700">
                                                {user.domaine}
                                            </span>
                                        )}
                                    </div>

                                    {user.disponible_mentorat === 1 && (
                                        <div className="pt-2">
                                            <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase rounded-full border border-amber-100 dark:border-amber-900/30">
                                                Mentor
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex w-full gap-2 mt-auto">
                                    <Link to={`/dashboard/profile/${user.id_user}`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full text-xs font-bold border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 h-9">
                                            {t.search.viewProfile}
                                        </Button>
                                    </Link>
                                    <Button
                                        size="sm"
                                        className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-black dark:hover:bg-slate-100 h-9"
                                        onClick={async () => {
                                            try {
                                                await api.post(`/friends/request/${user.id_user}`);
                                                alert(t.search.sentSuccess);
                                            } catch (err) {
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
                    <div className="col-span-full text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                        <div className="text-slate-400 dark:text-slate-500 mb-2">
                            <SearchIcon className="h-10 w-10 mx-auto opacity-50" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">{t.search.noResults}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
