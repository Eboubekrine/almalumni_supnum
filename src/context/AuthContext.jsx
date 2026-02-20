import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const mapUserData = (userData) => {
        if (!userData) return null;
        return {
            ...userData,
            id_user: userData.id_user || userData.id,
            name: userData.prenom && userData.nom ? `${userData.prenom} ${userData.nom}` : (userData.name || ''),
            phone: userData.telephone || userData.phone || '',
            birthday: userData.date_naissance ? userData.date_naissance.split('T')[0] : (userData.birthday || ''),
            location: userData.localisation || userData.location || '',
            jobTitle: userData.poste || userData.jobTitle || '',
            company: userData.entreprise || userData.company || '',
            cv_url: userData.cv_url || null,
            avatar: userData.avatar || null,
            supnumId: userData.supnum_id || '',
            social: {
                linkedin: userData.linkedin || userData.social?.linkedin || '',
                github: userData.github || userData.social?.github || '',
                facebook: userData.facebook || userData.social?.facebook || ''
            },
            is_mentor: !!(userData.disponible_mentorat)
        };
    };

    // Check for token on mount
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/auth/profile');
                    if (response.data.success) {
                        setUser(mapUserData(response.data.user));
                    }
                } catch (error) {
                    console.error('Failed to load user', error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });

            if (response.data.success) {
                const { token, user: rawUser } = response.data;
                localStorage.setItem('token', token);
                const mappedUser = mapUserData(rawUser);
                setUser(mappedUser);
                return { success: true, role: mappedUser.role };
            }
            return { success: false, error: response.data.message };
        } catch (error) {
            console.error('Login error:', error);
            const message = error.response?.data?.message || 'Login failed';
            return { success: false, error: message };
        }
    };

    const signup = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);

            if (response.data.success) {
                const { token, user: rawUser } = response.data;
                localStorage.setItem('token', token);
                setUser(mapUserData(rawUser));
                return { success: true };
            }
            return { success: false, error: response.data.message };
        } catch (error) {
            console.error('Signup error:', error);
            const message = error.response?.data?.message || 'Registration failed';
            return { success: false, error: message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const updateProfile = async (formData) => {
        try {
            const response = await api.put('/auth/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data.success) {
                setUser(mapUserData(response.data.user));
                return { success: true };
            }
            return { success: false, error: response.data.message };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || error.message };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
