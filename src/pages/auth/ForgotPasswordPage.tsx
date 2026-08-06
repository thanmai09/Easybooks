import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Logo } from '../../components/ui/Logo';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Decorative colored glow spheres */}
      <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-brand-300 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-accent-blue rounded-full blur-3xl opacity-20 pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Brand header */}
        <div className="text-center flex flex-col items-center gap-4 mb-8">
          <Link to="/" className="flex flex-col items-center gap-2">
            <Logo variant="icon" size="lg" />
            <span className="font-heading font-extrabold text-slate-900 text-2xl tracking-tight">ApnaBooks</span>
          </Link>
          <div>
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">Reset ledger password</h2>
            <p className="text-xs font-semibold text-slate-400 mt-1">We will mail a mock instructions link to restore access.</p>
          </div>
        </div>

        {/* Forgot Password Card */}
        <Card className="shadow-lg border-slate-100 p-8 bg-white/80 backdrop-blur-md">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200/50 rounded-xl text-xs font-semibold text-accent-rose text-left">
                  {error}
                </div>
              )}

              <Input
                label="Registered Email Address"
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

              <Button type="submit" size="lg" fullWidth className="mt-2">
                Send Recovery Instructions
              </Button>

              <Link to="/login" className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors">
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </form>
          ) : (
            <div className="text-center flex flex-col items-center gap-4 py-4">
              <CheckCircle2 size={48} className="text-emerald-500" />
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-slate-800">Check your inbox</h3>
                <p className="text-xs text-slate-500 font-semibold max-w-xs leading-normal">
                  We have simulated sending recovery instructions to <span className="text-slate-800 font-bold">{email}</span>. Click the link in the mock email to reset your credential.
                </p>
              </div>
              
              <Button onClick={() => setSubmitted(false)} variant="outline" size="sm" className="mt-2">
                Resend instructions mail
              </Button>

              <Link to="/login" className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors mt-4">
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
