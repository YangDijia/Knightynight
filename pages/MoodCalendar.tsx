import React, { useState, useRef, useEffect } from 'react';
import { MoodType, MOODS, DailyData, UserProfile } from '../types';
import { X, Bookmark, PenLine } from 'lucide-react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface MoodCalendarProps {
  currentUser: UserProfile;
}

const MoodCalendar: React.FC<MoodCalendarProps> = ({ currentUser }) => {
  // Initialize state from localStorage if available
  const [userData, setUserData] = useState<Record<UserProfile, Record<string, DailyData>>>(() => {
    try {
      const savedData = localStorage.getItem('knight_calendar_data');
      return savedData ? JSON.parse(savedData) : { 'Knight': {}, 'Hornet': {} };
    } catch (e) {
      return { 'Knight': {}, 'Hornet': {} };
    }
  });

  // Save to localStorage whenever userData changes
  useEffect(() => {
    localStorage.setItem('knight_calendar_data', JSON.stringify(userData));
  }, [userData]);
  
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [journalText, setJournalText] = useState('');
  
  // Long Press State
  const [pressingDate, setPressingDate] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  
  const PRESS_DURATION = 1000;

  const currentData = userData[currentUser];
  const year = 2026;

  const calculateStats = () => {
    const entries = Object.values(currentData) as DailyData[];
    if (entries.length === 0) return { dominant: 'None', dominantLabel: '-', soulVessel: 0 };

    const moodCounts: Record<string, number> = {};
    let happyCount = 0;

    entries.forEach(entry => {
      if (entry.mood) {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
        if (entry.mood === 'happy' || entry.mood === 'peaceful') happyCount++;
      }
    });

    let dominant = 'None';
    let maxCount = 0;
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominant = mood;
      }
    });

    const soulVessel = Math.round((happyCount / entries.length) * 100);
    return { 
        dominant: dominant === 'None' ? '-' : MOODS[dominant as MoodType], 
        dominantLabel: dominant === 'None' ? '-' : dominant.toUpperCase(),
        soulVessel 
    };
  };

  const stats = calculateStats();

  const startPress = (dateStr: string) => {
    setPressingDate(dateStr);
    setProgress(0);
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / PRESS_DURATION) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        handleLongPressTrigger(dateStr);
      }
    };
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const cancelPress = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    setPressingDate(null);
    setProgress(0);
  };

  const handleLongPressTrigger = (dateStr: string) => {
    cancelPress();
    const existingEntry = currentData[dateStr]?.journal || '';
    setJournalText(existingEntry);
    setSelectedDate(dateStr);
    setShowJournalModal(true);
  };

  const handleDayClick = (dateStr: string) => {
    if (!pressingDate) {
      setSelectedDate(dateStr);
    }
  };

  const handleSelectMood = (mood: MoodType) => {
    if (selectedDate) {
      setUserData(prev => ({
        ...prev,
        [currentUser]: {
          ...prev[currentUser],
          [selectedDate]: { ...prev[currentUser][selectedDate], mood }
        }
      }));
      // Only close if we are in the simple selection mode
      if (!showJournalModal) setSelectedDate(null);
    }
  };

  const handleSaveJournal = () => {
    if (selectedDate) {
       setUserData(prev => ({
        ...prev,
        [currentUser]: {
          ...prev[currentUser],
          [selectedDate]: { ...prev[currentUser][selectedDate], journal: journalText }
        }
      }));
      closeAllModals();
    }
  };

  const closeAllModals = () => {
      setShowJournalModal(false);
      setSelectedDate(null);
      setJournalText('');
  };

  const getDaysInMonth = (monthIndex: number) => new Date(year, monthIndex + 1, 0).getDate();
  const getStartDay = (monthIndex: number) => new Date(year, monthIndex, 1).getDay();

  return (
    <div className="relative px-4 py-8 max-w-[1600px] mx-auto flex flex-col items-center">
      
      {/* Header Stats */}
      <header className="mb-12 md:mb-16 text-center relative z-10 w-full max-w-4xl flex flex-col items-center">
         <h1 className="font-title text-6xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-white to-knight-accent/10 tracking-[0.2em] mb-8 drop-shadow-2xl">
           {year}
         </h1>
         
         {/* Stats Container - Stacked on mobile, Row on desktop */}
         <div className="relative flex flex-col md:flex-row justify-center items-stretch gap-0 font-title text-xs md:text-sm tracking-widest text-knight-accent uppercase backdrop-blur-md bg-[#0F1E26]/80 rounded-lg border border-knight-accent/20 shadow-glow-amber overflow-hidden group w-full md:w-auto">
            
            {/* Left: Dominant Mood */}
            <div className="flex flex-col items-center justify-center gap-2 px-6 md:px-10 py-4 border-b md:border-b-0 md:border-r border-knight-accent/10 relative">
              <span className="text-knight-glow text-[10px] opacity-60 tracking-[0.2em]">Dominant Mood</span>
              <div className="flex flex-col items-center">
                  <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] mb-1">{stats.dominant}</span>
                  <span className="text-[10px] text-knight-accent/50">{stats.dominantLabel}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-knight-glow/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>

            {/* Right: Soul Vessel */}
            <div className="flex flex-col items-center justify-center gap-3 px-6 md:px-10 py-4 relative min-w-[200px]">
              <span className="text-knight-infected text-[10px] opacity-60 tracking-[0.2em]">Soul Vessel</span>
              
              <div className="relative w-full h-3 bg-black/40 rounded-full border border-white/10 shadow-inner overflow-hidden">
                   {/* Animated Liquid Gradient */}
                   <div 
                     className="h-full bg-gradient-to-r from-orange-900 via-knight-infected to-yellow-100 shadow-[0_0_15px_#FFB84D] transition-all duration-1000 ease-out relative"
                     style={{ width: `${stats.soulVessel}%` }}
                   >
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50 mix-blend-overlay"></div>
                   </div>
              </div>
              
              <span className="text-lg text-white font-mono shadow-black drop-shadow-md">{stats.soulVessel}%</span>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-knight-infected/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
         </div>
      </header>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full pb-12">
        {MONTHS.map((month, monthIndex) => {
          const daysInMonth = getDaysInMonth(monthIndex);
          const startDay = getStartDay(monthIndex);
          const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
          const emptySlots = Array.from({ length: startDay }, (_, i) => i);

          return (
            <div 
              key={month} 
              className="bg-knight-secondary/20 border border-white/5 rounded-sm p-4 md:p-6 backdrop-blur-sm hover:border-knight-glow/20 hover:bg-knight-secondary/40 transition-all duration-500 group relative overflow-hidden"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 95%, 95% 100%, 0 100%)' }}
            >
              <h2 className="font-title text-md text-center mb-6 text-knight-accent group-hover:text-knight-glow tracking-[0.2em] uppercase border-b border-white/5 pb-3 transition-colors">
                {month}
              </h2>
              <div className="grid grid-cols-7 gap-y-3 md:gap-y-4 gap-x-1">
                {['S','M','T','W','T','F','S'].map((d, i) => (
                  <span key={i} className="text-[9px] text-center text-knight-accent/30 font-bold font-title">{d}</span>
                ))}
                {emptySlots.map(i => <div key={`empty-${i}`} />)}
                {days.map(day => {
                  const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const data = currentData[dateStr] || {};
                  const isPressing = pressingDate === dateStr;

                  return (
                    <div 
                      key={day}
                      className="relative flex flex-col items-center justify-center aspect-square"
                      onMouseDown={() => startPress(dateStr)}
                      onMouseUp={cancelPress}
                      onMouseLeave={cancelPress}
                      onTouchStart={() => startPress(dateStr)}
                      onTouchEnd={cancelPress}
                      onClick={() => handleDayClick(dateStr)}
                    >
                      <button
                        className={`
                          w-8 h-8 md:w-10 md:h-10 flex items-center justify-center transition-all duration-300 relative rounded-lg
                          ${data.mood 
                            ? 'scale-110 z-10'
                            : 'hover:bg-white/5 hover:text-white'}
                        `}
                      >
                        {data.mood && (
                          <span className="text-lg md:text-xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] animate-[fadeIn_0.3s_ease-out]">
                            {MOODS[data.mood]}
                          </span>
                        )}
                        
                        {/* Date Number - Moves up if mood is present */}
                        <span className={`
                            absolute transition-all duration-300 font-mono pointer-events-none
                            ${data.mood 
                                ? '-top-3 text-[9px] text-knight-accent/40 font-bold' 
                                : 'text-xs md:text-sm text-knight-accent/70 group-hover:text-white'}
                        `}>
                            {day}
                        </span>

                        {data.journal && (
                          <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-knight-glow rounded-full shadow-[0_0_5px_#A8E6CF]"></div>
                        )}
                      </button>
                      
                      {/* Long Press Gradient Bar */}
                      {isPressing && (
                        <div className="absolute -bottom-2 w-8 md:w-10 h-1 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-knight-glow to-white shadow-[0_0_8px_#A8E6CF]" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Simple Mood Selector Modal (Click) */}
      {selectedDate && !showJournalModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in px-4" onClick={() => setSelectedDate(null)}>
          <div className="bg-[#0F1E26] border border-knight-accent/20 rounded-3xl p-6 md:p-8 max-w-[600px] w-full shadow-glow-amber transform scale-100" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 md:mb-8 border-b border-white/5 pb-4">
              <h3 className="font-title text-xl text-white tracking-widest">Select Mood</h3>
              <button onClick={() => setSelectedDate(null)} className="text-white/50 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-5 gap-2 md:gap-4">
              {Object.entries(MOODS).map(([key, emoji]) => (
                <button
                  key={key}
                  onClick={() => handleSelectMood(key as MoodType)}
                  className="flex flex-col items-center gap-2 p-2 md:p-4 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <span className="text-3xl md:text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform">{emoji}</span>
                  <span className="text-[10px] md:text-xs uppercase tracking-wider text-knight-accent/60 group-hover:text-knight-glow">{key}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-knight-accent/30 text-[10px] md:text-xs tracking-widest uppercase">
                    Long press a day to write in your journal
                </p>
            </div>
          </div>
        </div>
      )}

      {/* Journal Modal */}
      {showJournalModal && selectedDate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fade-in p-0 md:p-4" onClick={closeAllModals}>
           <div className="bg-[#0F1E26] w-full md:max-w-2xl h-full md:h-[80vh] border-y md:border border-knight-accent/20 md:rounded-lg shadow-2xl flex flex-col relative" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#0F1E26] z-10">
                  <div className="flex flex-col">
                      <span className="font-title text-xl text-white tracking-widest">Journal</span>
                      <span className="font-mono text-xs text-knight-accent/50">{selectedDate}</span>
                  </div>
                  <div className="flex gap-4">
                      <button onClick={handleSaveJournal} className="flex items-center gap-2 px-4 py-2 bg-knight-glow/10 text-knight-glow rounded hover:bg-knight-glow hover:text-black transition-colors font-title text-xs tracking-widest uppercase">
                          <Bookmark className="w-4 h-4" /> <span className="hidden md:inline">Save</span>
                      </button>
                      <button onClick={closeAllModals} className="text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
                  </div>
              </div>

              <div className="flex-grow p-6 md:p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-10 pointer-events-none"></div>
                  <textarea
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                    placeholder="What burdens your mind today?"
                    className="w-full h-full bg-transparent border-none outline-none text-knight-accent/80 font-serif text-lg leading-relaxed resize-none placeholder-knight-accent/20 pb-20"
                  />
                  
                  {/* Mood Selector inside Journal */}
                  <div className="absolute bottom-6 right-6 flex gap-2 bg-[#0F1E26]/80 backdrop-blur-md p-2 rounded-full border border-white/5">
                       {Object.entries(MOODS).map(([key, emoji]) => (
                           <button 
                             key={key} 
                             onClick={() => handleSelectMood(key as MoodType)}
                             className={`p-2 rounded-full transition-all ${userData[currentUser][selectedDate]?.mood === key ? 'bg-knight-glow/20 scale-110 shadow-glow' : 'hover:bg-white/5 opacity-50 hover:opacity-100'}`}
                           >
                               <span className="text-xl">{emoji}</span>
                           </button>
                       ))}
                  </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default MoodCalendar;