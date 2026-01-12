import { Link, useLocation } from "wouter";
import { useMood } from "@/context/MoodContext"; // 👈 Using the new Context
import { PremiumBackground } from "@/components/ui/PremiumBackground"; // 👈 The Breathing Blobs
import DevResetButton from "./DevResetButton"; // Keeping your dev tool
import { 
  Home, Music, Book, MessageCircle, Wind, 
  Gamepad2, Palette, Lightbulb, Settings as SettingsIcon 
} from "lucide-react"; // Using Lucide icons for cleaner look

const navItems = [
  { name: "Home", path: "/dashboard", icon: <Home className="w-5 h-5"/>, id: "nav-home" },
  { name: "Music", path: "/music", icon: <Music className="w-5 h-5"/>, id: "nav-music" },
  { name: "Journal", path: "/journal", icon: <Book className="w-5 h-5"/>, id: "nav-journal" },
  { name: "Chat", path: "/aichat", icon: <MessageCircle className="w-5 h-5"/>, id: "nav-ai" },
  { name: "Games", path: "/games", icon: <Gamepad2 className="w-5 h-5"/>, id: "nav-games" },
  { name: "Create", path: "/creativity", icon: <Palette className="w-5 h-5"/>, id: "nav-creativity" },
];

interface AppWrapperProps {
  children: React.ReactNode;
}

const AppWrapper = ({ children }: AppWrapperProps) => {
  const [location] = useLocation();
  const { theme } = useMood(); // 🧠 Get current theme from Brain

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden text-slate-800 dark:text-slate-100 font-sans">
      
      {/* 1. THE BREATHING ATMOSPHERE */}
      {/* This sits behind everything and changes color based on mood */}
      <PremiumBackground />
      
      {/* 2. Top Navbar - Desktop (Glass Effect) */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 justify-center items-center pt-6 pointer-events-none">
        <div className="glass px-6 py-2 rounded-full flex gap-2 pointer-events-auto shadow-sm border border-white/40 bg-white/30 backdrop-blur-md">
          {navItems.map(({ name, path, icon, id }) => {
            const isActive = location === path;
            return (
              <Link key={id} href={path}>
                <button
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                    ${isActive 
                      ? "bg-white text-primary shadow-sm" 
                      : "text-slate-600 hover:bg-white/50"
                    }
                  `}
                >
                  {icon}
                  {name}
                </button>
              </Link>
            );
          })}
           <Link href="/settings">
             <button className="p-2 rounded-full text-slate-600 hover:bg-white/50 transition-all">
               <SettingsIcon className="w-5 h-5" />
             </button>
           </Link>
        </div>
      </nav>

      {/* 3. Main Content Area */}
      {/* Added z-index to ensure it sits above background but below modals */}
      <main className="relative z-10 flex-grow pt-24 pb-24 px-4 sm:px-8 w-full max-w-7xl mx-auto">
        {children}
      </main>

      {/* 4. Bottom Navbar - Mobile (Glass Effect) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/20 bg-white/60 backdrop-blur-xl pb-safe">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.slice(0, 5).map(({ name, path, icon, id }) => {
            const isActive = location === path;
            return (
              <Link key={id} href={path}>
                <button
                  className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                    isActive ? "text-primary scale-110" : "text-slate-500"
                  } transition-all duration-200`}
                >
                  <span className="opacity-90">{icon}</span>
                  <span className="text-[10px] font-medium">{name}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </nav>

      <DevResetButton />
    </div>
  );
};

export default AppWrapper;