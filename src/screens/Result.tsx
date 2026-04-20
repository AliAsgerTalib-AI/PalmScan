/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { CheckCircle, BookOpen, History, Download, Compass, Circle, Hexagon } from "lucide-react";
import { UserData, PalmReading } from "../types";
import { generatePalmReading } from "../lib/gemini";

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
          <div className="label-serif">Pipeline Operation: destiny-synthesis</div>
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
          <div className="label-serif mb-2">Subject Final Report</div>
          <h1 className="text-4xl md:text-5xl font-mono tracking-tighter uppercase leading-none">The Destiny <span className="text-accent-green">Output</span></h1>
        </div>
        <div className="flex gap-12 text-left font-mono">
           <div>
              <div className="label-serif mb-1">Status</div>
              <div className="text-sm font-bold text-accent-green uppercase">Authorized</div>
           </div>
           <div>
              <div className="label-serif mb-1">Registry</div>
              <div className="text-sm font-bold uppercase">{reading.verifiedId}</div>
           </div>
        </div>
        <div className="absolute top-0 right-0 w-12 h-12 border-l border-b border-border bg-surface-dim flex items-center justify-center">
           <Hexagon className="w-4 h-4 text-primary" />
        </div>
      </motion.div>

      {/* Main Analysis Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-border bg-surface-bright">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-12 p-8 border-b border-border bg-surface-dim"
        >
           <div className="label-serif mb-4">Synthesis Vector [soul-overview]</div>
           <div className="prose prose-invert max-w-none prose-p:text-lg prose-p:font-serif prose-p:italic prose-p:leading-relaxed prose-headings:font-mono prose-headings:uppercase prose-headings:tracking-tighter prose-strong:text-accent-orange">
              {reading.rawAnalysis ? reading.rawAnalysis.split('\n').map((line, i) => (
                <p key={i} className="mb-4">{line}</p>
              )) : reading.synthesis}
           </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-8 p-12 space-y-12 border-r border-border"
        >
          <div className="label-serif">Recursive Node Analysis</div>
          <div className="space-y-16">
            {[
              { id: 'PATH_01', type: 'Foundation', answer: reading.career },
              { id: 'PATH_02', type: 'Shadow', answer: reading.harmony },
              { id: 'PATH_03', type: 'Horizon', answer: reading.spirit }
            ].map((item, idx) => (
              <div key={idx} className="relative pl-16 group">
                <div className="absolute left-0 top-0 text-[10px] font-mono opacity-40 font-bold group-hover:opacity-100 transition-opacity">
                  {item.id}<br/>{item.type.toUpperCase()}
                </div>
                <div className="space-y-4">
                   <h4 className="text-lg font-mono font-bold tracking-tight uppercase">Analysis Matrix: {item.type.toUpperCase()}</h4>
                   <div className="p-6 bg-surface-dim border-l-4 border-primary italic font-serif text-lg leading-relaxed">
                      "{item.answer}"
                   </div>
                   <div className="flex gap-2">
                      <div className="w-8 h-1 bg-accent-blue/20"></div>
                      <div className="w-12 h-1 bg-accent-blue"></div>
                      <div className="w-4 h-1 bg-accent-blue/40"></div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="lg:col-span-4 flex flex-col">
           <div className="p-8 border-b border-border bg-surface-dim">
              <div className="label-serif mb-4">Visual: bio-mapping</div>
              <div className="aspect-square grayscale border border-border/20 overflow-hidden relative group">
                 <img 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                   src="https://picsum.photos/seed/palm-analysis/600/600" 
                   alt="Biological node map" 
                   referrerPolicy="no-referrer"
                 />
                 <div className="absolute inset-0 border-[20px] border-surface-dim opacity-40 pointer-events-none"></div>
              </div>
           </div>
           <div className="p-8 space-y-6 flex-grow bg-surface-bright">
              <div className="label-serif">Preservation Logic</div>
              <button className="w-full bg-primary text-white py-4 font-mono font-bold uppercase tracking-tighter text-xs hover:bg-neutral-800 transition-all flex items-center justify-center gap-3">
                <Download className="w-4 h-4" /> Resolve to PDF
              </button>
              <button className="w-full border border-border py-4 font-mono font-bold uppercase tracking-tighter text-xs hover:bg-surface-dim transition-all flex items-center justify-center gap-3">
                <History className="w-4 h-4" /> Archive Ritual
              </button>
              <div className="pt-6 border-t border-border/10">
                 <div className="text-[9px] font-mono opacity-40 leading-tight">
                    This document identifies potential destiny vectors based on current biological entropy. Recurrent synchronization is recommended every 180 solar cycles.
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
