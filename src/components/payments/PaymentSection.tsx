import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  Send, 
  Plus, 
  CreditCard,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardBody, CardHeader } from '../ui/Card';

interface Transaction {
  id: string;
  type: 'Deposit' | 'Withdraw' | 'Transfer' | 'Funding';
  amount: number;
  partner: string;
  date: string;
  status: 'Completed' | 'Pending' | 'Processing';
}

export const PaymentSection: React.FC<{ role: 'investor' | 'entrepreneur' }> = ({ role }) => {
  const [balance, setBalance] = useState(role === 'investor' ? 250000 : 5400);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', type: 'Funding', amount: 50000, partner: 'TechNova Startup', date: '2026-04-01', status: 'Completed' },
    { id: '2', type: 'Deposit', amount: 10000, partner: 'Bank Account ****4242', date: '2026-03-28', status: 'Completed' },
    { id: '3', type: 'Withdraw', amount: 2500, partner: 'External Wallet', date: '2026-03-25', status: 'Pending' },
  ]);

  const handleSimulateTransaction = (type: 'Deposit' | 'Transfer') => {
    const amount = type === 'Deposit' ? 1000 : 5000;
    
    // Update Balance
    if (type === 'Deposit') setBalance(prev => prev + amount);
    else setBalance(prev => prev - amount);

    // Add to History
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: type,
      amount: amount,
      partner: type === 'Deposit' ? 'Stripe Top-up' : 'Venture Deal X',
      date: new Date().toISOString().split('T')[0],
      status: 'Completed'
    };
    setTransactions([newTx, ...transactions]);
    alert(`${type} of $${amount.toLocaleString()} successful!`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. WALLET BALANCE CARD (Stripe/PayPal Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 font-medium mb-1">Total Balance</p>
                <h2 className="text-4xl font-bold tracking-tight">
                  ${balance.toLocaleString()} <span className="text-lg text-slate-500 font-normal">USD</span>
                </h2>
              </div>
              <div className="bg-slate-800 p-3 rounded-2xl">
                <Wallet className="text-indigo-400" size={28} />
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <Button 
                onClick={() => handleSimulateTransaction('Deposit')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white border-none flex-1 py-6 rounded-2xl"
              >
                <Plus size={18} className="mr-2" /> Deposit
              </Button>
              <Button 
                variant="outline" 
                className="border-slate-700 text-white hover:bg-slate-800 flex-1 py-6 rounded-2xl"
              >
                <ArrowUpRight size={18} className="mr-2" /> Withdraw
              </Button>
            </div>
          </div>
          {/* Decorative Background Pattern */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Quick Stats Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-4">Quick Pay</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CreditCard size={16} className="text-slate-400" /> **** 9012
                </div>
                <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-600">Default</span>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => handleSimulateTransaction('Transfer')}
            className="w-full bg-slate-100 text-slate-900 hover:bg-slate-200 border-none py-4"
          >
            {role === 'investor' ? 'Execute Funding' : 'Transfer Funds'}
          </Button>
        </div>
      </div>

      {/* 2. TRANSACTION HISTORY TABLE */}
      <Card className="border-none shadow-sm ring-1 ring-slate-100 overflow-hidden">
        <CardHeader className="flex flex-row justify-between items-center border-b border-slate-50 p-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <History size={20} className="text-slate-400" /> Transaction History
          </h3>
          <span className="text-sm text-indigo-600 font-medium cursor-pointer hover:underline">Download CSV</span>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Entity / Partner</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      {tx.status === 'Completed' ? (
                        <CheckCircle2 size={18} className="text-emerald-500" />
                      ) : (
                        <Clock size={18} className="text-amber-500" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-700">{tx.partner}</p>
                      <p className="text-[10px] text-slate-400">ID: TXN-{tx.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{tx.date}</td>
                    <td className={`px-6 py-4 text-right font-bold text-sm ${
                      tx.type === 'Deposit' || (role === 'entrepreneur' && tx.type === 'Funding')
                        ? 'text-emerald-600'
                        : 'text-slate-900'
                    }`}>
                      {tx.type === 'Deposit' || (role === 'entrepreneur' && tx.type === 'Funding') ? '+' : '-'}
                      ${tx.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {transactions.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-slate-400 italic">No transactions found.</p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};