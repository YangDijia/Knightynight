import React, { useState, useEffect } from 'react';
import { X, Wind, Flame, Dog } from 'lucide-react';
import { UserProfile } from '../types';

interface AudioState {
  fire: number;
  wind: number;
  dog: number;
}

interface TheBenchProps {
  currentUser: UserProfile;
}

const TheBench: React.FC<TheBenchProps> = ({ currentUser }) => {
  const [restingState, setRestingState] = useState<Record<UserProfile, boolean>>({
    'Knight': false,
    'Hornet': false,
  });
  
  const [showMixer, setShowMixer] = useState(false);
  const [volumes, setVolumes] = useState<AudioState>({
    fire: 50,
    wind: 30,
    dog: 0,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        setShowMixer((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleVolumeChange = (type: keyof AudioState, val: string) => {
    setVolumes(prev => ({ ...prev, [type]: parseInt(val) }));
  };

  const toggleRest = () => {
    setRestingState(prev => ({
      ...prev,
      [currentUser]: !prev[currentUser]
    }));
  };

  // Gothic Bench Illustration
  const GothicBenchSVG = () => (
    <svg viewBox="0 0 400 300" className="w-[600px] h-auto drop-shadow-2xl">
      <path d="M 80 250 L 80 280" stroke="#1A2633" strokeWidth="8" strokeLinecap="round" />
      <path d="M 320 250 L 320 280" stroke="#1A2633" strokeWidth="8" strokeLinecap="round" />
      <path d="M 60 150 L 60 250 L 340 250 L 340 150" fill="none" stroke="#2D3A4A" strokeWidth="6" />
      <path d="M 60 150 Q 100 100 140 150" fill="none" stroke="#2D3A4A" strokeWidth="4" />
      <path d="M 140 150 Q 200 80 260 150" fill="none" stroke="#2D3A4A" strokeWidth="4" />
      <path d="M 260 150 Q 300 100 340 150" fill="none" stroke="#2D3A4A" strokeWidth="4" />
      <path d="M 100 125 L 100 100" stroke="#2D3A4A" strokeWidth="3" />
      <path d="M 200 115 L 200 80" stroke="#2D3A4A" strokeWidth="4" />
      <path d="M 300 125 L 300 100" stroke="#2D3A4A" strokeWidth="3" />
      <rect x="50" y="220" width="300" height="20" rx="2" fill="#0F1E26" stroke="#2D3A4A" strokeWidth="2" />
      <path d="M 60 240 L 60 290 Q 50 300 40 290" fill="none" stroke="#0F1E26" strokeWidth="6" />
      <path d="M 340 240 L 340 290 Q 350 300 360 290" fill="none" stroke="#0F1E26" strokeWidth="6" />
    </svg>
  );

  const TheKnightSVG = () => (
    <svg viewBox="0 0 100 150" className="w-32 h-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
       <path d="M 20 80 Q 50 70 80 80 L 90 130 Q 50 140 10 130 Z" fill="#2D3A4A" />
       <path d="M 20 80 Q 10 100 15 120" stroke="#1A2633" strokeWidth="2" fill="none" />
       <path d="M 25 30 C 25 10 75 10 75 30 L 75 60 Q 75 75 50 75 Q 25 75 25 60 Z" fill="#E3DAC9" />
       <path d="M 28 20 Q 20 0 30 -10 Q 40 10 35 25" fill="#E3DAC9" />
       <path d="M 72 20 Q 80 0 70 -10 Q 60 10 65 25" fill="#E3DAC9" />
       <ellipse cx="40" cy="45" rx="8" ry="12" fill="black" />
       <ellipse cx="60" cy="45" rx="8" ry="12" fill="black" />
    </svg>
  );

  const HornetSVG = () => (
    <svg viewBox="0 0 100 150" className="w-32 h-auto drop-shadow-[0_0_15px_rgba(255,0,0,0.1)]">
       <path d="M 30 70 Q 50 60 70 70 L 85 140 Q 50 150 15 140 Z" fill="#3D1F1F" stroke="#1A2633" strokeWidth="1" />
       <path d="M 30 70 Q 20 90 25 120" stroke="#1A2633" strokeWidth="1" fill="none" />
       <path d="M 50 20 C 30 20 20 50 30 60 C 40 70 60 70 70 60 C 80 50 70 20 50 20 Z" fill="#E3DAC9" />
       <path d="M 30 30 Q 20 10 40 5" fill="#E3DAC9" />
       <path d="M 70 30 Q 80 10 60 5" fill="#E3DAC9" />
       <path d="M 38 45 Q 45 40 50 48 Q 45 55 38 45" fill="black" />
       <path d="M 62 45 Q 55 40 50 48 Q 55 55 62 45" fill="black" />
       <path d="M 75 80 L 90 60" stroke="#E3DAC9" strokeWidth="2" />
    </svg>
  );

  return (
    <div className="relative w-full h-[calc(100vh-140px)] flex flex-col items-center justify-center">
      
      {/* Scene Container */}
      <div className="relative z-10 flex flex-col items-center mt-12">
        <div className="relative flex items-end justify-center">
           <div className="relative z-10">
             <GothicBenchSVG />
           </div>
           <div 
              className={`absolute bottom-[80px] left-[150px] z-20 transition-all duration-1000 ease-in-out ${restingState.Knight ? 'opacity-100 scale-100' : 'opacity-0 scale-90 translate-y-4'}`}
           >
              <TheKnightSVG />
           </div>
           <div 
              className={`absolute bottom-[80px] left-[320px] z-20 transition-all duration-1000 ease-in-out ${restingState.Hornet ? 'opacity-100 scale-100' : 'opacity-0 scale-90 translate-y-4'}`}
           >
              <HornetSVG />
           </div>
        </div>

        <button
          onClick={toggleRest}
          className={`
            mt-12 px-12 py-3 rounded-full border border-knight-accent/20 bg-knight-bg/60 backdrop-blur-md
            font-title text-xl tracking-[0.3em] text-white uppercase
            transition-all duration-500 ease-out shadow-glow
            hover:scale-105 hover:border-knight-glow hover:bg-knight-glow/10 hover:shadow-glow-hover
            active:scale-95
            ${restingState[currentUser] ? 'opacity-80 text-knight-glow border-knight-glow' : 'opacity-100'}
          `}
        >
          {restingState[currentUser] ? `${currentUser} is Resting` : `Rest as ${currentUser}`}
        </button>

        {!showMixer && (
          <p className="mt-8 text-[10px] text-knight-accent/40 font-title tracking-[0.2em] animate-pulse">
            [ TAB ] for ambience
          </p>
        )}
      </div>

      <div 
        className={`
          absolute right-8 top-1/2 -translate-y-1/2 w-72 bg-knight-secondary/90 backdrop-blur-xl border border-white/10 rounded-3xl
          transition-all duration-500 ease-spring z-40 p-6 flex flex-col gap-6 shadow-2xl
          ${showMixer ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0 pointer-events-none'}
        `}
      >
        <div className="flex justify-between items-center pb-4 border-b border-white/5">
          <h3 className="font-title text-lg text-white tracking-widest">Soundscapes</h3>
          <button onClick={() => setShowMixer(false)} className="text-white/50 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {[
            { id: 'fire', icon: Flame, label: 'Bonfire' },
            { id: 'wind', icon: Wind, label: 'Howling Cliffs' },
            { id: 'dog', icon: Dog, label: 'Stray Shade' }
          ].map((track) => (
            <div key={track.id} className="space-y-2 group">
              <div className="flex items-center gap-3 text-knight-accent/60 group-hover:text-knight-glow transition-colors">
                <track.icon className="w-4 h-4" />
                <span className="font-body text-xs uppercase tracking-wider font-bold">{track.label}</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" 
                value={volumes[track.id as keyof AudioState]}
                onChange={(e) => handleVolumeChange(track.id as keyof AudioState, e.target.value)}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-knight-accent hover:accent-knight-glow"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TheBench;