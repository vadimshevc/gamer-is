import React, { useState } from 'react';
/**
 * Компонент презентаційної сторінки (Лендінгу).
 * @param {object} props - Властивості компонента.
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
        <nav role="navigation" aria-label={t.navLabel} className="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="font-black text-xl text-white italic tracking-tighter">
            GamerIS <span className="text-indigo-500 underline decoration-indigo-500 underline-offset-4">Cloud</span>
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
      <main role="main" aria-label={t.mainRole} className="max-w-[1400px] mx-auto px-6 py-20">

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

        <section aria-label="Методологія та Об'єкт" className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-32">

          {/* Блок 1: Об'єкт дослідження */}
          <div className="p-8 lg:p-12 bg-[#111319] rounded-3xl border border-white/5 flex flex-col justify-between shadow-2xl">
            <div>
              <h3 className="text-indigo-500 font-bold mb-4 lg:mb-6 uppercase text-base lg:text-lg tracking-widest">
                // {lang === 'UA' ? 'Об\'єкт дослідження' : 'Research Object'}
              </h3>
              <p className="text-slate-300 text-base lg:text-lg leading-relaxed">
                {t.researchObject}
              </p>
            </div>

            {/* Візуалізація об'єкта: Збільшений Моніторинг */}
            <div className="mt-8 lg:mt-10 aspect-video bg-[#0a0b10] rounded-2xl border border-white/5 p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 lg:w-64 lg:h-64 bg-indigo-500/[0.03] rounded-full blur-3xl"></div>

              {/* Верхня панель */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                  <span className="text-sm lg:text-base font-mono text-slate-400 uppercase tracking-wider">Automation Core</span>
                </div>
                <span className="text-xs lg:text-sm font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded border border-indigo-500/20">LIVE_SYNC</span>
              </div>

              {/* Центральний блок графіка */}
              <div className="flex-grow flex items-end gap-2 pt-6 pb-4 px-2">
                <div className="w-full bg-white/[0.02] h-full rounded-xl border border-white/5 p-4 flex items-center justify-between">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs lg:text-sm text-slate-500 uppercase font-mono tracking-wider">Process Stream</span>
                    <span className="text-base lg:text-xl font-mono text-slate-200 font-medium">Inventory & Customers</span>
                  </div>

                  {/* Збільшений Еквалайзер процесів */}
                  <div className="flex items-end gap-2 lg:gap-3 h-12 lg:h-16">
                    <div className="w-2 lg:w-3 bg-indigo-500/40 h-6 lg:h-8 rounded-full animate-[pulse_1.2s_infinite_100ms]"></div>
                    <div className="w-2 lg:w-3 bg-indigo-500 h-10 lg:h-14 rounded-full animate-[pulse_1.2s_infinite_300ms]"></div>
                    <div className="w-2 lg:w-3 bg-indigo-500/70 h-4 lg:h-6 rounded-full animate-[pulse_1.2s_infinite_500ms]"></div>
                    <div className="w-2 lg:w-3 bg-indigo-500 h-8 lg:h-12 rounded-full animate-[pulse_1.2s_infinite_200ms]"></div>
                  </div>
                </div>
              </div>

              {/* Нижня метрика */}
              <div className="flex items-center justify-between text-sm lg:text-base font-mono text-slate-500 border-t border-white/5 pt-4">
                <span>ERR_RATE: <span className="text-slate-300">0.00%</span></span>
                <span className="text-emerald-500/80">STATUS: OPTIMAL</span>
              </div>
            </div>
          </div>

          {/* Блок 2: Методологія */}
          <div className="p-8 lg:p-12 bg-[#111319] rounded-3xl border border-white/5 flex flex-col justify-between shadow-2xl">
            <div>
              <h3 className="text-indigo-500 font-bold mb-4 lg:mb-6 uppercase text-base lg:text-lg tracking-widest">
                // {lang === 'UA' ? 'Методологія' : 'Methodology'}
              </h3>
              <p className="text-slate-300 text-base lg:text-lg leading-relaxed">
                {t.methodology}
              </p>
            </div>

            {/* Візуалізація методології: Збільшена схема */}
            <div className="mt-8 lg:mt-10 aspect-video bg-[#0a0b10] rounded-2xl border border-white/5 p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-48 h-48 lg:w-64 lg:h-64 bg-blue-500/[0.03] rounded-full blur-3xl"></div>

              {/* Верхній заголовок схеми */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-blue-400 text-sm lg:text-base font-mono">⚛️ React UI approach</span>
                <span className="text-amber-500 text-sm lg:text-base font-mono">🔥 Firebase Live Data</span>
              </div>

              {/* Збільшена Модель потоку даних */}
              <div className="flex-grow flex items-center justify-center gap-6 lg:gap-8 py-4">
                {/* Компонентне дерево */}
                <div className="flex flex-col gap-2.5 p-3 lg:p-4 bg-white/[0.02] border border-white/5 rounded-2xl w-32 lg:w-40 shadow-lg">
                  <div className="h-2.5 lg:h-3 w-12 lg:w-16 bg-blue-500/40 rounded-full"></div>
                  <div className="flex gap-2">
                    <div className="h-8 lg:h-10 flex-1 bg-[#1a1d27] border border-white/5 rounded-lg flex items-center justify-center text-xs lg:text-sm font-mono text-slate-400">Node</div>
                    <div className="h-8 lg:h-10 flex-1 bg-[#1a1d27] border border-white/5 rounded-lg flex items-center justify-center text-xs lg:text-sm font-mono text-slate-400">Node</div>
                  </div>
                </div>

                {/* Зв'язок */}
                <div className="flex flex-col items-center">
                  <div className="w-12 lg:w-16 h-[2px] bg-gradient-to-r from-blue-500 to-amber-500 relative">
                    <div className="absolute -top-1.5 right-0 w-3 h-3 rounded-full bg-amber-400 animate-ping opacity-75"></div>
                    <div className="absolute -top-1 right-0.5 w-2 h-2 rounded-full bg-amber-300"></div>
                  </div>
                  <span className="text-xs lg:text-sm font-mono text-slate-500 mt-2.5 uppercase tracking-widest">Realtime</span>
                </div>

                {/* Документ бази */}
                <div className="p-3 lg:p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex flex-col gap-2 w-28 lg:w-36 font-mono text-xs lg:text-sm shadow-lg">
                  <span className="text-amber-400/90 font-bold border-b border-amber-500/20 pb-2">NoSQL Doc</span>
                  <span className="text-slate-300 pt-1">{"{ listen: true }"}</span>
                </div>
              </div>

              {/* Збільшений блок університету СумДУ */}
              <div className="flex items-center justify-center gap-4 text-sm lg:text-base font-mono text-slate-500 border-t border-white/5 pt-4">
                <span className="text-2xl lg:text-3xl">🏛️</span>
                <span className="uppercase tracking-widest text-slate-300 font-bold text-center">
                  {t.university}
                </span>
              </div>
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
      </main >

      {/* Footer із вказанням ролі contentinfo */}
      <footer footer role="contentinfo" className="py-12 text-center border-t border-white/5" >
        <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.5em]">
          Vadym Shevchenko | 2026
        </p>
      </footer >
    </div >
  );
};

export default Landing;