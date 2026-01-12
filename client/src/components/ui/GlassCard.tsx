import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils"; // Uses your existing utility

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "dark" | "frosted" | "clear"; // Different glass types
  hoverEffect?: boolean;
  delay?: number;
}

export const GlassCard = ({ 
  children, 
  className, 
  variant = "default", 
  hoverEffect = false,
  delay = 0,
  ...props 
}: GlassCardProps) => {

  // Define styles for different "Glass" variants
  const variants = {
    default: "bg-white/40 dark:bg-black/20 border-white/50 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]",
    dark: "bg-black/40 border-white/5 text-white shadow-xl",
    frosted: "bg-white/10 border-white/20 backdrop-blur-2xl shadow-lg",
    clear: "bg-transparent border-transparent shadow-none"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hoverEffect ? { 
        y: -4, 
        boxShadow: "0 20px 40px -5px rgba(0,0,0,0.1)",
        borderColor: "rgba(255,255,255,0.8)"
      } : undefined}
      transition={{ 
        duration: 0.5, 
        delay: delay, 
        ease: [0.23, 1, 0.32, 1] // "Quart" easing for premium feel
      }}
      className={cn(
        // Base Glass Styles
        "relative overflow-hidden backdrop-blur-xl rounded-3xl border",
        "transition-all duration-300 ease-out",
        variants[variant],
        className
      )}
      {...props}
    >
      {/* The "Sheen" Effect - A subtle gradient that runs across the top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50 pointer-events-none" />
      
      {/* The Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Optional: Subtle Inner Glow for depth */}
      <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10 pointer-events-none" />
    </motion.div>
  );
};