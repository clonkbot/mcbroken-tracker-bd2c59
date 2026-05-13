import { useState, useEffect } from 'react';
import { IceCreamMachine } from './components/IceCreamMachine';
import { WeatherCard } from './components/WeatherCard';
import { CrashOverlay } from './components/CrashOverlay';
import { GlitchText } from './components/GlitchText';

interface Machine {
  id: number;
  location: string;
  status: 'broken' | 'working' | 'unknown' | 'crashed';
  lastReport: string;
}

const initialMachines: Machine[] = [
  { id: 1, location: "Mobile, AL - Airport Blvd", status: 'broken', lastReport: '2 min ago' },
  { id: 2, location: "Mobile, AL - Dauphin St", status: 'broken', lastReport: '15 min ago' },
  { id: 3, location: "Mobile, AL - Schillinger Rd", status: 'working', lastReport: '1 hr ago' },
  { id: 4, location: "Mobile, AL - Government St", status: 'broken', lastReport: '30 min ago' },
  { id: 5, location: "Mobile, AL - Hillcrest Rd", status: 'unknown', lastReport: '3 hrs ago' },
  { id: 6, location: "Mobile, AL - Cottage Hill", status: 'broken', lastReport: '45 min ago' },
];

function App() {
  const [machines, setMachines] = useState<Machine[]>(initialMachines);
  const [showCrash, setShowCrash] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (loadingProgress < 100) {
        setLoadingProgress(prev => Math.min(prev + Math.random() * 15, 100));
      }
    }, 200);
    return () => clearInterval(interval);
  }, [loadingProgress]);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchIntensity(Math.random() * 0.5);
      setTimeout(() => setGlitchIntensity(0), 100);
    }, 2000 + Math.random() * 3000);
    return () => clearInterval(glitchInterval);
  }, []);

  useEffect(() => {
    const errorInterval = setInterval(() => {
      setErrorCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 500);
    return () => clearInterval(errorInterval);
  }, []);

  const handleMachineBreak = (id: number) => {
    setMachines(prev => prev.map(m =>
      m.id === id ? { ...m, status: 'crashed' as const } : m
    ));

    if (machines.filter(m => m.status === 'crashed').length >= 2) {
      setTimeout(() => setShowCrash(true), 500);
    }
  };

  const brokenCount = machines.filter(m => m.status === 'broken').length;
  const crashedCount = machines.filter(m => m.status === 'crashed').length;

  return (
    <div
      className="min-h-screen bg-neutral-900 text-white overflow-x-hidden relative"
      style={{
        transform: glitchIntensity > 0.3 ? `translateX(${(Math.random() - 0.5) * 4}px)` : 'none',
      }}
    >
      {/* Scanlines overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)',
        }}
      />

      {/* CRT vignette */}
      <div className="fixed inset-0 pointer-events-none z-40"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 60%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Noise texture */}
      <div className="fixed inset-0 pointer-events-none z-30 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {showCrash && <CrashOverlay onDismiss={() => setShowCrash(false)} />}

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b-4 border-red-600 bg-gradient-to-r from-red-700 via-red-600 to-yellow-500 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <GlitchText
                  text="McBroken Tracker"
                  className="text-3xl md:text-5xl font-black tracking-tighter"
                />
                <p className="text-yellow-200 text-sm md:text-base mt-1 font-mono">
                  ERROR_COUNT: {errorCount.toLocaleString()} | STABILITY: {Math.max(0, 100 - crashedCount * 30)}%
                </p>
              </div>
              <div className="bg-black/30 px-4 py-2 rounded-lg border border-yellow-400/50">
                <div className="text-xs text-yellow-300 uppercase tracking-wider">System Load</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-24 md:w-32 h-3 bg-black/50 rounded overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-red-500 transition-all duration-200"
                      style={{ width: `${loadingProgress}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-red-400 animate-pulse">
                    {loadingProgress >= 100 ? 'CRITICAL' : 'LOADING...'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Warning Banner */}
        <div className="bg-yellow-400 text-black overflow-hidden">
          <div className="animate-marquee whitespace-nowrap py-2 font-mono text-sm">
            {Array(10).fill('⚠️ WARNING: App may crash at any moment due to overwhelming machine failure data ⚠️ ').join('')}
          </div>
        </div>

        <main className="max-w-6xl mx-auto p-4 md:p-8">
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
            <StatCard
              label="Broken"
              value={brokenCount}
              color="red"
              icon="🔴"
            />
            <StatCard
              label="Working"
              value={machines.filter(m => m.status === 'working').length}
              color="green"
              icon="🟢"
            />
            <StatCard
              label="Unknown"
              value={machines.filter(m => m.status === 'unknown').length}
              color="gray"
              icon="⚫"
            />
            <StatCard
              label="CRASHED"
              value={crashedCount}
              color="yellow"
              icon="💥"
            />
          </div>

          {/* Weather Card - The "working" element */}
          <WeatherCard />

          {/* Machine Grid */}
          <section className="mt-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-red-500">📍</span> Mobile, AL Locations
              <span className="text-xs bg-red-600 px-2 py-1 rounded animate-pulse">LIVE</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {machines.map((machine, index) => (
                <IceCreamMachine
                  key={machine.id}
                  machine={machine}
                  onBreak={() => handleMachineBreak(machine.id)}
                  delay={index * 100}
                />
              ))}
            </div>
          </section>

          {/* Sarcastic Footer Content */}
          <div className="mt-12 text-center">
            <p className="text-neutral-500 text-sm font-mono mb-2">
              &quot;Want the exact weekend forecast this early? Get a time machine 🙄&quot;
            </p>
            <p className="text-neutral-600 text-xs">
              Data accuracy: approximately 0% | Uptime: theoretical
            </p>
          </div>
        </main>

        {/* Attribution Footer */}
        <footer className="border-t border-neutral-800 mt-12 py-6">
          <p className="text-center text-neutral-600 text-xs font-mono">
            Requested by @OfficialYallbot · Built by @clonkbot
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}

function StatCard({ label, value, color, icon }: {
  label: string;
  value: number;
  color: string;
  icon: string;
}) {
  const colorClasses: Record<string, string> = {
    red: 'border-red-500 bg-red-950/50',
    green: 'border-green-500 bg-green-950/50',
    gray: 'border-neutral-500 bg-neutral-800/50',
    yellow: 'border-yellow-500 bg-yellow-950/50',
  };

  return (
    <div className={`border-2 ${colorClasses[color]} rounded-lg p-3 md:p-4 text-center`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl md:text-3xl font-black">{value}</div>
      <div className="text-xs md:text-sm uppercase tracking-wider text-neutral-400">{label}</div>
    </div>
  );
}

export default App;
