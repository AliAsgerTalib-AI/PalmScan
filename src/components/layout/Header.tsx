/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Screen } from "../../types";

interface HeaderProps {
  onNavigate: (screen: Screen) => void;
  currentScreen: Screen;
}

export default function Header({ onNavigate, currentScreen }: HeaderProps) {
  return (
    <header className="h-12 border-b border-border flex items-center px-4 justify-between bg-surface-bright sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <div 
          className="font-bold flex items-center space-x-2 cursor-pointer"
          onClick={() => onNavigate('disclaimer')}
        >
          <div className="w-4 h-4 bg-primary"></div>
          <span className="tracking-tighter text-xs font-sans font-bold">PalmScan</span>
        </div>
        
      </div>
      
      <nav className="hidden md:flex items-center space-x-6">
        <div className="flex space-x-4 text-[10px] uppercase font-bold tracking-widest text-on-surface">
          <span 
            onClick={() => onNavigate('setup')}
            className={`cursor-pointer transition-opacity ${currentScreen === 'setup' ? 'opacity-100 underline underline-offset-4' : 'opacity-40 hover:opacity-100'}`}
          >
            Sanctum
          </span>
          
        </div>
     
      </nav>
    </header>
  );
}
