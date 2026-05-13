import { useState } from 'react';

export function WeatherCard() {
  const [isExpanded, setIsExpanded] = useState(false);

  const forecast = [
    { day: 'Today', temp: 85, icon: '☀️', condition: 'Sunny' },
    { day: 'Tuesday', temp: 85, icon: '☀️', condition: 'Sunny' },
    { day: 'Wednesday', temp: 85, icon: '☀️', condition: 'Sunny' },
    { day: 'Thursday', temp: 85, icon: '☀️', condition: 'Sunny' },
    { day: 'Friday', temp: null, icon: '🔮', condition: '???' },
    { day: 'Weekend', temp: null, icon: '⏰', condition: 'Get a time machine' },
  ];

  return (
    <div className="relative">
      {/* Stable indicator */}
      <div className="absolute -top-3 -right-2 md:-right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg z-20">
        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
        STABLE
      </div>

      <div
        className="bg-gradient-to-br from-sky-600 via-sky-500 to-amber-400 rounded-2xl p-4 md:p-6 border-4 border-sky-300 shadow-2xl cursor-pointer transition-all duration-300 hover:shadow-sky-500/30 hover:shadow-xl"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-4xl md:text-5xl">☀️</span>
              <div>
                <h3 className="text-white font-bold text-lg md:text-xl">Mobile, Alabama</h3>
                <p className="text-sky-100 text-sm">The one thing that actually works here</p>
              </div>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-5xl md:text-6xl font-black text-white">85°</div>
            <div className="text-sky-100 text-sm font-medium">Sunny & Perfect</div>
            <div className="text-sky-200/80 text-xs mt-1">(Unlike the ice cream machines)</div>
          </div>
        </div>

        {/* Expanded Forecast */}
        <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-80 mt-6' : 'max-h-0'}`}>
          <div className="border-t border-white/20 pt-4">
            <h4 className="text-white/80 text-sm font-medium mb-3">Weekly Forecast</h4>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {forecast.map((day, i) => (
                <div
                  key={day.day}
                  className={`bg-white/10 rounded-lg p-2 md:p-3 text-center backdrop-blur-sm ${i >= 4 ? 'opacity-50' : ''}`}
                >
                  <div className="text-xs text-white/70 mb-1">{day.day}</div>
                  <div className="text-2xl md:text-3xl mb-1">{day.icon}</div>
                  {day.temp ? (
                    <div className="text-white font-bold">{day.temp}°</div>
                  ) : (
                    <div className="text-white/50 text-xs">{day.condition}</div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-white/60 text-xs mt-4 italic">
              &quot;Sunny and 85° through Thursday. For the weekend forecast, consult your local psychic.&quot;
            </p>
          </div>
        </div>

        <div className="text-center mt-4 text-white/60 text-xs">
          {isExpanded ? 'Click to collapse' : 'Click for full forecast'}
        </div>
      </div>
    </div>
  );
}
