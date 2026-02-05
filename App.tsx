import React, { useState } from 'react';
import Layout from './components/Layout';
import TheBench from './pages/TheBench';
import MessageBoard from './pages/MessageBoard';
import MoodCalendar from './pages/MoodCalendar';
import { Page, UserProfile } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.BENCH);
  const [currentUser, setCurrentUser] = useState<UserProfile>('Knight');

  const renderPage = () => {
    switch (currentPage) {
      case Page.BENCH:
        return <TheBench currentUser={currentUser} />;
      case Page.BOARD:
        return <MessageBoard currentUser={currentUser} />;
      case Page.CALENDAR:
        return <MoodCalendar currentUser={currentUser} />;
      default:
        return <TheBench currentUser={currentUser} />;
    }
  };

  return (
    <Layout 
      currentPage={currentPage} 
      setCurrentPage={setCurrentPage}
      currentUser={currentUser}
      setCurrentUser={setCurrentUser}
    >
      <div className="animate-[fadeIn_0.5s_ease-in-out]">
        {renderPage()}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Layout>
  );
};

export default App;