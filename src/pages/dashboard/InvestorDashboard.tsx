import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Added useLocation
import { 
  Users, Filter, Search, PlusCircle, 
  Wallet, TrendingUp, Video, FileText, 
  Fingerprint, Smartphone, ShieldAlert, Lock 
} from 'lucide-react';

// Components
import VideoCallSection from '../../components/VideoCallSection';
import DocumentChamber from '../../components/DocumentChamber';
import MeetingCalendar from '../../components/MeetingCalendar';
import { PaymentSection } from '../../components/payments/PaymentSection';

// UI Components
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';

// Context & Data
import { useAuth } from '../../context/AuthContext';
import { entrepreneurs } from '../../data/users';

export const InvestorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { pathname, hash } = useLocation(); // Get URL hash
  const [searchQuery, setSearchQuery] = useState('');
  
  // Security States
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  // --- NEW: Scroll to Section Logic ---
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [pathname, hash]);

  if (!user) return null;

  const isInvestor = user.role === 'investor';

  // Logic: Password Strength
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
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back, {user.name}</h1>
          <p className="text-gray-600">{isInvestor ? "Investor Control Center" : "Founder Dashboard"}</p>
        </div>
        <Link to="/entrepreneurs">
          <Button leftIcon={<PlusCircle size={18} />}>View All Startups</Button>
        </Link>
      </div>

      {/* 2. CALENDAR - Added ID */}
      <section id="meetings" className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
          Availability & Meetings
        </h2>
        <Card className="w-full">
          <CardBody>
            <MeetingCalendar />
          </CardBody>
        </Card>
      </section>

      {/* 3. LIVE PITCH & DOCUMENTS - Added IDs */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
        <div id="pitch-room" className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Video size={20} className="text-indigo-600" />
            Live Pitch Room
          </h2>
          <VideoCallSection />
        </div>
        <div id="documents" className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText size={20} className="text-green-600" />
            Document Chamber
          </h2>
          <DocumentChamber />
        </div>
      </section>

      {/* 4. FINANCE SECTION - Added ID */}
      <section id="portfolio" className="space-y-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Wallet size={22} className="text-indigo-600" />
            Investment Funds & Wallet
          </h2>
          <Badge variant="success">Active Portfolio</Badge>
        </div>
        <div className="max-w-4xl">
          <PaymentSection role={user.role} />
        </div>
      </section>

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
                <div className="flex items-center gap-2">
                  <Lock className="text-emerald-700" size={18} />
                  <h3 className="font-bold text-sm">Update Master Password</h3>
                </div>
                <Input 
                  type="password" 
                  placeholder="Minimum 8 characters..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                />
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden flex gap-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div 
                      key={step}
                      className={`h-full flex-1 transition-all duration-500 ${step <= strength ? strengthColors[strength] : 'bg-gray-200'}`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Fingerprint className="text-emerald-700" size={18} />
                  <h3 className="font-bold text-sm">Two-Factor Authentication</h3>
                </div>
                <div className="flex gap-2">
                  {otp.map((digit, i) => (
                    <input 
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, i)}
                      className="w-10 h-12 text-center text-xl font-bold border-2 border-emerald-200 rounded-md bg-white focus:border-emerald-500 outline-none transition-all"
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* 6. FEATURED STARTUPS */}
      <section className="pt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Featured Opportunities</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {entrepreneurs.slice(0, 3).map(e => (
                <EntrepreneurCard key={e.id} entrepreneur={e} />
              ))}
            </div>
          </CardBody>
        </Card>
      </section>
    </div>
  );
};