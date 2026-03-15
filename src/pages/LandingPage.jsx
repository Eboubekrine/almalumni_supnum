import { ArrowRight, Users, GraduationCap, Award, Calendar, Trophy, Zap, ChevronRight, BarChart3, Building, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../lib/axios';

export function LandingPage() {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, students: 0, graduates: 0, events: 0, charts: {} });

    // Chart Data Transformation
    const entryYearData = stats.charts.entryYear?.map(d => ({ name: d.year.toString(), students: d.count })) || [];

    const promotionData = stats.charts.promotion?.map((d, i) => ({
        name: d.promotion,
        value: d.count,
        color: ['#0d9488', '#1e3a8a', '#1e40af', '#facc15', '#2dd4bf'][i % 5]
    })) || [];

    const specializationData = stats.charts.specialization?.map((d, i) => ({
        name: d.domaine,
        value: d.count,
        color: ['#3b82f6', '#06b6d4', '#4f46e5', '#8b5cf6'][i % 4]
    })) || [];

    const offerTypeData = stats.charts.offerTypes?.map(d => ({
        name: d.type_offre,
        count: d.count
    })) || [];

    const mockGrowthData = [
        { year: '2021', students: 200, graduates: 0 },
        { year: '2022', students: 240, graduates: 0 },
        { year: '2023', students: 240, graduates: 150 },
        { year: '2024', students: 400, graduates: 230 },
        { year: '2025', students: 230, graduates: 310 },
    ];

    const growthDataMap = {};
    if (stats.charts.entryYear) {
        let cumulativeStudents = 0;
        [...stats.charts.entryYear].sort((a, b) => a.year - b.year).forEach(d => {
            cumulativeStudents += d.count;
            if (!growthDataMap[d.year]) growthDataMap[d.year] = { year: d.year.toString(), students: 0, graduates: 0 };
            growthDataMap[d.year].students = cumulativeStudents;
        });
    }
    if (stats.charts.promotion) {
        let cumulativeGraduates = 0;
        [...stats.charts.promotion].sort((a, b) => a.promotion - b.promotion).forEach(d => {
            cumulativeGraduates += d.count;
            if (!growthDataMap[d.promotion]) growthDataMap[d.promotion] = { year: d.promotion.toString(), students: 0, graduates: 0 };
            growthDataMap[d.promotion].graduates = cumulativeGraduates;
        });
    }

    const realGrowthData = Object.values(growthDataMap).sort((a, b) => a.year.localeCompare(b.year));
    // Carry over values to fill gaps
    let prevStudents = 0, prevGrads = 0;
    realGrowthData.forEach(d => {
        if (d.students === 0) d.students = prevStudents;
        if (d.graduates === 0) d.graduates = prevGrads;
        prevStudents = d.students;
        prevGrads = d.graduates;
    });

    const finalGrowthData = realGrowthData.length > 1 ? realGrowthData : mockGrowthData;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch events
                const eventsRes = await api.get('/evenements');
                if (eventsRes.data.success) {
                    setUpcomingEvents(eventsRes.data.data.slice(0, 3));
                }

                // Fetch stats
                const statsRes = await api.get('/admin/stats');
                if (statsRes.data.success) {
                    setStats({
                        totalUsers: statsRes.data.data.totalUsers,
                        students: statsRes.data.data.students,
                        graduates: statsRes.data.data.alumni,
                        events: statsRes.data.data.events,
                        offers: statsRes.data.data.offers,
                        partners: statsRes.data.data.partners,
                        charts: statsRes.data.data.charts
                    });
                }
            } catch (error) {
                console.error('Failed to load landing page data', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#2563eb] py-24 lg:py-32 text-white">
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300" style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }}></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6 max-w-5xl"
                        >
                            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-tight">
                                {t.hero.title} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">SupNum Connect</span>
                            </h1>
                            <p className="mx-auto max-w-[800px] text-blue-100 md:text-xl leading-relaxed">
                                {t.hero.subtitle}
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4"
                        >
                            <Link to="/signup">
                                <Button size="lg" className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white border-none shadow-lg shadow-orange-500/25 px-8 py-6 text-lg rounded-xl font-bold">
                                    {t.hero.getStarted} <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link to="/about">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-blue-500/20 text-white border-none hover:bg-blue-500/30 px-8 py-6 text-lg rounded-xl font-bold backdrop-blur-sm">
                                    {t.hero.learnMore}
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{t.stats.community}</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                            {t.stats.communityDesc}
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
                        {/* Total Users Card */}
                        <motion.div whileHover={{ y: -5 }} className="h-full">
                            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-sm h-full relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Users className="h-24 w-24" />
                                </div>
                                <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
                                    <div>
                                        <p className="text-blue-100 font-medium mb-1">{t.stats.totalUsers}</p>
                                        <div className="text-4xl font-bold">{stats.totalUsers}</div>
                                    </div>
                                    <div className="mt-4 text-sm text-blue-100 bg-white/10 inline-block px-2 py-1 rounded-lg w-fit">
                                        +12% {t.dashboard.stats.growth}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Alumni Card */}
                        <motion.div whileHover={{ y: -5 }} className="h-full">
                            <Card className="bg-white dark:bg-slate-800 border-none shadow-sm h-full relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 text-slate-100 dark:text-slate-700 group-hover:text-blue-50 dark:group-hover:text-slate-600 transition-colors">
                                    <GraduationCap className="h-24 w-24" />
                                </div>
                                <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">{t.stats.students}</p>
                                        <div className="text-4xl font-bold text-slate-900 dark:text-white">{stats.students}</div>
                                    </div>
                                    <div className="mt-4 text-sm text-green-600 font-medium">
                                        +8% {t.dashboard.stats.growth}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Graduates Card */}
                        <motion.div whileHover={{ y: -5 }} className="h-full">
                            <Card className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white border-none shadow-sm h-full relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Award className="h-24 w-24" />
                                </div>
                                <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
                                    <div>
                                        <p className="text-cyan-100 font-medium mb-1">{t.stats.graduates}</p>
                                        <div className="text-4xl font-bold">{stats.graduates}</div>
                                    </div>
                                    <div className="mt-4 text-sm text-cyan-100 bg-white/10 inline-block px-2 py-1 rounded-lg w-fit">
                                        +5% {t.dashboard.stats.growth}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Events Card */}
                        <motion.div whileHover={{ y: -5 }} className="h-full">
                            <Card className="bg-white dark:bg-slate-800 border-none shadow-sm h-full relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 text-slate-100 dark:text-slate-700 group-hover:text-blue-50 dark:group-hover:text-slate-600 transition-colors">
                                    <Calendar className="h-24 w-24" />
                                </div>
                                <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">{t.stats.events}</p>
                                        <div className="text-4xl font-bold text-slate-900 dark:text-white">{upcomingEvents.length}</div>
                                    </div>
                                    <div className="mt-4 text-sm text-slate-400">
                                        {t.events.upcomingTerm}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Opportunities & Partners Section */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{t.opportunities.title}</h2>
                            <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg">
                                {t.opportunities.subtitle}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
                        <Card className="bg-white dark:bg-slate-800 border-none shadow-sm p-6 flex items-center space-x-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                                <Building className="h-8 w-8" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.partners}+</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{t.opportunities.partners}</p>
                            </div>
                        </Card>
                        <Card className="bg-white dark:bg-slate-800 border-none shadow-sm p-6 flex items-center space-x-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                                <Briefcase className="h-8 w-8" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.offers}+</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{t.opportunities.active}</p>
                            </div>
                        </Card>
                        <div className="lg:col-span-2 space-y-4">
                            <h3 className="font-semibold text-slate-900 dark:text-white">{t.opportunities.latest}</h3>
                            <div className="space-y-3">
                                {[
                                    { title: 'Software Engineer Intern', company: 'Tech Corp', loc: 'Nouakchott' },
                                    { title: 'Data Analyst', company: 'Data Systems', loc: 'Nouadhibou' },
                                    { title: 'Marketing Assistant', company: 'Creative Agency', loc: 'Nouakchott' }
                                ].map((job, i) => (
                                    <div key={i} className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                                                <Briefcase className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm text-slate-900 dark:text-white">{job.title}</p>
                                                <p className="text-xs text-slate-500">{job.company} • {job.loc}</p>
                                            </div>
                                        </div>
                                        <Link to={user ? "/dashboard" : "/signin"}>
                                            <button className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                                                {user ? t.opportunities.view : t.opportunities.apply}
                                            </button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Charts Section */}
            <section className="py-20 bg-white dark:bg-slate-950 transition-colors duration-300">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Community Growth Over Years Area Chart (New) */}
                        <Card className="shadow-sm border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 lg:col-span-2">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-teal-500" />
                                    {t.charts.growth}
                                </h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={finalGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorGraduates" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                itemStyle={{ color: '#1e293b' }}
                                            />
                                            <Legend verticalAlign="bottom" align="center" iconType="circle" />
                                            <Area type="monotone" dataKey="students" name={t.charts.students} stroke="#2dd4bf" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                                            <Area type="monotone" dataKey="graduates" name={t.charts.graduates} stroke="#1e3a8a" strokeWidth={3} fillOpacity={1} fill="url(#colorGraduates)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Students by Entry Year */}
                        <Card className="shadow-sm border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
                                    <Users className="h-5 w-5 text-teal-500" />
                                    {t.charts.entryYear}
                                </h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={entryYearData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                            <Tooltip
                                                cursor={{ fill: 'transparent' }}
                                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                itemStyle={{ color: '#1e293b' }}
                                            />
                                            <Bar dataKey="students" fill="#2dd4bf" radius={[4, 4, 0, 0]} barSize={50} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Graduates by Promotion */}
                        <Card className="shadow-sm border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5 text-teal-500" />
                                    {t.charts.promotion}
                                </h3>
                                <div className="h-[300px] w-full flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={promotionData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {promotionData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                itemStyle={{ color: '#1e293b' }}
                                            />
                                            <Legend verticalAlign="right" align="right" layout="vertical" iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Offers by Type */}
                        <Card className="shadow-sm border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 lg:col-span-2">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-teal-500" />
                                    {t.opportunities.title}
                                </h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={offerTypeData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                            <Tooltip
                                                cursor={{ fill: 'transparent' }}
                                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                itemStyle={{ color: '#1e293b' }}
                                            />
                                            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={50} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Specialization Distribution */}
                        <Card className="shadow-sm border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 lg:col-span-2">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-teal-500" />
                                    {t.profile.details || 'Specializations'}
                                </h3>
                                <div className="h-[300px] w-full flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={specializationData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {specializationData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                itemStyle={{ color: '#1e293b' }}
                                            />
                                            <Legend verticalAlign="bottom" align="center" layout="horizontal" iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Upcoming Events Section */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{t.events.title}</h2>
                            <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg">
                                {t.events.subtitle}
                            </p>
                        </div>
                        <Link to="/events">
                            <Button variant="outline" className="bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
                                {t.events.viewAll} <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {upcomingEvents.map((event) => (
                            <motion.div
                                key={event.id_evenement}
                                whileHover={{ y: -5 }}
                                className="group"
                            >
                                <Card className="overflow-hidden border-none shadow-sm h-full flex flex-col bg-white dark:bg-slate-800 transition-colors duration-300">
                                    <div className="p-6 pb-0 flex items-start justify-between">
                                        <div className={`p-3 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 bg-opacity-10`}>
                                            <Calendar className="h-6 w-6" />
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase bg-blue-600 text-white`}>
                                            EVENT
                                        </span>
                                    </div>

                                    <CardContent className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mb-3">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            {new Date(event.date_evenement).toLocaleDateString()}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {event.titre}
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400 mb-6 flex-1 line-clamp-3">
                                            {event.description}
                                        </p>
                                        <Link to="/events" className="w-full">
                                            <Button variant="outline" className="w-full border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
                                                {t.events.viewDetails}
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800 text-white text-center">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div className="flex justify-center">
                            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                                <GraduationCap className="h-12 w-12 text-white" />
                            </div>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                            {t.cta.title}
                        </h2>
                        <p className="text-blue-100 text-lg md:text-xl leading-relaxed">
                            {t.cta.subtitle}
                        </p>
                        <Link to="/signup">
                            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white border-none shadow-xl shadow-orange-500/25 px-8 py-6 text-lg rounded-full mt-4">
                                <Users className="mr-2 h-5 w-5" />
                                {t.cta.button}
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
