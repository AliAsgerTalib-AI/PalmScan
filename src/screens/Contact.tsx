/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Mail, MessageSquare } from "lucide-react";

export default function Contact() {
  return (
    <div className="flex-grow flex items-center justify-center px-6 py-12 relative overflow-hidden min-h-[80vh] bg-surface">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(#141414_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full z-10 border border-border bg-surface-bright shadow-sm"
      >
        <div className="p-8 border-b border-border bg-surface-dim">
           
           <h1 className="text-3xl md:text-4xl font-mono tracking-tighter uppercase leading-none">Contact <span className="text-accent-blue">Us</span></h1>
        </div>

        <div className="p-8 md:p-12 space-y-8">
          <p className="font-sans text-sm opacity-70 leading-relaxed">
            Have questions or technical difficulties? Our support team is available.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border border-border bg-surface-dim group hover:border-accent-blue transition-colors">
              <Mail className="w-5 h-5 text-accent-blue" />
              <div>
                <div className="text-[10px] font-mono opacity-40 uppercase">Email Support</div>
                <div className="text-sm font-mono font-bold">aliasgertalib@gmail.com</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border border-border bg-surface-dim group hover:border-accent-blue transition-colors">
              <MessageSquare className="w-5 h-5 text-accent-blue" />
              <div>
                <div className="text-[10px] font-mono opacity-40 uppercase">Feedback</div>
                <div className="text-sm font-mono font-bold">aliasgertalib@gmail.com</div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border/10">
            <p className="text-[9px] font-mono opacity-30 uppercase tracking-[0.2em] text-center">Responses typically replied within 24-48 Hours</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
