/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Download, Hexagon } from "lucide-react";
import { UserData, PalmReading } from "../types";

interface ResultProps {
  userData: UserData;
  analysisResult: PalmReading | null;
}

export default function Result({ userData, analysisResult }: ResultProps) {
  const [reading, setReading] = useState<PalmReading | null>(analysisResult);
  const [loading, setLoading] = useState(!analysisResult);

  useEffect(() => {
    if (analysisResult) {
      setReading(analysisResult);
      setLoading(false);
    }
  }, [analysisResult]);

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12 bg-surface">
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 border border-border rounded-full flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,#141414_0%,transparent_80%)]"></div>
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-bold">
            SYNCING...
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-mono tracking-tighter uppercase animate-pulse">Processing Reality Nodes</h2>
          <div className="max-w-xs mx-auto w-full h-1 bg-surface-dim relative overflow-hidden">
             <motion.div 
                animate={{ x: [-200, 400] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-0 h-full bg-accent-orange w-1/3 shadow-[0_0_10px_#FB923C]"
             />
          </div>
        </div>
      </div>
    );
  }

  if (!reading) return null;

  return (
    <div className="flex-grow max-w-6xl mx-auto px-6 py-12 w-full">
      {/* Report Header */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative mb-12 border border-border p-8 bg-surface-bright flex flex-col md:flex-row justify-between items-end gap-8"
      >
        <div className="text-left">
          <div className="label-serif mb-2">Report</div>
          <h1 className="text-4xl md:text-5xl font-mono tracking-tighter uppercase leading-none">The Destiny <span className="text-accent-green">Output</span></h1>
        </div>
        <div className="flex gap-12 text-left font-mono">
           
           <div>
              <div className="label-serif mb-1">Registry</div>
              <div className="text-sm font-bold uppercase">{reading.verifiedId}</div>
           </div>
        </div>
        <div className="absolute top-0 right-0 w-12 h-12 border-l border-b border-border bg-surface-dim flex items-center justify-center">
           <Hexagon className="w-4 h-4 text-primary" />
        </div>
      </motion.div>

      {/* Simplified, Unified Analysis "Textbox" */}
      <div className="border border-border bg-surface-bright shadow-2xl overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 md:p-14 selection:bg-accent-orange/10"
        >
          <div className="prose prose-neutral max-w-none prose-p:text-xl prose-p:font-serif prose-p:italic prose-p:leading-relaxed prose-p:text-on-surface">
            {/* Synthesis Section */}
            <div className="mb-16 pb-12 border-b border-border/10">
              {reading.rawAnalysis ? reading.rawAnalysis.split('\n').map((line, i) => (
                <p key={i} className="mb-6 text-on-surface">{line}</p>
              )) : <p className="text-on-surface">{reading.synthesis}</p>}
            </div>

            {/* Categorized Paths */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 not-prose">
              {[
                { label: 'Foundation', content: reading.career },
                { label: 'Shadow', content: reading.harmony },
                { label: 'Horizon', content: reading.spirit }
              ].map((item, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent-orange" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40 text-on-surface">
                      {item.label}
                    </span>
                  </div>
                  <p className="font-serif italic text-lg leading-relaxed text-on-surface border-l border-border/10 pl-5">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Action Bar integrated into the frame */}
        <div className="border-t border-border bg-surface-dim p-8 flex flex-col md:flex-row justify-between items-center gap-8">
           
           <button className="bg-primary text-white py-4 px-12 font-mono font-bold uppercase tracking-tighter text-xs hover:bg-neutral-800 transition-all flex items-center gap-3">
             <Download className="w-4 h-4" /> Print result to PDF
           </button>
        </div>
      </div>
    </div>
  );
}
