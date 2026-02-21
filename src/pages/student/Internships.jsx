import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../lib/axios';
import { Card, CardContent } from '../../components/ui/Card';
import { Briefcase, MapPin, Building, Search, Filter, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { cn } from '../../lib/utils';
import { X, Upload, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function Internships() {
    const { t } = useLanguage();
    const [offres, setOffres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');

    // Application Modal state
    const [selectedOffre, setSelectedOffre] = useState(null);
    const [cvFile, setCvFile] = useState(null);
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(''); // 'success', 'error'
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const fetchOffres = async () => {
            try {
                const res = await api.get('/offres');
                if (res.data.success) {
                    setOffres(res.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch offers', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOffres();
    }, []);

    const handleApply = async (e) => {
        e.preventDefault();
        if (!selectedOffre) return;

        setSubmitting(true);
        setErrorMsg('');

        try {
            // Send as JSON — no file upload needed
            const res = await api.post('/candidatures/apply', {
                id_offre: selectedOffre.id_offre,
                message: message
            });

            if (res.data.success) {
                setSubmitStatus('success');
                setTimeout(() => {
                    setSelectedOffre(null);
                    setSubmitStatus('');
                    setCvFile(null);
                    setMessage('');
                }, 2000);
            }
        } catch (error) {
            setSubmitStatus('error');
            setErrorMsg(error.response?.data?.message || 'Failed to submit application');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredOffres = offres.filter(o => {
        const matchesSearch = o.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.entreprise?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || o.type_offre === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.internships.title}</h1>
                    <p className="text-slate-500 dark:text-slate-400">{t.internships.subtitle}</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input
                        placeholder={t.internships.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-50 dark:bg-slate-900 border-none"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-slate-400" />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-900 border-none rounded-md text-sm p-2 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="All">{t.internships.allTypes}</option>
                        <option value="STAGE">{t.internships.internship}</option>
                        <option value="EMPLOI">{t.internships.job}</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="grid gap-6 md:grid-cols-2">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl"></div>
                    ))}
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {filteredOffres.map((offre) => (
                        <Card key={offre.id_offre} className="bg-white dark:bg-slate-800 border-none shadow-md hover:shadow-2xl transition-all group overflow-hidden relative">
                            {/* Decorative Gradient Bar */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-blue-500" />

                            <CardContent className="p-0">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-900 border border-blue-100/50 dark:border-slate-700 flex items-center justify-center shadow-inner">
                                            <Briefcase className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                            offre.type_offre === 'STAGE'
                                                ? "bg-emerald-50 text-emerald-600 border-emerald-100/50 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30"
                                                : "bg-amber-50 text-amber-600 border-amber-100/50 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30"
                                        )}>
                                            {offre.type_offre === 'STAGE' ? t.internships.internship : t.internships.job}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                                        {offre.titre}
                                    </h3>
                                    <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-semibold mb-4">
                                        <Building className="h-4 w-4 mr-1.5" />
                                        <span>{offre.entreprise}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-slate-50 dark:border-slate-700/50">
                                        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                                            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                                            {offre.lieu || 'Remote'}
                                        </div>
                                        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                                            <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                                            {new Date(offre.date_publication).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button className="flex-1 bg-slate-900 dark:bg-slate-700 hover:bg-black dark:hover:bg-slate-600 text-white font-bold transition-all">
                                            {t.internships.details}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all font-bold"
                                            onClick={() => setSelectedOffre(offre)}
                                        >
                                            {t.internships.apply}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {!loading && filteredOffres.length === 0 && (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-dashed border-slate-200 dark:border-slate-700">
                    <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">{t.internships.noOffers}</h3>
                    <p className="text-slate-500 dark:text-slate-400">{t.internships.noOffersSubtitle}</p>
                </div>
            )}

            {/* Application Modal */}
            {selectedOffre && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.internships.applyRole}</h2>
                                <p className="text-sm text-slate-500">{selectedOffre.titre} @ {selectedOffre.entreprise}</p>
                            </div>
                            <button onClick={() => setSelectedOffre(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                                <X className="h-5 w-5 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleApply} className="p-6 space-y-6">
                            {submitStatus === 'success' ? (
                                <div className="text-center py-8 space-y-4">
                                    <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.internships.applicationSent}</h3>
                                    <p className="text-slate-500">{t.internships.applicationSentDesc} {selectedOffre.entreprise}.</p>
                                </div>
                            ) : (
                                <>
                                    {submitStatus === 'error' && (
                                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
                                            <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                            {errorMsg}
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.internships.uploadCV}</label>
                                        <div
                                            className={cn(
                                                "relative border-2 border-dashed rounded-2xl p-8 transition-all text-center group cursor-pointer",
                                                cvFile ? "border-blue-500 bg-blue-50/30 dark:bg-blue-900/10" : "border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                            )}
                                        >
                                            <input
                                                type="file"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) => setCvFile(e.target.files[0])}
                                            />
                                            {cvFile ? (
                                                <div className="space-y-2">
                                                    <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center mx-auto">
                                                        <Briefcase className="h-6 w-6 text-blue-600" />
                                                    </div>
                                                    <p className="text-sm font-bold text-blue-600 truncate max-w-[200px] mx-auto">{cvFile.name}</p>
                                                    <button type="button" onClick={(e) => { e.stopPropagation(); setCvFile(null); }} className="text-[10px] text-red-500 uppercase font-bold hover:underline">{t.admin.events.delete}</button>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <Upload className="h-8 w-8 text-slate-300 mx-auto group-hover:text-blue-400 transition-colors" />
                                                    <p className="text-sm text-slate-500">{t.internships.uploadDesc}</p>
                                                    <p className="text-[10px] text-slate-400 uppercase font-medium">{t.internships.uploadLimit}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Message (Optional)</label>
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder={t.internships.messagePlaceholder}
                                            className="w-full min-h-[100px] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-sm"
                                        />
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="flex-1"
                                            onClick={() => setSelectedOffre(null)}
                                        >
                                            {t.internships.cancel}
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white"
                                            disabled={!cvFile || submitting}
                                        >
                                            {submitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    {t.internships.submitting}
                                                </>
                                            ) : (
                                                t.internships.submit
                                            )}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
