import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { Card, CardContent } from '../../components/ui/Card';
import { Building, Plus, Search, Globe, MapPin, Trash2, Edit, ExternalLink, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useLanguage } from '../../context/LanguageContext';

export function ManageCompanies() {
    const { t } = useLanguage();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCompany, setCurrentCompany] = useState(null); // For editing
    const [formData, setFormData] = useState({ name: '', industry: '', location: '', website: '' });

    const fetchCompanies = async () => {
        try {
            const res = await api.get('/partners');
            if (res.data.success) {
                setCompanies(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch companies', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const filteredCompanies = companies.filter(c =>
        c.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.secteur?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (company = null) => {
        if (company) {
            setCurrentCompany(company);
            setFormData({
                name: company.nom,
                industry: company.secteur,
                location: company.ville,
                website: company.site_web
            });
        } else {
            setCurrentCompany(null);
            setFormData({ name: '', industry: '', location: '', website: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentCompany(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                nom: formData.name,
                secteur: formData.industry,
                ville: formData.location,
                site_web: formData.website,
                logo: null
            };

            if (currentCompany) {
                await api.put(`/partners/${currentCompany.id_partenaire}`, payload);
            } else {
                await api.post('/partners', payload);
            }
            fetchCompanies();
            handleCloseModal();
        } catch (error) {
            console.error('Operation failed', error);
            alert('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t.companies.confirmDelete)) {
            try {
                await api.delete(`/partners/${id}`);
                setCompanies(companies.filter(c => c.id_partenaire !== id));
            } catch (error) {
                console.error('Delete failed', error);
            }
        }
    };

    return (
        <div className="space-y-8 relative">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.companies.title}</h1>
                <Button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> {t.companies.add}
                </Button>
            </div>

            <div className="flex items-center space-x-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input
                        placeholder={t.companies.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-50 dark:bg-slate-900 border-none"
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCompanies.map((company) => (
                    <Card key={company.id_partenaire} className="bg-white dark:bg-slate-800 border-none shadow-md hover:shadow-2xl transition-all group overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600" />

                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-900 border border-blue-100/50 dark:border-slate-700 flex items-center justify-center shadow-inner">
                                    <Building className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-100/50 dark:border-blue-900/30">
                                    {t.companies.partner}
                                </span>
                            </div>

                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
                                {company.nom}
                            </h3>
                            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-4">{company.secteur}</p>

                            <div className="space-y-3 text-sm text-slate-500 dark:text-slate-400 mb-6 bg-slate-50/50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100/50 dark:border-slate-700/50">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-blue-500" />
                                    <span className="font-medium text-slate-700 dark:text-slate-300">{company.ville || 'Nouakchott'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-indigo-500" />
                                    <span className="truncate max-w-[180px] font-medium text-slate-700 dark:text-slate-300">{company.site_web || t.profile.noSocial}</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleOpenModal(company)}
                                    variant="outline"
                                    className="flex-1 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
                                >
                                    <Edit className="h-4 w-4 mr-2" /> {t.admin.events.edit}
                                </Button>
                                <Button
                                    onClick={() => handleDelete(company.id_partenaire)}
                                    variant="ghost"
                                    className="px-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {currentCompany ? t.companies.edit : t.companies.add}
                            </h2>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.companies.name}</label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Tech Solutions"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.companies.industry}</label>
                                <Input
                                    required
                                    value={formData.industry}
                                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                    placeholder="e.g. Technology, Finance"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.companies.location}</label>
                                <Input
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="e.g. Nouakchott"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.companies.website}</label>
                                <Input
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    placeholder="e.g. www.example.com"
                                />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">{t.profile.cancel}</Button>
                                <Button type="submit" className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
                                    {currentCompany ? t.profile.saveChanges : t.companies.add}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
