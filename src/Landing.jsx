import React, { useState } from 'react';

/**
 * Компонент презентаційної сторінки (Лендінгу).
 * * @param {object} props - Властивості компонента.
 * @param {() => void} props.onStart - Функція, що викликається при натисканні на кнопку.
 * @returns {React.JSX.Element} Повертає візуальну структуру лендінгу.
 */

const Landing = ({ onStart }) => {
  const [lang, setLang] = useState('UA');

  const content = {
    UA: {
      topic: "Інформаційна система геймерського магазину",
      description: "Трирівнева архітектура: Google Sheets → Firebase → React",
      goal: "Мета: Автоматизація обліку та продажів через безсерверну хмарну інфраструктуру та AI.",
      archTitle: "Технічна архітектура",
      navLabel: "Головна навігація",
      langBtnLabel: "Змінити мову на англійську",
      mainRole: "Основний вміст",
      cards: [
        { icon: "📑", title: "Admin Panel", desc: "Google Sheets (Low-Code)" },
        { icon: "⚙️", title: "Middleware", desc: "Apps Script + Gemini AI" },
        { icon: "🔥", title: "Cloud Data", desc: "Firebase Firestore NoSQL" },
        { icon: "⚛️", title: "Frontend UI", desc: "React + Tailwind CSS" }
      ],
      btn: "Відкрити Проєкт",
      methodology: "Методологія: Використання компонентного підходу React для UI та сервісів Firebase для обробки даних у реальному часі.",
      researchObject: "Об'єкт дослідження: Процеси автоматизації обліку товарів та взаємодії з клієнтами в ігровій індустрії.",
      university: "Сумський державний університет"
    },
    EN: {
      topic: "Gamer Store Information System",
      description: "3-Tier Architecture: Google Sheets → Firebase → React",
      goal: "Goal: Automation of accounting and sales via serverless cloud and AI.",
      archTitle: "Technical Architecture",
      navLabel: "Main navigation",
      langBtnLabel: "Change language to Ukrainian",
      mainRole: "Main content",
      cards: [
        { icon: "📑", title: "Admin Panel", desc: "Google Sheets (Low-Code)" },
        { icon: "⚙️", title: "Middleware", desc: "Apps Script + Gemini AI" },
        { icon: "🔥", title: "Cloud Data", desc: "Firebase Firestore NoSQL" },
        { icon: "⚛️", title: "Frontend UI", desc: "React + Tailwind CSS" }
      ],
      btn: "Launch Project",
      methodology: "Methodology: Using React component-based UI and Firebase services for real-time data processing.",
      researchObject: "Research Object: Automation of inventory accounting and customer interaction in the gaming industry.",
      university: "Sumy State University"
    }
  };

  const t = content[lang];

  return (
    <div className="min-h-screen bg-[#0a0b10] scroll-smooth text-slate-300 font-sans selection:bg-indigo-500/30">
      {/* Header із вказанням ролі banner */}
      <header role="banner" className="border-b border-white/5 bg-[#0a0b10]/80 backdrop-blur-md sticky top-0 z-50">
        <nav role="navigation" aria-label={t.navLabel} className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="font-black text-xl text-white italic tracking-tighter">
            GamerIS <span className="text-indigo-500 underline decoration-indigo-500 underline-offset-4">PRO</span>
          </h1>
          <button 
            onClick={() => setLang(lang === 'UA' ? 'EN' : 'UA')}
            aria-label={t.langBtnLabel}
            className="text-[10px] font-black border border-indigo-500/50 px-4 py-1.5 rounded-full text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all tracking-widest"
          >
            {lang} VERSION
          </button>
        </nav>
      </header>

      {/* Main із вказанням ролі main */}
      <main role="main" aria-label={t.mainRole} className="max-w-6xl mx-auto px-6 py-20">
        
        {/* Hero Section із зв'язком через aria-labelledby */}
        <section aria-labelledby="hero-heading" className="text-center mb-32">
          <div className="inline-block px-4 py-1 mb-8 text-[10px] font-black tracking-[0.3em] text-indigo-400 uppercase bg-indigo-950/20 border border-indigo-900/50 rounded-full">
            Bachelor Thesis Project // 2026
          </div>
          <h2 id="hero-heading" className="text-5xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tighter">
            {t.topic}
          </h2>
          <p className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed italic">{t.goal}</p>
          <button 
            onClick={onStart}
            aria-label={lang === 'UA' ? "Запустити інформаційну систему" : "Start information system"}
            className="group relative bg-indigo-600 text-white px-12 py-6 rounded-2xl font-black text-xl shadow-[0_0_40px_-5px_rgba(79,70,229,0.5)] hover:bg-indigo-500 transition-all duration-300 hover:-translate-y-1"
          >
            {t.btn}
            <span aria-hidden="true" className="inline-block ml-3 group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </section>

        {/* Architecture Grid із семантичною назвою */}
        <section aria-label={t.archTitle}>
          <h3 id="arch-title" className="text-center text-xs font-black uppercase tracking-[0.5em] text-slate-600 mb-12">
            {t.archTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
            {t.cards.map((card, i) => (
              <article 
                key={i} 
                className="bg-[#111319] p-8 rounded-[2rem] border border-white/5 hover:border-indigo-500/40 transition-all group"
              >
                <div aria-hidden="true" className="text-5xl mb-6 bg-[#0a0b10] w-16 h-16 flex items-center justify-center rounded-2xl border border-white/5 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.2)] transition-all">
                  {card.icon}
                </div>
                <h4 className="text-white font-bold mb-2 tracking-tight">{card.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium uppercase tracking-wider">{card.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-label="Методологія та Об'єкт" className="grid md:grid-cols-2 gap-8 mb-32">
          <div className="p-8 bg-[#111319] rounded-3xl border border-white/5">
            <h3 className="text-indigo-500 font-bold mb-4 uppercase text-xs tracking-widest">// {lang === 'UA' ? 'Об\'єкт дослідження' : 'Research Object'}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{t.researchObject}</p>
            {/* Placeholder для фото об'єкта */}
            <div className="mt-6 aspect-video bg-[#0a0b10] rounded-xl border border-dashed border-slate-700 flex items-center justify-center text-slate-600 text-xs">
              [ Фото / Графік системи ]
            </div>
          </div>
          
          <div className="p-8 bg-[#111319] rounded-3xl border border-white/5">
            <h3 className="text-indigo-500 font-bold mb-4 uppercase text-xs tracking-widest">// {lang === 'UA' ? 'Методологія' : 'Methodology'}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{t.methodology}</p>
            {/* Placeholder для логотипу університету */}
            <div className="mt-6 h-20 bg-white/5 rounded-xl flex items-center justify-center gap-3">
              <span className="text-2xl opacity-50">🏛️</span>
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">{t.university}</span>
            </div>
          </div>
        </section>

        {/* Technical Footer як допоміжна інформація */}
        <section role="complementary" aria-label="Технічні деталі" className="bg-indigo-950/10 border border-indigo-500/10 p-10 rounded-[2.5rem] text-center">
            <p className="text-sm font-medium italic text-slate-500">
               {lang === 'UA' ? "Стек: React 18, Vite, Tailwind CSS, Vitest, Google Apps Script, Firebase Firestore." 
               : "Stack: React 18, Vite, Tailwind CSS, Vitest, Google Apps Script, Firebase Firestore."}
            </p>
        </section>
      </main>

      {/* Footer із вказанням ролі contentinfo */}
      <footer role="contentinfo" className="py-12 text-center border-t border-white/5">
        <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.5em]">
          Vadym Shevchenko | 2026
        </p>
      </footer>
    </div>
  );
};

export default Landing;