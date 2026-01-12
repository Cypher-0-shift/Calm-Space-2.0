import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface TouchableProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  scale?: number; // How much it shrinks (0.95 is standard premium feel)
}

export const Touchable = ({ 
  children, 
  className, 
  onClick, 
  scale = 0.96,
  ...props 
}: TouchableProps) => {
  return (
    <motion.button
      // The Physics of the Tap
      whileHover={{ scale: 1.02 }} 
      whileTap={{ scale: scale }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 15, // Low damping = more bouncy
        mass: 1 
      }}
      
      onClick={onClick}
      className={cn(
        "cursor-pointer select-none outline-none",
        // This ensures the element respects layout but handles transform
        "inline-flex items-center justify-center", 
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};