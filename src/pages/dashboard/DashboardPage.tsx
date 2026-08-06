import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Users, 
  Package, 
  AlertTriangle,
  Wallet,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LineChart, BarChart, DonutChart } from '../../components/charts/CustomCharts';
import { 
  getFinancialSummary, 
  getChartData, 
  getNotifications, 
  getSales, 
  getExpenses,
  getSettings
} from '../../mock';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [financials] = useState(getFinancialSummary());
  const [chartData] = useState(getChartData());
  const [notifications] = useState(getNotifications());
  const [recentTXs, setRecentTXs] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [businessSettings] = useState(getSettings());

  useEffect(() => {
    // Generate unified recent transactions
    const sales = getSales().map(s => ({
      id: s.id,
      type: 'sale',
      title: `Sale to ${s.customerName}`,
      amount: s.total,
      date: s.date,
      paymentMethod: s.paymentMethod,
      status: s.status,
    }));

    const expenses = getExpenses().map(e => ({
      id: e.id,
      type: 'expense',
      title: `${e.category} - ${e.description}`,
      amount: e.amount,
      date: e.date,
      paymentMethod: e.paymentMethod,
      status: e.status,
    }));

    // Merge and sort by date descending
    const merged = [...sales, ...expenses].sort((a, b) => b.date.localeCompare(a.date));
    setRecentTXs(merged.slice(0, 5));
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleQuickAction = (route: string, action: string) => {
    navigate(`${route}?action=${action}`);
  };

  const handleSendReminder = (customerName: string, amount: number) => {
    triggerToast(`Sent payment reminder to ${customerName} for ${businessSettings.currency}${amount} via WhatsApp!`);
  };

  const handleQuickReorder = (productName: string) => {
    triggerToast(`Created draft purchase order for ${productName} sent to vendor.`);
  };

  return (
    <div className="flex flex-col gap-8 text-left relative">
      {/* ------------------------------------------------------------- */}
      {/* Dynamic Toast Feedback Overlay */}
      {/* ------------------------------------------------------------- */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white rounded-2xl px-5 py-3.5 shadow-2xl flex items-center gap-3 animate-[slideUp_0.2s_ease-out] text-xs font-semibold">
          <Sparkles size={16} className="text-brand-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden border border-slate-800 shadow-md">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Namaste, {businessSettings.ownerName}!</h2>
            <p className="text-xs md:text-sm text-slate-300 font-medium mt-1">Here is how your business ledger looks for today, Aug 5, 2026.</p>
          </div>
          <div className="flex gap-2.5">
            <Button 
              size="sm" 
              className="bg-white/10 hover:bg-white/15 text-white border-white/10 rounded-xl"
              onClick={() => navigate('/reports')}
            >
              View Sales Summary
            </Button>
            <Button 
              size="sm" 
              onClick={() => handleQuickAction('/sales', 'new')}
              icon={<Plus size={16} />}
            >
              Add New Sale
            </Button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FINANCIAL INDICATOR CARDS */}
      {/* ------------------------------------------------------------- */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="white" hoverEffect>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Sales</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <TrendingUp size={16} />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900">{businessSettings.currency}{financials.todaySales.toLocaleString()}</span>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded-full ml-2">
              <ArrowUpRight size={10} /> +12%
            </span>
          </div>
          <p className="text-[10px] font-semibold text-slate-400 mt-2">vs yesterday summary</p>
        </Card>

        <Card variant="white" hoverEffect>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Expenses</span>
            <span className="p-2 bg-rose-50 text-accent-rose rounded-xl border border-rose-100">
              <TrendingDown size={16} />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900">{businessSettings.currency}{financials.todayExpenses.toLocaleString()}</span>
            <span className="text-[10px] font-bold text-rose-600 flex items-center bg-rose-50 px-1.5 py-0.5 rounded-full ml-2">
              <ArrowDownRight size={10} /> -4%
            </span>
          </div>
          <p className="text-[10px] font-semibold text-slate-400 mt-2">including employee helper wages</p>
        </Card>

        <Card variant="white" hoverEffect>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Profit Ledger</span>
            <span className="p-2 bg-brand-50 text-brand-600 rounded-xl border border-brand-100">
              <Sparkles size={16} />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900">{businessSettings.currency}{financials.netProfit.toLocaleString()}</span>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded-full ml-2">
              <ArrowUpRight size={10} /> +18.5%
            </span>
          </div>
          <p className="text-[10px] font-semibold text-slate-400 mt-2">cumulative monthly profit margin</p>
        </Card>

        <Card variant="white" hoverEffect>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Credit Payments</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
              <Wallet size={16} />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900">{businessSettings.currency}{financials.pendingPayments.toLocaleString()}</span>
            {financials.pendingPayments > 0 && (
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full ml-2 animate-pulse">
                Needs Collection
              </span>
            )}
          </div>
          <p className="text-[10px] font-semibold text-slate-400 mt-2">amount pending from customers</p>
        </Card>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DASHBOARD GRID: ANALYTICS & RECENT ACTIVITIES */}
      {/* ------------------------------------------------------------- */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Sales Chart Section */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Card className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Weekly Sales vs Expenses</h3>
                <p className="text-[10px] font-semibold text-slate-400">Tracks revenue inflow against operating outflow</p>
              </div>
              <Badge variant="info">Live Graph</Badge>
            </div>
            <div className="h-64 flex items-center justify-center pt-2">
              <LineChart data={chartData.salesTrend} />
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Cashflow Bar Chart */}
            <Card className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Monthly Cash Flow</h3>
                  <p className="text-[10px] font-semibold text-slate-400">6-Month aggregated flow ledger</p>
                </div>
              </div>
              <div className="h-64 flex items-center justify-center pt-2">
                <BarChart data={chartData.monthlyCashflow} />
              </div>
            </Card>

            {/* Expense breakdown Donut Chart */}
            <Card className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Expense Categories</h3>
                  <p className="text-[10px] font-semibold text-slate-400">Where you spent money this month</p>
                </div>
              </div>
              <div className="h-64 flex items-center justify-center pt-2">
                <DonutChart data={chartData.expenseBreakdown} />
              </div>
            </Card>
          </div>
        </div>

        {/* Sidebar widgets panel (Recent activities & Shortcuts) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Shortcuts Grid */}
          <Card className="flex flex-col gap-4.5">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest border-b border-slate-100 pb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3.5">
              <button 
                onClick={() => handleQuickAction('/sales', 'new')}
                className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-brand-50 hover:border-brand-100 hover:text-brand-600 transition-all group gap-2"
              >
                <span className="p-2.5 bg-white rounded-xl shadow-xs group-hover:bg-brand-100/50">
                  <TrendingUp size={18} className="text-emerald-500" />
                </span>
                <span className="text-xs font-bold">New Sale</span>
              </button>

              <button 
                onClick={() => handleQuickAction('/expenses', 'new')}
                className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-brand-50 hover:border-brand-100 hover:text-brand-600 transition-all group gap-2"
              >
                <span className="p-2.5 bg-white rounded-xl shadow-xs group-hover:bg-brand-100/50">
                  <TrendingDown size={18} className="text-accent-rose" />
                </span>
                <span className="text-xs font-bold">Add Expense</span>
              </button>

              <button 
                onClick={() => handleQuickAction('/customers', 'new')}
                className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-brand-50 hover:border-brand-100 hover:text-brand-600 transition-all group gap-2"
              >
                <span className="p-2.5 bg-white rounded-xl shadow-xs group-hover:bg-brand-100/50">
                  <Users size={18} className="text-amber-500" />
                </span>
                <span className="text-xs font-bold">Add Customer</span>
              </button>

              <button 
                onClick={() => handleQuickAction('/inventory', 'new')}
                className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-brand-50 hover:border-brand-100 hover:text-brand-600 transition-all group gap-2"
              >
                <span className="p-2.5 bg-white rounded-xl shadow-xs group-hover:bg-brand-100/50">
                  <Package size={18} className="text-brand-500" />
                </span>
                <span className="text-xs font-bold">Add Product</span>
              </button>
            </div>
          </Card>

          {/* Active Notifications / Alerts */}
          {notifications.length > 0 && (
            <Card className="flex flex-col gap-4 border-amber-100/60 bg-amber-50/20">
              <div className="flex items-center gap-2 text-amber-700 font-bold border-b border-amber-200/40 pb-2">
                <AlertTriangle size={18} className="text-amber-500 animate-bounce" />
                <h3 className="text-xs uppercase tracking-wider">Alerts & Collections</h3>
              </div>
              <div className="flex flex-col gap-3">
                {notifications.slice(0, 3).map((noti) => (
                  <div key={noti.id} className="p-3 bg-white border border-slate-100 rounded-xl flex flex-col gap-2.5 text-left">
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wide">
                        {noti.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium leading-normal mt-0.5">{noti.message}</p>
                    </div>
                    <div className="flex justify-end">
                      {noti.id.includes('pay') ? (
                        <Button 
                          size="sm" 
                          variant="secondary"
                          className="bg-amber-50 text-amber-700 hover:bg-amber-100 text-[10px] !py-1 !px-2.5"
                          icon={<MessageCircle size={12} />}
                          onClick={() => handleSendReminder(noti.message.split('has')[0].trim(), parseFloat(noti.message.split('₹')[1]))}
                        >
                          Ping Customer
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="secondary"
                          className="bg-rose-50 text-accent-rose hover:bg-rose-100 text-[10px] !py-1 !px-2.5"
                          icon={<ShoppingBag size={12} />}
                          onClick={() => handleQuickReorder(noti.message.split('has')[0].trim())}
                        >
                          Reorder Items
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Recent Ledger Transactions */}
          <Card className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Recent Activity</h3>
              <button 
                onClick={() => navigate('/sales')}
                className="text-[10px] font-bold text-brand-600 flex items-center gap-0.5 hover:underline"
              >
                All Sales <ArrowRight size={10} />
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              {recentTXs.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0 pb-2 last:pb-0">
                  <div className="flex items-center gap-3 overflow-hidden pr-2">
                    <span className={`p-2 rounded-xl shrink-0 ${tx.type === 'sale' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-accent-rose'}`}>
                      {tx.type === 'sale' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    </span>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-700 truncate leading-snug">{tx.title}</h4>
                      <p className="text-[9px] font-semibold text-slate-400 mt-0.5 leading-none">
                        {tx.date} • {tx.paymentMethod}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-xs font-extrabold ${tx.type === 'sale' ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {tx.type === 'sale' ? '+' : '-'}{businessSettings.currency}{tx.amount}
                    </span>
                    <div className="mt-1">
                      <Badge variant={tx.status === 'Paid' ? 'success' : tx.status === 'Pending' || tx.status === 'Partial' ? 'warning' : 'danger'} size="sm">
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};
