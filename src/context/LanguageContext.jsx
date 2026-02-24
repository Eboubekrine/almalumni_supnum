import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
    EN: {
        nav: {
            home: 'Home',
            events: 'Events',
            about: 'About',
            signin: 'Sign In',
            signup: 'Sign Up',
            internships: 'Internships',
            companies: 'Companies',
            logout: 'Sign Out'
        },
        dashboard: {
            nav: { dashboard: 'Dashboard', profile: 'Profile', users: 'Users', friends: 'Friends', messages: 'Messages', myOffers: 'My Offers' },
            welcome: 'Welcome,',
            welcomeSubtitle: "Here's what's happening in your SupNum network.",
            stats: { totalUsers: 'Total Users', friends: 'Your Friends', pending: 'Pending Requests', growth: 'this month' },
            quickLinks: { findUsers: 'Find People', messages: 'Messages', events: 'Events', viewProfile: 'View Profile' },
            friendRequests: 'Friend Requests',
            suggestions: 'Suggestions',
            viewMore: 'View More',
            bonRetour: 'Welcome back!',
            connectedSuccess: 'You have successfully logged in.'
        },
        admin: {
            nav: { dashboard: 'Dashboard', events: 'Manage Events', users: 'Manage Users' },
            welcome: 'Admin Dashboard',
            subtitle: 'Manage your SupNum Connect platform.',
            stats: { totalUsers: 'Total Users', students: 'Students', graduates: 'Graduates' },
            charts: { userGrowth: 'User Growth', students: 'Students', graduates: 'Graduates', opportunitiesPosted: 'Post Offer' },
            events: { title: 'Recent Events', create: 'Create Event', edit: 'Edit', delete: 'Delete', learnMore: 'Learn More' },
            users: {
                title: 'User Management',
                search: 'Search by name, ID or email...',
                role: 'Role',
                actions: 'Actions',
                remove: 'Remove',
                export: 'Export CSV',
                add: 'Add User',
                addUser: 'Add New User',
                allStatus: 'All Status',
                verified: 'Verified',
                pending: 'Pending',
                suspended: 'Suspended',
                approve: 'Approve',
                firstName: 'First Name',
                lastName: 'Last Name',
                email: 'Email',
                password: 'Password',
                user: 'User',
                status: 'Status',
                confirmDelete: 'Are you sure you want to remove this user? This cannot be undone.'
            }
        },
        profile: {
            title: 'User Profile',
            basicInfo: 'Basic Information',
            fullName: 'Full Name',
            supnumId: 'SupNum ID',
            phone: 'Phone Number',
            birthday: 'Birthday',
            bio: 'Bio',
            bioPlaceholder: 'Tell us about yourself...',
            role: 'Role',
            socialLinks: 'Social Links',
            saveChanges: 'Save Changes',
            saving: 'Saving...',
            saveSuccess: 'Changes saved successfully!',
            uploadPhoto: 'Upload Photo',
            student: 'Student',
            graduate: 'Graduate',
            admin: 'Administrator',
            mentor: 'Mentor',
            mentoringProgram: 'Mentoring Program',
            mentoringDesc: 'By activating this option, you will appear as a "Mentor" available to help students.',
            professionalInfo: 'Professional info',
            currentStatus: 'Current Status',
            selectStatus: 'Select Status',
            employed: 'Employed',
            seeking: 'Seeking Opportunities',
            studying: 'Continuing Studies',
            freelance: 'Freelancing',
            jobTitle: 'Job Title',
            company: 'Company / Organization',
            documents: 'Documents',
            myDocuments: 'My Documents',
            cv: 'Curriculum Vitae (CV)',
            cvLoaded: 'CV loaded successfully',
            noCv: 'No CV uploaded',
            viewCv: 'View my CV',
            changeCv: 'Change my CV',
            addCv: 'Add my CV',
            acceptedFormats: 'Accepted formats: PDF, Word. Max 5MB.',
            availableMentoring: 'Available for Mentoring',
            unavailableMentoring: 'Currently Unavailable for Mentoring',
            edit: 'Edit Profile',
            cancel: 'Cancel',
            jobTitle: 'Job Title',
            company: 'Company',
            location: 'Location',
            type: 'Type',
            activeListing: 'Active Listing',
            placeholder: {
                jobTitle: 'e.g. Software Engineer',
                company: 'e.g. Tech Corp',
                location: 'e.g. Nouakchott'
            }
        },
        applications: {
            title: 'My Applications',
            subtitle: 'Track the status of your internship applications',
            noApps: 'No applications yet',
            noAppsSubtitle: 'Start exploring internships and apply to get started!',
            appliedOn: 'Applied on',
            motivation: 'Motivation message',
            myCv: 'My CV',
            status: {
                pending: 'Pending',
                accepted: 'Accepted',
                rejected: 'Rejected'
            },
            remote: 'Remote'
        },
        about: {
            title: 'About SupNum Connect',
            subtitle: 'SupNum Connect is the official social-academic network for the Institut Supérieur Numérique (SupNum).',
            mission: {
                title: 'Our Mission',
                desc: 'To create a vibrant, interconnected community where students, graduates, and administrators can collaborate, share knowledge, and grow together. We believe in the power of networking to unlock new opportunities and foster academic excellence.'
            },
            goals: {
                title: 'Key Goals',
                items: [
                    'Connect current students with alumni',
                    'Facilitate mentorship and guidance',
                    'Centralize campus events and news',
                    'Showcase student achievements'
                ]
            },
            cta: {
                title: 'Built by Students, for Students',
                desc: 'This platform was created as a project by SupNum students, demonstrating the technical skills and innovation fostered at our institute.',
                founded: 'Founded',
                institute: 'Institute'
            }
        },
        auth: {
            signIn: {
                title: 'Sign In',
                subtitle: 'Access your member area',
                email: 'Email Address',
                password: 'Password',
                forgot: 'Forgot?',
                button: 'Sign In',
                noAccount: "New to SupNum Connect?",
                createAccount: "Create account",
                error: 'An unexpected error occurred',
                placeholder: {
                    email: 'your.email@supnum.mr'
                }
            },
            signUp: {
                title: 'Create your account',
                subtitle: 'Start your journey with SupNum Connect today',
                firstName: 'First Name',
                lastName: 'Last Name',
                email: 'Email Address',
                password: 'Password',
                role: 'Role',
                button: 'Create Account',
                haveAccount: 'Already have an account?',
                signIn: 'Sign in',
                benefits: {
                    title: 'Join the elite network of SupNum graduates.',
                    items: [
                        'Connect with alumni and industry leaders',
                        'Access exclusive job and internship opportunities',
                        'Participate in professional events and workshops',
                        'Mentor the next generation of students'
                    ]
                }
            }
        },
        userProfile: {
            viewProfile: 'View Public Profile',
            message: 'Send Message',
            connecting: 'Connecting...',
            connected: 'Connected',
            mutual: 'mutual friends',
            about: 'About',
            experience: 'Experience',
            contact: 'Contact Info',
            back: 'Back to Search',
            requestSent: 'Request Sent',
            connect: 'Connect',
            academicInfo: 'Academic Information',
            department: 'Department',
            entryYear: 'Entry Year',
            cs: 'Computer Science',
            noBio: "This user hasn't written a bio yet.",
            noSocial: 'No public social links.',
            viewSocial: 'Profile',
            socialProfiles: 'Social Profiles',
            notFound: 'User not found',
            loadError: 'Failed to load user profile'
        },
        hero: {
            welcome: 'Welcome to the SupNum Community',
            title: 'Connect, Learn & Grow with',
            subtitle: 'The official social network for Institut Supérieur Numérique graduates. Build connections, participate in events, and advance your career.',
            getStarted: 'Get Started',
            learnMore: 'Learn More'
        },
        stats: {
            community: 'Our Growing Community',
            communityDesc: 'Join thousands of SupNum graduates building the future of technology in Mauritania.',
            totalUsers: 'Total Users',
            students: 'Alumni',
            graduates: 'Graduates',
            events: 'Events',
            challenges: 'Challenges',
            contests: 'Contests'
        },
        opportunities: {
            title: 'Opportunities & Partners',
            subtitle: 'Connect with top companies and find your next career move.',
            partners: 'Partner Companies',
            active: 'Active Internships',
            latest: 'Latest Opportunities',
            view: 'View',
            apply: 'Apply'
        },
        internships: {
            title: 'Internships & Jobs',
            subtitle: 'Discover your next opportunity',
            searchPlaceholder: 'Search by title or company...',
            allTypes: 'All Types',
            internship: 'Internship (Stage)',
            job: 'Job (Emploi)',
            details: 'Details',
            apply: 'Apply',
            noOffers: 'No offers found',
            noOffersSubtitle: 'Try adjusting your search or filters',
            applyRole: 'Apply for Role',
            applicationSent: 'Application Sent!',
            applicationSentDesc: 'Your CV has been successfully submitted to',
            uploadCV: 'Upload CV (PDF/Word)',
            uploadDesc: 'Click or drag to upload your CV',
            uploadLimit: 'PDF, DOC, DOCX up to 5MB',
            messagePlaceholder: 'Why are you a good fit for this role?',
            cancel: 'Cancel',
            submit: 'Submit Application',
            submitting: 'Submitting...'
        },
        companies: {
            title: 'Partner Companies',
            subtitle: 'Our network of professional partners',
            searchPlaceholder: 'Search by name, sector or city...',
            partner: 'Partner',
            visitWebsite: 'Visit Website',
            noCompanies: 'No companies found',
            noCompaniesSubtitle: 'Try searching for something else',
            add: 'Add Company',
            edit: 'Edit Company',
            name: 'Company Name',
            industry: 'Industry',
            location: 'Location',
            website: 'Website',
            confirmDelete: 'Are you sure you want to remove this company?'
        },
        friends: {
            title: 'Friends',
            tabs: { mine: 'My Friends', requests: 'Requests' },
            message: 'Message',
            noFriends: 'No friends yet. Connect with people!',
            sentRequest: 'Sent you a friend request',
            accept: 'Accept',
            reject: 'Reject',
            noRequests: 'No pending requests.',
            acceptedAlert: 'Friend request accepted!',
            rejectedAlert: 'Friend request rejected',
            failedAlert: 'Failed to process request'
        },
        search: {
            title: 'Find People',
            placeholder: 'Search by name or email...',
            loading: 'Loading...',
            viewProfile: 'View Profile',
            sentSuccess: 'Friend request sent successfully!',
            noResults: 'No users found matching your search.'
        },
        messages: {
            title: 'Messages',
            createGroup: 'Create Group',
            newGroup: 'New Group',
            groupName: 'Group Name',
            searchPlaceholder: 'Search by name or email...',
            filterDomain: 'Filter by Domain',
            allDomains: 'All Domains',
            selectMembers: 'Select Members',
            loadingUsers: 'Loading users...',
            clickToChat: 'Click to chat',
            members: 'members',
            online: 'Online',
            addPeople: 'Add people to chat',
            typeMessage: 'Type a message...',
            selectConv: 'Select a conversation to start messaging',
            groupCreated: 'Group created successfully with'
        },
        charts: {
            entryYear: 'Students by Entry Year',
            promotion: 'Graduates by Promotion',
            growth: 'Community Growth Over Years',
            students: 'Students',
            graduates: 'Graduates'
        },
        events: {
            title: 'Upcoming Events',
            subtitle: 'Participate in events, challenges, and contests to enhance your skills and connect with peers.',
            viewAll: 'View All Events',
            learnMore: 'Learn More',
            viewDetails: 'View Details',
            create: 'Create Event',
            createNew: 'Create New Event',
            form: {
                title: 'Title',
                date: 'Date',
                location: 'Location',
                locationPlaceholder: 'e.g. Amphitheatre A',
                description: 'Description',
                uploadPhoto: 'Upload Photo (from PC)',
                imageUrl: 'Image URL',
                urlPlaceholder: 'https://images.unsplash.com/photo...',
                orUrl: 'OR enter an image URL below',
                cancel: 'Cancel',
                submit: 'Create Event'
            },
            success: 'Event created successfully!',
            failed: 'Failed to create event',
            organizedBy: 'Organized by',
            noEvents: 'No events found',
            noEventsSubtitle: 'Check back later for upcoming events and challenges.',
            close: 'Close',
            upcomingTerm: 'Upcoming this term'
        },
        cta: {
            title: 'Ready to Join the SupNum Community?',
            subtitle: 'Connect with fellow graduates, access exclusive opportunities, and be part of the next generation of tech leaders in Mauritania.',
            button: "Join Now – It's Free"
        },
        footer: {
            rights: 'All rights reserved.'
        }
    },
    FR: {
        nav: {
            home: 'Accueil',
            events: 'Événements',
            about: 'À propos',
            signin: 'Se connecter',
            signup: "S'inscrire",
            internships: 'Offres',
            companies: 'Entreprises',
            logout: 'Déconnexion'
        },
        dashboard: {
            nav: { dashboard: 'Tableau de bord', profile: 'Profil', users: 'Utilisateurs', friends: 'Amis', messages: 'Messages', myOffers: 'Mes Offres' },
            welcome: 'Bienvenue,',
            welcomeSubtitle: "Voici ce qui se passe dans votre réseau SupNum.",
            stats: { totalUsers: 'Total Utilisateurs', friends: 'Vos Amis', pending: 'Demandes en attente', growth: 'ce mois' },
            quickLinks: { findUsers: 'Trouver des gens', messages: 'Messages', events: 'Événements', viewProfile: 'Voir le profil' },
            friendRequests: "Demandes d'amis",
            suggestions: 'Suggestions',
            viewMore: 'Voir plus',
            bonRetour: 'Bon retour !',
            connectedSuccess: 'Vous êtes connecté avec succès.'
        },
        admin: {
            nav: { dashboard: 'Tableau de bord', events: 'Gérer événements', users: 'Gérer utilisateurs' },
            welcome: 'Tableau de bord Admin',
            subtitle: 'Gérez votre plateforme SupNum Connect.',
            stats: { totalUsers: 'Total Utilisateurs', students: 'Anciens', graduates: 'Diplômés' },
            charts: { userGrowth: 'Croissance des utilisateurs', students: 'Anciens', graduates: 'Diplômés', opportunitiesPosted: 'Créer une offre' },
            events: { title: 'Événements Récents', create: 'Créer un événement', edit: 'Modifier', delete: 'Supprimer', learnMore: 'En savoir plus' },
            users: {
                title: 'Gestion des Utilisateurs',
                search: 'Rechercher par nom, ID ou e-mail...',
                role: 'Rôle',
                actions: 'Actions',
                remove: 'Supprimer',
                export: 'Exporter CSV',
                add: 'Ajouter un utilisateur',
                addUser: 'Ajouter un nouvel utilisateur',
                allStatus: 'Tous les statuts',
                verified: 'Vérifié',
                pending: 'En attente',
                suspended: 'Suspendu',
                approve: 'Approuver',
                firstName: 'Prénom',
                lastName: 'Nom',
                email: 'E-mail',
                password: 'Mot de passe',
                user: 'Utilisateur',
                status: 'Statut',
                confirmDelete: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.'
            }
        },
        profile: {
            title: 'Profil Utilisateur',
            basicInfo: 'Informations de base',
            fullName: 'Nom complet',
            supnumId: 'ID SupNum',
            phone: 'Numéro de téléphone',
            birthday: 'Date de naissance',
            bio: 'Biographie',
            bioPlaceholder: 'Parlez-nous de vous...',
            role: 'Rôle',
            socialLinks: 'Liens sociaux',
            saveChanges: 'Enregistrer',
            saving: 'Enregistrement...',
            saveSuccess: 'Modifications enregistrées avec succès !',
            uploadPhoto: 'Changer la photo',
            student: 'Étudiant',
            graduate: 'Diplômé',
            admin: 'Administrateur',
            mentor: 'Mentor',
            mentoringProgram: 'Programme de Mentorat',
            mentoringDesc: 'En activant cette option, vous apparaîtrez comme "Mentor" disponible pour aider les étudiants.',
            professionalInfo: 'Informations Professionnelles',
            currentStatus: 'Statut Actuel',
            selectStatus: 'Sélectionner le statut',
            employed: 'Employé',
            seeking: 'En recherche d\'opportunités',
            studying: 'Poursuite d\'études',
            freelance: 'Freelance',
            jobTitle: 'Intitulé du poste',
            company: 'Entreprise / Organisation',
            documents: 'Documents',
            myDocuments: 'Mes Documents',
            cv: 'Curriculum Vitae (CV)',
            cvLoaded: 'CV chargé avec succès',
            noCv: 'Aucun CV téléchargé',
            viewCv: 'Voir mon CV',
            changeCv: 'Changer mon CV',
            addCv: 'Ajouter mon CV',
            acceptedFormats: 'Formats acceptés : PDF, Word. Max 5Mo.',
            availableMentoring: 'Disponible pour le mentorat',
            unavailableMentoring: 'Indisponible pour le mentorat',
            edit: 'Modifier le profil',
            cancel: 'Annuler'
        },
        applications: {
            title: 'Mes Candidatures',
            subtitle: 'Suivez l\'état de vos demandes d\'offre',
            noApps: 'Aucune candidature pour le moment',
            noAppsSubtitle: 'Commencez à explorer les offres et postulez pour débuter !',
            appliedOn: 'Postulé le',
            motivation: 'Message de motivation',
            myCv: 'Mon CV',
            status: {
                pending: 'En Attente',
                accepted: 'Accepté',
                rejected: 'Refusé'
            },
            remote: 'À distance'
        },
        about: {
            title: 'À propos de SupNum Connect',
            subtitle: 'SupNum Connect est le réseau social-académique officiel de l\'Institut Supérieur Numérique (SupNum).',
            mission: {
                title: 'Notre Mission',
                desc: 'Créer une communauté vibrante et interconnectée où les étudiants, les diplômés et les administrateurs peuvent collaborer, partager leurs connaissances et grandir ensemble. Nous croyons au pouvoir du réseautage pour débloquer de nouvelles opportunités et favoriser l\'excellence académique.'
            },
            goals: {
                title: 'Objectifs Clés',
                items: [
                    'Connecter les étudiants actuels avec les anciens',
                    'Faciliter le mentorat et l\'orientation',
                    'Centraliser les événements et les actualités du campus',
                    'Mettre en valeur les réalisations des étudiants'
                ]
            },
            cta: {
                title: 'Construit par des étudiants, pour des étudiants',
                desc: 'Cette plateforme a été créée comme un projet par des étudiants de SupNum, démontrant les compétences techniques et l\'innovation favorisées au sein de notre institut.',
                founded: 'Fondé en',
                institute: 'Institut'
            }
        },
        auth: {
            signIn: {
                title: 'Se connecter',
                subtitle: 'Accédez à votre espace membre',
                email: 'Adresse Email',
                password: 'Mot de passe',
                forgot: 'Oublié ?',
                button: 'Se connecter',
                noAccount: "Nouveau sur SupNum Connect ?",
                createAccount: "Créer un compte",
                error: 'Une erreur inattendue s\'est produite',
                placeholder: {
                    email: 'votre.email@supnum.mr'
                }
            },
            signUp: {
                title: 'Créez votre compte',
                subtitle: 'Commencez votre voyage avec SupNum Connect dès aujourd\'hui',
                firstName: 'Prénom',
                lastName: 'Nom',
                email: 'Adresse Email',
                password: 'Mot de passe',
                role: 'Rôle',
                button: 'Créer un compte',
                haveAccount: 'Déjà un compte ?',
                signIn: 'Se connecter',
                benefits: {
                    title: 'Rejoignez le réseau d\'élite des diplômés de SupNum.',
                    items: [
                        'Connectez-vous avec vos pairs et les leaders de l\'industrie',
                        'Accédez à des opportunités exclusives de stages et d\'emplois',
                        'Participez à des événements et ateliers professionnels',
                        'Mentorez la prochaine génération d\'étudiants'
                    ]
                }
            }
        },
        userProfile: {
            viewProfile: 'Voir le profil public',
            message: 'Envoyer un message',
            connecting: 'Connexion...',
            connected: 'Connecté',
            mutual: 'amis en commun',
            about: 'À propos',
            experience: 'Expérience',
            contact: 'Informations de contact',
            back: 'Retour à la recherche',
            requestSent: 'Demande envoyée',
            connect: 'Se connecter',
            academicInfo: 'Informations Académiques',
            department: 'Département',
            entryYear: 'Année d\'entrée',
            cs: 'Informatique',
            noBio: "Cet utilisateur n'a pas encore écrit de biographie.",
            noSocial: 'Aucun lien social public.',
            viewSocial: 'Profil',
            socialProfiles: 'Profils Sociaux',
            notFound: 'Utilisateur non trouvé',
            loadError: 'Échec du chargement du profil utilisateur'
        },
        hero: {
            welcome: 'Bienvenue dans la communauté SupNum',
            title: 'Connectez, Apprenez et Grandissez avec',
            subtitle: "Le réseau social officiel des diplômés de l'Institut Supérieur Numérique. Tissez des liens, participez à des événements et faites avancer votre carrière.",
            getStarted: 'Commencer',
            learnMore: 'En savoir plus'
        },
        stats: {
            community: 'Notre Communauté Grandissante',
            communityDesc: "Rejoignez des milliers de diplômés de SupNum qui construisent l'avenir de la technologie en Mauritanie.",
            totalUsers: 'Utilisateurs Totaux',
            students: 'Anciens',
            graduates: 'Diplômés',
            events: 'Événements',
            challenges: 'Défis',
            contests: 'Concours'
        },
        opportunities: {
            title: 'Opportunités & Partenaires',
            subtitle: 'Connectez-vous avec les meilleures entreprises et trouvez votre prochaine étape de carrière.',
            partners: 'Entreprises Partenaires',
            active: 'Offres Actives',
            latest: 'Dernières Opportunités',
            view: 'Voir',
            apply: 'Postuler'
        },
        internships: {
            title: 'Offres et Emplois',
            subtitle: 'Découvrez votre prochaine opportunité',
            searchPlaceholder: 'Rechercher par titre ou entreprise...',
            allTypes: 'Tous les types',
            internship: 'Offre',
            job: 'Emploi',
            details: 'Détails',
            apply: 'Postuler',
            noOffers: 'Aucune offre trouvée',
            noOffersSubtitle: 'Essayez d\'ajuster votre recherche ou vos filtres',
            applyRole: 'Postuler pour le poste',
            applicationSent: 'Candidature envoyée !',
            applicationSentDesc: 'Votre CV a été soumis avec succès à',
            uploadCV: 'Télécharger le CV (PDF/Word)',
            uploadDesc: 'Cliquez ou faites glisser pour télécharger votre CV',
            uploadLimit: 'PDF, DOC, DOCX jusqu\'à 5Mo',
            messagePlaceholder: 'Pourquoi êtes-vous un bon candidat pour ce poste ?',
            cancel: 'Annuler',
            submit: 'Soumettre la candidature',
            submitting: 'Envoi en cours...',
            jobTitle: 'Titre du poste',
            company: 'Entreprise',
            location: 'Lieu',
            type: 'Type',
            activeListing: 'Annonce active',
            placeholder: {
                jobTitle: 'ex: Ingénieur Logiciel',
                company: 'ex: Tech Corp',
                location: 'ex: Nouakchott'
            }
        },
        companies: {
            title: 'Entreprises Partenaires',
            subtitle: 'Notre réseau de partenaires professionnels',
            searchPlaceholder: 'Rechercher par nom, secteur ou ville...',
            partner: 'Partenaire',
            visitWebsite: 'Visiter le site web',
            noCompanies: 'Aucune entreprise trouvée',
            noCompaniesSubtitle: 'Essayez de rechercher autre chose',
            add: 'Ajouter une entreprise',
            edit: 'Modifier l\'entreprise',
            name: 'Nom de l\'entreprise',
            industry: 'Secteur d\'activité',
            location: 'Lieu',
            website: 'Site web',
            confirmDelete: 'Êtes-vous sûr de vouloir supprimer cette entreprise ?'
        },
        friends: {
            title: 'Amis',
            tabs: { mine: 'Mes Amis', requests: 'Demandes' },
            message: 'Message',
            noFriends: 'Pas encore d\'amis. Connectez-vous avec d\'autres élèves !',
            sentRequest: 'Vous a envoyé une demande d\'ami',
            accept: 'Accepter',
            reject: 'Refuser',
            noRequests: 'Aucune demande en attente.',
            acceptedAlert: 'Demande d\'ami acceptée !',
            rejectedAlert: 'Demande d\'ami refusée',
            failedAlert: 'Échec du traitement de la demande'
        },
        search: {
            title: 'Trouver des gens',
            placeholder: 'Rechercher par nom ou e-mail...',
            loading: 'Chargement...',
            viewProfile: 'Voir le profil',
            sentSuccess: 'Demande d\'ami envoyée avec succès !',
            noResults: 'Aucun utilisateur trouvé correspondant à votre recherche.'
        },
        messages: {
            title: 'Messages',
            createGroup: 'Créer un groupe',
            newGroup: 'Nouveau groupe',
            groupName: 'Nom du groupe',
            searchPlaceholder: 'Rechercher par nom ou e-mail...',
            filterDomain: 'Filtrer par Domaine',
            allDomains: 'Tous les Domaines',
            selectMembers: 'Sélectionner les membres',
            loadingUsers: 'Chargement des utilisateurs...',
            clickToChat: 'Cliquez pour discuter',
            members: 'membres',
            online: 'En ligne',
            addPeople: 'Ajouter des personnes',
            typeMessage: 'Tapez un message...',
            selectConv: 'Sélectionnez une conversation pour commencer',
            groupCreated: 'Groupe créé avec succès avec'
        },
        charts: {
            entryYear: "Étudiants par Année d'Entrée",
            promotion: 'Diplômés par Promotion',
            growth: 'Croissance de la Communauté',
            students: 'Étudiants',
            graduates: 'Diplômés'
        },
        events: {
            title: 'Événements à venir',
            subtitle: 'Participez à des événements, des défis et des concours pour améliorer vos compétences et vous connecter avec vos pairs.',
            viewAll: 'Voir tous les événements',
            learnMore: 'En savoir plus',
            viewDetails: 'Voir les détails',
            create: 'CRÉER UN ÉVÉNEMENT',
            createNew: 'Créer un nouvel événement',
            form: {
                title: 'Titre',
                date: 'Date',
                location: 'Lieu',
                locationPlaceholder: 'ex: Amphithéâtre A',
                description: 'Description',
                uploadPhoto: 'Télécharger une photo (depuis votre PC)',
                imageUrl: 'URL de l\'image',
                urlPlaceholder: 'https://images.unsplash.com/photo...',
                orUrl: 'OU entrez une URL d\'image ci-dessous',
                cancel: 'Annuler',
                submit: 'Créer l\'événement'
            },
            success: 'Événement créé avec succès !',
            failed: 'Échec de la création de l\'événement',
            organizedBy: 'Organisé par',
            noEvents: 'Aucun événement trouvé',
            noEventsSubtitle: 'Revenez plus tard pour les événements et défis à venir.',
            close: 'Fermer',
            upcomingTerm: 'À venir ce trimestre'
        },
        cta: {
            title: 'Prêt à rejoindre la communauté SupNum ?',
            subtitle: "Connectez-vous avec d'autres diplômés, accédez à des opportunités exclusives et faites partie de la prochaine génération de leaders technologiques en Mauritanie.",
            button: "Rejoindre maintenant – C'est gratuit"
        },
        footer: {
            rights: 'Tous droits réservés.'
        }
    },
    AR: {
        nav: {
            home: 'الرئيسية',
            events: 'الأحداث',
            about: 'حول',
            signin: 'تسجيل الدخول',
            signup: 'إنشاء حساب',
            internships: 'الفرص',
            companies: 'الشركات',
            logout: 'تسجيل الخروج'
        },
        dashboard: {
            nav: { dashboard: 'لوحة التحكم', profile: 'الملف الشخصي', users: 'المستخدمين', friends: 'الأصدقاء', messages: 'الرسائل', myOffers: 'عروضي' },
            welcome: 'مرحبًا،',
            welcomeSubtitle: 'إليك ما يحدث في شبكة SupNum الخاصة بك.',
            stats: { totalUsers: 'إجمالي المستخدمين', friends: 'أصدقاؤك', pending: 'طلبات معلقة', growth: 'هذا الشهر' },
            quickLinks: { findUsers: 'البحث عن مستخدمين', messages: 'الرسائل', events: 'الأحداث', viewProfile: 'عرض الملف الشخصي' },
            friendRequests: 'طلبات الصداقة',
            suggestions: 'اقتراحات التواصل',
            viewMore: 'عرض المزيد',
            bonRetour: 'مرحبًا بعودتك!',
            connectedSuccess: 'تم تسجيل الدخول بنجاح.'
        },
        admin: {
            nav: { dashboard: 'لوحة التحكم', events: 'إدارة الأحداث', users: 'إدارة المستخدمين' },
            welcome: 'لوحة تحكم المسؤول',
            subtitle: 'إدارة منصة SupNum Connect الخاصة بك.',
            stats: { totalUsers: 'إجمالي المستخدمين', students: 'الخريجين القدامى', graduates: 'الخريجين الجدد' },
            charts: { userGrowth: 'نمو المستخدمين', students: 'الخريجين القدامى', graduates: 'الخريجين الجدد', opportunitiesPosted: 'إنشاء عرض' },
            events: { title: 'الأحداث الأخيرة', create: 'إنشاء حدث', edit: 'تعديل', delete: 'حذف', learnMore: 'المزيد' },
            users: {
                title: 'إدارة المستخدمين',
                search: 'البحث عن مستخدمين...',
                role: 'الدور',
                actions: 'إجراءات',
                remove: 'إزالة',
                export: 'تصدير CSV',
                add: 'إضافة مستخدم',
                addUser: 'إضافة مستخدم جديد',
                allStatus: 'كل الحالات',
                verified: 'موثق',
                pending: 'قيد الانتظار',
                suspended: 'موقوف',
                approve: 'موافقة',
                firstName: 'الاسم الأول',
                lastName: 'اللقب',
                email: 'البريد الإلكتروني',
                password: 'كلمة المرور',
                user: 'مستخدم',
                status: 'الحالة',
                confirmDelete: 'هل أنت متأكد من رغبتك في إزالة هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.'
            }
        },
        profile: {
            title: 'ملفي الشخصي',
            basicInfo: 'المعلومات الأساسية',
            fullName: 'الاسم الكامل',
            supnumId: 'معرف SupNum',
            phone: 'رقم الهاتف',
            birthday: 'تاريخ الميلاد',
            bio: 'نبذة عني',
            bioPlaceholder: 'أخبرنا عن نفسك...',
            role: 'الدور',
            socialLinks: 'روابط التواصل الاجتماعي',
            saveChanges: 'حفظ التغييرات',
            saving: 'جاري الحفظ...',
            saveSuccess: 'تم حفظ التغييرات بنجاح!',
            uploadPhoto: 'رفع صورة',
            student: 'خريج سابق',
            graduate: 'خريج',
            admin: 'مسؤول',
            mentor: 'مرشد',
            mentoringProgram: 'برنامج الإرشاد',
            mentoringDesc: 'بتفعيل هذا الخيار، ستظهر كـ "مرشد" متاح لمساعدة الطلاب.',
            professionalInfo: 'المعلومات المهنية',
            currentStatus: 'الحالة الحالية',
            selectStatus: 'اختر الحالة',
            employed: 'موظف',
            seeking: 'يبحث عن فرص',
            studying: 'يواصل دراسته',
            freelance: 'عمل حر',
            jobTitle: 'المسمى الوظيفي',
            company: 'الشركة / المنظمة',
            documents: 'المستندات',
            myDocuments: 'مستنداتي',
            cv: 'السيرة الذاتية (CV)',
            cvLoaded: 'تم تحميل السيرة الذاتية بنجاح',
            noCv: 'لم يتم تحميل سيرة ذاتية',
            viewCv: 'عرض سيرتي الذاتية',
            changeCv: 'تغيير السيرة الذاتية',
            addCv: 'إضافة سيرة ذاتية',
            acceptedFormats: 'الصيغ المقبولة: PDF, Word. الحد الأقصى 5 ميجابايت.',
            availableMentoring: 'متاح للإرشاد',
            unavailableMentoring: 'غير متاح حاليًا للإرشاد',
            edit: 'تعديل الملف الشخصي',
            cancel: 'إلغاء'
        },
        applications: {
            title: 'طلباتي',
            subtitle: 'تتبع حالة طلبات التدريب الخاصة بك',
            noApps: 'لا توجد طلبات بعد',
            noAppsSubtitle: 'ابدأ باستكشاف التدريبات وقدم طلباتك للبدء!',
            appliedOn: 'تم التقديم في',
            motivation: 'رسالة التحفيز',
            myCv: 'سيرتي الذاتية',
            status: {
                pending: 'قيد الانتظار',
                accepted: 'مقبول',
                rejected: 'مرفوض'
            },
            remote: 'عن بعد'
        },
        about: {
            title: 'عن SupNum Connect',
            subtitle: 'SupNum Connect هي الشبكة الاجتماعية الأكاديمية الرسمية للمعهد العالي للرقمنة (SupNum).',
            mission: {
                title: 'مهمتنا',
                desc: 'إنشاء مجتمع حيوي ومترابط حيث يمكن للطلاب والخريجين والمسؤولين التعاون وتبادل المعرفة والنمو معًا. نحن نؤمن بقوة التواصل لفتح فرص جديدة وتعزيز التميز الأكاديمي.'
            },
            goals: {
                title: 'الأهداف الرئيسية',
                items: [
                    'ربط الطلاب الحاليين بالخريجين',
                    'تسهيل الإرشاد والتوجيه',
                    'مركزية أحداث وأخبار الحرم الجامعي',
                    'عرض إنجازات الطلاب'
                ]
            },
            cta: {
                title: 'بني من قبل الطلاب، للطلاب',
                desc: 'تم إنشاء هذه المنصة كمشروع من قبل طلاب SupNum، مما يبرز المهارات التقنية والابتكار الذي يتم تعزيزه في معهدنا.',
                founded: 'تأسس في',
                institute: 'المعهد'
            }
        },
        auth: {
            signIn: {
                title: 'تسجيل الدخول',
                subtitle: 'الوصول إلى منطقة الأعضاء الخاصة بك',
                email: 'البريد الإلكتروني',
                password: 'كلمة المرور',
                forgot: 'نسيت؟',
                button: 'تسجيل الدخول',
                noAccount: "جديد في SupNum Connect؟",
                createAccount: "إنشاء حساب",
                error: 'حدث خطأ غير متوقع',
                placeholder: {
                    email: 'your.email@supnum.mr'
                }
            },
            signUp: {
                title: 'إنشاء حسابك',
                subtitle: 'ابدأ رحلتك مع SupNum Connect اليوم',
                firstName: 'الاسم الأول',
                lastName: 'اللقب',
                email: 'البريد الإلكتروني',
                password: 'كلمة المرور',
                role: 'الدور',
                button: 'إنشاء حساب',
                haveAccount: 'لديك حساب بالفعل؟',
                signIn: 'تسجيل الدخول',
                benefits: {
                    title: 'انضم إلى شبكة النخبة من خريجي SupNum.',
                    items: [
                        'التواصل مع الأقران وقادة الصناعة',
                        'الوصول إلى فرص عمل وتدريب حصرية',
                        'المشاركة في الأحداث والورش المهنية',
                        'إرشاد الجيل القادم من الطلاب'
                    ]
                }
            }
        },
        userProfile: {
            viewProfile: 'عرض الملف الشخصي العام',
            message: 'إرسال رسالة',
            connecting: 'جاري الاتصال...',
            connected: 'متصل',
            mutual: 'أصدقاء مشتركين',
            about: 'حول',
            experience: 'الخبرة',
            contact: 'معلومات الاتصال',
            back: 'العودة للبحث',
            requestSent: 'تم إرسال الطلب',
            connect: 'تواصل',
            academicInfo: 'المعلومات الأكاديمية',
            department: 'القسم',
            entryYear: 'سنة الالتحاق',
            cs: 'علوم الحاسوب',
            noBio: "لم يكتب هذا المستخدم نبذة شخصية بعد.",
            noSocial: 'لا توجد روابط تواصل اجتماعي عامة.',
            viewSocial: 'الملف الشخصي',
            socialProfiles: 'الملفات الاجتماعية',
            notFound: 'المستخدم غير موجود',
            loadError: 'فشل تحميل ملف المستخدم'
        },
        hero: {
            welcome: 'مرحبًا بكم في مجتمع SupNum',
            title: 'تواصل، تعلم وتطور مع',
            subtitle: 'الشبكة الاجتماعية الرسمية لخريجي المعهد العالي للرقمنة. ابنِ علاقات، شارك في الأحداث، وطور مسارك المهني.',
            getStarted: 'ابدأ الآن',
            learnMore: 'المزيد'
        },
        stats: {
            community: 'مجتمعنا المتنامي',
            communityDesc: 'انضم إلى آلاف الخريجين من SupNum الذين يبنون مستقبل التكنولوجيا في موريتانيا.',
            totalUsers: 'إجمالي المستخدمين',
            students: 'الخريجين القدامى',
            graduates: 'الخريجين الجدد',
            events: 'الأحداث',
            challenges: 'التحديات',
            contests: 'المسابقات'
        },
        opportunities: {
            title: 'الفرص والشركاء',
            subtitle: 'تواصل مع أفضل الشركات وابحث عن خطوتك المهنية التالية.',
            partners: 'الشركات الشريكة',
            active: 'التدريبات النشطة',
            latest: 'أحدث الفرص',
            view: 'عرض',
            apply: 'تقديم'
        },
        internships: {
            title: 'التدريبات والوظائف',
            subtitle: 'اكتشف فرصتك التالية',
            searchPlaceholder: 'البحث عن طريق العنوان أو الشركة...',
            allTypes: 'كل الأنواع',
            internship: 'تدريب',
            job: 'وظيفة',
            details: 'التفاصيل',
            apply: 'تقديم',
            noOffers: 'لم يتم العثور على عروض',
            noOffersSubtitle: 'حاول تعديل بحثك أو الفلاتر',
            applyRole: 'التقديم للوظيفة',
            applicationSent: 'تم إرسال الطلب!',
            applicationSentDesc: 'تم تقديم سيرتك الذاتية بنجاح إلى',
            uploadCV: 'رفع السيرة الذاتية (PDF/Word)',
            uploadDesc: 'انقر أو اسحب لرفع سيرتك الذاتية',
            uploadLimit: 'PDF, DOC, DOCX حتى 5 ميجابايت',
            messagePlaceholder: 'لماذا أنت مناسب لهذا الدور؟',
            cancel: 'إلغاء',
            submit: 'إرسال الطلب',
            submitting: 'جاري الإرسال...',
            jobTitle: 'عنوان الوظيفة',
            company: 'الشركة',
            location: 'الموقع',
            type: 'النوع',
            activeListing: 'عرض نشط',
            placeholder: {
                jobTitle: 'مثال: مهندس برمجيات',
                company: 'مثال: شركة تقنية',
                location: 'مثال: نواكشوط'
            }
        },
        companies: {
            title: 'الشركات الشريكة',
            subtitle: 'شبكة شركائنا المهنيين',
            searchPlaceholder: 'البحث عن طريق الاسم أو القطاع أو المدينة...',
            partner: 'شريك',
            visitWebsite: 'زيارة الموقع',
            noCompanies: 'لم يتم العثور على شركات',
            noCompaniesSubtitle: 'حاول البحث عن شيء آخر',
            add: 'إضافة شركة',
            edit: 'تعديل الشركة',
            name: 'اسم الشركة',
            industry: 'المجال',
            location: 'الموقع',
            website: 'الموقع الإلكتروني',
            confirmDelete: 'هل أنت متأكد من رغبتك في إزالة هذه الشركة؟'
        },
        friends: {
            title: 'الأصدقاء',
            tabs: { mine: 'أصدقائي', requests: 'الطلبات' },
            message: 'رسالة',
            noFriends: 'لا يوجد أصدقاء بعد. تواصل مع الآخرين!',
            sentRequest: 'أرسل لك طلب صداقة',
            accept: 'قبول',
            reject: 'رفض',
            noRequests: 'لا توجد طلبات معلقة.',
            acceptedAlert: 'تم قبول طلب الصداقة!',
            rejectedAlert: 'تم رفض طلب الصداقة',
            failedAlert: 'فشل معالجة الطلب'
        },
        search: {
            title: 'البحث عن مستخدمين',
            placeholder: 'البحث بالاسم أو البريد الإلكتروني...',
            loading: 'جاري التحميل...',
            viewProfile: 'عرض الملف الشخصي',
            sentSuccess: 'تم إرسال طلب الصداقة بنجاح!',
            noResults: 'لم يتم العثور على مستخدمين يطابقون بحثك.'
        },
        messages: {
            title: 'الرسائل',
            createGroup: 'إنشاء مجموعة',
            newGroup: 'مجموعة جديدة',
            groupName: 'اسم المجموعة',
            searchPlaceholder: 'البحث بالاسم أو البريد الإلكتروني...',
            filterDomain: 'تصفية حسب المجال',
            allDomains: 'كل المجالات',
            selectMembers: 'اختر الأعضاء',
            loadingUsers: 'جاري تحميل المستخدمين...',
            clickToChat: 'انقر للدردشة',
            members: 'أعضاء',
            online: 'متصل',
            addPeople: 'إضافة أشخاص للدردشة',
            typeMessage: 'اكتب رسالة...',
            selectConv: 'اختر محادثة لبدء المراسلة',
            groupCreated: 'تم إنشاء المجموعة بنجاح مع'
        },
        charts: {
            entryYear: 'الطلاب حسب سنة الالتحاق',
            promotion: 'الخريجين حسب الدفعة',
            growth: 'نمو المجتمع عبر السنوات',
            students: 'الطلاب',
            graduates: 'الخريجين'
        },
        events: {
            title: 'الأحداث القادمة',
            subtitle: 'شارك في الأحداث، التحديات، والمسابقات لتعزيز مهاراتك والتواصل مع أقرانك.',
            viewAll: 'عرض كل الأحداث',
            learnMore: 'اعرف المزيد',
            viewDetails: 'عرض التفاصيل',
            create: 'إنشاء حدث',
            createNew: 'إنشاء حدث جديد',
            form: {
                title: 'العنوان',
                date: 'التاريخ',
                location: 'الموقع',
                locationPlaceholder: 'مثال: المدرج أ',
                description: 'الوصف',
                uploadPhoto: 'رفع صورة (من جهازك)',
                imageUrl: 'رابط الصورة',
                urlPlaceholder: 'https://images.unsplash.com/photo...',
                orUrl: 'أو أدخل رابط الصورة أدناه',
                cancel: 'إلغاء',
                submit: 'إنشاء الحدث'
            },
            success: 'تم إنشاء الحدث بنجاح!',
            failed: 'فشل إنشاء الحدث',
            organizedBy: 'منظم من قبل',
            noEvents: 'لم يتم العثور على أحداث',
            noEventsSubtitle: 'عد لاحقًا للأحداث والتحديات القادمة.',
            close: 'إغلاق',
            upcomingTerm: 'القادم هذا الفصل'
        },
        cta: {
            title: 'مستعد للانضمام إلى مجتمع SupNum؟',
            subtitle: 'تواصل مع زملائك الخريجين، احصل على فرص حصرية، وكن جزءًا من الجيل القادم من قادة التكنولوجيا في موريتانيا.',
            button: 'انضم الآن – مجانًا'
        },
        footer: {
            rights: 'جميع الحقوق محفوظة.'
        }
    }
};

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('FR');
    const [theme, setTheme] = useState('light');

    const t = translations[language];

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, theme, toggleTheme }}>
            <div dir={language === 'AR' ? 'rtl' : 'ltr'} className={language === 'AR' ? 'font-arabic' : ''}>
                {children}
            </div>
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);
