import { useEffect, useState } from 'react';

interface AppToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
}

export default function AppToast({ message, visible, onHide }: AppToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onHide();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [visible, onHide]);

  return (
    <div 
      className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg z-50 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {message}
    </div>
  );
}
