/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Screen, UserData, PalmReading } from "./types";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Disclaimer from "./screens/Disclaimer";
import Sanctum from "./screens/Sanctum";
import Confirmation from "./screens/Confirmation";
import Result from "./screens/Result";
import Contact from "./screens/Contact";
import { generatePalmReading, getPalmReadingPrompt } from "./lib/gemini";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('setup');
  const [analysisResult, setAnalysisResult] = useState<PalmReading | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewPrompt, setPreviewPrompt] = useState<string>('');
  const [userData, setUserData] = useState<UserData>({
    name: '',
    age: '',
    sex: '',
    terminologyLevel: 'Layman',
    portals: {
      rightHand: null,
      leftHand: null,
      rightPercussion: null,
      leftPercussion: null,
    }
  });

  const executeAnalysis = async () => {
    setIsAnalyzing(true);
    setCurrentScreen('result');
    
    try {
      // Direct call on frontend
      const result = await generatePalmReading(userData);
      
      setAnalysisResult(result);
    } catch (error: any) {
      console.error(error);
      const message = error?.message || "Mystical synthesis failed.";
      alert(`The Ritual Encountered an Error: ${message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'disclaimer':
        return <Disclaimer onAccept={() => setCurrentScreen('setup')} />;
      case 'setup':
        return <Sanctum 
          userData={userData} 
          setUserData={setUserData} 
          onNext={() => executeAnalysis()} 
        />;
      case 'result':
        return <Result 
          userData={userData} 
          analysisResult={analysisResult} 
        />;
      case 'contact':
        return <Contact />;
      default:
        return <Sanctum userData={userData} setUserData={setUserData} onNext={() => executeAnalysis()} />;
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col relative text-on-surface">
      {/* Mystical Texture Overlay */}
      <div className="grain-overlay pointer-events-none" />
      
      <Header currentScreen={currentScreen} onNavigate={handleNavigate} />
      
      <main className="flex-grow flex flex-col relative z-10 w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex-grow flex flex-col"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
