import { Outlet, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { GraduationCap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function PublicLayout() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <footer className="bg-[#0f172a] dark:bg-slate-950 text-slate-400 py-12 border-t border-slate-800 transition-colors duration-300">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center space-x-2">
                            <div className="bg-blue-600 p-1.5 rounded-lg">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">SupNum Connect</span>
                        </div>

                        <div className="flex flex-wrap justify-center gap-8 text-sm font-medium">
                            <Link to="/about" className="hover:text-white transition-colors">{t.nav.about}</Link>
                            <Link to="/events" className="hover:text-white transition-colors">{t.nav.events}</Link>
                        </div>

                        <div className="text-sm">
                            &copy; {new Date().getFullYear()} SupNum Connect. {t.footer.rights}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
