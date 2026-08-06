import React, { useState } from 'react';
import { 
  Download, 
  Briefcase, 
  ShieldAlert, 
  Mail, 
  Phone, 
  Clock
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { getCAClients, getSettings } from '../../mock';
import type { CAClient } from '../../mock';

export const CAPortalPage: React.FC = () => {
  const settings = getSettings();
  const [clients] = useState<CAClient[]>(getCAClients());
  const [activeClient, setActiveClient] = useState<CAClient | null>(null);
  
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAudit = (client: CAClient) => {
    setActiveClient(client);
    setIsAuditOpen(true);
  };

  const handleSendReminder = (client: CAClient) => {
    triggerToast(`Sent tax filing alert to ${client.ownerName} (${client.businessName}) regarding GST liability.`);
  };

  const handleDownloadGST = (client: CAClient) => {
    triggerToast(`Downloaded GSTR-1 and GSTR-3B tax logs for ${client.businessName}.`);
  };

  return (
    <div className="flex flex-col gap-6 text-left relative">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white rounded-2xl px-5 py-3.5 shadow-2xl flex items-center gap-3 animate-[slideUp_0.2s_ease-out] text-xs font-semibold">
          <Briefcase size={16} className="text-brand-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">CA Auditor / Accountant Portal</h2>
          <p className="text-xs font-semibold text-slate-400">Review client ledger balances, tax filings, and GST details</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3.5 py-2 rounded-xl">
          <Clock size={14} className="text-slate-400" />
          <span>Filing Deadline: 10th Aug 2026</span>
        </div>
      </div>

      {/* Accountant Stats Summary */}
      <div className="grid sm:grid-cols-3 gap-6">
        <Card className="border-slate-100 bg-slate-50/10">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Audits</span>
          <h3 className="text-2xl font-extrabold text-slate-800 mt-2">{clients.length} Clients</h3>
          <p className="text-[10px] font-medium text-slate-400 mt-1">registered business ledgers</p>
        </Card>

        <Card className="border-emerald-100 bg-emerald-50/10">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">GST Filings Done</span>
          <h3 className="text-2xl font-extrabold text-slate-800 mt-2">
            {clients.filter(c => c.gstStatus === 'Filed').length} Filed
          </h3>
          <p className="text-[10px] font-medium text-slate-400 mt-1">tax sheets reconciled</p>
        </Card>

        <Card className="border-rose-100 bg-rose-50/10">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Dues</span>
          <h3 className="text-2xl font-extrabold text-slate-850 mt-2 text-rose-600">
            {clients.filter(c => c.gstStatus !== 'Filed').length} Pending
          </h3>
          <p className="text-[10px] font-medium text-slate-400 mt-1">overdue notifications warning</p>
        </Card>
      </div>

      {/* Clients list table */}
      <Card className="overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-left">
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Client Shop</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Owner Name</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Annual Turnover</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Tax Liability</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Filing Status</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-slate-800">{client.businessName}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-600">{client.ownerName}</td>
                  <td className="px-6 py-4 text-xs font-extrabold text-slate-900">{settings.currency}{client.turnoverCurrentYear.toLocaleString()}</td>
                  <td className="px-6 py-4 text-xs font-extrabold text-slate-800">
                    {client.taxDue > 0 ? (
                      <span className="text-rose-600">{settings.currency}{client.taxDue.toLocaleString()}</span>
                    ) : (
                      <span className="text-slate-400 font-medium">Nil</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <Badge variant={client.gstStatus === 'Filed' ? 'success' : client.gstStatus === 'Pending' ? 'warning' : 'danger'}>
                      {client.gstStatus}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-xs text-right flex justify-end gap-2.5">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      className="!py-1.5 !px-2.5"
                      onClick={() => handleAudit(client)}
                    >
                      Audit
                    </Button>
                    {client.gstStatus !== 'Filed' && (
                      <button 
                        onClick={() => handleSendReminder(client)}
                        className="p-1.5 bg-slate-50 hover:bg-rose-50 hover:text-accent-rose rounded-lg text-slate-400 transition-colors"
                        title="Alert Client"
                      >
                        <ShieldAlert size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ------------------------------------------------------------- */}
      {/* AUDIT DETAILS VIEW MODAL */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        title={`Audit Ledger: ${activeClient?.businessName}`}
        size="md"
        footer={
          <div className="flex gap-3 justify-end w-full">
            <Button variant="outline" icon={<Download size={14} />} onClick={() => activeClient && handleDownloadGST(activeClient)}>
              Tax Logs
            </Button>
            <Button variant="primary" onClick={() => setIsAuditOpen(false)}>
              Reconciliation OK
            </Button>
          </div>
        }
      >
        {activeClient && (
          <div className="flex flex-col gap-5 text-left text-xs text-slate-600 font-medium">
            {/* Header metadata */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-800">{activeClient.businessName}</h4>
                <p className="text-[10px] text-slate-400 mt-1">GSTIN: {settings.gstin}</p>
              </div>
              <div className="text-right">
                <Badge variant={activeClient.gstStatus === 'Filed' ? 'success' : 'warning'}>
                  {activeClient.gstStatus}
                </Badge>
                <p className="text-[10px] text-slate-400 mt-1">Last filed: {activeClient.lastFilingDate}</p>
              </div>
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4.5 rounded-2xl border border-slate-100">
              <div className="flex flex-col gap-2">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Client Contact</span>
                <span className="text-slate-850 font-bold text-xs">{activeClient.ownerName}</span>
                <div className="flex items-center gap-1.5 mt-1 text-slate-500">
                  <Phone size={12} /> {activeClient.phone}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Auditor Actions</span>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="!py-1 bg-white hover:bg-slate-100 text-[10px] !px-2.5 rounded-lg border border-slate-200"
                    icon={<Mail size={11} />}
                    onClick={() => triggerToast(`Emailed statement draft request to ${activeClient.email}.`)}
                  >
                    Email Client
                  </Button>
                </div>
              </div>
            </div>

            {/* Financial tax overview logs */}
            <div className="flex flex-col gap-3 mt-1">
              <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wide">Filing Reconciliations</h4>
              <div className="border border-slate-100 rounded-xl divide-y divide-slate-100 font-semibold bg-white">
                <div className="flex justify-between p-3">
                  <span>Reconciled Turnover Year-to-date:</span>
                  <span className="text-slate-900 font-black">{settings.currency}{activeClient.turnoverCurrentYear.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-3">
                  <span>Assessed Tax Liability due (GST):</span>
                  <span className="text-rose-600 font-black">{settings.currency}{activeClient.taxDue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-3">
                  <span>GST Filing Form drafts:</span>
                  <span className="text-slate-600 font-bold">GSTR-1, GSTR-3B READY</span>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-slate-400 font-semibold leading-normal mt-1 border-t border-slate-100 pt-3">
              * GST reconciliations are dynamically generated matching simulated cash ledger inputs in ApnaBooks. Re-verify ledger attachments before filing.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};
