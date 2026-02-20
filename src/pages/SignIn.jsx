import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Lock, Mail, Eye, EyeOff, ArrowRight, CheckCircle2, Users, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const result = await login(email, password);
            if (result.success) {
                if (result.role === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError(t.auth.signIn.error);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col md:flex-row overflow-hidden">
            {/* Left Side: Institution Photo */}
            <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-blue-900">
                <img
                    src="/images/supnum_building.png"
                    alt="Institut SUPNUM"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
                {/* Pattern de secours si l'image est manquante */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent" />

                <div className="relative z-10 w-full p-12 flex flex-col justify-end text-white">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-5xl font-bold mb-6 leading-tight">
                            {t.about.cta.title.split(',')[0]} <br />
                            <span className="text-blue-400">SupNum Connect</span>
                        </h1>
                        <p className="text-xl text-blue-100 max-w-lg mb-8 leading-relaxed">
                            {t.about.subtitle}
                        </p>

                        <div className="space-y-4">
                            {t.auth.signIn.benefits?.items?.map((item, i) => (
                                <div key={i} className="flex items-center gap-4 text-blue-50">
                                    <div className="p-2 bg-blue-500/20 backdrop-blur-sm rounded-lg">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <span className="font-medium">{item}</span>
                                </div>
                            )) || [
                                { icon: Users, text: 'Connectez-vous avec vos pairs' },
                                { icon: Shield, text: 'Plateforme sécurisée et officielle' },
                                { icon: CheckCircle2, text: 'Profils vérifiés par l\'institut' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 text-blue-50">
                                    <div className="p-2 bg-blue-500/20 backdrop-blur-sm rounded-lg">
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <span className="font-medium">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-900/50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-10 border border-slate-100 dark:border-slate-800 relative">
                        <div className="text-center mb-10">
                            {/* SUPNUM Logo Integration */}
                            <div className="flex justify-center mb-6">
                                <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl shadow-inner border border-slate-100 dark:border-slate-800">
                                    <img
                                        src="/images/logo_supnum.png"
                                        alt="Logo SUPNUM"
                                        className="h-20 w-auto object-contain"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                    <div className="hidden flex-col items-center">
                                        <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-500/30">
                                            <Users className="h-10 w-10 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{t.auth.signIn.title}</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">{t.auth.signIn.subtitle}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-3 font-medium"
                                >
                                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-sm" />
                                    {error}
                                </motion.div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">{t.auth.signIn.email}</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <Input
                                        type="email"
                                        placeholder={t.auth.signIn.placeholder.email}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="pl-12 h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-200">{t.auth.signIn.password}</label>
                                    <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-500 uppercase tracking-tight">{t.auth.signIn.forgot}</a>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pl-12 pr-12 h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-3.5 text-slate-400 hover:text-blue-500 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl shadow-blue-500/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
                                {t.auth.signIn.button} <ArrowRight className="h-5 w-5" />
                            </Button>
                        </form>

                        <div className="mt-8 text-center pt-6 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {t.auth.signIn.noAccount}{' '}
                                <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
                                    {t.auth.signIn.createAccount}
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

