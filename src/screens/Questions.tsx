/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Dispatch, SetStateAction, ChangeEvent } from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { UserData, Screen } from "../types";

interface QuestionsProps {
  userData: UserData;
  setUserData: Dispatch<SetStateAction<UserData>>;
  onNext: (screen: Screen) => void;
  isAnalyzing: boolean;
}

export default function Questions({ userData, setUserData, onNext, isAnalyzing }: QuestionsProps) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserData(prev => ({
      ...prev,
      questions: { ...prev.questions, [e.target.name]: e.target.value }
    }));
  };

  return (
    <div className="flex-grow flex items-center justify-center px-6 py-12 relative overflow-hidden min-h-[80vh] bg-surface">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(#141414_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl w-full z-10 border border-border bg-surface-bright shadow-sm"
      >
        <div className="p-8 border-b border-border bg-surface-dim">
           <div className="label-serif mb-2">Protocol: subject-inquiry-v4</div>
           <h1 className="text-4xl font-mono tracking-tighter uppercase leading-none">Pose Thy <span className="text-accent-blue">Inquiry</span></h1>
        </div>

        <div className="p-8 md:p-12 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-12 space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-sm font-mono opacity-30">INQ_01</span>
                <span className="label-serif">The Foundation</span>
              </div>
              <input 
                type="text"
                name="foundation"
                value={userData.questions.foundation}
                onChange={handleInputChange}
                className="w-full bg-surface-dim border border-border/20 focus:border-accent-blue focus:ring-0 text-xl font-serif italic py-4 px-6 transition-all" 
                placeholder="Core intention..." 
              />
            </div>

            <div className="md:col-span-6 space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-sm font-mono opacity-30">INQ_02</span>
                <span className="label-serif">The Shadow</span>
              </div>
              <input 
                type="text"
                name="shadow"
                value={userData.questions.shadow}
                onChange={handleInputChange}
                className="w-full bg-surface-dim border border-border/20 focus:border-accent-blue focus:ring-0 text-lg font-serif italic py-4 px-6 transition-all" 
                placeholder="Unseen variables..." 
              />
            </div>

            <div className="md:col-span-6 space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-sm font-mono opacity-30">INQ_03</span>
                <span className="label-serif">The Horizon</span>
              </div>
              <input 
                type="text"
                name="horizon"
                value={userData.questions.horizon}
                onChange={handleInputChange}
                className="w-full bg-surface-dim border border-border/20 focus:border-accent-blue focus:ring-0 text-lg font-serif italic py-4 px-6 transition-all" 
                placeholder="Final vector..." 
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-8 pt-8 border-t border-border/10">
            <div className="flex items-center gap-12 w-full justify-center">
               <div className="text-center">
                  <div className="text-[10px] font-mono opacity-40 uppercase mb-1">Subject_Alpha</div>
                  <div className="text-xs font-mono font-bold">{userData.name || 'ANON'}</div>
               </div>
               <div className="h-10 w-px bg-border/20"></div>
               <div className="text-center">
                  <div className="text-[10px] font-mono opacity-40 uppercase mb-1">State_Entropy</div>
                  <div className="text-xs font-mono font-bold text-accent-orange">LOW</div>
               </div>
            </div>

            <div className="w-full flex flex-col items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNext('result')}
                disabled={!userData.questions.foundation || isAnalyzing}
                className="bg-primary text-white px-16 py-5 font-mono text-sm font-bold uppercase tracking-tighter hover:bg-neutral-800 transition-all flex items-center gap-4 shadow-lg disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <span>Initialize Synthesis</span>
                <Sparkles className={`w-4 h-4 fill-current ${isAnalyzing ? 'animate-spin' : ''}`} />
              </motion.button>
              {isAnalyzing && (
                <p className="text-[10px] font-mono text-accent-blue animate-pulse uppercase tracking-widest">AI Node Synchronizing...</p>
              )}
            </div>
            <p className="text-[9px] font-mono opacity-30 uppercase tracking-[0.3em]">Processing bio-data via oracle-v4</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
