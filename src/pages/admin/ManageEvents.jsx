import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../lib/axios'; // Import API
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Plus, Calendar, Edit, Trash2, ArrowRight, Trophy, Zap, X, Save, Image as ImageIcon, Clock, Briefcase, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '../../context/AuthContext'; // Import Auth

export function ManageEvents() {
    const { t } = useLanguage();
    const { user } = useAuth(); // Get user
    const [events, setEvents] = useState([]);

    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEventId, setCurrentEventId] = useState(null);

    const [newEvent, setNewEvent] = useState({
        title: '',
        date: '',
        type: 'Event',
        description: '',
        image: '',
        duration: '7',
        stage: '',
        color: 'bg-blue-600'
    });

    const fetchEvents = async () => {
        try {
            // Filter by userId if not admin
            const userIdParam = user?.role === 'ADMIN' ? '' : `&userId=${user?.id_user}`;
            const res = await api.get(`/evenements?limit=100${userIdParam}`);
            if (res.data.success) {
                // Map Backend Data to Frontend UI
                const mappedEvents = res.data.data.map(e => ({
                    id: e.id_evenement,
                    title: e.titre,
                    description: e.description,
                    date: e.date_evenement ? new Date(e.date_evenement).toISOString().split('T')[0] : '',
                    stage: e.lieu || 'General',
                    type: 'Event', // Default as DB doesn't have type yet
                    color: 'bg-blue-600'
                }));
                setEvents(mappedEvents);
            }
        } catch (error) {
            console.error("Failed to fetch events", error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleImageUpload = (e) => {
        // Keeping UI for future, but DB won't save it yet
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewEvent(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/evenements/${id}`);
                setEvents(events.filter(e => e.id !== id));
            } catch (error) {
                console.error("Failed to delete", error);
                alert("Failed to delete event");
            }
        }
    };

    const handleEdit = (event) => {
        setNewEvent({
            title: event.title,
            date: event.date,
            type: event.type,
            description: event.description,
            image: event.image || '',
            duration: event.duration || '7',
            stage: event.stage || '',
            color: event.color
        });
        setCurrentEventId(event.id);
        setIsEditing(true);
        setIsAdding(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const eventData = {
            titre: newEvent.title,
            description: newEvent.description,
            date_evenement: newEvent.date,
            lieu: newEvent.stage
        };

        try {
            if (isEditing) {
                const res = await api.put(`/evenements/${currentEventId}`, eventData);
                if (res.data.success) {
                    fetchEvents();
                    setIsEditing(false);
                    setCurrentEventId(null);
                }
            } else {
                const res = await api.post('/evenements', eventData);
                if (res.data.success) {
                    fetchEvents();
                }
            }
            setIsAdding(false);
            resetForm();
        } catch (error) {
            console.error("Failed to save event", error);
            alert("Failed to save event");
        }
    };

    const resetForm = () => {
        setNewEvent({
            title: '',
            date: '',
            type: 'Event',
            description: '',
            image: '',
            duration: '7',
            stage: '',
            color: 'bg-blue-600'
        });
        setIsEditing(false);
        setCurrentEventId(null);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.admin.events.title}</h1>
                <Button
                    onClick={() => { resetForm(); setIsAdding(true); }}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    {t.admin.events.create}
                </Button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <Card className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 mb-8">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                        {isEditing ? t.admin.events.edit : t.events.createNew}
                                    </h3>
                                    <button variant="ghost" size="sm" onClick={() => { setIsAdding(false); resetForm(); }}>
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                                <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.events.form.title}</label>
                                        <Input
                                            required
                                            value={newEvent.title}
                                            onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                            placeholder={t.events.form.title}
                                            className="bg-white dark:bg-slate-900"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.events.form.date}</label>
                                        <div className="relative">
                                            <Input
                                                type="date"
                                                required
                                                value={newEvent.date}
                                                onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                                                className="bg-white dark:bg-slate-900"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
                                        <select
                                            className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={newEvent.type}
                                            onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
                                        >
                                            <option value="Event">Event</option>
                                            <option value="Challenge">Challenge</option>
                                            <option value="Contest">Contest</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.events.form.location}</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <Input
                                                value={newEvent.stage}
                                                onChange={e => setNewEvent({ ...newEvent, stage: e.target.value })}
                                                placeholder={t.events.form.locationPlaceholder}
                                                className="pl-10 bg-white dark:bg-slate-900"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Image</label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                <Input
                                                    value={newEvent.image}
                                                    onChange={e => setNewEvent({ ...newEvent, image: e.target.value })}
                                                    placeholder="Image URL (optional)"
                                                    className="pl-10 bg-white dark:bg-slate-900"
                                                />
                                            </div>
                                            <label className="flex items-center justify-center px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                                <Upload className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                            </label>
                                        </div>
                                        {newEvent.image && (
                                            <div className="mt-2 h-20 w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                                                <img src={newEvent.image} alt="Preview" className="h-full w-full object-cover" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Duration (Days)</label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <Input
                                                type="number"
                                                min="1"
                                                value={newEvent.duration}
                                                onChange={e => setNewEvent({ ...newEvent, duration: e.target.value })}
                                                placeholder="7"
                                                className="pl-10 bg-white dark:bg-slate-900"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.events.form.description}</label>
                                        <textarea
                                            required
                                            className="w-full min-h-[100px] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                            value={newEvent.description}
                                            onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                                            placeholder={t.events.form.description}
                                        />
                                    </div>
                                    <div className="md:col-span-2 flex justify-end gap-2">
                                        <Button type="button" variant="ghost" onClick={() => { setIsAdding(false); resetForm(); }}>{t.events.form.cancel}</Button>
                                        <Button type="submit" className="bg-blue-600 text-white">
                                            <Save className="mr-2 h-4 w-4" /> {isEditing ? t.admin.events.edit : t.events.form.submit}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid gap-6 md:grid-cols-2">
                {events.map((event) => (
                    <motion.div
                        key={event.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ y: -5 }}
                        className="group"
                    >
                        <Card className="overflow-hidden border-none shadow-lg h-full flex flex-col bg-white dark:bg-slate-800 transition-colors duration-300">
                            {event.image ? (
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider ${event.color} shadow-lg flex items-center gap-2`}>
                                        {event.type === 'Challenge' && <Trophy className="h-3 w-3" />}
                                        {event.type === 'Contest' && <Zap className="h-3 w-3" />}
                                        {event.type}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500" />
                            )}

                            <CardContent className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        {event.date}
                                    </div>
                                    {!event.image && (
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${event.color} text-white`}>
                                            {event.type}
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {event.title}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-4 flex-1 line-clamp-3">
                                    {event.description}
                                </p>

                                <div className="flex items-center gap-2 mb-6 text-sm text-slate-500">
                                    <Briefcase className="h-4 w-4" />
                                    <span>{event.stage || 'All'}</span>
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                                    <button className="flex items-center text-sm font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        {t.admin.events.learnMore} <ArrowRight className="ml-2 h-4 w-4" />
                                    </button>
                                    <div className="flex space-x-2">
                                        {(user?.role === 'ADMIN' || event.id_organisateur === user?.id_user) && (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                                                    onClick={() => handleEdit(event)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="bg-red-500 hover:bg-red-600 text-white border-none"
                                                    onClick={() => handleDelete(event.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
