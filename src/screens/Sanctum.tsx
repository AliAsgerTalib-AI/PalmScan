/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, Dispatch, SetStateAction, ChangeEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles, Hand, ArrowRight, Scan, CloudUpload, Focus, CheckCircle2, AlertCircle, XCircle, Loader2 } from "lucide-react";
import { UserData, Screen } from "../types";

interface SanctumProps {
  userData: UserData;
  setUserData: Dispatch<SetStateAction<UserData>>;
  onNext: (screen?: Screen) => void;
}

export default function Sanctum({ userData, setUserData, onNext }: SanctumProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  const [activePortal, setActivePortal] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error("Canvas context failed"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        // Compress to JPEG with 0.8 quality
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    });
  };

  const handlePortalChange = (portal: keyof UserData['portals'], e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setErrors(prev => ({ ...prev, [portal]: "" })); // Clear previous error
    
    if (file) {
      setProcessing(prev => ({ ...prev, [portal]: true }));

      // Basic Validation
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, [portal]: "Format incompatible with astral visualization (Images only)" }));
        setUserData(prev => ({ ...prev, portals: { ...prev.portals, [portal]: "" } })); // Clear data
        setProcessing(prev => ({ ...prev, [portal]: false }));
        return;
      }

      // Allow slightly larger raw files for compression (e.g., 10MB), 
      // but the result must still be manageable.
      if (file.size > 10 * 1024 * 1024) { 
        setErrors(prev => ({ ...prev, [portal]: "Source file too bulky for mystical transference (10MB limit)" }));
        setUserData(prev => ({ ...prev, portals: { ...prev.portals, [portal]: "" } }));
        setProcessing(prev => ({ ...prev, [portal]: false }));
        return;
      }

      const reader = new FileReader();
      reader.onerror = () => {
        setErrors(prev => ({ ...prev, [portal]: "Spectral interference during memory extraction" }));
        setProcessing(prev => ({ ...prev, [portal]: false }));
      };

      reader.onloadend = async () => {
        try {
          const rawBase64 = reader.result as string;
          const compressed = await compressImage(rawBase64);
          
          // Final check: Is compressed size under 2MB? (Roughly 1.33x for base64)
          const approximateSize = (compressed.length * (3/4));
          if (approximateSize > 2 * 1024 * 1024) {
             setErrors(prev => ({ ...prev, [portal]: "Image data too dense for alchemical processing (2MB limit)" }));
             setUserData(prev => ({ ...prev, portals: { ...prev.portals, [portal]: "" } }));
             setProcessing(prev => ({ ...prev, [portal]: false }));
             return;
          }

          setUserData(prev => ({
            ...prev,
            portals: { ...prev.portals, [portal]: compressed }
          }));
        } catch (err) {
          setErrors(prev => ({ ...prev, [portal]: "Alchemical synthesis failed: System overload" }));
          setUserData(prev => ({ ...prev, portals: { ...prev.portals, [portal]: "" } }));
        } finally {
          setProcessing(prev => ({ ...prev, [portal]: false }));
        }
      };
      
      try {
        reader.readAsDataURL(file);
      } catch (err) {
        setErrors(prev => ({ ...prev, [portal]: "Spectral interference detected: Execution denied" }));
        setProcessing(prev => ({ ...prev, [portal]: false }));
      }
    }
  };

  const isComplete = userData.name && userData.age && userData.sex && 
    userData.portals.rightHand && userData.portals.leftHand && 
    userData.portals.rightPercussion && userData.portals.leftPercussion;

  const handleAnalyze = async () => {
    if (!isComplete) return;
    onNext('result'); 
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 w-full min-h-[80vh] bg-surface">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-border">
        {/* Left Column: Personal Information */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:col-span-4 border-r border-border bg-surface-bright flex flex-col"
        >
          <header className="p-8 border-b border-border bg-surface-dim">
            <h1 className="text-3xl font-mono tracking-tighter leading-none">
              Palm<span className="text-accent-orange">Scan</span>
            </h1>
          </header>

          <div className="p-8 space-y-8 flex-grow">
            <div className="space-y-6">
              <div className="group">
                <div className="label-serif mb-2">Name</div>
                <input 
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  className="w-full bg-surface-dim border border-[#14141433] focus:border-primary focus:ring-0 text-on-surface py-3 px-4 transition-all font-mono text-sm placeholder:opacity-30" 
                  placeholder="Designate name..." 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <div className="label-serif mb-2">Age</div>
                  <input 
                    type="number"
                    name="age"
                    value={userData.age}
                    onChange={handleInputChange}
                    className="w-full bg-surface-dim border border-[#14141433] focus:border-primary focus:ring-0 text-on-surface py-3 px-4 transition-all font-mono text-sm placeholder:opacity-30" 
                    placeholder="00" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <div className="label-serif mb-2">Sex</div>
                  <select 
                    name="sex"
                    value={userData.sex}
                    onChange={handleInputChange}
                    className="w-full bg-surface-dim border border-[#14141433] focus:border-primary focus:ring-0 text-on-surface py-3 px-4 transition-all font-mono text-sm appearance-none"
                  >
                    <option value="" disabled>Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="group">
                  <div className="label-serif mb-2">Insight Level</div>
                  <select 
                    name="terminologyLevel"
                    value={userData.terminologyLevel}
                    onChange={handleInputChange}
                    className="w-full bg-surface-dim border border-[#14141433] focus:border-primary focus:ring-0 text-on-surface py-3 px-4 transition-all font-mono text-sm appearance-none"
                  >
                    <option value="Layman">Layman</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Portal Upload Zones */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:col-span-8 flex flex-col bg-surface-dim"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-border flex-grow">
            {[
              { 
                id: 'leftHand' as const, 
                label: 'Left Palm', 
                sub: 'Innate Potential', 
                icon: <Hand className="w-8 h-8 rotate-y-180" />,
                desc: 'Reveals the subconscious mind, inherited traits, and emotional blueprint. This is the hand of "Prarabdha" or destiny.'
              },
              { 
                id: 'rightHand' as const, 
                label: 'Right Palm', 
                sub: 'Active Projection', 
                icon: <Hand className="w-8 h-8" />,
                desc: 'Represents the conscious self, current life choices, and physical reality. In Samudrika Shastra, this is the hand of "Karma" or active manifestation.'
              },
              { 
                id: 'leftPercussion' as const, 
                label: 'Left Edge', 
                sub: 'Internal Dialogue', 
                icon: <Scan className="w-8 h-8" />,
                desc: 'Reflects your inner world, secret desires, and the depth of your intuitive connection to yourself.'
              },
              { 
                id: 'rightPercussion' as const, 
                label: 'Right Edge', 
                sub: 'Social Interaction', 
                icon: <Scan className="w-8 h-8" />,
                desc: 'Highlights how you project energy into the world, your external reputation, and zones of public engagement.'
              }
            ].map((p, idx) => (
              <label 
                key={p.id}
                onMouseEnter={() => setActivePortal(p.id)}
                onMouseLeave={() => setActivePortal(null)}
                className={`group p-8 border-b md:border-b-0 md:border-r border-border hover:bg-surface-bright transition-all relative flex flex-col items-center justify-center min-h-[220px] last:border-b-0 md:last:border-r-0 cursor-pointer overflow-hidden ${userData.portals[p.id] ? 'bg-[#FFFFFF80]' : 'bg-surface-dim'} ${activePortal === p.id ? 'ring-2 ring-primary ring-inset z-20 shadow-xl' : ''}`}
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment"
                  className="hidden" 
                  onChange={(e) => handlePortalChange(p.id, e)} 
                />

                {/* Active Highlight Overlay */}
                <AnimatePresence>
                  {activePortal === p.id && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-[#FB923C0D] pointer-events-none z-10"
                    />
                  )}
                </AnimatePresence>
                
                {userData.portals[p.id] ? (
                  <>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 z-0"
                    >
                      <img 
                        src={userData.portals[p.id] as string} 
                        alt={p.label} 
                        className="w-full h-full object-cover opacity-30 grayscale blur-[1px]" 
                        referrerPolicy="no-referrer"
                      />
                      {/* Success Flash Overlay */}
                      <motion.div 
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 bg-white z-10"
                      />
                      <div className="absolute inset-0 bg-[#22C55E1A]" />
                    </motion.div>
                    {/* Pulsing Success Border */}
                    <motion.div 
                      animate={{ opacity: [0.1, 0.4, 0.1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 border-2 border-accent-green z-0"
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                    <Focus className="w-32 h-32 text-primary" />
                  </div>
                )}

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-[9px] font-mono opacity-20">VECTOR_{idx+1}</div>
                  
                  <motion.div 
                    initial={false}
                    animate={userData.portals[p.id] ? { scale: [1, 1.2, 1] } : {}}
                    className={`mb-4 transition-all duration-500 transform 
                      ${errors[p.id] ? 'text-accent-red' : processing[p.id] ? 'text-primary' : userData.portals[p.id] ? 'text-accent-green' : 'text-primary opacity-40 group-hover:opacity-80 group-hover:scale-110'}`}
                  >
                    {errors[p.id] ? (
                      <AlertCircle className="w-12 h-12 animate-bounce" />
                    ) : processing[p.id] ? (
                      <Loader2 className="w-12 h-12 animate-spin" />
                    ) : userData.portals[p.id] ? (
                      <CheckCircle2 className="w-12 h-12 shadow-[0_0_20px_rgba(34,197,94,0.4)]" />
                    ) : (
                      p.icon
                    )}
                  </motion.div>
                  
                  <h3 className="text-sm font-mono font-bold uppercase mb-1">{p.label}</h3>
                  <p className="text-[9px] uppercase tracking-widest opacity-40 mb-2">{p.sub}</p>

                  <AnimatePresence>
                    {activePortal === p.id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-[10px] italic text-[#14141499] max-w-[200px] mt-2 leading-tight">
                          {p.desc}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <AnimatePresence mode="wait">
                    {errors[p.id] ? (
                      <motion.div 
                        key="error"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-[9px] font-mono font-bold uppercase tracking-tighter mt-4 py-1 px-3 border border-accent-red text-accent-red bg-[#EF44441A] flex items-center gap-2"
                      >
                        <XCircle className="w-3 h-3" />
                        <span>{errors[p.id]}</span>
                      </motion.div>
                    ) : processing[p.id] ? (
                      <motion.div 
                        key="processing"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-[10px] font-mono font-bold uppercase tracking-tighter mt-4 py-1 px-3 border border-primary text-primary bg-[#1414141A] flex items-center gap-2"
                      >
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Processing...</span>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="status"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`text-[10px] font-mono font-bold uppercase tracking-tighter mt-4 py-1 px-3 border transition-all flex items-center gap-2
                          ${userData.portals[p.id] 
                            ? 'border-accent-green text-accent-green bg-[#22C55E33]' 
                            : 'border-border text-primary group-hover:border-primary group-hover:bg-primary group-hover:text-white'}`}
                      >
                        {userData.portals[p.id] ? (
                          <>
                            <Sparkles className="w-3 h-3 animate-pulse" />
                            <span>READY FOR ANALYSIS</span>
                          </>
                        ) : (
                          <>
                            <span>Tap to scan</span>
                            <span className="opacity-40 text-[7px] ml-1 bg-[#1414141A] px-1 py-0.5 rounded-sm">MAX: 2MB</span>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Tech scan lines animation if not captured */}
                {!userData.portals[p.id] && (
                  <div className="absolute inset-x-0 h-px bg-[#14141433] animate-scan pointer-events-none" />
                )}
              </label>
            ))}
          </div>

          <div className="p-8 flex justify-center bg-surface-bright">
            <button 
              onClick={handleAnalyze}
              disabled={!isComplete}
              className="group relative overflow-hidden bg-primary text-white font-mono text-sm font-bold py-4 px-12 uppercase tracking-tighter shadow-md hover:bg-[#262626] transition-all flex items-center gap-4 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <span>Analyze</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
