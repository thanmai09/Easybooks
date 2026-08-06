import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Sparkles,
  PieChart
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  getSales, 
  getExpenses, 
  getSettings, 
  getFinancialSummary 
} from '../../mock';

export const ReportsPage: React.FC = () => {
  const settings = getSettings();
  const financials = getFinancialSummary();
  const sales = getSales();
  const expenses = getExpenses();

  const [activeTab, setActiveTab] = useState<'pnl' | 'sales' | 'expenses'>('pnl');
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDownload = (format: 'PDF' | 'Excel') => {
    triggerToast(`Exporting ${reportPeriod} report as ${format} spreadsheet file...`);
  };

  // P&L calculation helpers
  const totalSalesVal = financials.totalSales;
  const simulatedCOGS = Math.round(totalSalesVal * 0.55); // simulated 55% Cost of Goods Sold
  const grossProfit = totalSalesVal - simulatedCOGS;
  const totalExpensesVal = financials.totalExpenses;
  const netProfitVal = grossProfit - totalExpensesVal;

  // Expense breakdown group
  const expenseByCategory = expenses.reduce((acc: any, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  // Sales items breakdown group
  const salesByItem = sales.reduce((acc: any, sale) => {
    sale.items.forEach(item => {
      acc[item.name] = (acc[item.name] || 0) + item.quantity;
    });
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6 text-left relative">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white rounded-2xl px-5 py-3.5 shadow-2xl flex items-center gap-3 animate-[slideUp_0.2s_ease-out] text-xs font-semibold">
          <BarChart3 size={16} className="text-brand-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Business Statements</h2>
          <p className="text-xs font-semibold text-slate-400">Generate, audit, and export financial sheets for tax filings</p>
        </div>
        
        {/* Date Filter & Export */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex bg-slate-100 rounded-xl p-1 text-xs shrink-0">
            {(['daily', 'weekly', 'monthly'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setReportPeriod(period)}
                className={`px-3 py-1.5 rounded-lg capitalize font-bold transition-all ${reportPeriod === period ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {period}
              </button>
            ))}
          </div>
          <div className="flex gap-2 shrink-0">
            <Button size="sm" variant="outline" icon={<Download size={14} />} onClick={() => handleDownload('Excel')}>
              Excel
            </Button>
            <Button size="sm" icon={<FileText size={14} />} onClick={() => handleDownload('PDF')}>
              PDF Print
            </Button>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid sm:grid-cols-4 gap-6">
        <Card className="border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Sales</span>
          <h4 className="text-xl font-black text-slate-800 mt-2">{settings.currency}{totalSalesVal.toLocaleString()}</h4>
          <p className="text-[9px] font-semibold text-emerald-600 mt-1">Total revenue collected</p>
        </Card>
        <Card className="border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">COGS (Simulated)</span>
          <h4 className="text-xl font-black text-slate-800 mt-2">{settings.currency}{simulatedCOGS.toLocaleString()}</h4>
          <p className="text-[9px] font-semibold text-slate-400 mt-1">Cost of Goods Sold (stock buy value)</p>
        </Card>
        <Card className="border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Operating Expenses</span>
          <h4 className="text-xl font-black text-slate-800 mt-2">{settings.currency}{totalExpensesVal.toLocaleString()}</h4>
          <p className="text-[9px] font-semibold text-rose-500 mt-1">Rent, wages, utilities outflow</p>
        </Card>
        <Card className={`border-slate-100 ${netProfitVal >= 0 ? 'bg-emerald-50/10 border-emerald-100/50' : 'bg-rose-50/10 border-rose-100/50'}`}>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Profit Ledger</span>
          <h4 className={`text-xl font-black mt-2 ${netProfitVal >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {settings.currency}{netProfitVal.toLocaleString()}
          </h4>
          <p className="text-[9px] font-semibold text-brand-600 mt-1">Operating margin profit margin</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 text-sm font-semibold text-slate-500">
        <button
          onClick={() => setActiveTab('pnl')}
          className={`pb-3.5 px-6 border-b-2 font-bold transition-all flex items-center gap-2 ${activeTab === 'pnl' ? 'border-brand-500 text-brand-600' : 'border-transparent hover:text-slate-800'}`}
        >
          <DollarSign size={16} />
          Profit & Loss Summary
        </button>
        <button
          onClick={() => setActiveTab('sales')}
          className={`pb-3.5 px-6 border-b-2 font-bold transition-all flex items-center gap-2 ${activeTab === 'sales' ? 'border-brand-500 text-brand-600' : 'border-transparent hover:text-slate-800'}`}
        >
          <TrendingUp size={16} />
          Sales Ledger Analytics
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`pb-3.5 px-6 border-b-2 font-bold transition-all flex items-center gap-2 ${activeTab === 'expenses' ? 'border-brand-500 text-brand-600' : 'border-transparent hover:text-slate-800'}`}
        >
          <TrendingDown size={16} />
          Operating Expenditures
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* PROFIT & LOSS STATEMENTS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'pnl' && (
        <Card className="flex flex-col gap-6 p-8">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Profit & Loss Ledger</h3>
              <p className="text-xs font-semibold text-slate-400">Statement period: Aug 1 - Aug 6, 2026</p>
            </div>
            <Badge variant="success">Balanced Ledger</Badge>
          </div>

          <div className="flex flex-col gap-4 text-xs font-semibold text-slate-600">
            {/* Income segment */}
            <div className="flex flex-col gap-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">1. Operating Income</h4>
              <div className="flex justify-between py-1.5 px-2">
                <span>Revenue Sales (Gross):</span>
                <span className="text-slate-800 font-bold">{settings.currency}{totalSalesVal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 px-2 bg-slate-50 rounded-lg">
                <span className="text-slate-800 font-bold">Total Operating Income:</span>
                <span className="text-slate-900 font-bold">{settings.currency}{totalSalesVal.toLocaleString()}</span>
              </div>
            </div>

            {/* COGS segment */}
            <div className="flex flex-col gap-2 mt-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">2. Cost of Sales (COGS)</h4>
              <div className="flex justify-between py-1.5 px-2">
                <span>Beginning Stock (Estimated):</span>
                <span className="text-slate-700">{settings.currency}45,000</span>
              </div>
              <div className="flex justify-between py-1.5 px-2">
                <span>Wholesale Purchases (Inventory):</span>
                <span className="text-slate-700">{settings.currency}{simulatedCOGS.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 px-2 bg-slate-50 rounded-lg">
                <span className="text-slate-800 font-bold">Total Cost of Goods Sold (COGS):</span>
                <span className="text-slate-950 font-bold">{settings.currency}{simulatedCOGS.toLocaleString()}</span>
              </div>
            </div>

            {/* Gross Margin */}
            <div className="flex justify-between py-2 px-2 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-100/50 mt-2">
              <span>Gross Profit (Income - COGS):</span>
              <span>{settings.currency}{grossProfit.toLocaleString()}</span>
            </div>

            {/* Operating Expenses segment */}
            <div className="flex flex-col gap-2 mt-4">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">3. Operating Expenses</h4>
              {Object.keys(expenseByCategory).map((cat) => (
                <div key={cat} className="flex justify-between py-1.5 px-2">
                  <span>{cat} expenditure:</span>
                  <span className="text-slate-800 font-semibold">{settings.currency}{expenseByCategory[cat].toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between py-1.5 px-2 bg-slate-50 rounded-lg">
                <span className="text-slate-800 font-bold">Total Operating Expenses:</span>
                <span className="text-slate-900 font-bold">{settings.currency}{totalExpensesVal.toLocaleString()}</span>
              </div>
            </div>

            {/* Divider line */}
            <div className="h-px bg-slate-150 my-2" />

            {/* Net PnL statement */}
            <div className={`flex justify-between py-3 px-4 rounded-xl text-sm font-bold border ${netProfitVal >= 0 ? 'bg-gradient-to-r from-emerald-50 to-emerald-100/50 text-emerald-800 border-emerald-200/50 shadow-xs' : 'bg-rose-50 text-rose-800 border-rose-200/50'}`}>
              <span className="flex items-center gap-1.5">
                <Sparkles size={16} /> Net Profit / Loss:
              </span>
              <span className="text-base">{settings.currency}{netProfitVal.toLocaleString()}</span>
            </div>
          </div>
        </Card>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SALES LEDGER ANALYTICS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'sales' && (
        <Card className="flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Top Selling Products</h3>
              <p className="text-[10px] font-semibold text-slate-400">Total units sold in current period</p>
            </div>
            <PieChart size={16} className="text-slate-400" />
          </div>

          <div className="flex flex-col gap-3 font-semibold">
            {Object.keys(salesByItem).length === 0 ? (
              <p className="py-8 text-center text-slate-400 text-xs">No sale products ledger registered.</p>
            ) : (
              Object.keys(salesByItem).map((itemName, index) => (
                <div key={index} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                  <span className="text-slate-700 font-bold">{itemName}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400">Total sold:</span>
                    <span className="text-slate-800 font-black">{salesByItem[itemName]} units</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* ------------------------------------------------------------- */}
      {/* OPERATING EXPENDITURES */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'expenses' && (
        <Card className="flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Expenses Categorized Ledger</h3>
              <p className="text-[10px] font-semibold text-slate-400">Consolidated outflows</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 font-semibold">
            {Object.keys(expenseByCategory).length === 0 ? (
              <p className="py-8 text-center text-slate-400 text-xs">No expense logs registered.</p>
            ) : (
              Object.keys(expenseByCategory).map((cat, index) => (
                <div key={index} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                  <span className="text-slate-700 font-bold uppercase tracking-wider">{cat} costs</span>
                  <span className="text-slate-900 font-black">{settings.currency}{expenseByCategory[cat].toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
