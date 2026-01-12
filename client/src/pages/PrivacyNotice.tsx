// client/src/pages/PrivacyNotice.tsx

import React from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Shield, EyeOff, Lock, RefreshCcw } from 'lucide-react';

const PrivacyNotice: React.FC = () => {
    const [, setLocation] = useLocation();

    // Pure navigation, no storage or API side effects
    const handleContinue = () => {
        setLocation('/profile-setup');
    };

    const handleReadLater = () => {
        setLocation('/');
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#FAFAFA] flex items-center justify-center p-6">
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-2xl w-full space-y-12"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="p-3 bg-slate-100 rounded-full">
                            <Shield className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
                        </div>
                    </div>
                    <h1 className="text-3xl font-light text-slate-900 tracking-tight">
                        Your space stays yours.
                    </h1>
                </motion.div>

                {/* Core Pillars */}
                <div className="grid md:grid-cols-2 gap-8">
                    
                    {/* Pillar 1 */}
                    <motion.div variants={itemVariants} className="space-y-3">
                        <div className="flex items-center gap-3 text-slate-900">
                            <EyeOff className="w-5 h-5 opacity-50" strokeWidth={1.5} />
                            <h3 className="font-medium">What we don’t do</h3>
                        </div>
                        <ul className="text-slate-500 font-light text-sm space-y-2 leading-relaxed pl-8 border-l border-slate-100">
                            <li>We don’t track your movements.</li>
                            <li>We don’t sell your history.</li>
                            <li>We don’t watch over your shoulder.</li>
                        </ul>
                    </motion.div>

                    {/* Pillar 2 */}
                    <motion.div variants={itemVariants} className="space-y-3">
                        <div className="flex items-center gap-3 text-slate-900">
                            <Lock className="w-5 h-5 opacity-50" strokeWidth={1.5} />
                            <h3 className="font-medium">What happens here</h3>
                        </div>
                        <ul className="text-slate-500 font-light text-sm space-y-2 leading-relaxed pl-8 border-l border-slate-100">
                            <li>You can exist here without creating anything.</li>
                            <li>Nothing is saved unless you ask.</li>
                            <li>You can leave quietly anytime.</li>
                        </ul>
                    </motion.div>

                    {/* Pillar 3 */}
                    <motion.div variants={itemVariants} className="space-y-3">
                        <div className="flex items-center gap-3 text-slate-900">
                            <div className="w-5 h-5 rounded-full border border-slate-300 opacity-50" />
                            <h3 className="font-medium">When things change</h3>
                        </div>
                        <ul className="text-slate-500 font-light text-sm space-y-2 leading-relaxed pl-8 border-l border-slate-100">
                            <li>This space adapts only if you allow it.</li>
                            <li>It listens to understand, not to report.</li>
                            <li>You will always be asked first.</li>
                        </ul>
                    </motion.div>

                    {/* Pillar 4 */}
                    <motion.div variants={itemVariants} className="space-y-3">
                        <div className="flex items-center gap-3 text-slate-900">
                            <RefreshCcw className="w-5 h-5 opacity-50" strokeWidth={1.5} />
                            <h3 className="font-medium">Your control</h3>
                        </div>
                        <ul className="text-slate-500 font-light text-sm space-y-2 leading-relaxed pl-8 border-l border-slate-100">
                            <li>Reset this entire space anytime.</li>
                            <li>Delete memories instantly.</li>
                            <li>Change your mind whenever you need.</li>
                        </ul>
                    </motion.div>
                </div>

                {/* Actions */}
                <motion.div variants={itemVariants} className="flex flex-col items-center gap-6 pt-8">
                    <Button 
                        size="lg"
                        className="rounded-full px-12 h-14 text-lg font-normal bg-slate-900 text-white hover:bg-slate-800 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02]"
                        onClick={handleContinue}
                    >
                        Continue
                    </Button>

                    <button 
                        onClick={handleReadLater}
                        className="text-sm text-slate-400 hover:text-slate-600 transition-colors font-light"
                    >
                        I’ll read later
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default PrivacyNotice;