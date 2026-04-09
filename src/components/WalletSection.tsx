import React, { useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, History, Send } from 'lucide-react';

export const WalletSection = ({ role }: { role: 'investor' | 'entrepreneur' }) => {
  const [balance, setBalance] = useState(role === 'investor' ? 500000 : 12500);
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'Inbound', amount: 5000, from: 'Seed Fund VC', date: '2026-04-01', status: 'Completed' },
    { id: 2, type: 'Outbound', amount: 1200, from: 'AWS Services', date: '2026-03-28', status: 'Pending' },
  ]);

  const simulateFunding = () => {
    const amount = 25000;
    if (role === 'investor') {
      setBalance(prev => prev - amount);
      alert(`Deal Funded! $${amount.toLocaleString()} transferred to startup.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Wallet Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-indigo-100 text-sm">Available Balance</p>
            <h3 className="text-3xl font-bold mt-1">${balance.toLocaleString()}</h3>
          </div>
          <Wallet className="text-indigo-200/50" size={40} />
        </div>
        <div className="flex gap-3">
          <button className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition">
            <ArrowDownLeft size={16} /> Deposit
          </button>
          <button onClick={simulateFunding} className="flex-1 bg-white text-indigo-600 hover:bg-indigo-50 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition">
            {role === 'investor' ? <Send size={16} /> : <ArrowUpRight size={16} />} 
            {role === 'investor' ? 'Fund Deal' : 'Withdraw'}
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-50 flex items-center gap-2">
          <History size={18} className="text-gray-400" />
          <h4 className="font-bold text-gray-700">Recent Activity</h4>
        </div>
        <div className="divide-y divide-gray-50">
          {transactions.map(tx => (
            <div key={tx.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${tx.type === 'Inbound' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {tx.type === 'Inbound' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{tx.from}</p>
                  <p className="text-[10px] text-gray-400">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${tx.type === 'Inbound' ? 'text-green-600' : 'text-gray-800'}`}>
                  {tx.type === 'Inbound' ? '+' : '-'}${tx.amount}
                </p>
                <p className="text-[10px] text-gray-400 uppercase">{tx.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};