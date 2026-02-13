import React, { useState } from 'react';
import { Page, UserProfile } from '../types';
import { Ghost, Menu, X } from 'lucide-react';

interface LayoutProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentPage, setCurrentPage, currentUser, setCurrentUser, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = [Page.BENCH, Page.BOARD, Page.CALENDAR];

  // Intricate, Sharp, Thorny Gothic Corner
  const ThornFiligreeCorner = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 150 150" className={`w-24 h-24 md:w-48 md:h-48 absolute pointer-events-none text-knight-accent/40 ${className}`}>
      <defs>
        <filter id="sharp-blur">
           <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" />
        </filter>
      </defs>
      <g fill="currentColor" stroke="none">
        <path d="M 2 150 L 4 50 L 2 20 L 0 50 Z" opacity="0.8" />
        <path d="M 150 2 L 50 4 L 20 2 L 50 0 Z" opacity="0.8" />
        <path d="M 2 20 C 2 5, 5 2, 20 2 C 35 2, 40 15, 30 25 C 20 35, 10 30, 15 20" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M 30 25 L 40 35 L 32 28 Z" /> 
        <path d="M 5 50 Q -5 70 5 90" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M 5 60 L 15 65 L 5 68 Z" />
        <path d="M 5 80 L 12 82 L 5 85 Z" />
        <path d="M 50 5 Q 70 -5 90 5" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M 60 5 L 65 15 L 68 5 Z" />
        <path d="M 80 5 L 82 12 L 85 5 Z" />
        <path d="M 20 20 Q 40 40 60 30 Q 80 20 70 50" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M 60 30 L 65 20 L 62 32 Z" />
        <path d="M 70 50 L 75 60 L 68 52 Z" />
        <path d="M 30 30 Q 40 40 30 50" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <path d="M 30 50 L 25 55 L 32 52 Z" /> 
      </g>
      <g fill="currentColor">
         <rect x="2" y="100" width="1" height="15" />
         <rect x="2" y="125" width="1" height="25" />
         <rect x="100" y="2" width="15" height="1" />
         <rect x="125" y="2" width="25" height="1" />
      </g>
    </svg>
  );

  const GothicHeader = () => (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[400px] h-24 pointer-events-none z-40 opacity-40 text-knight-accent">
      <svg viewBox="0 0 400 60" className="w-full h-full">
         <g fill="currentColor" stroke="none">
           <path d="M 200 50 L 195 20 L 200 10 L 205 20 Z" />
           <path d="M 195 20 Q 150 20 120 40 L 100 30 L 110 45 Q 150 50 190 40 Z" />
           <path d="M 150 30 L 155 15 L 145 25 Z" />
           <path d="M 205 20 Q 250 20 280 40 L 300 30 L 290 45 Q 250 50 210 40 Z" />
           <path d="M 250 30 L 245 15 L 255 25 Z" />
         </g>
         <path d="M 100 30 L 50 30" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="10 5" />
         <path d="M 300 30 L 350 30" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="10 5" />
      </svg>
    </div>
  );

  // Exquisite Icons for User Switcher
  const KnightSeal = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full p-2">
      <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
      <path d="M 50 10 C 25 10 25 30 25 50 L 25 80 Q 37.5 90 50 80 Q 62.5 90 75 80 L 75 50 C 75 30 75 10 50 10 Z" fill="currentColor" opacity="0.8" />
      <path d="M 28 5 C 20 -5 10 10 20 25" stroke="currentColor" fill="none" strokeWidth="2" />
      <path d="M 72 5 C 80 -5 90 10 80 25" stroke="currentColor" fill="none" strokeWidth="2" />
      <ellipse cx="40" cy="45" rx="5" ry="8" fill="#050B14" />
      <ellipse cx="60" cy="45" rx="5" ry="8" fill="#050B14" />
    </svg>
  );

  const HornetSeal = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full p-2">
       <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
       {/* Head */}
       <path d="M 50 20 C 30 20 30 50 35 60 C 42 70 58 70 65 60 C 70 50 70 20 50 20 Z" fill="currentColor" opacity="0.8" />
       {/* Horns */}
       <path d="M 35 30 Q 20 10 40 5" fill="currentColor" opacity="0.8" />
       <path d="M 65 30 Q 80 10 60 5" fill="currentColor" opacity="0.8" />
       {/* Eyes */}
       <path d="M 42 45 L 48 48 L 42 52 Z" fill="#050B14" />
       <path d="M 58 45 L 52 48 L 58 52 Z" fill="#050B14" />
       {/* Needle behind */}
       <path d="M 80 80 L 95 95" stroke="currentColor" strokeWidth="3" />
    </svg>
  );

  return (
    <div className="min-h-screen flex flex-col font-body bg-knight-bg text-knight-accent overflow-hidden relative selection:bg-knight-glow selection:text-knight-petrol">
      
      {/* Backgrounds */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1F2E3A] via-[#0F1E26] to-[#050B14]"></div>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden mix-blend-screen">
        <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] bg-knight-glow/10 rounded-full blur-[100px] animate-breathe"></div>
        <div className="absolute bottom-[0%] right-[10%] w-[50vw] h-[50vw] bg-knight-infected/10 rounded-full blur-[120px] animate-breathe delay-1000"></div>
      </div>
      {/* Replaced external texture with Tailwind internal noise pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30 bg-noise animate-pulse-slow"></div>
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,rgba(5,11,20,0.95)_100%)]"></div>

      {/* Ornaments - Hide on mobile to save space, show on desktop */}
      <div className="fixed inset-0 z-50 pointer-events-none">
        <GothicHeader />
        <ThornFiligreeCorner className="top-4 left-4 md:top-6 md:left-6 hidden md:block" />
        <ThornFiligreeCorner className="top-4 right-4 md:top-6 md:right-6 transform -scale-x-100 hidden md:block" />
        <ThornFiligreeCorner className="bottom-4 left-4 md:bottom-6 md:left-6 transform -scale-y-100 hidden md:block" />
        <ThornFiligreeCorner className="bottom-4 right-4 md:bottom-6 md:right-6 transform -scale-x-100 -scale-y-100 hidden md:block" />
        
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[70] px-4 md:px-8 py-4 md:py-6 flex justify-between items-center">
        <div className="absolute inset-x-0 top-0 h-24 md:h-32 bg-gradient-to-b from-knight-bg to-transparent pointer-events-none -z-10"></div>
        
        {/* Logo Area */}
        <div className="flex items-center gap-3 md:gap-4 group cursor-pointer relative z-[70]" onClick={() => setCurrentPage(Page.BENCH)}>
          <div className="relative p-1.5 md:p-2 rounded-full border border-knight-accent/20 bg-knight-secondary/40 backdrop-blur-md group-hover:border-knight-glow/60 group-hover:shadow-[0_0_20px_rgba(168,230,207,0.3)] transition-all duration-500">
            <Ghost className="w-5 h-5 md:w-6 md:h-6 text-knight-accent group-hover:text-white transition-colors" />
          </div>
          <span className="font-title text-lg md:text-xl font-bold tracking-[0.2em] text-knight-accent/90 group-hover:text-white transition-colors drop-shadow-lg">
            KNIGHTYNIGHT
          </span>
        </div>

        {/* Desktop Navigation - Hidden on Mobile */}
        <div className="hidden md:flex gap-4">
          {navItems.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`
                relative px-6 py-2 rounded-full border transition-all duration-500 font-title text-xs tracking-widest uppercase overflow-hidden group
                ${currentPage === page 
                  ? 'border-knight-glow/50 text-white shadow-glow bg-knight-glow/5' 
                  : 'border-transparent text-knight-accent/60 hover:text-white hover:border-knight-accent/30'}
              `}
            >
              <span className="relative z-10 group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">{page}</span>
              {currentPage === page && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-knight-glow/10 to-transparent animate-pulse-slow"></div>
              )}
            </button>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden relative z-[70] p-2 text-knight-accent"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`
        fixed inset-0 bg-[#050B14]/95 backdrop-blur-xl z-[60] flex flex-col items-center justify-center gap-8 transition-all duration-500 md:hidden
        ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}>
        <div className="flex flex-col gap-6 w-full px-8 max-w-sm">
          {navItems.map((page) => (
            <button
              key={page}
              onClick={() => {
                setCurrentPage(page);
                setIsMobileMenuOpen(false);
              }}
              className={`
                w-full py-4 text-center border-b border-white/5 font-title text-lg tracking-[0.3em] uppercase transition-colors
                ${currentPage === page ? 'text-knight-glow border-knight-glow/30' : 'text-knight-accent/60 hover:text-white'}
              `}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="mt-8 flex gap-8">
           {['Knight', 'Hornet'].map((user) => (
             <button
               key={user}
               onClick={() => {
                 setCurrentUser(user as UserProfile);
                 setIsMobileMenuOpen(false);
               }}
               className={`flex flex-col items-center gap-3 transition-all ${currentUser === user ? 'scale-110' : 'opacity-50'}`}
             >
                <div className={`w-16 h-16 relative rounded-full border-2 ${currentUser === user ? 'border-knight-glow shadow-glow' : 'border-knight-accent/20'}`}>
                    {user === 'Knight' ? <KnightSeal /> : <HornetSeal />}
                </div>
                <span className="font-title text-xs tracking-widest uppercase">{user}</span>
             </button>
           ))}
        </div>
      </div>

      {/* Global User Switcher (Desktop Right Side) */}
      <div className="hidden md:flex fixed right-0 top-32 z-[60] flex-col gap-6">
        {['Knight', 'Hornet'].map((user) => (
          <button
            key={user}
            onClick={() => setCurrentUser(user as UserProfile)}
            className={`
              w-16 h-16 flex items-center justify-center transition-all duration-500 group relative
              ${currentUser === user 
                ? 'translate-x-0' 
                : 'translate-x-4 hover:translate-x-2 opacity-50 hover:opacity-100'}
            `}
            title={`Switch to ${user}`}
          >
            {/* Ancient Bookmark Shape */}
            <div className={`
                absolute inset-0 bg-knight-secondary/90 border border-white/10 shadow-glass
                ${user === 'Knight' ? 'rounded-l-lg' : 'rounded-l-lg'}
                ${currentUser === user ? 'border-knight-glow/50 shadow-[0_0_15px_rgba(168,230,207,0.2)]' : ''}
            `} style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 10% 50%)' }}></div>
            
            <div className={`relative z-10 w-10 h-10 ${currentUser === user ? 'text-knight-glow' : 'text-knight-accent'}`}>
               {user === 'Knight' ? <KnightSeal /> : <HornetSeal />}
            </div>
          </button>
        ))}
      </div>

      <main className="flex-grow pt-24 relative z-10 w-full max-w-[1920px] mx-auto overflow-x-hidden md:overflow-visible">
        {children}
      </main>

      <footer className="w-full py-6 md:py-8 text-center text-knight-accent/20 text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-title relative z-50">
        <div className="flex justify-center items-center gap-4">
          <span className="h-px w-8 bg-knight-accent/10"></span>
          <p>Hallownest Archive • 2025</p>
          <span className="h-px w-8 bg-knight-accent/10"></span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;