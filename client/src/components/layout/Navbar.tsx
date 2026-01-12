import React from 'react';
import { useLocation, Link } from 'wouter';
import {
  Home,
  Music,
  Book,
  MessageCircle,
  Sparkles,
  Settings as SettingsIcon,
} from 'lucide-react';

export const Navbar = () => {
  const [location] = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/music', icon: Music, label: 'Music' },
    { path: '/journal', icon: Book, label: 'Journal' },
    { path: '/aichat', icon: MessageCircle, label: 'Chat' },
    { path: '/inspiration', icon: Sparkles, label: 'Inspire' },
    { path: '/settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <nav className="sticky top-4 z-50 flex justify-center w-full px-4 mb-6">
      <div className="flex items-center gap-1 p-1.5 bg-white/80 backdrop-blur-xl border border-white/20 rounded-full shadow-lg shadow-slate-200/20">
        {navItems.map((item) => {
          const isActive =
            location === item.path ||
            (item.path !== '/' && location.startsWith(item.path));

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300
                ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }
              `}
            >
              <item.icon
                className={`w-4 h-4 ${
                  isActive ? 'text-white' : 'text-current'
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  isActive ? 'block' : 'hidden md:block'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
