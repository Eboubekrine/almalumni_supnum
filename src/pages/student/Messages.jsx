import { useState, useEffect, useRef } from 'react';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Send, Image as ImageIcon, Users, Plus, X, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function Messages() {
    const { t } = useLanguage();
    const { user: currentUser } = useAuth();
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [contacts, setContacts] = useState([]); // Users to chat with
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [groups, setGroups] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]); // For group creation
    const [selectedDomain, setSelectedDomain] = useState('All'); // For filtering users
    const [searchQuery, setSearchQuery] = useState(''); // New search state
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    // Fetch potential contacts (all users for now) and GROUPS
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('🔄 Fetching users and groups...');
                const [usersRes, groupsRes] = await Promise.all([
                    api.get('/users'),
                    api.get('/groupes/my-groups')
                ]);

                console.log('✅ Users API response:', usersRes.data);

                if (usersRes.data.success) {
                    const allUsers = usersRes.data.users || [];
                    console.log(`👥 Total users fetched: ${allUsers.length}`);

                    if (allUsers.length === 0) {
                        console.warn('⚠️ API returned 0 users');
                    }

                    // Ensure id_user is compared correctly (both as numbers if possible)
                    const filtered = allUsers.filter(u => {
                        const isMe = Number(u.id_user) === Number(currentUser?.id_user);
                        return !isMe;
                    });

                    console.log(`📱 Displaying ${filtered.length} contacts`);
                    setContacts(filtered);
                } else {
                    console.error('❌ Users API success=false', usersRes.data);
                    alert('Error loading users: ' + (usersRes.data.message || 'Unknown error'));
                }

                if (groupsRes.data.success) {
                    setGroups(groupsRes.data.data.map(g => ({ ...g, id: g.id_groupe, name: g.nom, isGroup: true })));
                }
            } catch (err) {
                console.error("❌ Failed to fetch contacts/groups", err);
                const errorMsg = err.response?.data?.message || err.message;
                alert('Connection error: ' + errorMsg);
            }
        };

        if (currentUser) {
            fetchData();
        }
    }, [currentUser]);

    // Fetch conversation when user selected
    // Fetch conversation when user selected with Polling
    useEffect(() => {
        if (!selectedUser) return;

        const fetchMessages = async () => {
            try {
                // Use id (group) or id_user (user)
                const targetId = selectedUser.isGroup ? (selectedUser.id || selectedUser.id_groupe) : (selectedUser.id_user || selectedUser.id);
                const endpoint = `/messages/${targetId}?isGroup=${!!selectedUser.isGroup}`;

                const res = await api.get(endpoint);
                if (res.data.success) {
                    setChatHistory(res.data.data.map(msg => ({
                        id: msg.id_message,
                        senderId: Number(msg.id_expediteur) === Number(currentUser.id_user) ? 'me' : msg.id_expediteur,
                        text: msg.contenu,
                        image: msg.image_url,
                        timestamp: new Date(msg.date_envoi).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    })));
                }
            } catch (err) {
                console.error("Failed to fetch messages", err);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds

        return () => clearInterval(interval);
    }, [selectedUser, currentUser]);

    // Scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const handleSend = async (e) => {
        e.preventDefault();
        if ((!message.trim() && !imageFile) || !selectedUser) return;

        const newMessageText = message;
        const currentPreview = imagePreview;

        setMessage('');
        setImageFile(null);
        setImagePreview(null);

        try {
            const formData = new FormData();
            formData.append('recipientId', !selectedUser.isGroup ? (selectedUser.id_user || selectedUser.id) : '');
            formData.append('groupId', selectedUser.isGroup ? (selectedUser.id || selectedUser.id_groupe) : '');
            formData.append('content', newMessageText);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const res = await api.post('/messages', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                setChatHistory(prev => [
                    ...prev,
                    {
                        id: res.data.id || Date.now(),
                        senderId: 'me',
                        text: newMessageText,
                        image: res.data.image_url || currentPreview,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                ]);
            }
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        if (!groupName.trim()) return;

        console.log('Creating group with:', {
            nom: groupName,
            members: selectedMembers,
            memberCount: selectedMembers.length
        });

        try {
            const res = await api.post('/groupes', {
                nom: groupName,
                description: "Group created via Messages",
                members: selectedMembers
            });

            console.log('Group creation response:', res.data);

            if (res.data.success) {
                // Add new group to list
                setGroups(prev => [...prev, {
                    id: res.data.id,
                    name: groupName,
                    members: selectedMembers.length + 1, // + creator
                    isGroup: true
                }]);
                setIsCreatingGroup(false);
                setGroupName('');
                setSelectedMembers([]);
                alert(`${t.messages.groupCreated} ${selectedMembers.length + 1} ${t.messages.members}!`);
            }
        } catch (error) {
            console.error('Group creation error:', error);
            console.error('Error response:', error.response?.data);
            alert('Failed to create group: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors duration-300">
            {/* Sidebar */}
            <div className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <h2 className="font-bold text-lg text-slate-900 dark:text-white">{t.messages.title}</h2>
                    <Button size="icon" variant="ghost" onClick={() => setIsCreatingGroup(true)} title={t.messages.createGroup} className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>

                <AnimatePresence>
                    {isCreatingGroup && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 overflow-hidden"
                        >
                            <form onSubmit={handleCreateGroup} className="space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{t.messages.newGroup}</span>
                                    <button type="button" onClick={() => setIsCreatingGroup(false)}><X className="h-4 w-4 text-slate-400" /></button>
                                </div>

                                <Input
                                    placeholder={t.messages.groupName}
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                    required
                                />

                                {/* Search User */}
                                <div>
                                    <Input
                                        placeholder={t.messages.searchPlaceholder}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>

                                {/* Domain Filter */}
                                <div>
                                    <label className="text-xs text-slate-500 mb-1 block">{t.messages.filterDomain}</label>
                                    <select
                                        className="w-full text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
                                        onChange={(e) => setSelectedDomain(e.target.value)}
                                        value={selectedDomain}
                                    >
                                        <option value="All">{t.messages.allDomains}</option>
                                        <option value="GL">Génie Logiciel</option>
                                        <option value="RSI">Réseaux & Sécu</option>
                                        <option value="DS">Data Science</option>
                                    </select>
                                </div>

                                {/* Multi-Select Members */}
                                <div className="max-h-40 overflow-y-auto space-y-2 border rounded-md p-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                                    <p className="text-xs font-medium text-slate-500 mb-2">{t.messages.selectMembers} ({contacts.length} total)</p>
                                    {contacts.length === 0 ? (
                                        <p className="text-xs text-slate-400 italic">{t.messages.loadingUsers}</p>
                                    ) : (
                                        contacts.map(user => (
                                            <div key={user.id_user} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={`u-${user.id_user}`}
                                                    checked={selectedMembers.includes(user.id_user)}
                                                    onChange={(e) => {
                                                        console.log('Checkbox changed:', user.id_user, e.target.checked);
                                                        if (e.target.checked) {
                                                            const newMembers = [...selectedMembers, user.id_user];
                                                            console.log('New selected members:', newMembers);
                                                            setSelectedMembers(newMembers);
                                                        } else {
                                                            const newMembers = selectedMembers.filter(id => id !== user.id_user);
                                                            console.log('Removed member, new list:', newMembers);
                                                            setSelectedMembers(newMembers);
                                                        }
                                                    }}
                                                    className="rounded border-slate-300"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <label htmlFor={`u-${user.id_user}`} className="text-sm text-slate-700 dark:text-slate-300 truncate cursor-pointer select-none block">
                                                        {user.prenom} {user.nom}
                                                    </label>
                                                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <Button size="sm" type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={!groupName.trim()}>
                                    <Check className="h-4 w-4 mr-2" /> {t.messages.createGroup} ({selectedMembers.length})
                                </Button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex-1 overflow-y-auto">
                    {contacts.map((user) => (
                        <button
                            key={user.id_user}
                            onClick={() => setSelectedUser(user)}
                            className={cn(
                                "w-full p-4 flex items-center space-x-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left",
                                selectedUser?.id_user === user.id_user ? "bg-slate-50 dark:bg-slate-800 border-r-2 border-supnum-blue" : ""
                            )}
                        >
                            <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.prenom} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center font-bold text-slate-400 dark:text-slate-500">
                                        {user.prenom?.[0]}{user.nom?.[0]}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate text-slate-900 dark:text-white">{user.prenom} {user.nom}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{t.messages.clickToChat}</p>
                            </div>
                        </button>
                    ))}

                    {/* Groups List */}
                    {groups.map(group => (
                        <button
                            key={group.id}
                            onClick={() => setSelectedUser({ ...group, isGroup: true })}
                            className={cn(
                                "w-full p-4 flex items-center space-x-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left",
                                selectedUser?.id === group.id ? "bg-slate-50 dark:bg-slate-800 border-r-2 border-supnum-blue" : ""
                            )}
                        >
                            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <Users className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate text-slate-900 dark:text-white">{group.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{group.members} {t.messages.members}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
                {selectedUser ? (
                    <>
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                    {selectedUser.isGroup ? (
                                        <div className="h-full w-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                                            <Users className="h-5 w-5" />
                                        </div>
                                    ) : selectedUser.avatar ? (
                                        <img src={selectedUser.avatar} alt={selectedUser.prenom} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center font-bold text-slate-400 dark:text-slate-500">
                                            {selectedUser.prenom?.[0]}{selectedUser.nom?.[0]}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">{selectedUser.isGroup ? selectedUser.name : `${selectedUser.prenom} ${selectedUser.nom}`}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {selectedUser.isGroup ? `${selectedUser.members} ${t.messages.members}` : t.messages.online}
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" title={t.messages.addPeople} className="text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                                <Users className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
                            {chatHistory.map((msg) => {
                                const isMe = msg.senderId === 'me';
                                return (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn("flex", isMe ? "justify-end" : "justify-start")}
                                    >
                                        <div className={cn(
                                            "max-w-[70%] rounded-2xl px-4 py-2 shadow-sm",
                                            isMe ? "bg-supnum-blue text-white rounded-br-none" : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none"
                                        )}>
                                            {msg.image && (
                                                <img src={msg.image} alt="Sent" className="max-w-full rounded-lg mb-2 cursor-pointer hover:opacity-90" onClick={() => window.open(msg.image, '_blank')} />
                                            )}
                                            {msg.text && <p>{msg.text}</p>}
                                            <p className={cn("text-[10px] mt-1 opacity-70", isMe ? "text-blue-100" : "text-slate-400 dark:text-slate-500")}>
                                                {msg.timestamp}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                            {imagePreview && (
                                <div className="mb-2 relative w-20 h-20">
                                    <img src={imagePreview} className="w-full h-full object-cover rounded-lg border dark:border-slate-700" alt="Preview" />
                                    <button
                                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-lg"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                            <form onSubmit={handleSend} className="flex items-center space-x-2">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <Button type="button" variant="ghost" size="icon" onClick={handleFileClick} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                    <ImageIcon className="h-5 w-5" />
                                </Button>
                                <Input
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={t.messages.typeMessage}
                                    className="flex-1 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                />
                                <Button type="submit" size="icon" disabled={!message.trim() && !imageFile} className="bg-supnum-blue hover:bg-blue-700 text-white">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-400 dark:text-slate-500">
                        {t.messages.selectConv}
                    </div>
                )}
            </div>
        </div>
    );
}
