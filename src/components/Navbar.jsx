import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, GraduationCap, Home, Calendar, Info, Globe, Sun, Moon } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { language, setLanguage, t, theme, toggleTheme } = useLanguage();
    const { user } = useAuth();
    const location = useLocation();

    const navItems = [
        { name: t.nav.home, path: '/', icon: Home },
        { name: t.nav.events, path: '/events', icon: Calendar },
        { name: t.nav.about, path: '/about', icon: Info },
    ];

    const isActive = (path) => location.pathname === path;

    const languages = ['AR', 'EN', 'FR'];

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-16 items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="bg-supnum-blue p-1.5 rounded-lg">
                            <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">SupNum Connect</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex md:items-center md:space-x-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center space-x-2",
                                    isActive(item.path)
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                <span>{item.name}</span>
                            </Link>
                        ))}

                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2" />

                        {/* Language Selector */}
                        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-900 rounded-full p-1">
                            {languages.map((l) => (
                                <button
                                    key={l}
                                    onClick={() => setLanguage(l)}
                                    className={cn(
                                        "px-2 py-1 text-xs font-bold rounded-full transition-all",
                                        language === l
                                            ? "bg-white dark:bg-slate-800 text-supnum-blue shadow-sm"
                                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                    )}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-900"
                        >
                            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>

                        <div className="flex items-center space-x-2 ml-4">
                            {user ? (
                                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}>
                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
                                        {t.dashboard.nav.dashboard}
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link to="/signin">
                                        <Button variant="ghost" size="sm" className="font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900">{t.nav.signin}</Button>
                                    </Link>
                                    <Link to="/signup">
                                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">{t.nav.signup}</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-slate-600 dark:text-slate-400"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4">
                    <div className="flex flex-col space-y-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-supnum-blue flex items-center space-x-2",
                                    isActive(item.path) ? "text-supnum-blue" : "text-slate-600 dark:text-slate-400"
                                )}
                                onClick={() => setIsOpen(false)}
                            >
                                <item.icon className="h-4 w-4" />
                                <span>{item.name}</span>
                            </Link>
                        ))}

                        <div className="flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-900">
                            <div className="flex items-center space-x-2">
                                <Globe className="h-4 w-4 text-slate-400" />
                                <div className="flex space-x-2">
                                    {languages.map((l) => (
                                        <button
                                            key={l}
                                            onClick={() => setLanguage(l)}
                                            className={cn(
                                                "px-2 py-1 text-xs font-bold rounded-md border transition-all",
                                                language === l
                                                    ? "bg-supnum-blue text-white border-supnum-blue"
                                                    : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800"
                                            )}
                                        >
                                            {l}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-900"
                            >
                                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </button>
                        </div>

                        <div className="flex flex-col space-y-2 pt-4 border-t border-slate-100 dark:border-slate-900">
                            <Link to="/signin" onClick={() => setIsOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900">{t.nav.signin}</Button>
                            </Link>
                            <Link to="/signup" onClick={() => setIsOpen(false)}>
                                <Button className="w-full">{t.nav.signup}</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
