import { useState, useEffect } from 'react';

interface Machine {
  id: number;
  location: string;
  status: 'broken' | 'working' | 'unknown' | 'crashed';
  lastReport: string;
}

interface IceCreamMachineProps {
  machine: Machine;
  onBreak: () => void;
  delay: number;
}

export function IceCreamMachine({ machine, onBreak, delay }: IceCreamMachineProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (machine.status === 'working') {
      const interval = setInterval(() => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 150);
      }, 3000 + Math.random() * 5000);
      return () => clearInterval(interval);
    }
  }, [machine.status]);

  const handleClick = () => {
    const status = machine.status as string;
    if (status === 'crashed') return;

    setClickCount(prev => prev + 1);
    if (clickCount >= 2) {
      onBreak();
    }
  };

  const statusConfig = {
    broken: {
      bg: 'bg-gradient-to-br from-red-900/80 to-red-950/90',
      border: 'border-red-500',
      icon: '🍦',
      iconBg: 'bg-red-800',
      label: 'BROKEN',
      labelBg: 'bg-red-600',
    },
    working: {
      bg: 'bg-gradient-to-br from-green-900/80 to-green-950/90',
      border: 'border-green-500',
      icon: '🍦',
      iconBg: 'bg-green-800',
      label: 'WORKING',
      labelBg: 'bg-green-600',
    },
    unknown: {
      bg: 'bg-gradient-to-br from-neutral-800/80 to-neutral-900/90',
      border: 'border-neutral-500',
      icon: '❓',
      iconBg: 'bg-neutral-700',
      label: 'UNKNOWN',
      labelBg: 'bg-neutral-600',
    },
    crashed: {
      bg: 'bg-gradient-to-br from-yellow-900/80 to-orange-950/90',
      border: 'border-yellow-400',
      icon: '💥',
      iconBg: 'bg-yellow-800',
      label: 'CRASHED',
      labelBg: 'bg-yellow-600 animate-pulse',
    },
  };

  const config = statusConfig[machine.status];

  return (
    <div
      className={`
        ${config.bg} ${config.border} border-2 rounded-xl p-4
        transform transition-all duration-500 cursor-pointer
        hover:scale-[1.02] active:scale-[0.98]
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        ${isGlitching ? 'animate-shake' : ''}
        ${machine.status === 'crashed' ? 'animate-shake-constant' : ''}
      `}
      onClick={handleClick}
      style={{
        filter: machine.status === 'crashed'
          ? `hue-rotate(${Math.random() * 360}deg) saturate(2)`
          : 'none',
      }}
    >
      <div className="flex items-start gap-3">
        <div className={`${config.iconBg} w-12 h-12 rounded-lg flex items-center justify-center text-2xl relative overflow-hidden`}>
          <span className={machine.status === 'broken' ? 'opacity-50 grayscale' : ''}>
            {config.icon}
          </span>
          {machine.status === 'broken' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-0.5 bg-red-500 rotate-45 transform" />
            </div>
          )}
          {machine.status === 'crashed' && (
            <div className="absolute inset-0 bg-yellow-500/30 animate-pulse" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`${config.labelBg} text-white text-xs font-bold px-2 py-0.5 rounded`}>
              {config.label}
            </span>
          </div>
          <h3 className="font-semibold text-sm truncate">{machine.location}</h3>
          <p className="text-xs text-neutral-400 mt-1">
            Last report: {machine.lastReport}
          </p>
        </div>
      </div>

      {machine.status === 'crashed' && (
        <div className="mt-3 bg-black/50 rounded p-2 font-mono text-xs text-red-400 overflow-hidden">
          <div className="animate-scroll-error">
            ERROR: MACHINE_OVERFLOW<br/>
            STACK_TRACE: null<br/>
            STATUS: UNRECOVERABLE<br/>
            TRY: turning it off and on again
          </div>
        </div>
      )}

      {clickCount > 0 && clickCount < 3 && machine.status !== 'crashed' && (
        <div className="mt-2 text-xs text-yellow-400 text-center animate-pulse">
          Warning: Stability decreasing... ({3 - clickCount} clicks until crash)
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px) rotate(-1deg); }
          75% { transform: translateX(3px) rotate(1deg); }
        }
        @keyframes shake-constant {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          10% { transform: translateX(-2px) rotate(-0.5deg); }
          20% { transform: translateX(2px) rotate(0.5deg); }
          30% { transform: translateX(-1px) rotate(-0.3deg); }
          40% { transform: translateX(1px) rotate(0.3deg); }
          50% { transform: translateX(-2px) rotate(-0.5deg); }
          60% { transform: translateX(2px) rotate(0.5deg); }
          70% { transform: translateX(-1px) rotate(-0.3deg); }
          80% { transform: translateX(1px) rotate(0.3deg); }
          90% { transform: translateX(-2px) rotate(-0.5deg); }
        }
        @keyframes scroll-error {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-shake {
          animation: shake 0.15s ease-in-out;
        }
        .animate-shake-constant {
          animation: shake-constant 0.5s ease-in-out infinite;
        }
        .animate-scroll-error {
          animation: scroll-error 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
