import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
    LayoutDashboard,
    User,
    Users,
    MessageSquare,
    LogOut,
    Menu,
    X,
    GraduationCap,
    Sun,
    Moon,
    ChevronDown,
    Calendar,
    Briefcase,
    Building,
    Home
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import { NotificationBell } from '../components/NotificationBell';

export function DashboardLayout() {
    const { user, logout } = useAuth();
    const { t, language, setLanguage, theme, toggleTheme } = useLanguage();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    const studentNavItems = [
        { name: t.nav.home, path: '/', icon: Home },
        { name: t.dashboard.nav.dashboard, path: '/dashboard', icon: LayoutDashboard },
        { name: t.dashboard.nav.profile, path: '/dashboard/profile', icon: User },
        { name: t.dashboard.nav.users, path: '/dashboard/search', icon: Users },
        { name: t.dashboard.nav.friends, path: '/dashboard/friends', icon: Users },
        { name: t.dashboard.nav.messages, path: '/dashboard/messages', icon: MessageSquare },
        { name: t.nav.internships, path: '/dashboard/internships', icon: Briefcase },
        { name: t.nav.companies, path: '/dashboard/companies', icon: Building },
    ];

    const alumniNavItems = [
        { name: t.nav.home, path: '/', icon: Home },
        { name: t.dashboard.nav.dashboard, path: '/dashboard', icon: LayoutDashboard },
        { name: t.dashboard.nav.profile, path: '/dashboard/profile', icon: User },
        { name: t.dashboard.nav.users, path: '/dashboard/search', icon: Users },
        { name: t.dashboard.nav.friends, path: '/dashboard/friends', icon: Users },
        { name: t.dashboard.nav.messages, path: '/dashboard/messages', icon: MessageSquare },
        { name: t.nav.internships, path: '/dashboard/internships', icon: Briefcase },
        { name: t.nav.companies, path: '/dashboard/companies', icon: Building },
        { name: t.admin.nav.events, path: '/dashboard/events', icon: Calendar },
        { name: t.dashboard.nav.myOffers, path: '/dashboard/offers', icon: Briefcase },
    ];

    const adminNavItems = [
        { name: t.nav.home, path: '/', icon: Home },
        { name: t.admin.nav.dashboard, path: '/admin', icon: LayoutDashboard },
        { name: t.admin.nav.events, path: '/admin/events', icon: Calendar },
        { name: t.admin.nav.users, path: '/admin/users', icon: Users },
        { name: t.nav.internships, path: '/admin/internships', icon: Briefcase },
        { name: t.nav.companies, path: '/admin/companies', icon: Building },
    ];

    const navItems = user?.role === 'ADMIN' ? adminNavItems : (user?.role === 'ALUMNI' ? alumniNavItems : studentNavItems);

    const isActive = (path) => {
        if (path === '/dashboard' && location.pathname === '/dashboard') return true;
        if (path === '/admin' && location.pathname === '/admin') return true;
        if (path !== '/dashboard' && path !== '/admin' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const languages = ['AR', 'EN', 'FR'];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link to={user?.role === 'ADMIN' ? "/admin" : "/dashboard"} className="flex items-center space-x-2">
                            <div className="bg-supnum-blue p-1.5 rounded-lg">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                            <div className="hidden md:block">
                                <span className="text-xl font-bold text-supnum-blue">SupNum</span>
                                <span className="text-xl font-bold text-slate-900 dark:text-white">Connect</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2",
                                        isActive(item.path)
                                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                            : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
                                    )}
                                >
                                    <item.icon className={cn("h-4 w-4", isActive(item.path) ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300")} />
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-4">
                            {/* Language Selector */}
                            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
                                {languages.map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => setLanguage(l)}
                                        className={cn(
                                            "px-2 py-1 text-xs font-bold rounded-md transition-all",
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
                                className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                            >
                                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </button>

                            <NotificationBell />

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 transition-colors"
                                >
                                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                        {user?.name?.[0]}
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden sm:block">{user?.name?.split(' ')[0]}</span>
                                    <ChevronDown className="h-4 w-4 text-slate-400" />
                                </button>

                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-950 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 py-1 z-50 animate-in fade-in slide-in-from-top-2">
                                        <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-900">
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                                        </div>
                                        {user?.role !== 'admin' && (
                                            <Link
                                                to="/dashboard/profile"
                                                className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-blue-600 dark:hover:text-blue-400"
                                                onClick={() => setIsProfileMenuOpen(false)}
                                            >
                                                {t.dashboard.nav.profile}
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            {t.nav.logout}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                className="md:hidden p-2 text-slate-500 dark:text-slate-400"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-4">
                        <div className="space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                        isActive(item.path)
                                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-900">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{language === 'EN' ? 'Language' : (language === 'AR' ? 'اللغة' : 'Langue')}</span>
                                <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
                                    {languages.map((l) => (
                                        <button
                                            key={l}
                                            onClick={() => setLanguage(l)}
                                            className={cn(
                                                "px-3 py-1 text-xs font-bold rounded-md transition-all",
                                                language === l
                                                    ? "bg-white dark:bg-slate-800 text-supnum-blue shadow-sm"
                                                    : "text-slate-500 dark:text-slate-400"
                                            )}
                                        >
                                            {l}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>{t.nav.logout}</span>
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
}
