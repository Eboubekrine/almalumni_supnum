import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { Card, CardContent } from '../../components/ui/Card';
import { Building, MapPin, Globe, Search, ExternalLink } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useLanguage } from '../../context/LanguageContext';

export function Companies() {
    const { t } = useLanguage();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
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
        fetchCompanies();
    }, []);

    const filteredCompanies = companies.filter(c =>
        c.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.secteur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.ville?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.companies.title}</h1>
                <p className="text-slate-500 dark:text-slate-400">{t.companies.subtitle}</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm relative">
                <Search className="absolute left-7 top-7 h-5 w-5 text-slate-400" />
                <Input
                    placeholder={t.companies.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 bg-slate-50 dark:bg-slate-900 border-none h-12"
                />
            </div>

            {loading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl"></div>
                    ))}
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCompanies.map((company) => (
                        <Card key={company.id_partenaire} className="bg-white dark:bg-slate-800 border-none shadow-md hover:shadow-2xl transition-all group overflow-hidden relative">
                            {/* Decorative Gradient Bar */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600" />

                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-900 border border-blue-100/50 dark:border-slate-700 flex items-center justify-center shadow-inner">
                                        <Building className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-100/50 dark:border-blue-900/30">
                                        {t.companies.partner}
                                    </span>
                                </div>

                                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
                                    {company.nom}
                                </h3>
                                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-4 uppercase tracking-tight">{company.secteur}</p>

                                <div className="space-y-3 text-sm text-slate-500 dark:text-slate-400 mb-6 bg-slate-50/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100/50 dark:border-slate-700/50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 rounded-lg bg-white dark:bg-slate-950 shadow-sm border border-slate-100 dark:border-slate-800">
                                            <MapPin className="h-4 w-4 text-blue-500" />
                                        </div>
                                        <span className="font-medium">{company.ville}</span>
                                    </div>
                                    {company.site_web && (
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 rounded-lg bg-white dark:bg-slate-950 shadow-sm border border-slate-100 dark:border-slate-800">
                                                <Globe className="h-4 w-4 text-indigo-500" />
                                            </div>
                                            <a
                                                href={company.site_web.startsWith('http') ? company.site_web : `https://${company.site_web}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-blue-600 transition-colors truncate font-medium underline underline-offset-4 decoration-slate-200 dark:decoration-slate-700"
                                            >
                                                {company.site_web.replace(/^https?:\/\/(www\.)?/, '')}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <Button
                                    className="w-full bg-blue-600 text-white hover:bg-indigo-600 shadow-lg shadow-blue-500/20 transition-all font-bold h-11"
                                    onClick={() => company.site_web && window.open(company.site_web.startsWith('http') ? company.site_web : `https://${company.site_web}`, '_blank')}
                                >
                                    {t.companies.visitWebsite}
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {!loading && filteredCompanies.length === 0 && (
                <div className="text-center py-20">
                    <Building className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.companies.noCompanies}</h3>
                    <p className="text-slate-500">{t.companies.noCompaniesSubtitle}</p>
                </div>
            )}
        </div>
    );
}
