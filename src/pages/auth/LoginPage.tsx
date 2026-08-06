import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    // Redirect directly to dashboard (sandbox sandbox mode)
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Decorative colored glow spheres */}
      <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-brand-300 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-accent-blue rounded-full blur-3xl opacity-20 pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Brand header */}
        <div className="text-center flex flex-col items-center gap-2.5 mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-brand-600 flex items-center justify-center text-white font-heading font-black text-lg shadow-sm">
              Ac
            </div>
            <span className="font-heading font-extrabold text-slate-900 text-xl tracking-tight">Apna Books</span>
          </Link>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight mt-2">Sign in to your shop log</h2>
          <p className="text-xs font-semibold text-slate-400">Welcome back! Please enter your credentials.</p>
        </div>

        {/* Login form Card */}
        <Card className="shadow-lg border-slate-100 p-8 bg-white/80 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200/50 rounded-xl text-xs font-semibold text-accent-rose text-left">
                {error}
              </div>
            )}

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
                label="Security Password"
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

            <div className="flex justify-end -mt-1.5">
              <Link to="/forgot-password" className="text-xs font-bold text-brand-600 hover:text-brand-700">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" size="lg" fullWidth className="mt-2">
              Sign In to Dashboard
            </Button>
          </form>
        </Card>

        {/* Bottom register link */}
        <p className="text-center text-xs font-semibold text-slate-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700">
            Create an account free
          </Link>
        </p>
      </div>
    </div>
  );
};
