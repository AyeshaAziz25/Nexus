import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, Building2, CircleDollarSign, Users, MessageCircle, 
  Bell, FileText, Settings, HelpCircle, Video, ShieldCheck, Wallet, Calendar
} from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  id?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, text, id }) => {
  const location = useLocation();
  const currentPath = location.pathname + location.hash;
  const isActive = currentPath === to;

  return (
    <NavLink
      to={to}
      id={id}
      className={`flex items-center py-2.5 px-4 rounded-md transition-colors duration-200 ${
        isActive 
          ? 'bg-primary-50 text-primary-700 font-semibold' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span className="text-sm font-medium">{text}</span>
    </NavLink>
  );
};

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user) return null;
  
  const entrepreneurItems = [
    { id: 'tour-dashboard', to: '/dashboard/entrepreneur', icon: <Home size={20} />, text: 'Dashboard' },
    { id: 'tour-pitch', to: '/dashboard/entrepreneur#pitch-room', icon: <Video size={20} />, text: 'Live Pitch Room' },
    { id: 'tour-docs', to: '/dashboard/entrepreneur#documents', icon: <FileText size={20} />, text: 'Documents' },
    { id: 'tour-finance', to: '/dashboard/entrepreneur#finances', icon: <Wallet size={20} />, text: 'Finances' },
    { id: 'tour-security', to: '/dashboard/entrepreneur#security', icon: <ShieldCheck size={20} />, text: 'Security' },
    { id: 'tour-startup', to: '/profile/entrepreneur/' + user.id, icon: <Building2 size={20} />, text: 'My Startup' },
    { id: 'tour-investors', to: '/investors', icon: <CircleDollarSign size={20} />, text: 'Find Investors' },
    { id: 'tour-messages-sidebar', to: '/messages', icon: <MessageCircle size={20} />, text: 'Messages' },
  ];
  
  const investorItems = [
    { id: 'tour-dashboard', to: '/dashboard/investor', icon: <Home size={20} />, text: 'Dashboard' },
    { id: 'tour-meetings', to: '/dashboard/investor#meetings', icon: <Calendar size={20} />, text: 'Meetings' },
    { id: 'tour-pitch', to: '/dashboard/investor#pitch-room', icon: <Video size={20} />, text: 'Live Pitch Room' },
    { id: 'tour-docs', to: '/dashboard/investor#documents', icon: <FileText size={20} />, text: 'Documents' },
    { id: 'tour-finance', to: '/dashboard/investor#portfolio', icon: <Wallet size={20} />, text: 'Finance' },
    { id: 'tour-security', to: '/dashboard/investor#security', icon: <ShieldCheck size={20} />, text: 'Security' },
    { id: 'tour-profile-sidebar', to: '/profile/investor/' + user.id, icon: <CircleDollarSign size={20} />, text: 'My Profile' },
    { id: 'tour-entrepreneurs', to: '/entrepreneurs', icon: <Users size={20} />, text: 'Find Startups' },
    { id: 'tour-messages-sidebar', to: '/messages', icon: <MessageCircle size={20} />, text: 'Messages' },
  ];

  const sidebarItems = user.role === 'entrepreneur' ? entrepreneurItems : investorItems;
  
  const commonItems = [
    { id: 'tour-settings', to: '/settings', icon: <Settings size={20} />, text: 'Settings' },
    { id: 'tour-help', to: '/help', icon: <HelpCircle size={20} />, text: 'Help & Support' },
  ];
  
  return (
    <div className="w-64 bg-white h-full border-r border-gray-200 hidden md:block">
      <div className="h-full flex flex-col">
        <div className="flex-1 py-4 overflow-y-auto">
          <div className="px-3 space-y-1">
            {sidebarItems.map((item, index) => (
              <SidebarItem
                key={index}
                id={item.id}
                to={item.to}
                icon={item.icon}
                text={item.text}
              />
            ))}
          </div>
          
          <div className="mt-8 px-3">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Settings</h3>
            <div className="mt-2 space-y-1">
              {commonItems.map((item, index) => (
                <SidebarItem 
                  key={index} 
                  id={item.id} 
                  to={item.to} 
                  icon={item.icon} 
                  text={item.text} 
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-md p-3 text-center">
            <p className="text-xs text-gray-600 font-medium">support@businessnexus.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};
