import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { cn } from '../lib/utils';
import { Calendar, Trophy, Zap, ArrowRight, Loader2, Plus, X, MapPin } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';

export function PublicEvents() {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({
        titre: '',
        description: '',
        date_evenement: '',
        lieu: '',
        image: ''
    });
    const [imageFile, setImageFile] = useState(null);

    const fetchEvents = async () => {
        try {
            console.log('🔄 Fetching events...');
            const response = await api.get('/evenements?limit=100');
            console.log('📡 API Response:', response.data);
            if (response.data.success) {
                console.log('✅ Loaded events:', response.data.data);
                // Sort by ID DESC to show newest created events first
                const sorted = response.data.data.sort((a, b) => b.id_evenement - a.id_evenement);
                setEvents(sorted);
            }
        } catch (error) {
            console.error('❌ Failed to load events', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            console.log('🚀 Creating event...', { ...newEvent, hasFile: !!imageFile });
            const formData = new FormData();
            formData.append('titre', newEvent.titre);
            formData.append('description', newEvent.description);
            formData.append('date_evenement', newEvent.date_evenement);
            formData.append('lieu', newEvent.lieu);

            if (imageFile) {
                formData.append('image', imageFile);
            } else if (newEvent.image) {
                formData.append('image', newEvent.image);
            }

            const res = await api.post('/evenements', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.data.success) {
                alert(t.events.success);
                setIsCreating(false);
                setNewEvent({ titre: '', description: '', date_evenement: '', lieu: '', image: '' });
                setImageFile(null);
                fetchEvents();
            }
        } catch (error) {
            console.error('❌ Event creation error:', error);
            alert(t.events.failed + ': ' + (error.response?.data?.message || error.message));
        }
    };

    const canCreate = user && (
        user.role?.toUpperCase() === 'STUDENT' ||
        user.role?.toUpperCase() === 'ALUMNI' ||
        user.role?.toUpperCase() === 'ADMIN'
    );

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{t.events.title}</h1>
                {canCreate && (
                    <Button onClick={() => setIsCreating(true)} className="bg-supnum-blue text-white hover:bg-blue-700">
                        <Plus className="mr-2 h-5 w-5" /> {t.events.create}
                    </Button>
                )}
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {isCreating && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create New Event</h2>
                                <button onClick={() => setIsCreating(false)} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <form onSubmit={handleCreate} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.events.form.title}</label>
                                    <Input
                                        value={newEvent.titre}
                                        onChange={e => setNewEvent({ ...newEvent, titre: e.target.value })}
                                        required
                                        className="bg-slate-50 dark:bg-slate-900"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.events.form.date}</label>
                                        <Input
                                            type="date"
                                            value={newEvent.date_evenement}
                                            onChange={e => setNewEvent({ ...newEvent, date_evenement: e.target.value })}
                                            required
                                            className="bg-slate-50 dark:bg-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.events.form.location}</label>
                                        <Input
                                            value={newEvent.lieu}
                                            onChange={e => setNewEvent({ ...newEvent, lieu: e.target.value })}
                                            placeholder={t.events.form.locationPlaceholder}
                                            className="bg-slate-50 dark:bg-slate-900"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.events.form.uploadPhoto}</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setImageFile(e.target.files[0])}
                                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    <p className="text-xs text-slate-400 mt-1">{t.events.form.orUrl}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.events.form.imageUrl}</label>
                                    <Input
                                        value={newEvent.image}
                                        onChange={e => setNewEvent({ ...newEvent, image: e.target.value })}
                                        placeholder={t.events.form.urlPlaceholder}
                                        className="bg-slate-50 dark:bg-slate-900"
                                        disabled={!!imageFile}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.events.form.description}</label>
                                    <textarea
                                        className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white"
                                        rows={4}
                                        value={newEvent.description}
                                        onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="pt-4 flex justify-end space-x-3">
                                    <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>{t.events.form.cancel}</Button>
                                    <Button type="submit" className="bg-supnum-blue text-white">{t.events.form.submit}</Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-supnum-blue" />
                </div>
            ) : events.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => (
                        <Card key={event.id_evenement} className="overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-slate-800 border-none shadow-md flex flex-col h-full">
                            {event.image ? (
                                <div className="h-48 w-full overflow-hidden relative">
                                    <img src={event.image} alt={event.titre} className="w-full h-full object-cover" />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-2 py-1 rounded text-xs font-bold uppercase text-white bg-blue-600 shadow-sm">
                                            EVENT
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 pb-0 flex items-start justify-between">
                                    <div className="p-3 rounded-xl bg-opacity-10 bg-blue-600 text-blue-600">
                                        <Calendar className="h-6 w-6" />
                                    </div>
                                    <span className="px-2 py-1 rounded text-xs font-bold uppercase text-white bg-blue-600">
                                        EVENT
                                    </span>
                                </div>
                            )}

                            <CardHeader className="flex-1 pt-4">
                                <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mb-2">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    {new Date(event.date_evenement).toLocaleDateString()}
                                    {event.lieu && (
                                        <span className="flex items-center ml-4">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {event.lieu}
                                        </span>
                                    )}
                                </div>
                                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">{event.titre}</CardTitle>
                            </CardHeader>
                            <CardContent className="mt-auto">
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-3">{event.description}</p>
                                <Button
                                    onClick={() => setSelectedEvent(event)}
                                    className="w-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600"
                                >
                                    {t.events.viewDetails} <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                        <Calendar className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">{t.events.noEvents}</h3>
                    <p className="text-slate-500 dark:text-slate-400">{t.events.noEventsSubtitle}</p>
                </div>
            )}

            {/* Event Details Modal */}
            <AnimatePresence>
                {selectedEvent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
                        >
                            <div className="relative h-64 w-full">
                                {selectedEvent.image ? (
                                    <img src={selectedEvent.image} alt={selectedEvent.titre} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                        <Calendar className="h-16 w-16 text-slate-300" />
                                    </div>
                                )}
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white p-2 rounded-full transition-colors"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="p-8">
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="flex items-center text-supnum-blue bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full text-sm font-medium">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        {new Date(selectedEvent.date_evenement).toLocaleDateString()}
                                    </div>
                                    {selectedEvent.lieu && (
                                        <div className="flex items-center text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full text-sm font-medium border border-slate-200 dark:border-slate-700">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            {selectedEvent.lieu}
                                        </div>
                                    )}
                                </div>

                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{selectedEvent.titre}</h2>

                                <div className="prose dark:prose-invert max-w-none">
                                    <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                                        {selectedEvent.description || 'No description provided for this event.'}
                                    </p>
                                </div>

                                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500">
                                            {selectedEvent.org_prenom?.[0]}{selectedEvent.org_nom?.[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                {t.events.organizedBy} {selectedEvent.org_prenom} {selectedEvent.org_nom}
                                            </p>
                                            <p className="text-xs text-slate-500">SupNum Member</p>
                                        </div>
                                    </div>
                                    <Button onClick={() => setSelectedEvent(null)} className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white">
                                        {t.events.close}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
