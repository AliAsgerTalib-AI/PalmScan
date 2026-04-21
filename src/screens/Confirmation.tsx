/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Terminal, ShieldCheck, X, Eye } from "lucide-react";
import { UserData } from "../types";

interface ConfirmationProps {
  prompt: string;
  userData: UserData;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing: boolean;
}

export default function Confirmation({ prompt, userData, onConfirm, onCancel, isProcessing }: ConfirmationProps) {
  const images = Object.values(userData.portals).filter(Boolean) as string[];
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 w-full flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full border border-border bg-surface-bright overflow-hidden shadow-2xl"
      >
        <header className="p-4 border-b border-border bg-surface-dim flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Terminal className="w-4 h-4 text-accent-orange" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#14141499]">Presynthesis Prompt Verification</span>
          </div>
          <button 
            onClick={onCancel}
            className="p-1 hover:bg-surface-dim transition-colors rounded-sm"
            disabled={isProcessing}
          >
            <X className="w-4 h-4 opacity-40 hover:opacity-100" />
          </button>
        </header>

        <div className="p-8 space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-mono tracking-tighter uppercase leading-none">Review the <span className="text-accent-orange">Ritual</span> Input</h2>
            <p className="font-sans text-sm text-on-surface opacity-60 leading-relaxed max-w-2xl">
              The BIOS-essence and physical vessels have been prepared. Verify the combined instruction matrix before initiating the transference to the Divine LLM.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 opacity-40">
              <Eye className="w-3 h-3" />
              <span className="font-mono text-[9px] uppercase tracking-widest">Visual Payload (Multimodal Input)</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, idx) => (
                <div key={idx} className="aspect-square border border-border bg-[#171717] overflow-hidden relative group">
                  <img src={img} alt="Vessel Part" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 border-inset border-[#FB923C00] group-hover:border-[#FB923C33] transition-all pointer-events-none" />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 opacity-40">
              <Terminal className="w-3 h-3" />
              <span className="font-mono text-[9px] uppercase tracking-widest">Logic Instructions (System Prompt)</span>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FB923C33] to-[#60A5FA33] rounded opacity-50 blur group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative p-6 bg-[#171717] border border-[#262626] rounded font-mono text-xs text-[#D4D4D4] leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[40vh] custom-scrollbar selection:bg-[#FB923C4D]">
                {prompt}
                <motion.div 
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="inline-block w-2 h-4 bg-accent-orange ml-1 translate-y-1"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={onConfirm}
              disabled={isProcessing}
              className="flex-grow bg-primary text-white py-5 px-8 font-mono font-bold uppercase tracking-tighter text-sm hover:bg-[#262626] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-[#FFFFFF33] border-t-white rounded-full"
                  />
                  Synthesizing...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Initiate Final Analysis
                </>
              )}
            </button>
            <button 
              onClick={onCancel}
              className="py-5 px-8 border border-border font-mono font-bold uppercase tracking-tighter text-sm hover:bg-surface-dim transition-all text-[#14141499]"
              disabled={isProcessing}
            >
              Abort Routine
            </button>
          </div>
        </div>

        <footer className="p-4 border-t border-border bg-surface-dim text-center">
            <div className="text-[9px] font-mono opacity-30 uppercase tracking-[0.2em]">
              Security Handshake: Verified // Protocol 4.4.x
            </div>
        </footer>
      </motion.div>
    </div>
  );
}
