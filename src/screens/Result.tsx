/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Download, Hexagon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { UserData, PalmReading } from "../types";
// @ts-ignore
import html2pdf from "html2pdf.js";

interface ResultProps {
  userData: UserData;
  analysisResult: PalmReading | null;
}

export default function Result({ userData, analysisResult }: ResultProps) {
  const [reading, setReading] = useState<PalmReading | null>(analysisResult);
  const [loading, setLoading] = useState(!analysisResult);
  const [printStatus, setPrintStatus] = useState<string | null>(null);

  useEffect(() => {
    if (analysisResult) {
      setReading(analysisResult);
      setLoading(false);
    }
  }, [analysisResult]);

  const handlePrint = async () => {
    if (!reading) return;
    
    const element = document.getElementById('print-area');
    if (!element) return;

    setPrintStatus("Generating PDF...");
    
    // PDF configuration
    const opt = {
      margin:       [40, 40, 40, 40] as [number, number, number, number], // px margins
      filename:     `PalmScan_Report_${userData.name.replace(/\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        backgroundColor: '#FFFFFF', // White background for PDF
        logging: false
      },
      jsPDF:        { unit: 'px' as const, format: 'a4', orientation: 'portrait' as const }
    };

    try {
      // Creating a clone to modify styles for PDF without affecting UI
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.color = '#141414';
      clone.style.backgroundColor = '#FFFFFF';
      clone.style.width = '800px'; // Consistent width for PDF
      
      // We don't append it to body, html2pdf can take the node directly
      await html2pdf().set(opt).from(clone).save();
      setPrintStatus(null);
    } catch (err) {
      console.error("PDF generation failed:", err);
      setPrintStatus("Fallback to Print...");
      setTimeout(() => {
        window.print();
        setPrintStatus(null);
      }, 1000);
    }
  };

  const chartData = reading?.scores ? [
    { subject: 'Synthesis', value: reading.scores.synthesis },
    { subject: 'Career', value: reading.scores.career },
    { subject: 'Harmony', value: reading.scores.harmony },
    { subject: 'Spirit', value: reading.scores.spirit },
  ] : [];

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
          <h2 className="text-4xl font-mono tracking-tighter uppercase animate-pulse">Processing</h2>
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
      <div id="print-area" className="relative border border-border bg-surface-bright overflow-hidden print:shadow-none print:border-none print:m-0 print:p-0">
        {/* Decorative Corner Ornaments */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary/20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-primary/20 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/20 pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 md:p-20 selection:bg-accent-orange"
        >
          {/* Spiritual Matrix Visualization */}
          <div className="mb-20 flex flex-col items-center">
            <div className="flex flex-col items-center mb-8">
              <Hexagon className="w-12 h-12 text-accent-orange mb-4 opacity-20" />
              <div className="label-serif text-center uppercase tracking-[0.3em]">Ritual Vector Analysis</div>
            </div>
            
            <div className="w-full h-[300px] md:h-[400px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                  <PolarGrid stroke="#f0f0f0" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#666666', fontSize: 10, fontWeight: 600, fontFamily: 'monospace' }} 
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    tick={false} 
                    axisLine={false}
                  />
                  <Radar
                    name="Propensity"
                    dataKey="value"
                    stroke="#22C55E"
                    fill="#22C55E"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
              {/* Subtle watermark overlay for the chart */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                <Hexagon className="w-64 h-64 text-primary rotate-45" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mt-12 w-full max-w-2xl">
              {chartData.map((d) => (
                <div key={d.subject} className="flex flex-col items-center p-4 border border-border/5 bg-surface-dim/30">
                  <div className="text-[10px] font-mono text-[#14141466] uppercase mb-2 tracking-widest">{d.subject}</div>
                  <div className="text-3xl font-mono tracking-tighter font-bold">{d.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border/10 pt-20">
            <div className="flex justify-between items-center mb-16 px-4">
              <div className="h-px bg-border/20 flex-grow mr-8" />
              <div className="label-serif">Technical Narrative</div>
              <div className="h-px bg-border/20 flex-grow ml-8" />
            </div>

            <div className="prose prose-neutral max-w-none 
              prose-headings:font-mono prose-headings:tracking-widest prose-headings:uppercase prose-headings:text-[#141414cc]
              prose-h2:text-2xl prose-h2:border-b prose-h2:border-[#1414141a] prose-h2:pb-6 prose-h2:mt-16 prose-h2:mb-8
              prose-p:text-xl prose-p:font-serif prose-p:italic prose-p:leading-relaxed prose-p:text-on-surface
              prose-strong:text-accent-orange prose-strong:font-bold prose-strong:px-1 prose-strong:bg-[#FB923C0D]
              prose-ul:list-square prose-li:font-serif prose-li:text-lg
              prose-blockquote:border-l-4 prose-blockquote:border-accent-orange prose-blockquote:bg-[#FAFAFA] prose-blockquote:p-6 prose-blockquote:italic
            ">
              {/* Unified Analysis Body with Markdown support */}
              <div className="markdown-body space-y-8 px-4">
                {reading.fullReading ? (
                  <ReactMarkdown>{reading.fullReading}</ReactMarkdown>
                ) : (
                  <p className="text-on-surface mb-6 leading-relaxed">{reading.synthesis}</p>
                )}
              </div>
            </div>

            {/* Ritual Conclusion / Signature Section */}
            <div className="mt-32 pt-20 border-t border-border/5 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
              <div className="space-y-6">
                <div className="label-serif">Diagnostic Timestamp</div>
                <div className="text-sm font-mono opacity-60">
                  {new Date().toISOString().replace('T', ' ').split('.')[0]} GMT
                </div>
                <div className="text-[10px] font-mono text-accent-green leading-tight max-w-xs">
                  This report is a technical synthesis of visible hand geometry and skin texture patterns. Verified under Shastra Protocol v3.
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="w-48 h-12 border-b border-primary/40 relative mb-4">
                  <div className="absolute bottom-2 left-0 font-serif italic text-2xl text-primary/30 select-none">Samudrika Master</div>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5, delay: 1 }}
                    className="absolute -bottom-[2px] left-0 h-1 bg-accent-orange/40"
                  />
                </div>
                <div className="label-serif">Ritual Signature Authenticated</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Bar integrated into the frame */}
        <div className="border-t border-border bg-surface-dim p-8 md:p-12 flex justify-center print:hidden">
           <button 
             onClick={handlePrint}
             className="group relative overflow-hidden bg-primary text-white py-5 px-16 font-mono font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-neutral-800 transition-all flex items-center gap-4 disabled:opacity-50 shadow-xl active:scale-[0.98]"
             disabled={!!printStatus}
           >
             <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
             {printStatus ? (
               <Hexagon className="w-5 h-5 animate-spin text-accent-orange" />
             ) : (
               <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
             )}
             <span className="relative z-10">{printStatus || "Generate PDF Report"}</span>
           </button>
        </div>
      </div>
    </div>
  );
}
