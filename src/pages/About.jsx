import { useLanguage } from '../context/LanguageContext';

export function About() {
    const { t } = useLanguage();
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold text-center mb-8 text-slate-900 dark:text-white">{t.about.title}</h1>
            <div className="prose prose-slate dark:prose-invert mx-auto lg:prose-lg">
                <p className="lead text-xl text-slate-600 dark:text-slate-300 text-center mb-12">
                    {t.about.subtitle}
                </p>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{t.about.mission.title}</h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            {t.about.mission.desc}
                        </p>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-2xl">
                        <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{t.about.goals.title}</h3>
                        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
                            {t.about.goals.items.map((goal, i) => (
                                <li key={i}>{goal}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="bg-supnum-blue text-white p-12 rounded-3xl text-center shadow-xl">
                    <h2 className="text-3xl font-bold mb-6">{t.about.cta.title}</h2>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                        {t.about.cta.desc}
                    </p>
                    <div className="mt-8 pt-8 border-t border-blue-400/30 flex justify-center space-x-12">
                        <div>
                            <div className="text-3xl font-bold">2024</div>
                            <div className="text-blue-200 text-sm">{t.about.cta.founded}</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold">SupNum</div>
                            <div className="text-blue-200 text-sm">{t.about.cta.institute}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
