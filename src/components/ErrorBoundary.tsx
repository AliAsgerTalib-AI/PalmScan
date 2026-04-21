import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Hexagon, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#E4E3E0] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full border border-[#141414] bg-white p-12 space-y-8 relative overflow-hidden">
            {/* Structural Ornaments */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#14141433]" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#14141433]" />
            
            <HeaderAccent />
            
            <div className="space-y-4 relative z-10">
              <h1 className="text-3xl font-mono tracking-tighter uppercase text-[#EF4444]">
                Ritual Fracture
              </h1>
              <p className="font-serif italic text-lg leading-relaxed text-[#141414CC]">
                The mystical synthesis has encountered a fatal instability. The Akashic stream has collapsed.
              </p>
              <div className="bg-[#FAFAFA] border border-[#1414141A] p-4 text-left font-mono text-[10px] text-[#14141466] break-all overflow-auto max-h-32">
                ERROR_CODE: {this.state.error?.name || 'UNKNOWN'}<br/>
                SPEC: {this.state.error?.message || 'CRITICAL_FAILURE'}
              </div>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-[#141414] text-[#FAFAFA] font-mono text-sm uppercase tracking-widest hover:bg-opacity-90 transition-all border border-[#141414]"
            >
              Re-materialize Interface
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function HeaderAccent() {
  return (
    <div className="flex justify-center mb-4">
      <div className="relative">
        <Hexagon className="w-12 h-12 text-[#EF4444] opacity-20 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-[#EF4444]" />
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;
