import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Store, 
  Scissors, 
  Utensils, 
  Shirt, 
  Activity, 
  Globe, 
  ShoppingBag,
  TrendingUp, 
  TrendingDown, 
  Package, 
  Users, 
  Briefcase, 
  BarChart3,
  Smartphone,
  Shield,
  Zap
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const categories = [
    { name: 'Grocery Shops', icon: <Store className="text-brand-500" size={24} /> },
    { name: 'Clothing Stores', icon: <Shirt className="text-accent-blue" size={24} /> },
    { name: 'Medical Stores', icon: <Activity className="text-accent-teal" size={24} /> },
    { name: 'Restaurants & Cafes', icon: <Utensils className="text-accent-amber" size={24} /> },
    { name: 'Salons & Parlors', icon: <Scissors className="text-accent-rose" size={24} /> },
    { name: 'Retail Shops', icon: <ShoppingBag className="text-brand-500" size={24} /> },
    { name: 'Wholesale Businesses', icon: <Globe className="text-accent-teal" size={24} /> }
  ];

  const features = [
    { title: 'Track Daily Sales', desc: 'Log sales in seconds just like sending a WhatsApp text. Multiple payment modes (UPI, Cash, Credit).', icon: <TrendingUp size={24} className="text-emerald-500" /> },
    { title: 'Manage Business Expenses', desc: 'Keep track of bills, rent, supplier dues, and utility expenses. Categorized ledger reports.', icon: <TrendingDown size={24} className="text-accent-rose" /> },
    { title: 'Smart Stock Inventory', desc: 'Real-time stock quantities. Automate alerts when items are running out so you never miss a sale.', icon: <Package size={24} className="text-brand-500" /> },
    { title: 'Customer Credit Directory', desc: 'Digital Udhar Khata. Send pending payment reminders via WhatsApp in one click.', icon: <Users size={24} className="text-accent-amber" /> },
    { title: 'Automated Reports', desc: 'One-tap Profit & Loss statement, GST sheets, and daily sale summaries. No accounting terms used.', icon: <BarChart3 size={24} className="text-accent-blue" /> },
    { title: 'Share with Accountant', desc: 'Dedicated CA Portal. Let your tax professional extract GST logs and ledgers directly.', icon: <Briefcase size={24} className="text-indigo-500" /> }
  ];

  const testimonials = [
    { name: 'Ramesh Patel', store: 'Patel Grocery Store', text: 'Earlier, I used to keep writing in notebooks. It took hours to calculate profit at month-end. With Apna Books, I know my cash balance in just 2 minutes!' },
    { name: 'Sunita Rao', store: 'Elegant Clothing Boutique', text: 'This feels as easy as GPay! The customer credit features are excellent. My pending collection time has cut down by half.' },
    { name: 'Dr. Amit Shah', store: 'Medisec Chemists', text: 'Low stock notification is a lifesaver. My stock is always optimized now, and sharing data with my auditor is extremely easy.' }
  ];

  const pricing = [
    { name: 'Free Trial', price: '₹0', period: 'Forever', features: ['Track unlimited sales', 'Up to 50 inventory products', 'Manage up to 20 customers', 'Standard monthly reports'], active: false, label: 'Get Started' },
    { name: 'Pro Premium', price: '₹299', period: 'per month', features: ['Everything in Free Trial', 'Unlimited products & stock', 'Unlimited customers database', 'Automatic low stock WhatsApp notifications', 'Dedicated Auditor / CA login access', 'Offline usage mode supported'], active: true, label: 'Go Premium' }
  ];

  const faqs = [
    { q: 'Is Apna Books complicated to use?', a: 'Not at all! We designed it specifically for small business owners who do not understand complex accounting terms. If you know how to use WhatsApp or Google Pay, you can use this app easily.' },
    { q: 'Can I install this on my phone?', a: 'Yes! It is a Progressive Web Application (PWA). Just open the link, click "Add to Home Screen" on your browser or install via prompt, and it will work exactly like a native app.' },
    { q: 'Does it work without internet?', a: 'Yes, it works offline. Your sales and inventory entries are stored locally on your device and will sync whenever you go back online.' },
    { q: 'Is my data secure?', a: 'Absolutely. We do not store or sell your transactional details. Everything is saved locally on your browser database or backed up securely under your private profile account.' }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-left">
      {/* ------------------------------------------------------------- */}
      {/* HEADER NAVBAR */}
      {/* ------------------------------------------------------------- */}
      <header className="fixed top-0 inset-x-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-brand-600 flex items-center justify-center text-white font-heading font-bold text-sm">
            Ac
          </div>
          <span className="font-heading font-extrabold text-slate-800 text-base">Apna Books</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-800">
            Sign In
          </Link>
          <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
            Try Free
          </Button>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* HERO SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="pt-32 pb-20 px-6 lg:px-12 max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col items-start text-left gap-6">
          <span className="bg-brand-50 text-brand-600 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            ⚡ Accounting Simplified
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.08] tracking-tight">
            The simplest way to manage <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-500 via-brand-600 to-accent-blue">your shop bookkeeping.</span>
          </h1>
          <p className="text-slate-600 text-base md:text-lg max-w-xl font-medium leading-relaxed">
            Record sales, track customer udhar, manage stock levels, and generate professional profit/loss sheets. Built for retail, grocery, and local stores.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" onClick={() => navigate('/register')} className="shadow-lg">
              Start Free Bookkeeping
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
              Live Demo Sandbox
            </Button>
          </div>
          <div className="flex items-center gap-6 mt-4 text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1.5">
              <Shield size={14} className="text-brand-500" /> Secure Data
            </span>
            <span className="flex items-center gap-1.5">
              <Zap size={14} className="text-brand-500" /> Installed PWA
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={14} className="text-brand-500" /> Offline Ready
            </span>
          </div>
        </div>

        {/* Dynamic App Preview */}
        <div className="lg:col-span-5 flex justify-center relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-brand-300 to-accent-blue rounded-full blur-3xl opacity-20" />
          
          {/* Mock Mobile App Wrapper */}
          <div className="relative w-[280px] h-[550px] bg-slate-900 rounded-[42px] p-3 shadow-2xl border-4 border-slate-800 flex flex-col overflow-hidden">
            {/* Speaker & camera notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-28 bg-slate-900 rounded-b-xl z-20 flex justify-center items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
              <span className="w-8 h-1 bg-slate-800 rounded-full" />
            </div>

            {/* App UI */}
            <div className="flex-1 bg-slate-50 rounded-[32px] overflow-hidden flex flex-col text-slate-800 select-none relative">
              {/* Header */}
              <div className="bg-white border-b border-slate-100 p-4 pt-6 flex items-center justify-between">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-900 leading-none">Apna Bazar</h4>
                  <p className="text-[8px] font-semibold text-slate-400">Grocery Shop Ledger</p>
                </div>
                <Smartphone size={14} className="text-slate-400" />
              </div>

              {/* Body */}
              <div className="p-3 flex-1 flex flex-col gap-2.5 overflow-y-auto">
                {/* Stats cards */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex flex-col text-left">
                    <span className="text-[8px] font-bold text-slate-400 uppercase leading-none">Sales</span>
                    <span className="text-xs font-bold text-emerald-600 mt-1">₹18,520</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex flex-col text-left">
                    <span className="text-[8px] font-bold text-slate-400 uppercase leading-none">Expenses</span>
                    <span className="text-xs font-bold text-rose-500 mt-1">₹4,200</span>
                  </div>
                </div>

                {/* Sales Chart Mockup */}
                <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex flex-col items-start gap-1">
                  <span className="text-[8px] font-bold text-slate-400 uppercase leading-none">Sales Trend</span>
                  <div className="w-full h-12 flex items-end gap-1.5 pt-2">
                    <div className="h-6 w-full bg-brand-100 rounded" />
                    <div className="h-8 w-full bg-brand-200 rounded" />
                    <div className="h-4 w-full bg-brand-100 rounded" />
                    <div className="h-10 w-full bg-brand-500 rounded" />
                    <div className="h-12 w-full bg-brand-600 rounded" />
                  </div>
                </div>

                {/* Recent transaction rows */}
                <div className="flex flex-col gap-1.5 text-left">
                  <span className="text-[8px] font-bold text-slate-400 uppercase">Recent Sales</span>
                  <div className="bg-white p-2 rounded-xl border border-slate-100 flex items-center justify-between text-[10px]">
                    <div>
                      <h5 className="font-bold text-slate-800">Rajesh Grocery</h5>
                      <p className="text-[8px] font-medium text-slate-400">08:24 AM</p>
                    </div>
                    <span className="font-bold text-emerald-600">+₹4,200</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-100 flex items-center justify-between text-[10px]">
                    <div>
                      <h5 className="font-bold text-slate-800">Coca Cola Refill</h5>
                      <p className="text-[8px] font-medium text-slate-400">Yesterday</p>
                    </div>
                    <span className="font-bold text-rose-500">-₹1,200</span>
                  </div>
                </div>
              </div>

              {/* Bottom bar indicator */}
              <div className="h-6 flex justify-center items-center pb-1">
                <span className="w-20 h-1 bg-slate-300 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* CATEGORIES SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="bg-white py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center flex flex-col gap-10">
          <div className="flex flex-col gap-2 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Designed for your business category
            </h2>
            <p className="text-slate-500 font-medium text-sm">
              We personalize Apna Books defaults (categories, taxes, units) according to what you retail.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((c) => (
              <Card key={c.name} className="flex items-center gap-3 py-3.5 px-5 shadow-xs border-slate-100">
                {c.icon}
                <span className="text-sm font-bold text-slate-700">{c.name}</span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FEATURES SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center flex flex-col gap-4 mb-16 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest leading-none">Complete Feature Suite</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
            Powering everything your business needs to grow
          </h2>
          <p className="text-slate-500 font-medium text-sm md:text-base">
            Lose the messy notebooks and calculators. Apna Books handles all operational ledger operations effortlessly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <Card key={i} className="flex flex-col gap-4 hoverEffect">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                {f.icon}
              </div>
              <div className="text-left flex flex-col gap-1">
                <h3 className="text-base font-bold text-slate-800">{f.title}</h3>
                <p className="text-slate-500 text-xs font-medium leading-relaxed">{f.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* TESTIMONIALS */}
      {/* ------------------------------------------------------------- */}
      <section className="bg-slate-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center flex flex-col gap-16">
          <div className="flex flex-col gap-4 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">Loved by Store Owners</span>
            <h2 className="text-2xl md:text-4xl font-heading font-extrabold">Join 50,000+ happy shop owners</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div 
                key={idx} 
                className="bg-slate-800/50 backdrop-blur-xs p-8 rounded-2xl border border-slate-700/50 text-left flex flex-col justify-between gap-6 hover:border-slate-600 transition-all duration-200"
              >
                <p className="text-slate-300 text-sm font-medium leading-relaxed italic">
                  "{t.text}"
                </p>
                <div>
                  <h4 className="font-heading font-bold text-sm text-white">{t.name}</h4>
                  <p className="text-slate-500 text-xs font-semibold mt-0.5">{t.store}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* PRICING SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="py-24 px-6 lg:px-12 max-w-5xl mx-auto text-center flex flex-col gap-16">
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">Transparent Pricing</span>
          <h2 className="text-3xl font-extrabold text-slate-900">Choose the best fit for your shop</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-3xl mx-auto w-full">
          {pricing.map((p, idx) => (
            <Card 
              key={idx} 
              className={`flex flex-col justify-between gap-8 text-left ${p.active ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-lg relative' : ''}`}
            >
              {p.active && (
                <span className="absolute top-0 right-6 -translate-y-1/2 bg-brand-500 text-white font-bold text-[9px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-xs">
                  Recommended
                </span>
              )}
              
              <div className="flex flex-col gap-6">
                <div>
                  <h4 className="text-lg font-bold text-slate-800">{p.name}</h4>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-bold text-slate-900">{p.price}</span>
                    <span className="text-slate-400 font-semibold text-xs">/ {p.period}</span>
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                <ul className="flex flex-col gap-3">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-xs text-slate-600 font-semibold">
                      <Check size={14} className="text-brand-500 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                variant={p.active ? 'primary' : 'outline'} 
                fullWidth 
                onClick={() => navigate('/register')}
              >
                {p.label}
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FAQ SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="bg-slate-100/50 py-24 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col gap-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
          
          <div className="flex flex-col gap-4 text-left">
            {faqs.map((f, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-sm font-bold text-slate-800 focus:outline-none"
                  >
                    <span>{f.q}</span>
                    {isOpen ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-500 font-medium leading-relaxed border-t border-slate-50 pt-3">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FOOTER */}
      {/* ------------------------------------------------------------- */}
      <footer className="bg-slate-900 border-t border-slate-800 text-white py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 border-b border-slate-800 pb-8 mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-heading font-bold text-sm">
              Ac
            </div>
            <span className="font-heading font-extrabold text-base">Apna Books</span>
          </div>
          <div className="flex gap-6 text-xs font-semibold text-slate-400">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Refund Policy</a>
            <a href="#" className="hover:text-white">Contact Support</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between text-left text-[11px] font-medium text-slate-500 gap-4">
          <p>© 2026 Apna Books Inc. All rights reserved.</p>
          <p>Bookkeeping Progressive Web Application for small stores and merchants.</p>
        </div>
      </footer>
    </div>
  );
};
