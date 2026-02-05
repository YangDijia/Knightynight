import React, { useState, useRef } from 'react';
import { Note, UserProfile, Comment } from '../types';
import { Heart, Pin, Image as ImageIcon, X, MessageCircle, Trash2, Send } from 'lucide-react';

interface MessageBoardProps {
  currentUser: UserProfile;
}

const INITIAL_NOTES: Note[] = [
  {
    id: '1',
    text: "Don't forget to rest, little ghost. The journey is long but the bench is always here.",
    liked: false,
    timestamp: '10/14/2025, 10:30:00 AM',
    author: 'Hornet',
    comments: []
  },
  {
    id: '2',
    text: "I found this view near the City of Tears. It reminds me of home.",
    imageUrl: "https://picsum.photos/id/122/400/300",
    liked: true,
    timestamp: '10/12/2025, 08:45:15 PM',
    author: 'Knight',
    comments: [
        { id: 'c1', text: "A truly melancholic sight.", author: 'Hornet', timestamp: '10/12/2025, 09:00:00 PM' }
    ]
  },
  {
    id: '3',
    text: "Bapanada.",
    liked: false,
    timestamp: '10/15/2025, 02:15:00 PM',
    author: 'Knight',
    comments: []
  }
];

const Avatar: React.FC<{ user: UserProfile, className?: string }> = ({ user, className }) => (
    <div className={`rounded-full overflow-hidden bg-knight-secondary border border-white/20 flex items-center justify-center ${className}`}>
        {user === 'Knight' ? (
            <svg viewBox="0 0 100 100" className="w-full h-full p-1"><path d="M 50 10 C 25 10 25 30 25 50 L 25 80 Q 37.5 90 50 80 Q 62.5 90 75 80 L 75 50 C 75 30 75 10 50 10 Z" fill="#E3DAC9"/><ellipse cx="40" cy="45" rx="6" ry="10" fill="black"/><ellipse cx="60" cy="45" rx="6" ry="10" fill="black"/></svg>
        ) : (
            <svg viewBox="0 0 100 100" className="w-full h-full p-1"><path d="M 50 20 C 30 20 30 50 35 60 C 42 70 58 70 65 60 C 70 50 70 20 50 20 Z" fill="#E3DAC9"/><path d="M 35 30 Q 20 10 40 5" fill="#E3DAC9"/><path d="M 65 30 Q 80 10 60 5" fill="#E3DAC9"/><path d="M 42 45 L 48 48 L 42 52 Z" fill="black"/><path d="M 58 45 L 52 48 L 58 52 Z" fill="black"/></svg>
        )}
    </div>
);

const MessageBoard: React.FC<MessageBoardProps> = ({ currentUser }) => {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal State
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  const activeNote = notes.find(n => n.id === activeNoteId);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = () => {
    if (!inputText.trim() && !selectedImage) return;

    const newNote: Note = {
      id: Date.now().toString(),
      text: inputText,
      imageUrl: selectedImage || undefined,
      liked: false,
      timestamp: new Date().toLocaleString(),
      author: currentUser,
      comments: []
    };

    setNotes([newNote, ...notes]);
    setInputText('');
    setSelectedImage(null);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotes(notes.filter(n => n.id !== id));
    if (activeNoteId === id) setActiveNoteId(null);
  };

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotes(notes.map(note => 
      note.id === id ? { ...note, liked: !note.liked } : note
    ));
  };

  const handleAddComment = () => {
    if (!commentInput.trim() || !activeNoteId) return;

    const newComment: Comment = {
        id: Date.now().toString(),
        text: commentInput,
        author: currentUser,
        timestamp: new Date().toLocaleString()
    };

    setNotes(notes.map(n => 
        n.id === activeNoteId ? { ...n, comments: [...n.comments, newComment] } : n
    ));
    setCommentInput('');
  };

  const getNoteShape = (id: string) => {
    const shapes = [
      'polygon(1% 0%, 99% 1%, 100% 99%, 0% 100%)',
      'polygon(0% 0%, 90% 0%, 100% 10%, 100% 100%, 0% 100%)',
      'polygon(2% 0%, 98% 0%, 95% 100%, 5% 100%)',
      'polygon(5% 0%, 100% 2%, 95% 100%, 0% 98%)',
      'polygon(0% 0%, 100% 0%, 100% 0%, 100% 100%, 2% 95%)',
    ];
    return shapes[parseInt(id) % shapes.length];
  };

  const getNoteColor = (id: string) => {
    const colors = [
      'rgba(227, 218, 201, 0.9)', 
      'rgba(212, 197, 169, 0.9)', 
      'rgba(235, 229, 206, 0.9)',
      'rgba(218, 208, 190, 0.9)',
    ];
    return colors[parseInt(id) % colors.length];
  };

  return (
    <div className="min-h-full px-4 md:px-16 py-8 w-full max-w-7xl mx-auto relative">
      
      {/* Input Hero */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 mb-12 md:mb-20 items-stretch">
        <div className="w-full md:w-2/3 p-6 md:p-8 rounded-sm border border-knight-accent/10 bg-knight-secondary/40 backdrop-blur-xl relative group transition-all duration-500 hover:border-knight-glow/30 hover:shadow-glow shadow-glass"
             style={{ clipPath: 'polygon(1% 0%, 99% 2%, 100% 98%, 0% 100%)' }}
        >
          <div className="flex items-start gap-4 mb-4">
             <Avatar user={currentUser} className="w-10 h-10 border-knight-glow/30" />
             <div className="flex flex-col">
                <span className="text-xs font-title tracking-widest text-knight-glow">{currentUser}</span>
                <span className="text-[10px] text-knight-accent/30 font-mono">Posting as...</span>
             </div>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Etch your thoughts into the void..."
            className="w-full bg-transparent border-none outline-none text-knight-accent placeholder-knight-accent/20 font-body text-lg md:text-xl resize-none h-24 tracking-wide"
          />
          {selectedImage && (
            <div className="mt-4 relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border border-white/20 shadow-lg">
              <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
              <button onClick={() => setSelectedImage(null)} className="absolute top-2 right-2 bg-black/70 rounded-full p-1.5 hover:bg-red-500 text-white"><X className="w-3 h-3" /></button>
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mt-6 border-t border-white/5 pt-6 gap-4 sm:gap-0">
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center sm:justify-start gap-2 text-knight-accent/50 hover:text-knight-glow transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
              <ImageIcon className="w-5 h-5" />
              <span className="text-sm font-title tracking-wider">Add Image</span>
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            <button onClick={handlePost} className="flex items-center justify-center gap-2 px-8 py-3 bg-knight-glow/10 border border-knight-glow/30 rounded-sm text-knight-glow font-title tracking-widest uppercase hover:bg-knight-glow hover:text-black hover:shadow-glow transition-all duration-300">
              <Pin className="w-4 h-4" /> <span>Pin</span>
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/3 flex items-center justify-center text-center p-4 md:p-8">
           <div className="relative">
             <div className="absolute top-0 left-0 text-6xl text-knight-accent/5 font-serif">"</div>
             <p className="font-title text-lg md:text-xl italic text-knight-accent/60 leading-relaxed drop-shadow-lg">
               Voices of travelers echo here, pinned against the passing of time.
             </p>
           </div>
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 md:space-y-12 pb-12">
        {notes.map((note) => (
          <div 
            key={note.id}
            className="break-inside-avoid relative transition-all duration-500 hover:scale-[1.02] cursor-pointer group"
            style={{ transform: `rotate(${Math.random() * 2 - 1}deg)` }}
            onClick={() => setActiveNoteId(note.id)}
          >
            <div className="relative p-6 overflow-hidden border border-white/10 backdrop-blur-md shadow-glass"
                 style={{ 
                   backgroundColor: getNoteColor(note.id),
                   backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")',
                   clipPath: getNoteShape(note.id),
                   borderRadius: '2px'
                 }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-3 bg-knight-infected/40 rounded-b-full shadow-[0_0_20px_#FFB84D] backdrop-blur-sm border-b border-knight-infected/50 z-20">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-knight-infected rounded-b-full shadow-[0_0_10px_#FFB84D]"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none rounded-[inherit]"></div>

              {/* Author Stamp */}
              <div className="absolute top-4 left-4 z-30 opacity-70 group-hover:opacity-100 transition-opacity">
                <Avatar user={note.author} className="w-8 h-8 border-black/20" />
              </div>

              {note.imageUrl && (
                <div className="mb-5 overflow-hidden rounded-sm border border-black/10 shadow-sm relative z-10 mt-6">
                  <img src={note.imageUrl} alt="Attachment" className="w-full h-auto object-cover grayscale transition-all duration-700 ease-out group-hover:grayscale-0" />
                </div>
              )}

              <p className={`font-body text-[#2D3A4A] text-lg leading-relaxed mb-6 font-medium font-serif relative z-10 ${note.imageUrl ? 'pt-2' : 'pt-8'}`}>
                {note.text}
              </p>

              <div className="flex justify-between items-end border-t border-[#2D3A4A]/10 pt-3 relative z-10">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#2D3A4A]/60 font-mono">{note.timestamp.split(',')[0]}</span>
                  <span className="text-[9px] text-[#2D3A4A]/40 font-mono">{note.timestamp.split(',')[1]}</span>
                </div>
                
                <div className="flex items-center gap-3">
                    <button onClick={(e) => handleDelete(e, note.id)} className="text-[#2D3A4A]/30 hover:text-red-700 transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-1 text-[#2D3A4A]/40">
                         <MessageCircle className="w-4 h-4" />
                         <span className="text-xs font-bold">{note.comments.length}</span>
                    </div>
                    <button onClick={(e) => toggleLike(e, note.id)} className={`transition-all duration-300 transform active:scale-95 ${note.liked ? 'text-red-800 scale-110 drop-shadow-md' : 'text-[#2D3A4A]/20 hover:text-red-800/60'}`}>
                        <Heart className={`w-5 h-5 ${note.liked ? 'fill-current' : ''}`} />
                    </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal - Full Screen on Mobile, Centered Box on Desktop */}
      {activeNote && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-lg animate-fade-in md:p-4" onClick={() => setActiveNoteId(null)}>
            <div className="bg-[#0F1E26] border-t md:border border-knight-accent/20 w-full md:max-w-4xl h-[90vh] md:h-[80vh] rounded-t-2xl md:rounded-xl overflow-hidden flex flex-col md:flex-row shadow-2xl relative" onClick={e => e.stopPropagation()}>
                <button onClick={() => setActiveNoteId(null)} className="absolute top-4 right-4 text-white/50 hover:text-white z-50 bg-black/50 rounded-full p-2"><X className="w-5 h-5"/></button>
                
                {/* Left: The Note */}
                <div className="w-full md:w-1/2 p-6 md:p-8 bg-[#1A2633] overflow-y-auto flex items-start md:items-center justify-center relative border-b md:border-b-0 md:border-r border-white/5">
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
                   <div className="relative p-8 shadow-glass w-full my-auto"
                        style={{ 
                            backgroundColor: getNoteColor(activeNote.id),
                            backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")',
                            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', // Simpler shape for modal
                            borderRadius: '4px'
                        }}
                   >
                        <div className="flex items-center gap-3 mb-6 border-b border-[#2D3A4A]/10 pb-4">
                            <Avatar user={activeNote.author} className="w-12 h-12 border-[#2D3A4A]/30" />
                            <div>
                                <span className="block text-[#2D3A4A] font-title font-bold tracking-widest">{activeNote.author}</span>
                                <span className="text-xs text-[#2D3A4A]/60 font-mono">{activeNote.timestamp}</span>
                            </div>
                        </div>
                        {activeNote.imageUrl && <img src={activeNote.imageUrl} className="w-full rounded-sm mb-6 shadow-sm" />}
                        <p className="font-body text-[#2D3A4A] text-xl leading-relaxed whitespace-pre-wrap font-serif">{activeNote.text}</p>
                   </div>
                </div>

                {/* Right: Comments */}
                <div className="w-full md:w-1/2 flex flex-col bg-[#050B14] min-h-[300px]">
                    <div className="p-4 md:p-6 border-b border-white/5 bg-[#050B14] sticky top-0 z-10">
                        <h3 className="font-title text-lg md:text-xl text-knight-accent tracking-widest flex items-center gap-2">
                            <MessageCircle className="w-5 h-5" /> Comments
                        </h3>
                    </div>
                    
                    <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar pb-24 md:pb-6">
                        {activeNote.comments.length === 0 && (
                            <p className="text-center text-knight-accent/20 italic mt-8 md:mt-12">No echoes yet...</p>
                        )}
                        {activeNote.comments.map(comment => (
                            <div key={comment.id} className="flex gap-4 group">
                                <Avatar user={comment.author} className="w-8 h-8 shrink-0 mt-1 opacity-70 group-hover:opacity-100 transition-opacity" />
                                <div className="flex flex-col">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-knight-glow text-sm font-title tracking-wider">{comment.author}</span>
                                        <span className="text-[10px] text-knight-accent/30 font-mono">{comment.timestamp}</span>
                                    </div>
                                    <p className="text-knight-accent/80 text-sm mt-1 leading-relaxed bg-white/5 p-3 rounded-r-xl rounded-bl-xl">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 md:p-6 bg-[#0F1E26] border-t border-white/5 absolute bottom-0 w-full md:relative">
                        <div className="flex gap-3">
                            <Avatar user={currentUser} className="w-8 md:w-10 h-8 md:h-10 shrink-0 opacity-50" />
                            <div className="flex-grow relative">
                                <input 
                                    type="text" 
                                    value={commentInput}
                                    onChange={(e) => setCommentInput(e.target.value)}
                                    placeholder="Leave an echo..."
                                    className="w-full bg-black/20 border border-knight-accent/10 rounded-full px-4 py-2 text-sm md:text-base text-knight-accent focus:outline-none focus:border-knight-glow/50 transition-colors pr-10"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                                />
                                <button 
                                    onClick={handleAddComment}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-knight-accent/50 hover:text-knight-glow transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default MessageBoard;