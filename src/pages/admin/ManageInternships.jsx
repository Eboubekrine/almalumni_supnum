import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Briefcase, Plus, Search, MapPin, Building, Trash2, Edit, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { cn } from '../../lib/utils';

import { useLanguage } from '../../context/LanguageContext';

export function ManageInternships() {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentInternship, setCurrentInternship] = useState(null);
    const [formData, setFormData] = useState({ titre: '', entreprise: '', type_offre: 'STAGE', lieu: '', active: true });

    const fetchInternships = async () => {
        try {
            const url = user?.role === 'ADMIN' ? '/offres' : `/offres?userId=${user?.id_user}`;
            const res = await api.get(url);
            if (res.data.success) {
                setInternships(res.data.data);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to load internships: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInternships();
    }, []);

    const filteredInternships = internships.filter(i =>
        i.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.entreprise?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (internship = null) => {
        if (internship) {
            setCurrentInternship(internship);
            setFormData({
                titre: internship.titre,
                entreprise: internship.entreprise,
                type_offre: internship.type_offre,
                lieu: internship.lieu || '',
                active: true
            });
        } else {
            setCurrentInternship(null);
            setFormData({ titre: '', entreprise: '', type_offre: 'STAGE', lieu: '', active: true });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentInternship(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                titre: formData.titre,
                entreprise: formData.entreprise,
                description: "No description",
                type_offre: formData.type_offre,
                lieu: formData.lieu
            };

            if (currentInternship) {
                await api.put(`/offres/${currentInternship.id_offre}`, payload);
            } else {
                await api.post('/offres', payload);
            }
            fetchInternships();
            handleCloseModal();
        } catch (error) {
            console.error(error);
            alert('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this opportunity?')) {
            try {
                await api.delete(`/offres/${id}`);
                setInternships(internships.filter(i => i.id_offre !== id));
            } catch (error) {
                console.error(error);
            }
        }
    };

    const toggleActive = (id) => {
        // Not implemented in backend yet, just UI toggle for now or ignore
    };

    return (
        <div className="space-y-8 relative">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.internships.title}</h1>
                <Button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> {t.admin.charts.opportunitiesPosted}
                </Button>
            </div>

            <div className="flex items-center space-x-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input
                        placeholder={t.internships.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-50 dark:bg-slate-900 border-none"
                    />
                </div>
            </div>

            <div className="grid gap-6">
                {filteredInternships.map((internship) => (
                    <Card key={internship.id_offre} className="bg-white dark:bg-slate-800 border-none shadow-md hover:shadow-xl transition-all group overflow-hidden relative">
                        {/* Decorative Gradient Bar */}
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-blue-500" />

                        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center space-x-5">
                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-900 border border-blue-100/50 dark:border-slate-700 flex items-center justify-center shadow-inner shrink-0">
                                    <Briefcase className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors uppercase tracking-tight">{internship.titre}</h3>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm">
                                        <span className="flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400">
                                            <Building className="h-3.5 w-3.5" /> {internship.entreprise}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                                            <MapPin className="h-3.5 w-3.5 text-blue-500" /> {internship.lieu || 'Remote'}
                                        </span>
                                        <span className={cn(
                                            "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                            internship.type_offre === 'STAGE'
                                                ? "bg-emerald-50 text-emerald-600 border-emerald-100/50 dark:bg-emerald-900/20 dark:text-emerald-400"
                                                : "bg-amber-50 text-amber-600 border-amber-100/50 dark:bg-amber-900/20 dark:text-amber-400"
                                        )}>
                                            {internship.type_offre}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 self-end md:self-center bg-slate-50/50 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-100/50 dark:border-slate-700/50">
                                <button
                                    onClick={() => toggleActive(internship.id_offre)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-lg text-[11px] font-bold uppercase transition-all shadow-sm",
                                        internship.active !== false
                                            ? "bg-white dark:bg-slate-800 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 shadow-green-200/50"
                                            : "bg-white dark:bg-slate-800 text-slate-400 hover:bg-slate-50 shadow-slate-200/50"
                                    )}
                                >
                                    {internship.active !== false ? '● Active' : '○ Closed'}
                                </button>
                                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
                                <Button onClick={() => handleOpenModal(internship)} variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600">
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button onClick={() => handleDelete(internship.id_offre)} variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {!loading && filteredInternships.length === 0 && (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-dashed border-slate-200 dark:border-slate-700 transition-colors">
                    <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">{t.internships.noOffers}</h3>
                    <p className="text-slate-500 dark:text-slate-400">{t.internships.noOffersSubtitle}</p>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {currentInternship ? t.admin.events.edit : t.admin.charts.opportunitiesPosted}
                            </h2>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Job Title</label>
                                <Input
                                    required
                                    value={formData.titre}
                                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                                    placeholder="e.g. Software Engineer"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Company</label>
                                <Input
                                    required
                                    value={formData.entreprise}
                                    onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })}
                                    placeholder="e.g. Tech Corp"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
                                    <select
                                        className="w-full h-10 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                                        value={formData.type_offre}
                                        onChange={(e) => setFormData({ ...formData, type_offre: e.target.value })}
                                    >
                                        <option value="STAGE">{t.internships.internship}</option>
                                        <option value="EMPLOI">{t.internships.job}</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
                                    <Input
                                        required
                                        value={formData.lieu}
                                        onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                                        placeholder="e.g. Nouakchott"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="active"
                                    checked={formData.active}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="active" className="text-sm font-medium text-slate-700 dark:text-slate-300">Active Listing</label>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">{t.internships.cancel}</Button>
                                <Button type="submit" className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
                                    {currentInternship ? t.profile.saveChanges : t.admin.charts.opportunitiesPosted}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
