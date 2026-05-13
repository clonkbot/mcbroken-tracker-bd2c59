import { useState, useEffect } from 'react';

interface CrashOverlayProps {
  onDismiss: () => void;
}

export function CrashOverlay({ onDismiss }: CrashOverlayProps) {
  const [errorLines, setErrorLines] = useState<string[]>([]);
  const [showButton, setShowButton] = useState(false);

  const errors = [
    "FATAL ERROR: ICE_CREAM_OVERFLOW",
    "Stack trace: McFlurry.serve() -> null",
    "Exception in thread 'main' java.lang.NullPointerException",
    "    at McDonalds.IceCreamMachine.work(IceCreamMachine.java:404)",
    "    at McDonalds.Customer.orderMcFlurry(Customer.java:1)",
    "    at McDonalds.HopesAndDreams.crush(HopesAndDreams.java:∞)",
    "...",
    "ERROR: Expected ice cream, got disappointment",
    "WARNING: Machine has been 'broken' since 1998",
    "CRITICAL: Success rate 0.00000001%",
    "INFO: Maybe try Dairy Queen?",
    "FATAL: App crashed due to irony overload",
    "",
    "This app tracking broken ice cream machines has itself broken.",
    "The prophecy is fulfilled.",
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < errors.length) {
        setErrorLines(prev => [...prev, errors[index]]);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowButton(true), 500);
      }
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* BSOD-style background */}
      <div
        className="absolute inset-0 bg-blue-700"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundBlendMode: 'overlay',
        }}
      />

      {/* Scanlines */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />

      {/* Content */}
      <div className="relative max-w-2xl w-full text-white font-mono text-sm md:text-base">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl md:text-6xl">💀</span>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold">McBroken has crashed</h1>
            <p className="text-blue-200">(Just like the ice cream machines)</p>
          </div>
        </div>

        <div className="bg-black/30 rounded p-4 max-h-64 overflow-y-auto">
          {errorLines.map((line, i) => (
            <div key={i} className={`${line.startsWith('FATAL') ? 'text-red-400' : line.startsWith('WARNING') ? 'text-yellow-400' : 'text-white/90'}`}>
              {line}
            </div>
          ))}
          <span className="animate-blink">▌</span>
        </div>

        {showButton && (
          <div className="mt-6 text-center animate-fade-in">
            <button
              onClick={onDismiss}
              className="bg-white text-blue-700 font-bold px-8 py-3 rounded-lg hover:bg-blue-100 transition-colors text-lg active:scale-95 transform"
            >
              Pretend This Didn&apos;t Happen
            </button>
            <p className="text-blue-200 text-xs mt-3">
              (The machines will still be broken)
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
