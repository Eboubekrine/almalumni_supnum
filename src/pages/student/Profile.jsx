import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Camera, Save, Linkedin, Github, Facebook, GraduationCap, Mail, User, Briefcase, Calendar, Phone, Building, FileText, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function Profile() {
    const { user, updateProfile } = useAuth();
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
        location: user?.location || '',
        linkedin: user?.social?.linkedin || '',
        github: user?.social?.github || '',
        facebook: user?.social?.facebook || '',
        phone: user?.phone || '',
        birthday: user?.birthday || '',
        workStatus: user?.workStatus || '',
        jobTitle: user?.jobTitle || '',
        company: user?.company || '',
        is_mentor: user?.is_mentor || false,
        cv_url: user?.cv_url || null,
        supnum_id: user?.supnumId || ''
    });
    const [previewImage, setPreviewImage] = useState(user?.avatar || null);
    const [imageFile, setImageFile] = useState(null);
    const [cvFile, setCvFile] = useState(null);
    const [isDirty, setIsDirty] = useState(false);
    const [saveStatus, setSaveStatus] = useState(''); // 'saving', 'success', 'error'
    const [appCount, setAppCount] = useState(0);

    // Sync with user data when it loads
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                bio: user.bio || '',
                location: user.location || '',
                linkedin: user.social?.linkedin || '',
                github: user.social?.github || '',
                facebook: user.social?.facebook || '',
                phone: user.phone || '',
                birthday: user.birthday || '',
                workStatus: user.workStatus || '',
                jobTitle: user.jobTitle || '',
                company: user.company || '',
                is_mentor: user.is_mentor || false,
                cv_url: user.cv_url || null,
                supnum_id: user.supnumId || ''
            });
            setPreviewImage(user.avatar || null);
        }
    }, [user]);

    // Check for changes
    useEffect(() => {
        const isChanged =
            formData.name !== (user?.name || '') ||
            formData.bio !== (user?.bio || '') ||
            formData.phone !== (user?.phone || '') ||
            formData.birthday !== (user?.birthday || '') ||
            formData.linkedin !== (user?.social?.linkedin || '') ||
            formData.github !== (user?.social?.github || '') ||
            formData.facebook !== (user?.social?.facebook || '') ||
            formData.location !== (user?.location || '') ||
            formData.workStatus !== (user?.workStatus || '') ||
            formData.jobTitle !== (user?.jobTitle || '') ||
            formData.company !== (user?.company || '') ||
            formData.is_mentor !== (user?.is_mentor || false) ||
            formData.supnum_id !== (user?.supnumId || '') ||
            imageFile !== null ||
            cvFile !== null;

        setIsDirty(isChanged);
    }, [formData, imageFile, user]);

    useEffect(() => {
        const fetchAppCount = async () => {
            try {
                const res = await api.get('/candidatures/my');
                if (res.data.success) {
                    setAppCount(res.data.data.length);
                }
            } catch (error) {
                console.error('Failed to fetch app count', error);
            }
        };
        fetchAppCount();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCvChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCvFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveStatus('saving');

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('bio', formData.bio);
            data.append('phone', formData.phone);
            data.append('birthday', formData.birthday);
            data.append('linkedin', formData.linkedin);
            data.append('github', formData.github);
            data.append('facebook', formData.facebook);
            data.append('location', formData.location);
            data.append('company', formData.company);
            data.append('jobTitle', formData.jobTitle);
            data.append('is_mentor', formData.is_mentor);
            data.append('supnum_id', formData.supnum_id);

            if (imageFile) {
                data.append('avatar', imageFile);
            }
            if (cvFile) {
                data.append('cv', cvFile);
            }

            const result = await updateProfile(data);

            if (result.success) {
                setSaveStatus('success');
                setIsDirty(false);
                setImageFile(null);
                setTimeout(() => setSaveStatus(''), 3000);
            } else {
                setSaveStatus('error');
                setTimeout(() => setSaveStatus(''), 3000);
            }
        } catch (error) {
            console.error("Failed to save profile", error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(''), 3000);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8 pb-12"
        >
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.profile.title}</h1>
            </div>

            {/* Profile Header Card */}
            <Card className="border-none shadow-lg bg-white dark:bg-slate-800 overflow-hidden">
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative group">
                            <div className="h-32 w-32 rounded-full border-4 border-white dark:border-slate-700 shadow-xl overflow-hidden bg-slate-100 dark:bg-slate-700">
                                {previewImage ? (
                                    <img src={previewImage} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-slate-200 dark:bg-slate-600 text-4xl font-bold text-slate-400 dark:text-slate-300">
                                        {user?.name?.[0]}
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white cursor-pointer shadow-lg hover:bg-blue-700 transition-colors">
                                <Camera className="h-5 w-5" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
                            <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center md:justify-start gap-2">
                                <Mail className="h-4 w-4" /> {user?.email}
                            </p>
                            <div className="flex items-center justify-center md:justify-start gap-2 pt-2">
                                <span className="px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4" />
                                    {user?.role === 'student' ? t.profile.student : t.profile.graduate}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Career Summary Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Link to="/dashboard/applications">
                    <Card className="border-none shadow-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 text-white overflow-hidden group hover:shadow-blue-500/40 hover:scale-[1.02] transition-all cursor-pointer relative">
                        {/* Decorative elements */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />

                        <CardContent className="p-8 relative z-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                        <Briefcase className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-blue-100 text-xs font-black uppercase tracking-[0.2em]">{t.dashboard.nav.myOffers}</p>
                                        <h3 className="text-3xl font-black tracking-tight">
                                            {appCount} <span className="text-blue-200">{t.applications.title}</span>
                                        </h3>
                                        <p className="text-blue-100/70 text-sm font-medium">{t.applications.subtitle}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full transition-all self-start md:self-center border border-white/10">
                                    <span className="text-sm font-black uppercase tracking-wider">{t.dashboard.viewMore}</span>
                                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <Card className="border-none shadow-lg bg-white dark:bg-slate-800">
                    <CardHeader>
                        <CardTitle className="text-xl text-slate-900 dark:text-white">{t.profile.basicInfo}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.profile.fullName}</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.profile.supnumId}</label>
                                <Input
                                    value={formData.supnum_id}
                                    onChange={(e) => setFormData({ ...formData, supnum_id: e.target.value })}
                                    placeholder="e.g. 24043"
                                    className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.profile.phone}</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+222 ..."
                                        className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.profile.birthday}</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input
                                        type="date"
                                        value={formData.birthday}
                                        onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                                        className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.profile.bio}</label>
                            <textarea
                                className="w-full min-h-[120px] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none outline-none"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder={t.profile.bioPlaceholder}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Professional Info */}
                <Card className="border-none shadow-lg bg-white dark:bg-slate-800">
                    <CardHeader>
                        <CardTitle className="text-xl text-slate-900 dark:text-white">{t.profile.professionalInfo}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.profile.currentStatus}</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <select
                                        value={formData.workStatus}
                                        onChange={(e) => setFormData({ ...formData, workStatus: e.target.value })}
                                        className="w-full h-11 pl-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                                    >
                                        <option value="">{t.profile.selectStatus}</option>
                                        <option value="employed">{t.profile.employed}</option>
                                        <option value="seeking">{t.profile.seeking}</option>
                                        <option value="studying">{t.profile.studying}</option>
                                        <option value="freelance">{t.profile.freelance}</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.profile.jobTitle}</label>
                                <Input
                                    value={formData.jobTitle}
                                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                    placeholder="e.g. Software Engineer"
                                    className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.profile.company}</label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        placeholder="e.g. Tech Corp"
                                        className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {user?.role === 'ALUMNI' && (
                            <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-700">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-blue-900 dark:text-blue-300">{t.profile.mentoringProgram}</h4>
                                        <p className="text-sm text-blue-700 dark:text-blue-400">{t.profile.mentoringDesc}</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={formData.is_mentor}
                                            onChange={(e) => setFormData({ ...formData, is_mentor: e.target.checked })}
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* CV / Documents Section */}
                        <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-blue-600" />
                                {t.profile.myDocuments}
                            </h3>
                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">{t.profile.cv}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                {cvFile ? cvFile.name : (formData.cv_url ? t.profile.cvLoaded : t.profile.noCv)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {formData.cv_url && !cvFile && (
                                            <a
                                                href={formData.cv_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg transition-colors"
                                            >
                                                {t.profile.viewCv}
                                            </a>
                                        )}
                                        <label className="cursor-pointer bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-600 dark:text-slate-300 font-bold py-2 px-4 rounded-lg text-sm transition-all shadow-sm">
                                            {formData.cv_url || cvFile ? t.profile.changeCv : t.profile.addCv}
                                            <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleCvChange} />
                                        </label>
                                    </div>
                                </div>
                                <p className="mt-4 text-[11px] text-slate-400">{t.profile.acceptedFormats}</p>
                            </div>
                        </div>

                    </CardContent>
                </Card>

                {/* Social Links */}
                <Card className="border-none shadow-lg bg-white dark:bg-slate-800">
                    <CardHeader>
                        <CardTitle className="text-xl text-slate-900 dark:text-white">{t.profile.socialLinks}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                <Linkedin className="h-4 w-4 text-[#0077b5]" /> LinkedIn
                            </label>
                            <Input
                                value={formData.linkedin}
                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                placeholder="https://linkedin.com/in/username"
                                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                <Github className="h-4 w-4 text-slate-900 dark:text-white" /> GitHub
                            </label>
                            <Input
                                value={formData.github}
                                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                placeholder="https://github.com/username"
                                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                <Facebook className="h-4 w-4 text-[#1877F2]" /> Facebook
                            </label>
                            <Input
                                value={formData.facebook}
                                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                                placeholder="https://facebook.com/username"
                                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end gap-4">
                    {saveStatus === 'success' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium"
                        >
                            ✓ {t.profile.saveSuccess}
                        </motion.div>
                    )}
                    <Button
                        type="submit"
                        disabled={!isDirty || saveStatus === 'saving'}
                        className={`px-8 ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {saveStatus === 'saving' ? t.profile.saving : t.profile.saveChanges}
                    </Button>
                </div>
            </form>
        </motion.div >
    );
}
