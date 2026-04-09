import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, AlertCircle, ShieldAlert, Lock, Fingerprint } from 'lucide-react';
import VideoCallSection from '../../components/VideoCallSection';
import DocumentChamber from '../../components/DocumentChamber';
import MeetingCalendar from '../../components/MeetingCalendar'; 
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input'; // Ensure this is imported
import { CollaborationRequestCard } from '../../components/collaboration/CollaborationRequestCard';
import { InvestorCard } from '../../components/investor/InvestorCard';
import { useAuth } from '../../context/AuthContext';
import { getRequestsForEntrepreneur } from '../../data/collaborationRequests';
import { investors } from '../../data/users';
import { PaymentSection } from '../../components/payments/PaymentSection';

export const EntrepreneurDashboard: React.FC = () => {
  const { pathname, hash } = useLocation();
  const { user } = useAuth();
  const [collaborationRequests, setCollaborationRequests] = useState<any[]>([]);
  const recommendedInvestors = investors.slice(0, 3);
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100); // Small delay to ensure the page has loaded
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]); // Runs every time the link changes
  useEffect(() => {
    if (user) {
      const requests = getRequestsForEntrepreneur(user.id);
      setCollaborationRequests(requests);
    }
  }, [user]);

  if (!user) return null;
  const pendingRequests = collaborationRequests.filter(req => req.status === 'pending');

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = calculateStrength(password);
  const strengthColors = ["bg-gray-200", "bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];

  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      (nextInput as HTMLInputElement)?.focus();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10 max-w-7xl mx-auto px-4">
      {/* 1. HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
        <p className="text-gray-600">Your startup control center</p>
      </div>

      {/* 2. CALENDAR - Added ID */}
      <Card >
        <CardHeader><h2 className="text-xl font-bold">Meeting Scheduler</h2></CardHeader>
        <CardBody><MeetingCalendar /></CardBody>
      </Card>

      {/* 3. PITCH & DOCUMENTS - Added IDs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div id="pitch-room" className="lg:col-span-7 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
            Live Pitch Room
          </h2>
          <VideoCallSection />
        </div>

        <div id="documents" className="lg:col-span-5 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-green-600 rounded-full"></span>
            Document Chamber
          </h2>
          <DocumentChamber />
        </div>
      </div>

      {/* 4. FINANCES - Added ID */}
      <div id="finances" className="space-y-4 pt-4 border-t border-gray-100">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
          Finances & Wallet
        </h2>
        <PaymentSection role="entrepreneur" />
      </div>

      {/* 5. SECURITY - Added ID */}
      <section id="security" className="space-y-4 pt-4 border-t border-gray-100">
        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
          <ShieldAlert className="text-emerald-600" size={22} />
          Security & Access Control
        </h2>
        <Card className="border-emerald-100 bg-emerald-50/30">
          <CardBody>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Lock size={18} className="text-emerald-700"/> Update Master Password
                </h3>
                <Input type="password" placeholder="Minimum 8 characters..." value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden flex gap-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className={`h-full flex-1 transition-all ${step <= strength ? strengthColors[strength] : 'bg-gray-200'}`} />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Fingerprint size={18} className="text-emerald-700"/> 2FA Authentication
                </h3>
                <div className="flex gap-2">
                  {otp.map((digit, i) => (
                    <input key={i} id={`otp-${i}`} type="text" maxLength={1} value={digit} onChange={(e) => handleOtpChange(e.target.value, i)} className="w-10 h-12 text-center border-2 border-emerald-200 rounded-md focus:border-emerald-500 outline-none" />
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* 6. COLLABORATION */}
      {/* 1. Change the wrapper to span all 3 columns */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
  <div className="lg:col-span-3"> {/* Changed from col-span-2 to col-span-3 */}
    <Card>
      <CardHeader>
        <h2 className="text-lg font-medium text-gray-900">Collaboration Requests</h2>
      </CardHeader>
      <CardBody>
        {collaborationRequests.length > 0 ? (
          collaborationRequests.map(req => (
            <CollaborationRequestCard key={req.id} request={req} onStatusUpdate={() => {}} />
          ))
        ) : (
          <p className="text-center py-8">No requests yet</p>
        )}
      </CardBody>
    </Card>
  </div>
</div>
    </div>
  );
};