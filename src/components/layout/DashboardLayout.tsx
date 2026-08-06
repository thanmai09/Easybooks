import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Package, 
  BarChart3, 
  Briefcase, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  ChevronDown,
  Info
} from 'lucide-react';
import { getSettings, getNotifications } from '../../mock';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [businessSettings, setBusinessSettings] = useState(getSettings());
  const [notifications, setNotifications] = useState(getNotifications());

  useEffect(() => {
    // Reload settings when navigation path updates to reflect changes in settings forms
    setBusinessSettings(getSettings());
    setNotifications(getNotifications());
  }, [location.pathname]);

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Sales', path: '/sales', icon: <TrendingUp size={20} /> },
    { name: 'Expenses', path: '/expenses', icon: <TrendingDown size={20} /> },
    { name: 'Customers', path: '/customers', icon: <Users size={20} /> },
    { name: 'Inventory', path: '/inventory', icon: <Package size={20} /> },
    { name: 'Reports', path: '/reports', icon: <BarChart3 size={20} /> },
    { name: 'CA Portal', path: '/ca-portal', icon: <Briefcase size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  const activeItem = navigationItems.find(item => location.pathname.startsWith(item.path)) || navigationItems[0];

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      {/* ------------------------------------------------------------- */}
      {/* DESKTOP SIDEBAR */}
      {/* ------------------------------------------------------------- */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 h-screen sticky top-0">
        {/* Branding header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-brand-600 flex items-center justify-center text-white font-heading font-black text-lg shadow-sm">
            Ac
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 leading-tight">Apna Books</h1>
            <p className="text-[10px] font-medium text-brand-600 uppercase tracking-widest leading-none">Business PWA</p>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-150
                  ${isActive 
                    ? 'bg-brand-50 text-brand-600' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
                `}
              >
                {item.icon}
                <span>{item.name}</span>
                {item.name === 'Inventory' && notifications.some(n => n.type === 'alert') && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-accent-rose animate-pulse" />
                )}
                {item.name === 'Customers' && notifications.some(n => n.type === 'reminder') && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-amber-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom profile/logout card */}
        <div className="p-4 border-t border-slate-100 flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-heading font-bold text-sm">
              {businessSettings.ownerName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-slate-800 truncate">{businessSettings.ownerName}</h4>
              <p className="text-[10px] font-semibold text-slate-400 truncate">{businessSettings.businessName}</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout} 
            className="w-full !justify-start text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl"
            icon={<LogOut size={16} />}
          >
            Sign Out
          </Button>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MOBILE SIDEBAR (Drawer overlay) */}
      {/* ------------------------------------------------------------- */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="relative flex flex-col w-72 max-w-[80vw] bg-white h-full shadow-2xl animate-[slideRight_0.2s_ease-out]">
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-brand-600 flex items-center justify-center text-white font-heading font-bold text-sm">
                  Ac
                </div>
                <div>
                  <h1 className="text-xs font-bold text-slate-800 leading-tight">Apna Books</h1>
                </div>
              </div>
              <button 
                onClick={() => setIsMobileOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            
            <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto">
              {navigationItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150
                      ${isActive 
                        ? 'bg-brand-50 text-brand-600' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
                    `}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-100 flex flex-col gap-3">
              <div className="flex items-center gap-3 px-2">
                <div className="w-9 h-9 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-heading font-bold text-xs">
                  {businessSettings.ownerName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-slate-800 truncate">{businessSettings.ownerName}</h4>
                  <p className="text-[10px] font-semibold text-slate-400 truncate">{businessSettings.businessName}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout} 
                className="w-full !justify-start text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl"
                icon={<LogOut size={16} />}
              >
                Sign Out
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* APP BODY CONTAINER */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header navbar */}
        <header className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-1.5 -ml-1 text-slate-500 hover:bg-slate-50 rounded-xl"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-sm font-bold text-slate-800">{businessSettings.businessName}</h2>
              <p className="text-[10px] font-semibold text-slate-400 leading-none mt-0.5">{activeItem.name} Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* ------------------------------------------------------------- */}
            {/* NOTIFICATIONS DROPDOWN */}
            {/* ------------------------------------------------------------- */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                  setIsProfileOpen(false);
                }}
                className={`p-2 rounded-xl border border-slate-100 transition-all text-slate-500 hover:bg-slate-50 relative ${isNotificationOpen ? 'bg-slate-50 border-slate-200' : ''}`}
              >
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-rose ring-2 ring-white animate-pulse" />
                )}
              </button>

              {isNotificationOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationOpen(false)} />
                  <div className="absolute right-0 mt-2.5 w-80 bg-white rounded-2xl border border-slate-100 shadow-xl z-50 p-4 max-h-[400px] overflow-y-auto animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Alerts & Reminders</h4>
                      <Badge variant="danger" size="sm">{notifications.length}</Badge>
                    </div>
                    
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 flex flex-col items-center gap-2">
                        <Info size={24} className="text-slate-300" />
                        <p className="text-xs font-semibold">All caught up! No alerts.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2.5">
                        {notifications.map((noti) => (
                          <div 
                            key={noti.id} 
                            onClick={() => {
                              setIsNotificationOpen(false);
                              if (noti.type === 'alert') navigate('/inventory');
                              else navigate('/customers');
                            }}
                            className={`p-3 rounded-xl border border-slate-50 cursor-pointer transition-colors text-left hover:bg-slate-50 ${noti.type === 'alert' ? 'bg-rose-50/30' : 'bg-amber-50/20'}`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className={`text-[10px] font-bold uppercase tracking-wider ${noti.type === 'alert' ? 'text-accent-rose' : 'text-amber-600'}`}>
                                {noti.title}
                              </span>
                              <span className="text-[9px] font-semibold text-slate-400">{noti.time}</span>
                            </div>
                            <p className="text-xs text-slate-600 font-medium leading-normal">{noti.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* ------------------------------------------------------------- */}
            {/* USER PROFILE DROPDOWN */}
            {/* ------------------------------------------------------------- */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationOpen(false);
                }}
                className="flex items-center gap-2.5 p-1 pr-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center font-heading font-bold text-xs">
                  {businessSettings.ownerName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="hidden md:block">
                  <h4 className="text-xs font-bold text-slate-800 leading-none">{businessSettings.ownerName}</h4>
                  <p className="text-[9px] font-semibold text-slate-400 leading-none mt-1">Admin</p>
                </div>
                <ChevronDown size={14} className="text-slate-400 hidden md:block" />
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 mt-2.5 w-48 bg-white rounded-2xl border border-slate-100 shadow-xl z-50 p-2 animate-[fadeIn_0.15s_ease-out]">
                    <Link
                      to="/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                    >
                      <Settings size={14} />
                      Business Settings
                    </Link>
                    <div className="h-px bg-slate-100 my-1" />
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic page contents grid */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-page-enter">
          {children}
        </main>
      </div>
    </div>
  );
};
