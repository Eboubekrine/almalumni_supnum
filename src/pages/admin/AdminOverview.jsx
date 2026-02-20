import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Users, GraduationCap, Calendar, Briefcase, Building, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

const growthData = [
    { name: 'Sep', students: 120, graduates: 40 },
    { name: 'Oct', students: 180, graduates: 55 },
    { name: 'Nov', students: 250, graduates: 80 },
    { name: 'Dec', students: 320, graduates: 115 },
    { name: 'Jan', students: 450, graduates: 140 },
    { name: 'Feb', students: 600, graduates: 190 },
];

const domainData = [
    { name: 'Software Dev', value: 45, color: '#3b82f6' },
    { name: 'Data Science', value: 25, color: '#0ea5e9' },
    { name: 'Networking', value: 20, color: '#6366f1' },
    { name: 'Cybersecurity', value: 10, color: '#8b5cf6' },
];

const opportunitiesData = [
    { name: 'Sep', jobs: 5, internships: 12 },
    { name: 'Oct', jobs: 8, internships: 15 },
    { name: 'Nov', jobs: 12, internships: 20 },
    { name: 'Dec', jobs: 10, internships: 18 },
    { name: 'Jan', jobs: 15, internships: 25 },
];

export function AdminOverview() {
    const { t } = useLanguage();
    const [dashboardStats, setDashboardStats] = useState({
        students: 0,
        alumni: 0,
        admins: 0,
        totalUsers: 0,
        offers: 0,
        events: 0,
        partners: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                if (res.data.success) {
                    setDashboardStats(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        { title: t.admin.stats.graduates, value: dashboardStats.alumni.toString(), icon: Users, color: "bg-blue-500", subtext: t.admin.stats.registered },
        { title: t.admin.stats.students, value: dashboardStats.students.toString(), icon: GraduationCap, color: "bg-green-500", subtext: t.admin.stats.enrolled },
        { title: t.admin.stats.totalUsers, value: dashboardStats.totalUsers.toString(), icon: CheckCircle, color: "bg-amber-500", subtext: t.admin.stats.growth },
        { title: t.admin.stats.partners, value: dashboardStats.partners.toString(), icon: Building, color: "bg-indigo-500", subtext: t.admin.stats.activePartners },
        { title: t.admin.stats.internships, value: dashboardStats.offers.toString(), icon: Briefcase, color: "bg-purple-500", subtext: t.admin.stats.activeInternships },
        { title: t.admin.stats.events, value: dashboardStats.events.toString(), icon: Calendar, color: "bg-pink-500", subtext: t.admin.stats.upcoming },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col space-y-2">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{t.admin.welcome}</h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg">Platform Overview & Statistics</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-slate-800 overflow-hidden relative">
                            <div className={`absolute top-0 right-0 p-4 opacity-10 text-slate-900 dark:text-white`}>
                                <stat.icon className="h-24 w-24" />
                            </div>
                            <CardContent className="p-6 relative z-10">
                                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">{stat.title}</p>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
                                <p className="text-xs text-slate-400 mt-2">{stat.subtext}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid gap-8 lg:grid-cols-2">
                {/* Growth Chart */}
                <Card className="bg-white dark:bg-slate-800 border-none shadow-xl lg:col-span-2">
                    <CardContent className="p-8">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8">{t.admin.charts.growthOverTime}</h3>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={growthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorGraduates" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ color: '#1e293b' }}
                                    />
                                    <Area type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" name={t.admin.charts.students} />
                                    <Area type="monotone" dataKey="graduates" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorGraduates)" name={t.admin.charts.graduates} />
                                    <Legend />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Employment Domains */}
                <Card className="bg-white dark:bg-slate-800 border-none shadow-xl">
                    <CardContent className="p-8">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8">{t.admin.charts.employmentDomains}</h3>
                        <div className="h-[300px] w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={domainData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {domainData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ color: '#1e293b' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Opportunities Posted */}
                <Card className="bg-white dark:bg-slate-800 border-none shadow-xl">
                    <CardContent className="p-8">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8">{t.admin.charts.opportunitiesPosted}</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={opportunitiesData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ color: '#1e293b' }}
                                    />
                                    <Bar dataKey="jobs" fill="#3b82f6" radius={[4, 4, 0, 0]} name={t.admin.charts.jobs} />
                                    <Bar dataKey="internships" fill="#8b5cf6" radius={[4, 4, 0, 0]} name={t.admin.charts.internships} />
                                    <Legend />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
