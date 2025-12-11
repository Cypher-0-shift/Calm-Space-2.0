import { Link, useLocation } from "wouter";
import { useMoodTheme } from "@/hooks/useMoodTheme";
import ParticlesBackground from "./ParticlesBackground";
import DevResetButton from "./DevResetButton";

const navItems = [
  { name: "Home", path: "/", icon: "🏠", id: "nav-home" },
  { name: "Music", path: "/music", icon: "🎵", id: "nav-music" },
  { name: "Journal", path: "/journal", icon: "📓", id: "nav-journal" },
  { name: "AI Chat", path: "/aichat", icon: "💬", id: "nav-ai" },
  { name: "Panic", path: "/panic", icon: "🌬️", id: "nav-panic" },
  { name: "Games", path: "/games", icon: "🎮", id: "nav-games" },
  { name: "Creativity", path: "/creativity", icon: "🎨", id: "nav-creativity" },
  { name: "Inspiration", path: "/inspiration", icon: "🌈", id: "nav-inspiration" },
  { name: "Relaxation", path: "/relaxation", icon: "🧘‍♀️", id: "nav-relaxation" },
  { name: "Settings", path: "/settings", icon: "⚙️", id: "nav-settings" },
];

interface AppWrapperProps {
  children: React.ReactNode;
}

const AppWrapper = ({ children }: AppWrapperProps) => {
  const [location] = useLocation();
  const { theme } = useMoodTheme();

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br ${theme} transition-all duration-700`}>
      <ParticlesBackground />
      
      {/* Top Navbar - Desktop */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 justify-center items-center glass px-6 py-3 space-x-3 sm:space-x-6">
        {navItems.map(({ name, path, icon, id }) => (
          <Link
            key={id}
            href={path}
            className={`text-sm sm:text-base font-medium px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-purple-100/60 hover:text-purple-800 ${
              location === path
                ? "bg-purple-200 text-purple-900"
                : "text-gray-800 dark:text-gray-200"
            }`}
          >
            {icon} {name}
          </Link>
        ))}
      </nav>

      {/* Bottom Navbar - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-dark flex justify-around py-2 px-4 border-t border-gray-200/20">
        {navItems.slice(0, 5).map(({ name, path, icon, id }) => (
          <Link
            key={id}
            href={path}
            className={`text-xs flex flex-col items-center ${
              location === path
                ? "text-purple-300"
                : "text-gray-400"
            }`}
          >
            <span className="text-lg">{icon}</span>
            <span className="mt-0.5">{name}</span>
          </Link>
        ))}
      </nav>

      {/* Main Content */}
      <main className="relative z-[1] flex-grow pt-20 pb-20 px-4 sm:px-8 w-full max-w-7xl mx-auto">
        {children}
      </main>

      <DevResetButton />
    </div>
  );
};

export default AppWrapper;
