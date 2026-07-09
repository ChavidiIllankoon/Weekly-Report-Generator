import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';
import {
  HiOutlineDocumentText,
  HiOutlineChartBar,
  HiOutlineClipboardCheck,
  HiOutlineLightningBolt,
  HiOutlineUserGroup,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineArrowRight,
  HiOutlineMenu,
  HiOutlineX,
} from 'react-icons/hi';

/* ─── Intersection Observer hook for scroll animations ─── */
const useInView = (options = {}) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsInView(true); },
      { threshold: 0.15, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, isInView];
};

/* ─── Feature card data ─── */
const features = [
  {
    icon: HiOutlineDocumentText,
    title: 'Generate Reports',
    desc: 'Create professional weekly reports in seconds with our intuitive form builder and smart templates.',
    gradient: 'from-indigo-500 to-blue-600',
    glow: 'shadow-indigo-500/20',
  },
  {
    icon: HiOutlineChartBar,
    title: 'Track Progress',
    desc: 'Visualise team productivity trends with beautiful charts and real-time analytics dashboards.',
    gradient: 'from-purple-500 to-pink-600',
    glow: 'shadow-purple-500/20',
  },
  {
    icon: HiOutlineClipboardCheck,
    title: 'Manage Tasks',
    desc: 'Log completed work, plan ahead, and flag blockers — all from one streamlined workspace.',
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'shadow-emerald-500/20',
  },
  {
    icon: HiOutlineLightningBolt,
    title: 'AI-Powered Insights',
    desc: 'Ask our AI assistant to summarise blockers, compare workloads, and surface hidden patterns.',
    gradient: 'from-amber-500 to-orange-600',
    glow: 'shadow-amber-500/20',
  },
];

/* ─── Stats ─── */
const stats = [
  { label: 'Active Teams', value: '120+' },
  { label: 'Reports Generated', value: '8,500+' },
  { label: 'Hours Saved Monthly', value: '2,400+' },
  { label: 'Satisfaction Rate', value: '99 %' },
];

/* ═══════════════════════════════════════════════════════
   Landing Page
   ═══════════════════════════════════════════════════════ */
const LandingPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Navbar shrink on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* InView refs for scroll animations */
  const [featRef, featInView] = useInView();
  const [aboutRef, aboutInView] = useInView();
  const [statsRef, statsInView] = useInView();
  const [ctaRef, ctaInView] = useInView();

  /* ─── Smooth anchor click ─── */
  const scrollTo = (id) => {
    setMobileMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-slate-100 transition-colors duration-300 overflow-x-hidden">

      {/* ═══ BACKGROUND AMBIENT BLOBS ═══ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-indigo-500/[.07] dark:bg-indigo-500/[.05] rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-60 w-[600px] h-[600px] bg-purple-500/[.07] dark:bg-purple-500/[.05] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-pink-500/[.05] dark:bg-pink-500/[.04] rounded-full blur-[120px]" />
      </div>

      {/* ═══ NAVIGATION ═══ */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-slate-700/40 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => scrollTo('hero')} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-110 transition-transform duration-300">
              <HiOutlineDocumentText size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              WeeklyPulse
            </span>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {['hero', 'features', 'about', 'contact'].map((id) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors capitalize"
              >
                {id === 'hero' ? 'Home' : id}
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 border border-gray-200 dark:border-slate-700/50 transition-all duration-300"
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>

            <Link
              to="/login"
              className="hidden md:inline-flex px-5 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300"
            >
              Login
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700/50"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? <HiOutlineX size={20} /> : <HiOutlineMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileMenu && (
          <div className="md:hidden bg-white/95 dark:bg-black/95 backdrop-blur-xl border-t border-gray-200 dark:border-slate-700/50 px-6 pb-6 pt-3 space-y-3 animate-[fadeSlide_0.25s_ease]">
            {['hero', 'features', 'about', 'contact'].map((id) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="block w-full text-left py-2.5 px-3 text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg capitalize transition-colors"
              >
                {id === 'hero' ? 'Home' : id}
              </button>
            ))}
            <Link
              to="/login"
              onClick={() => setMobileMenu(false)}
              className="block text-center py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
            >
              Login
            </Link>
          </div>
        )}
      </nav>

      {/* ═══ HERO SECTION ═══ */}
      <section id="hero" className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Copy */}
          <div className="max-w-xl animate-[fadeUp_0.7s_ease]">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-6">
              <HiOutlineSparkles size={14} />
              AI-Powered Report System
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Weekly Report{' '}
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Generator
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-500 dark:text-slate-400 leading-relaxed">
              Create, manage, and generate your weekly reports easily with an intelligent reporting system.
              Track progress, surface blockers, and keep your team aligned — all in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300"
              >
                Get Started Free
                <HiOutlineArrowRight size={16} />
              </Link>
              <button
                onClick={() => scrollTo('features')}
                className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold rounded-xl border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/60 transition-all duration-300"
              >
                Explore Features
              </button>
            </div>
          </div>

          {/* Hero illustration — decorative dashboard mockup */}
          <div className="relative flex justify-center lg:justify-end animate-[fadeUp_0.9s_ease]">
            <div className="relative w-full max-w-lg">
              {/* Glow ring */}
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl" />

              {/* Card */}
              <div className="relative bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl border border-gray-200/80 dark:border-slate-700/50 rounded-3xl p-6 shadow-2xl">
                {/* Fake title bar */}
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="ml-auto text-[10px] text-gray-400 dark:text-slate-600 font-mono">WeeklyPulse v2.0</span>
                </div>

                {/* Mini stat cards */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: 'Reports', val: '24', color: 'from-indigo-500 to-blue-500' },
                    { label: 'Tasks', val: '87', color: 'from-purple-500 to-pink-500' },
                    { label: 'Hours', val: '168', color: 'from-emerald-500 to-teal-500' },
                  ].map((s) => (
                    <div key={s.label} className="bg-gray-50 dark:bg-slate-800/60 rounded-xl p-3 border border-gray-100 dark:border-slate-700/40">
                      <p className={`text-xl font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.val}</p>
                      <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Fake chart bars */}
                <div className="flex items-end gap-2 h-28 px-2">
                  {[40, 65, 50, 80, 60, 90, 75].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-indigo-500 to-purple-500 opacity-80"
                      style={{
                        height: `${h}%`,
                        animationName: 'barGrow',
                        animationDuration: '0.8s',
                        animationTimingFunction: 'ease',
                        animationFillMode: 'both',
                        animationDelay: `${i * 0.08}s`,
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 px-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                    <span key={d} className="text-[9px] text-gray-400 dark:text-slate-600 flex-1 text-center">{d}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section ref={statsRef} className="py-10 border-y border-gray-200/60 dark:border-slate-800/60 bg-gray-50/50 dark:bg-slate-900/20">
        <div className={`max-w-6xl mx-auto px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-700 ${statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">{s.value}</p>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" ref={featRef} className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${featInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">Features</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
              Everything you need to{' '}
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                streamline reporting
              </span>
            </h2>
            <p className="mt-4 text-gray-500 dark:text-slate-400">
              From automated report generation to AI-driven insights, WeeklyPulse keeps your entire team on the same page.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`group relative bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl border border-gray-200/80 dark:border-slate-700/40 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-xl ${f.glow} transition-all duration-300 ${featInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 100 + 200}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon size={22} className="text-white" />
                </div>
                <h3 className="text-base font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section id="about" ref={aboutRef} className="py-24 px-6 lg:px-8 bg-gray-50/50 dark:bg-slate-900/20 border-y border-gray-200/60 dark:border-slate-800/60">
        <div className={`max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center transition-all duration-700 ${aboutInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Illustration side */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-6 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl" />
            <div className="relative grid grid-cols-2 gap-4">
              {[
                { icon: HiOutlineDocumentText, title: 'Smart Reports', desc: 'Auto-formatted and ready to share', gradient: 'from-indigo-500 to-blue-600' },
                { icon: HiOutlineUserGroup, title: 'Team Overview', desc: 'See who did what at a glance', gradient: 'from-purple-500 to-pink-600' },
                { icon: HiOutlineShieldCheck, title: 'Role-Based Access', desc: 'Managers and members, sorted', gradient: 'from-emerald-500 to-teal-600' },
                { icon: HiOutlineSparkles, title: 'AI Assistant', desc: 'Ask anything about your reports', gradient: 'from-amber-500 to-orange-600' },
              ].map((c, i) => (
                <div
                  key={c.title}
                  className={`bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl border border-gray-200/80 dark:border-slate-700/40 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 ${aboutInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                  style={{ transitionDelay: `${i * 120 + 200}ms` }}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${c.gradient} flex items-center justify-center mb-3`}>
                    <c.icon size={18} className="text-white" />
                  </div>
                  <h4 className="text-sm font-bold mb-1">{c.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Copy side */}
          <div className="order-1 lg:order-2 max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">About WeeklyPulse</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Built for teams that{' '}
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                value clarity
              </span>
            </h2>
            <p className="mt-5 text-gray-500 dark:text-slate-400 leading-relaxed">
              WeeklyPulse is an intelligent weekly report management system designed for modern teams.
              Whether you're a team member logging your progress or a manager tracking project health,
              WeeklyPulse gives you the tools to stay organised and informed.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Create and submit reports in minutes, not hours',
                'Role-based dashboards for managers and members',
                'AI-powered assistant to analyse trends and blockers',
                'Beautiful analytics with actionable insights',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300">
                  <span className="mt-1 w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300"
              >
                Start Reporting
                <HiOutlineArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section id="contact" ref={ctaRef} className="py-24 px-6 lg:px-8">
        <div className={`max-w-3xl mx-auto text-center transition-all duration-700 ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl" />
            <div className="relative bg-white/80 dark:bg-slate-900/40 backdrop-blur-2xl border border-gray-200/80 dark:border-slate-700/40 rounded-3xl p-10 md:p-16">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Ready to transform your{' '}
                <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  weekly reporting?
                </span>
              </h2>
              <p className="mt-4 text-gray-500 dark:text-slate-400 max-w-lg mx-auto">
                Join hundreds of teams already using WeeklyPulse to save time, improve visibility, and keep everyone aligned.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300"
                >
                  Get Started — It's Free
                  <HiOutlineArrowRight size={16} />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-xl border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/60 transition-all duration-300"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-gray-200/60 dark:border-slate-800/60 py-10 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
              <HiOutlineDocumentText size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              WeeklyPulse
            </span>
          </div>
          <p className="text-xs text-gray-400 dark:text-slate-600">
            &copy; {new Date().getFullYear()} WeeklyPulse. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Support'].map((l) => (
              <button key={l} className="text-xs text-gray-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                {l}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
