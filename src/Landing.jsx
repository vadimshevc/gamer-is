import React, { useState } from 'react';

const Landing = ({ onStart }) => {
  const [lang, setLang] = useState('UA');

  const content = {
    UA: {
      topic: "Інформаційна система геймерського магазину",
      description: "Трирівнева архітектура: Google Sheets → Firebase → React",
      goal: "Мета: Автоматизація обліку та продажів через безсерверну хмарну інфраструктуру та AI.",
      archTitle: "Технічна архітектура",
      cards: [
        { icon: "📑", title: "Admin Panel", desc: "Google Sheets (Low-Code)" },
        { icon: "⚙️", title: "Middleware", desc: "Apps Script + Gemini AI" },
        { icon: "🔥", title: "Cloud Data", desc: "Firebase Firestore NoSQL" },
        { icon: "⚛️", title: "Frontend UI", desc: "React + Tailwind CSS" }
      ],
      btn: "Відкрити Проєкт"
    },
    EN: {
      topic: "Gamer Store Information System",
      description: "3-Tier Architecture: Google Sheets → Firebase → React",
      goal: "Goal: Automation of accounting and sales via serverless cloud and AI.",
      archTitle: "Technical Architecture",
      cards: [
        { icon: "📑", title: "Admin Panel", desc: "Google Sheets (Low-Code)" },
        { icon: "⚙️", title: "Middleware", desc: "Apps Script + Gemini AI" },
        { icon: "🔥", title: "Cloud Data", desc: "Firebase Firestore NoSQL" },
        { icon: "⚛️", title: "Frontend UI", desc: "React + Tailwind CSS" }
      ],
      btn: "Launch Project"
    }
  };

  const t = content[lang];

  return (
    <div className="min-h-screen bg-[#0a0b10] text-slate-300 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0a0b10]/80 backdrop-blur-md sticky top-0 z-50">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="font-black text-xl text-white italic tracking-tighter">GamerIS <span className="text-indigo-500 underline decoration-indigo-500 underline-offset-4">PRO</span></h1>
          <button 
            onClick={() => setLang(lang === 'UA' ? 'EN' : 'UA')}
            className="text-[10px] font-black border border-indigo-500/50 px-4 py-1.5 rounded-full text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all tracking-widest"
          >
            {lang} VERSION
          </button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* Hero */}
        <section className="text-center mb-32">
          <div className="inline-block px-4 py-1 mb-8 text-[10px] font-black tracking-[0.3em] text-indigo-400 uppercase bg-indigo-950/20 border border-indigo-900/50 rounded-full">
            Bachelor Thesis Project // 2026
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tighter">
            {t.topic}
          </h2>
          <p className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">{t.goal}</p>
          <button 
            onClick={onStart}
            className="group relative bg-indigo-600 text-white px-12 py-6 rounded-2xl font-black text-xl shadow-[0_0_40px_-5px_rgba(79,70,229,0.5)] hover:bg-indigo-500 transition-all duration-300 hover:-translate-y-1"
          >
            {t.btn}
            <span className="inline-block ml-3 group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </section>

        {/* Architecture Grid */}
        <h3 className="text-center text-xs font-black uppercase tracking-[0.5em] text-slate-600 mb-12">{t.archTitle}</h3>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          {t.cards.map((card, i) => (
            <div key={i} className="bg-[#111319] p-8 rounded-[2rem] border border-white/5 hover:border-indigo-500/40 transition-all group">
              <div className="text-5xl mb-6 bg-[#0a0b10] w-16 h-16 flex items-center justify-center rounded-2xl border border-white/5 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.2)] transition-all">{card.icon}</div>
              <h4 className="text-white font-bold mb-2 tracking-tight">{card.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium uppercase tracking-wider">{card.desc}</p>
            </div>
          ))}
        </section>

        {/* Technical Footer */}
        <section className="bg-indigo-950/10 border border-indigo-500/10 p-10 rounded-[2.5rem] text-center">
            <p className="text-sm font-medium italic text-slate-500">
               {lang === 'UA' ? "Стек: React 18, Vite, Tailwind CSS, Vitest, Google Apps Script, Firebase Firestore." 
               : "Stack: React 18, Vite, Tailwind CSS, Vitest, Google Apps Script, Firebase Firestore."}
            </p>
        </section>
      </main>

      <footer className="py-12 text-center border-t border-white/5">
        <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.5em]">Vadym Shevchenko | 2026</p>
      </footer>
    </div>
  );
};

export default Landing;