// src/components/AppToast.tsx
interface AppToastProps {
  message: string;
}

export default function AppToast({ message }: AppToastProps) {
  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg z-50 animate-bounce">
      {message}
    </div>
  );
}
