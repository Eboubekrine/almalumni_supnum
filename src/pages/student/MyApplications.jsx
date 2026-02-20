import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/utils';
import { Briefcase, Clock, CheckCircle2, XCircle, FileText, ExternalLink, Building, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'framer-motion';

export function MyApplications() {
    const { t } = useLanguage();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await api.get('/candidatures/my');
                if (res.data.success) {
                    setApplications(res.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch applications', error);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'ACCEPTE': return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800';
            case 'REFUSE': return 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
            default: return 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'ACCEPTE': return <CheckCircle2 className="h-4 w-4" />;
            case 'REFUSE': return <XCircle className="h-4 w-4" />;
            default: return <Clock className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.applications.title}</h1>
                <p className="text-slate-500 dark:text-slate-400">{t.applications.subtitle}</p>
            </div>

            {loading ? (
                <div className="grid gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl"></div>
                    ))}
                </div>
            ) : applications.length > 0 ? (
                <div className="grid gap-4">
                    {applications.map((app, index) => (
                        <motion.div
                            key={app.id_candidature}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="border-none shadow-md hover:shadow-xl transition-all group overflow-hidden relative bg-white dark:bg-slate-800">
                                {/* Decorative Gradient Bar */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />

                                <CardContent className="p-0">
                                    <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                        <div className="flex gap-5 items-center">
                                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-900 border border-blue-100/50 dark:border-slate-700 flex items-center justify-center shadow-inner shrink-0">
                                                <Briefcase className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors uppercase tracking-tight">{app.titre}</h3>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm">
                                                    <span className="flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400">
                                                        <Building className="h-3.5 w-3.5" /> {app.entreprise}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                                                        <MapPin className="h-3.5 w-3.5 text-blue-500" /> {app.lieu || t.applications.remote}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:items-end gap-2 w-full md:w-auto">
                                            <div className={cn(
                                                "px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider flex items-center gap-2",
                                                getStatusStyle(app.statut)
                                            )}>
                                                {getStatusIcon(app.statut)}
                                                {app.statut === 'EN_ATTENTE' ? t.applications.status.pending : (app.statut === 'ACCEPTE' ? t.applications.status.accepted : (app.statut === 'REFUSE' ? t.applications.status.rejected : app.statut))}
                                            </div>
                                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">{t.applications.appliedOn} {new Date(app.date_postulation).toLocaleDateString()}</p>
                                        </div>

                                        <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-700">
                                            <a
                                                href={app.cv_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="w-full md:w-auto"
                                            >
                                                <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all font-bold h-10 px-6 rounded-xl">
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    {t.applications.myCv}
                                                </Button>
                                            </a>
                                        </div>
                                    </div>
                                    {app.message && (
                                        <div className="px-6 pb-6 pt-2">
                                            <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50">
                                                <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">{t.applications.motivation}</p>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 italic font-medium">"{app.message}"</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-dashed border-slate-200 dark:border-slate-700">
                    <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">{t.applications.noApps}</h3>
                    <p className="text-slate-500 dark:text-slate-400">{t.applications.noAppsSubtitle}</p>
                </div>
            )}
        </div>
    );
}
