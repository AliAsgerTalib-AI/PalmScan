/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Download, Hexagon } from "lucide-react";
import ReactMarkdown from "react-markdown";
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
    
    // Scroll to top to ensure capture starts from the beginning
    window.scrollTo(0, 0);

    const opt = {
      margin:       [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
      filename:     `PalmScan_Report_${userData.name.replace(/\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { 
        scale: 2,
        useCORS: true, 
        letterRendering: true,
        backgroundColor: '#FFFFFF',
        logging: false,
        scrollY: 0,
        windowWidth: 800
      },
      jsPDF:        { unit: 'in' as const, format: 'letter', orientation: 'portrait' as const }
    };

    try {
      // Use html2pdf with the element directly
      await html2pdf().set(opt).from(element).save();
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

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12 bg-[#E4E3E0]">
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
          <div className="max-w-xs mx-auto w-full h-1 bg-[#FAFAFA] relative overflow-hidden">
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
        className="relative mb-12 border border-[#141414] p-8 bg-[#FFFFFF] flex flex-col md:flex-row justify-between items-end gap-8"
      >
        <div className="text-left">
          
          <h1 className="text-4xl md:text-5xl font-mono tracking-tighter uppercase leading-none">The Destiny <span className="text-[#22C55E]">Output</span></h1>
        </div>
        <div className="flex gap-12 text-left font-mono">
           
           <div>
              <div className="label-serif mb-1">Registry</div>
              <div className="text-sm font-bold uppercase">{reading.verifiedId}</div>
           </div>
        </div>
        <div className="absolute top-0 right-0 w-12 h-12 border-l border-b border-[#141414] bg-[#FAFAFA] flex items-center justify-center">
           <Hexagon className="w-4 h-4 text-[#141414]" />
        </div>
      </motion.div>

      {/* Simplified, Unified Analysis "Textbox" */}
      <div id="print-area" className="relative border border-[#141414] bg-[#FFFFFF] overflow-hidden print:shadow-none print:border-none print:m-0 print:p-0">
        {/* Decorative Corner Ornaments */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#14141433] pointer-events-none" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#14141433] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#14141433] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#14141433] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 md:p-20 selection:bg-[#FB923C]"
        >
          <div className="border-t border-[#1414141A] pt-10">
            <div className="flex justify-between items-center mb-16 px-4">
              <div className="h-px bg-[#14141433] flex-grow mr-8" />
              <div className="label-serif">Technical Narrative</div>
              <div className="h-px bg-[#14141433] flex-grow ml-8" />
            </div>

            <div className="prose max-w-none 
              prose-headings:font-mono prose-headings:tracking-widest prose-headings:uppercase prose-headings:text-[#141414]
              prose-h2:text-2xl prose-h2:border-b prose-h2:border-[#1414141a] prose-h2:pb-6 prose-h2:mt-16 prose-h2:mb-8
              prose-p:text-xl prose-p:font-serif prose-p:italic prose-p:leading-relaxed prose-p:text-[#141414]
              prose-strong:text-[#FB923C] prose-strong:font-bold prose-strong:px-1 prose-strong:bg-[#FB923C0D]
              prose-ul:list-square prose-li:font-serif prose-li:text-lg
              prose-blockquote:border-l-4 prose-blockquote:border-[#FB923C] prose-blockquote:bg-[#FAFAFA] prose-blockquote:p-6 prose-blockquote:italic
            " style={{
              ["--tw-prose-body" as any]: '#141414',
              ["--tw-prose-headings" as any]: '#141414',
              ["--tw-prose-lead" as any]: '#141414',
              ["--tw-prose-links" as any]: '#141414',
              ["--tw-prose-bold" as any]: '#141414',
              ["--tw-prose-counters" as any]: '#141414',
              ["--tw-prose-bullets" as any]: '#141414',
              ["--tw-prose-hr" as any]: '#141414',
              ["--tw-prose-quotes" as any]: '#141414',
              ["--tw-prose-quote-borders" as any]: '#FB923C',
              ["--tw-prose-captions" as any]: '#141414',
              ["--tw-prose-code" as any]: '#141414',
              ["--tw-prose-pre-code" as any]: '#FAFAFA',
              ["--tw-prose-pre-bg" as any]: '#141414',
              ["--tw-prose-th-borders" as any]: '#141414',
              ["--tw-prose-td-borders" as any]: '#141414',
            }}>
              {/* Unified Analysis Body with Markdown support */}
              <div className="markdown-body space-y-8 px-4">
                {reading.fullReading ? (
                  <ReactMarkdown>{reading.fullReading}</ReactMarkdown>
                ) : (
                  <p className="text-[#141414] mb-6 leading-relaxed">{reading.synthesis}</p>
                )}
              </div>
            </div>

            {/* Ritual Conclusion / Signature Section */}
            <div className="mt-32 pt-20 border-t border-[#1414140D] flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
              <div className="space-y-6">
                <div className="label-serif">Diagnostic Timestamp</div>
                <div className="text-sm font-mono text-[#14141499]">
                  {new Date().toISOString().replace('T', ' ').split('.')[0]} GMT
                </div>
                <div className="text-[10px] font-mono text-[#22C55E] leading-tight max-w-xs">
                  Disclaimer: The readings, interpretations and insights provided by PalmScan are for entertainment purposes only. 
                  Palmistry is an interpretive art, and not an exact science.
                </div>
              </div>

              
            </div>
          </div>
        </motion.div>

        {/* Action Bar integrated into the frame */}
        <div className="border-t border-[#141414] bg-[#FAFAFA] p-8 md:p-12 flex justify-center print:hidden">
           <button 
             onClick={handlePrint}
             className="group relative overflow-hidden bg-[#141414] text-white py-5 px-16 font-mono font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-[#262626] transition-all flex items-center gap-4 disabled:opacity-50 shadow-xl active:scale-[0.98]"
             disabled={!!printStatus}
           >
             <div className="absolute inset-0 bg-[#FFFFFF0D] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
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
