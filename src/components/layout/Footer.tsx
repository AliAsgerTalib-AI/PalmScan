/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Screen } from "../../types";

interface FooterProps {
  onNavigate: (screen: Screen) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="h-10 bg-primary text-[#A3A3A3] p-4 font-mono text-[10px] flex items-center justify-between leading-relaxed sticky bottom-0 z-50">
      <span>© 2026 PalmScan</span>
      
      <div className="flex gap-6 uppercase tracking-tighter">
        <span 
          onClick={() => onNavigate('contact')}
          className="cursor-pointer hover:text-white transition-colors"
        >
          Contact Us
        </span>
        <span 
          onClick={() => onNavigate('disclaimer')}
          className="cursor-pointer hover:text-white transition-colors"
        >
          Disclaimer
        </span>
      </div>
    </footer>
  );
}
