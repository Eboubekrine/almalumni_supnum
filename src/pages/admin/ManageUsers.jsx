import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Search, Trash2, ArrowLeft, Eye, CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function ManageUsers() {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [newUser, setNewUser] = useState({ nom: '', prenom: '', email: '', mot_de_passe: '', role: 'STUDENT' });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/users');
                if (res.data.success) {
                    setUsers(res.data.users.map(u => ({ ...u, status: 'Verified' }))); // Default status
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
        const search = searchTerm.toLowerCase();
        return fullName.includes(search) || user.email.toLowerCase().includes(search);
    });

    const handleDelete = async (id) => {
        if (window.confirm(t.admin.users.confirmDelete)) {
            try {
                const res = await api.delete(`/users/${id}`);
                if (res.data.success) {
                    setUsers(users.filter(u => u.id_user !== id));
                }
            } catch (err) {
                console.error("Failed to delete", err);
                alert("Failed to delete user: " + (err.response?.data?.message || err.message));
            }
        }
    };

    const handleStatusChange = (id, newStatus) => {
        setUsers(users.map(u => u.id_user === id ? { ...u, status: newStatus } : u));
    };

    const handleExportCSV = () => {
        const headers = [t.admin.users.user, t.admin.users.email, t.admin.users.role, t.admin.users.status];
        const csvContent = [
            headers.join(','),
            ...users.map(u => [`${u.prenom} ${u.nom}`, u.email, u.role, u.status].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'supnum_users.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/register', newUser);
            if (res.data.success) {
                alert(t.admin.users.addSuccess || 'User created successfully!');
                setIsAddingUser(false);
                setNewUser({ nom: '', prenom: '', email: '', mot_de_passe: '', role: 'STUDENT' });
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || error.message || 'Failed to create user';
            alert('Error: ' + msg);
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'Verified': return t.admin.users.verified;
            case 'Pending': return t.admin.users.pending;
            case 'Suspended': return t.admin.users.suspended;
            default: return status;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between font-arabic-support">
                <div className="flex items-center space-x-4">
                    <Link to="/admin" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-400">
                        <ArrowLeft className="h-6 w-6 rtl:rotate-180" />
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.admin.users.title}</h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExportCSV}>{t.admin.users.export}</Button>
                    <Button className="bg-blue-600 text-white" onClick={() => setIsAddingUser(true)}>{t.admin.users.add}</Button>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input
                        placeholder={t.admin.users.search}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-blue-500"
                    />
                </div>
                <select className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm outline-none">
                    <option>{t.admin.users.allStatus}</option>
                    <option value="Verified">{t.admin.users.verified}</option>
                    <option value="Pending">{t.admin.users.pending}</option>
                    <option value="Suspended">{t.admin.users.suspended}</option>
                </select>
            </div>

            <AnimatePresence>
                {isAddingUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.admin.users.addUser}</h2>
                                <button onClick={() => setIsAddingUser(false)} className="text-slate-500 hover:text-slate-700 dark:text-slate-400">
                                    <XCircle className="h-6 w-6" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.admin.users.firstName}</label>
                                        <Input
                                            value={newUser.prenom}
                                            onChange={e => setNewUser({ ...newUser, prenom: e.target.value })}
                                            required
                                            className="bg-slate-50 dark:bg-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.admin.users.lastName}</label>
                                        <Input
                                            value={newUser.nom}
                                            onChange={e => setNewUser({ ...newUser, nom: e.target.value })}
                                            required
                                            className="bg-slate-50 dark:bg-slate-900"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.admin.users.email}</label>
                                    <Input
                                        type="email"
                                        value={newUser.email}
                                        onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                        required
                                        className="bg-slate-50 dark:bg-slate-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.admin.users.password}</label>
                                    <Input
                                        type="password"
                                        value={newUser.mot_de_passe}
                                        onChange={e => setNewUser({ ...newUser, mot_de_passe: e.target.value })}
                                        required
                                        className="bg-slate-50 dark:bg-slate-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.admin.users.role}</label>
                                    <select
                                        className="w-full h-11 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 text-sm"
                                        value={newUser.role}
                                        onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                    >
                                        <option value="STUDENT">{t.profile.student}</option>
                                        <option value="ALUMNI">{t.profile.graduate}</option>
                                        <option value="ADMIN">{t.profile.admin}</option>
                                    </select>
                                </div>
                                <div className="pt-4 flex justify-end space-x-3">
                                    <Button type="button" variant="outline" onClick={() => setIsAddingUser(false)}>{t.profile.cancel}</Button>
                                    <Button type="submit" className="bg-blue-600 text-white">{t.admin.users.add}</Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Card className="border-none shadow-lg overflow-hidden bg-white dark:bg-slate-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                                <th className="p-6 font-semibold text-slate-900 dark:text-white">{t.admin.users.user}</th>
                                <th className="p-6 font-semibold text-slate-900 dark:text-white">{t.admin.users.email}</th>
                                <th className="p-6 font-semibold text-slate-900 dark:text-white">{t.admin.users.role}</th>
                                <th className="p-6 font-semibold text-slate-900 dark:text-white">{t.admin.users.status}</th>
                                <th className="p-6 font-semibold text-slate-900 dark:text-white text-right">{t.admin.users.actions}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {loading ? <tr><td colSpan="5" className="p-6 text-center">{t.search.loading}</td></tr> : filteredUsers.map((user) => (
                                <tr key={user.id_user} className="group hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt={user.prenom} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center font-bold text-slate-500 dark:text-slate-400">
                                                        {user.prenom?.[0]}{user.nom?.[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 dark:text-white">{user.prenom} {user.nom}</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-slate-600 dark:text-slate-300 font-mono">{user.email}</td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${user.role?.toLowerCase() === 'student'
                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                            : 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'
                                            }`}>
                                            {user.role === 'ADMIN' ? t.profile.admin : (user.role === 'ALUMNI' ? t.profile.graduate : t.profile.student)}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit ${user.status === 'Verified' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                            user.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                                                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                            }`}>
                                            {user.status === 'Verified' && <CheckCircle className="h-3 w-3" />}
                                            {user.status === 'Pending' && <AlertTriangle className="h-3 w-3" />}
                                            {user.status === 'Suspended' && <XCircle className="h-3 w-3" />}
                                            {getStatusLabel(user.status)}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            {user.status === 'Pending' && (
                                                <Button size="sm" onClick={() => handleStatusChange(user.id_user, 'Verified')} className="bg-green-600 hover:bg-green-700 text-white">
                                                    {t.admin.users.approve}
                                                </Button>
                                            )}
                                            <Link to={`/admin/profile/${user.id_user}`}>
                                                <Button size="sm" variant="outline" className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300" title={t.userProfile.viewProfile}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                onClick={() => handleDelete(user.id_user)}
                                                size="sm"
                                                className="bg-red-500 hover:bg-red-600 text-white border-none shadow-sm"
                                                title={t.admin.users.remove}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
