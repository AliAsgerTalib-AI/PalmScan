/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { AlertTriangle, ArrowRight } from "lucide-react";

interface DisclaimerProps {
  onAccept: () => void;
}

export default function Disclaimer({ onAccept }: DisclaimerProps) {
  return (
    <div className="flex-grow flex items-center justify-center px-6 py-12 relative overflow-hidden min-h-[80vh] bg-surface">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(#141414_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full z-10 border border-border bg-surface-bright shadow-2xl"
      >
      

        <div className="p-8 md:p-12 space-y-8 font-mono text-xs leading-relaxed">
           <header className="border-b border-border/10 pb-6 mb-6">
              <h1 className="text-2xl font-bold tracking-tighter uppercase leading-none mb-2">
                 Legal Disclaimer & <span className="text-accent-orange">Terms of Use</span>
              </h1>
              
           </header>

           <section className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
              <div className="space-y-2">
                 <h2 className="text-sm font-bold text-accent-orange uppercase">For Entertainment Purposes Only</h2>
                 <p className="opacity-70">
                    The readings, interpretations, and insights provided by PalmScan are for entertainment purposes only. 
                    Palmistry is an interpretive art, and while it can provide personal insight, it is not an exact science.
                 </p>
              </div>

              <div className="space-y-2">
                 <h2 className="text-sm font-bold text-accent-orange uppercase">No Professional Advice</h2>
                 <p className="opacity-70">
                    The content on this website does not constitute medical, legal, financial, or psychological advice.
                 </p>
                 <ul className="list-disc pl-4 space-y-1 opacity-60">
                    <li><span className="font-bold">Health:</span> Do not use palmistry readings to diagnose or treat health conditions. Always consult a qualified medical professional.</li>
                    <li><span className="font-bold">Finances:</span> Any insights regarding wealth or career should not be taken as professional financial planning or investment advice.</li>
                    <li><span className="font-bold">Legal:</span> Consult a licensed attorney for any legal matters.</li>
                 </ul>
              </div>

              <div className="space-y-2">
                 <h2 className="text-sm font-bold text-accent-orange uppercase">Limitation of Liability</h2>
                 <p className="opacity-70">
                    PalmScan and its practitioners are not responsible for any actions, decisions, or outcomes resulting from the use of our services or information. 
                    By using this site, you acknowledge that you are responsible for your own life choices and exercise your own free will.
                 </p>
              </div>

              <div className="space-y-2">
                 <h2 className="text-sm font-bold text-accent-orange uppercase">Age Requirement</h2>
                 <p className="opacity-70">
                    You must be at least 18 years of age (or the age of majority in your jurisdiction) to request a reading or use the interactive tools on this site.
                 </p>
              </div>
           </section>

           <div className="pt-8 border-t border-border/10 flex flex-col items-center gap-6">
              <div className="flex items-center gap-4 text-[9px] opacity-40 uppercase tracking-widest text-center">
                 <span>By proceeding, you acknowledge the terms</span>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onAccept}
                className="w-full bg-primary text-white py-5 font-bold uppercase tracking-tighter hover:bg-neutral-800 transition-all flex items-center justify-center gap-4 shadow-lg group"
              >
                <span>Authorize & Initialize</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
