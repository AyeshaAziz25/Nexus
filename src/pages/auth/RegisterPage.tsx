import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, CircleDollarSign, Building2, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UserRole } from '../../types';

// --- Password Meter Component ---
const PasswordStrengthMeter: React.FC<{ password: string }> = ({ password }) => {
  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains a number', met: /\d/.test(password) },
    { label: 'Mix of Uppercase & Lowercase', met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: 'Special character (!@#$%)', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const strengthScore = requirements.filter((req) => req.met).length;

  const strengthConfig = [
    { label: 'Very Weak', color: 'bg-red-500', width: '25%' },
    { label: 'Weak', color: 'bg-orange-500', width: '50%' },
    { label: 'Good', color: 'bg-yellow-500', width: '75%' },
    { label: 'Strong', color: 'bg-green-500', width: '100%' },
  ];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex justify-between items-center text-xs mb-1">
        <span className="text-gray-500">Strength: </span>
        <span className="font-bold text-gray-700">
          {strengthScore > 0 ? strengthConfig[strengthScore - 1].label : 'Too Short'}
        </span>
      </div>
      
      {/* Visual Bar */}
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${strengthScore > 0 ? strengthConfig[strengthScore - 1].color : ''}`}
          style={{ width: strengthScore > 0 ? strengthConfig[strengthScore - 1].width : '5%' }}
        />
      </div>

      {/* Checklist */}
      <ul className="grid grid-cols-2 gap-1 mt-2">
        {requirements.map((req, index) => (
          <li key={index} className="flex items-center text-[10px] space-x-1">
            {req.met ? (
              <CheckCircle2 size={10} className="text-green-500" />
            ) : (
              <XCircle size={10} className="text-gray-300" />
            )}
            <span className={req.met ? 'text-green-700 font-medium' : 'text-gray-400'}>
              {req.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- Main Registration Page ---
export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('entrepreneur');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password, role);
      navigate(role === 'entrepreneur' ? '/dashboard/entrepreneur' : '/dashboard/investor');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary-600 rounded-md flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">Join Business Nexus to connect with partners</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded-md flex items-start">
              <AlertCircle size={18} className="mr-2 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I am registering as a</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('entrepreneur')}
                  className={`py-2 px-4 border rounded-md flex items-center justify-center text-sm transition-all ${
                    role === 'entrepreneur' ? 'border-primary-600 bg-primary-50 text-primary-700 ring-1 ring-primary-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Building2 size={16} className="mr-2" /> Entrepreneur
                </button>
                <button
                  type="button"
                  onClick={() => setRole('investor')}
                  className={`py-2 px-4 border rounded-md flex items-center justify-center text-sm transition-all ${
                    role === 'investor' ? 'border-primary-600 bg-primary-50 text-primary-700 ring-1 ring-primary-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <CircleDollarSign size={16} className="mr-2" /> Investor
                </button>
              </div>
            </div>

            <Input
              label="Full name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              startAdornment={<User size={18} className="text-gray-400" />}
            />

            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              startAdornment={<Mail size={18} className="text-gray-400" />}
            />

            {/* Password with Meter */}
            <div>
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                startAdornment={<Lock size={18} className="text-gray-400" />}
              />
              <PasswordStrengthMeter password={password} />
            </div>

            <Input
              label="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
              startAdornment={<Lock size={18} className="text-gray-400" />}
            />

            <div className="flex items-start">
              <input id="terms" type="checkbox" required className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded" />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the <span className="text-primary-600 hover:underline cursor-pointer">Terms</span> and <span className="text-primary-600 hover:underline cursor-pointer">Privacy Policy</span>
              </label>
            </div>

            <Button type="submit" fullWidth isLoading={isLoading} className="mt-2">
              Create account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/Login" className="font-medium text-primary-600 hover:text-primary-500 underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};