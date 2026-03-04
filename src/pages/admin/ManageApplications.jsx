import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { Card, CardContent } from '../../components/ui/Card';
import { Briefcase, Search, User, FileText, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../context/LanguageContext';

export function ManageApplications() {
    const { t } = useLanguage();
    const [offers, setOffers] = useState([]);
    const [applications, setApplications] = useState({}); // { offerId: [apps] }
    const [expandedOffers, setExpandedOffers] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchOffers = async () => {
        try {
            const res = await api.get('/offres');
            if (res.data.success) {
                setOffers(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch offers', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchApplications = async (offerId) => {
        try {
            const res = await api.get(`/candidatures/offre/${offerId}`);
            if (res.data.success) {
                setApplications(prev => ({ ...prev, [offerId]: res.data.data }));
            }
        } catch (error) {
            console.error(`Failed to fetch apps for offer ${offerId}`, error);
        }
    };

    useEffect(() => {
        fetchOffers();
    }, []);

    const toggleOffer = (offerId) => {
        const newExpanded = new Set(expandedOffers);
        if (newExpanded.has(offerId)) {
            newExpanded.delete(offerId);
        } else {
            newExpanded.add(offerId);
            if (!applications[offerId]) {
                fetchApplications(offerId);
            }
        }
        setExpandedOffers(newExpanded);
    };

    const handleUpdateStatus = async (offerId, appId, newStatus) => {
        try {
            const res = await api.patch(`/candidatures/${appId}/status`, { statut: newStatus });
            if (res.data.success) {
                // Refresh applications for this offer
                fetchApplications(offerId);
            }
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Failed to update status');
        }
    };

    const filteredOffers = offers.filter(o =>
        o.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.entreprise?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACCEPTE': return 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400';
            case 'REFUSE': return 'text-red-600 bg-red-50 border-red-100 dark:bg-red-900/20 dark:text-red-400';
            default: return 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.admin.nav.applications}</h1>
            </div>

            <div className="flex items-center space-x-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
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

            <div className="grid gap-4">
                {filteredOffers.map((offer) => (
                    <div key={offer.id_offre} className="space-y-2">
                        <Card
                            className={cn(
                                "bg-white dark:bg-slate-800 border-none shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden",
                                expandedOffers.has(offer.id_offre) && "ring-2 ring-blue-500 dark:ring-blue-400"
                            )}
                            onClick={() => toggleOffer(offer.id_offre)}
                        >
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-slate-900 flex items-center justify-center">
                                        <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">{offer.titre}</h3>
                                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{offer.entreprise}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.internships.type}</p>
                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{offer.type_offre}</p>
                                    </div>
                                    {expandedOffers.has(offer.id_offre) ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                                </div>
                            </CardContent>
                        </Card>

                        {expandedOffers.has(offer.id_offre) && (
                            <div className="ml-4 pl-4 border-l-2 border-blue-200 dark:border-blue-900 space-y-3 animate-in slide-in-from-top-2 duration-200">
                                {applications[offer.id_offre] ? (
                                    applications[offer.id_offre].length > 0 ? (
                                        applications[offer.id_offre].map(app => (
                                            <Card key={app.id_candidature} className="bg-white/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800">
                                                <CardContent className="p-4">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold">
                                                                {app.prenom?.[0]}{app.nom?.[0]}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-900 dark:text-white">{app.prenom} {app.nom}</p>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400">{app.email}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center flex-wrap gap-2">
                                                            <span className={cn(
                                                                "px-3 py-1 rounded-full text-[11px] font-bold border",
                                                                getStatusColor(app.statut)
                                                            )}>
                                                                {app.statut}
                                                            </span>

                                                            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

                                                            {app.cv_url && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        window.open(app.cv_url, '_blank');
                                                                    }}
                                                                >
                                                                    <FileText className="h-4 w-4 mr-1" /> CV
                                                                </Button>
                                                            )}

                                                            {app.statut === 'EN_ATTENTE' && (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleUpdateStatus(offer.id_offre, app.id_candidature, 'ACCEPTE');
                                                                        }}
                                                                    >
                                                                        <CheckCircle className="h-4 w-4 mr-1" /> {t.friends.accept}
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleUpdateStatus(offer.id_offre, app.id_candidature, 'REFUSE');
                                                                        }}
                                                                    >
                                                                        <XCircle className="h-4 w-4 mr-1" /> {t.friends.reject}
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {app.message && (
                                                        <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-400 italic">
                                                            "{app.message}"
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 text-slate-400 text-sm">
                                            {t.applications.noApps}
                                        </div>
                                    )
                                ) : (
                                    <div className="flex justify-center py-4">
                                        <Clock className="h-5 w-5 animate-spin text-blue-500" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {!loading && filteredOffers.length === 0 && (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-dashed border-slate-200 dark:border-slate-700">
                    <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">{t.internships.noOffers}</h3>
                </div>
            )}
        </div>
    );
}
