import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { GraduationCap, User, Mail, Lock, Hash, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export function SignUp() {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        mot_de_passe: '',
        role: 'STUDENT'
    });
    const { signup } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await signup(formData);
        if (result.success) {
            navigate('/signin');
        } else {
            alert(result.error || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col md:flex-row overflow-hidden">
            {/* Left Side: Institution Photo */}
            <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-blue-900 shadow-2xl">
                <img
                    src="/images/supnum_building.png"
                    alt="Institut SUPNUM"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

                <div className="relative z-10 w-full p-12 flex flex-col justify-end text-white">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-4xl font-bold mb-8 leading-tight">
                            {t.auth.signUp.benefits.title}
                        </h2>
                        <div className="space-y-4">
                            {t.auth.signUp.benefits.items.map((item, i) => (
                                <div key={i} className="flex items-center gap-4 text-blue-50">
                                    <div className="p-2 bg-blue-500/20 backdrop-blur-sm rounded-lg">
                                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                                    </div>
                                    <span className="font-medium text-lg">{item}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-12 pt-8 border-t border-white/10 text-blue-200 text-sm">
                            © 2024 SupNum. All rights reserved.
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Registration Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-900/50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-lg"
                >
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-10 border border-slate-100 dark:border-slate-800 relative">
                        <div className="text-center mb-8">
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
                                            <GraduationCap className="h-10 w-10 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{t.auth.signUp.title}</h1>
                            <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium">
                                {t.auth.signUp.subtitle}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-200">{t.auth.signUp.firstName}</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                        <Input name="prenom" placeholder="John" required onChange={handleChange} className="pl-12 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-200">{t.auth.signUp.lastName}</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                        <Input name="nom" placeholder="Doe" required onChange={handleChange} className="pl-12 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">{t.auth.signUp.email}</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <Input name="email" type="email" placeholder="name@example.com" required onChange={handleChange} className="pl-12 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">{t.auth.signUp.password}</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <Input name="mot_de_passe" type="password" placeholder="••••••••" required onChange={handleChange} className="pl-12 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">{t.auth.signUp.role}</label>
                                <div className="relative group font-medium">
                                    <Hash className="absolute left-4 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full pl-12 h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="STUDENT">{t.profile.student}</option>
                                        <option value="ALUMNI">{t.profile.graduate}</option>
                                    </select>
                                    <div className="absolute right-4 top-3.5 pointer-events-none">
                                        <ArrowRight className="h-4 w-4 text-slate-400 rotate-90" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button type="submit" className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl shadow-blue-500/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
                                    {t.auth.signUp.button} <ArrowRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </form>

                        <div className="mt-8 text-center pt-6 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                {t.auth.signUp.haveAccount}{' '}
                                <Link to="/signin" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
                                    {t.auth.signUp.signIn}
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
