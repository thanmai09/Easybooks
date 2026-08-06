import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Store, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Logo } from '../../components/ui/Logo';
import { saveSettings, getSettings } from '../../mock';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('Grocery');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !businessName || !email || !password) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    // Capture business name in our settings mock data immediately so it updates the layout title!
    const settings = getSettings();
    saveSettings({
      ...settings,
      businessName: businessName,
      ownerName: name,
      email: email,
    });

    navigate('/dashboard');
  };

  const businessCategories = [
    { value: 'Grocery', label: 'Grocery / General Store' },
    { value: 'Retail', label: 'Retail Shop / Boutique' },
    { value: 'Apparel', label: 'Clothing & Apparel Store' },
    { value: 'Medical', label: 'Medical / Pharmacy Store' },
    { value: 'Restaurant', label: 'Restaurant / Cafe / Bakery' },
    { value: 'Salon', label: 'Salon / Parlor' },
    { value: 'Wholesale', label: 'Wholesale / Distribution' },
    { value: 'Other', label: 'Other Business' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Decorative colored glow spheres */}
      <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-brand-300 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-accent-blue rounded-full blur-3xl opacity-20 pointer-events-none" />

      <div className="relative w-full max-w-lg">
        {/* Brand header */}
        <div className="text-center flex flex-col items-center gap-4 mb-8">
          <Link to="/" className="flex flex-col items-center gap-2">
            <Logo variant="icon" size="lg" />
            <span className="font-heading font-extrabold text-slate-900 text-2xl tracking-tight">ApnaBooks</span>
          </Link>
          <div className="text-center">
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">Create your business account</h2>
            <p className="text-xs font-semibold text-slate-400 mt-1">Zero credit card required. Start managing ledger in seconds.</p>
          </div>
        </div>

        {/* Register Card */}
        <Card className="shadow-lg border-slate-100 p-8 bg-white/80 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200/50 rounded-xl text-xs font-semibold text-accent-rose text-left">
                {error}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Store Owner Name"
                type="text"
                placeholder="e.g. Sunil Malhotra"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                icon={<User size={16} />}
                required
              />
              <Input
                label="Shop / Business Name"
                type="text"
                placeholder="e.g. Apna Bazar"
                value={businessName}
                onChange={(e) => {
                  setBusinessName(e.target.value);
                  setError('');
                }}
                icon={<Store size={16} />}
                required
              />
            </div>

            <Select
              label="Business Niche Category"
              options={businessCategories}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. owner@myshop.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              icon={<Mail size={16} />}
              required
            />

            <div className="relative">
              <Input
                label="Password Credentials"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                icon={<Lock size={16} />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-[38px] text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <p className="text-[10px] text-slate-400 font-semibold leading-normal text-left">
              By submitting, you agree to our terms of service and acknowledge that data is securely initialized locally on your PWA profile.
            </p>

            <Button type="submit" size="lg" fullWidth className="mt-2">
              Initialize ApnaBooks
            </Button>
          </form>
        </Card>

        {/* Bottom sign-in link */}
        <p className="text-center text-xs font-semibold text-slate-500 mt-6">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700">
            Sign in to your ledger
          </Link>
        </p>
      </div>
    </div>
  );
};
