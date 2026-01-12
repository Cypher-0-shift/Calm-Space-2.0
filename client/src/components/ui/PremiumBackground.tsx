import { motion } from "framer-motion";

export const PremiumBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#F5F7FA] dark:bg-[#050505] transition-colors duration-700">
      
      {/* 1. The Fog Layer (Noise) - Adds texture so gradients don't band */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none z-0"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* 2. Primary Orb (Calm Blue/Purple) - Drifts Top Left */}
      <motion.div
        animate={{
          x: [0, 50, -30, 0],
          y: [0, 80, 20, 0],
          scale: [1, 1.2, 0.9, 1],
          opacity: [0.3, 0.5, 0.3, 0.3]
        }}
        transition={{ 
          duration: 25, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute -top-[10%] -left-[10%] w-[70vw] h-[70vw] rounded-full blur-[80px] md:blur-[120px] bg-purple-300/40 dark:bg-indigo-900/30 mix-blend-multiply dark:mix-blend-screen"
      />

      {/* 3. Secondary Orb (Warmth/Pink) - Drifts Center Right */}
      <motion.div
        animate={{
          x: [0, -60, 30, 0],
          y: [0, -40, 60, 0],
          scale: [1, 1.1, 0.95, 1],
          opacity: [0.3, 0.6, 0.4, 0.3]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2 
        }}
        className="absolute top-[30%] -right-[20%] w-[60vw] h-[60vw] rounded-full blur-[90px] md:blur-[140px] bg-pink-300/40 dark:bg-fuchsia-900/20 mix-blend-multiply dark:mix-blend-screen"
      />

      {/* 4. Tertiary Orb (Grounding Teal/Blue) - Drifts Bottom Left */}
      <motion.div
        animate={{
          x: [0, 70, -50, 0],
          y: [0, -60, -20, 0],
          scale: [1, 1.3, 1.1, 1],
        }}
        transition={{ 
          duration: 28, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 5
        }}
        className="absolute -bottom-[20%] -left-[10%] w-[80vw] h-[80vw] rounded-full blur-[100px] md:blur-[160px] bg-blue-200/50 dark:bg-cyan-900/20 mix-blend-multiply dark:mix-blend-screen"
      />

      {/* 5. The "Glow" Overlay - subtle gradient to merge everything */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/40 dark:via-black/10 dark:to-black/60 pointer-events-none" />
    </div>
  );
};