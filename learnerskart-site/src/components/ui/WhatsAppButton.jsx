import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, ChevronLeft, Menu, ThumbsUp, Paperclip, Smile } from 'lucide-react';

const WhatsAppButton = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [inputVal, setInputVal] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  // Format current hour:minute in 24h format e.g. 11:24
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const [chatMessages, setChatMessages] = useState([
    {
      text: "👋 Hi! How can we help?",
      sender: "bot",
      name: "Customer Support",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=60&auto=format&fit=crop",
      time: ""
    }
  ]);



  const whatsappBaseUrl = 'https://wa.me/919844591589';

  // Option Click Handler (prints response in-chat, avoids immediate redirect)
  const handleOptionClick = (e, optionText) => {
    e.preventDefault();
    
    const userMsg = {
      text: optionText,
      sender: 'user',
      time: getCurrentTime()
    };
    setChatMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      let replyText = '';
      if (optionText === 'I have a question') {
        replyText = "Please go ahead and ask your question. I'm here to help!";
      } else {
        replyText = "Sure! We offer world-class professional certification courses in Project Management, Agile, Scrum, and more. Which track would you like to explore?";
      }

      const botMsg = {
        text: replyText,
        sender: 'bot',
        name: 'Apollo',
        isApollo: true,
        time: getCurrentTime()
      };
      setChatMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  // Text Send Handler
  const handleSendText = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const message = inputVal.trim();
    const cleanMsg = message.toLowerCase();
    setInputVal('');
    setShowEmojiPicker(false);

    // 1. Add User Message
    const userMsg = {
      text: message,
      sender: 'user',
      time: getCurrentTime()
    };
    setChatMessages((prev) => [...prev, userMsg]);

    // 2. Bot Responds after 700ms
    setTimeout(() => {
      let replyText = '';
      let showContactButton = false;

      if (cleanMsg.includes('course') || cleanMsg.includes('certif') || cleanMsg.includes('train')) {
        replyText = "We offer top certification programs across key domains including Project Management (PMP, CAPM), Agile & Scrum (CSM, CSPO), IT Service Management (ITIL), Quality Management (Six Sigma), and more. Feel free to explore our courses list in the top navigation bar!";
      } else if (cleanMsg.includes('price') || cleanMsg.includes('cost') || cleanMsg.includes('fee') || cleanMsg.includes('discount')) {
        replyText = "Our certification tracks feature competitive global pricing. We also offer special discounts of up to 15% for Students, Alumni, Military, and Career Re-entry candidates. Check the 'Special Discounts' dropdown menu to apply!";
      } else if (cleanMsg.includes('learners') || cleanMsg.includes('kart') || cleanMsg.includes('who are you') || cleanMsg.includes('what is this') || cleanMsg.trim() === 'about' || cleanMsg.includes('about us') || cleanMsg.includes('about learners')) {
        replyText = "LearnersKart is an online learning platform that offers professional certification training for all career levels. It aims to provide accessible, engaging, and relevant learning experiences with expert mentors to help bridge skill gaps and drive results. The platform offers diverse and immersive courses with personalized guidance to ensure global certification and workplace success. Whether you want to advance your career, learn a new skill, or explore interests, LearnersKart provides options for lifelong learning.";
      } else if (cleanMsg.includes('hello') || cleanMsg.includes('hi') || cleanMsg.includes('hey')) {
        replyText = "Hello! How can I assist you today? Feel free to ask about our certification tracks, discount programs, or direct advisor contact options.";
      } else if (cleanMsg.includes('contact') || cleanMsg.includes('live') || cleanMsg.includes('whatsapp') || cleanMsg.includes('advisor') || cleanMsg.includes('agent') || cleanMsg.includes('support')) {
        replyText = "Sure! I'd be happy to connect you with our live course advisor on WhatsApp. Click the button below to start the chat directly:";
        showContactButton = true;
      } else {
        replyText = "Thank you for your message! To get detailed assistance directly from our live support advisor on WhatsApp, please click the chat button below:";
        showContactButton = true;
      }

      const botMsg = {
        text: replyText,
        sender: 'bot',
        name: 'Apollo',
        isApollo: true,
        time: getCurrentTime(),
        showContactButton,
        customText: message
      };
      setChatMessages((prev) => [...prev, botMsg]);
    }, 700);
  };

  // Thumbs Up Action Handler
  const handleThumbsUpClick = (e) => {
    e.preventDefault();
    
    // 1. Add User thumbs up message
    const userMsg = {
      text: "👍",
      sender: 'user',
      time: getCurrentTime()
    };
    setChatMessages((prev) => [...prev, userMsg]);

    // 2. Bot replies politely
    setTimeout(() => {
      const botMsg = {
        text: "Glad to help! Let me know if you need more details about our credentials, pricing models, or discount options.",
        sender: 'bot',
        name: 'Apollo',
        isApollo: true,
        time: getCurrentTime()
      };
      setChatMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  // Hidden File input change trigger
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Add User File upload message
    const userMsg = {
      text: `📁 Attached: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
      sender: 'user',
      time: getCurrentTime()
    };
    setChatMessages((prev) => [...prev, userMsg]);

    // Clear input so same file can be uploaded again
    e.target.value = '';

    // 2. Bot acknowledges receipt
    setTimeout(() => {
      const botMsg = {
        text: `Thank you for sending "${file.name}"! I have shared this file with our support team. Click the button below to connect on WhatsApp and review this file together:`,
        sender: 'bot',
        name: 'Apollo',
        isApollo: true,
        time: getCurrentTime(),
        showContactButton: true,
        customText: `Hello LearnersKart, I have attached a file: ${file.name}`
      };
      setChatMessages((prev) => [...prev, botMsg]);
    }, 800);
  };

  // Emoji picker item selection
  const handleEmojiClick = (emoji) => {
    setInputVal((prev) => prev + emoji);
    setShowEmojiPicker(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="font-sans select-none">
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      {/* Floating Chat Bubble Button */}
      {!drawerOpen && (
        <button
          onClick={() => {
            setDrawerOpen(true);
            setShowBadge(false);
          }}
          className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-3.5 rounded-full shadow-2xl hover:bg-[#128C7E] transition-all duration-300 hover:scale-110 flex items-center justify-center group"
          aria-label="Open customer support panel"
        >
          {/* Pulse Effect */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping -z-10 group-hover:hidden"></span>
          
          <MessageCircle className="w-6.5 h-6.5 fill-white stroke-[#25D366]" />

          {showBadge && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white shadow animate-bounce">
              1
            </span>
          )}

          <span className="absolute right-15 bg-slate-950 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap hidden md:block">
            Chat with Advisor
          </span>
        </button>
      )}

      {/* Customer Support Sidebar Drawer */}
      {drawerOpen && (
        <div className="fixed right-0 top-0 bottom-0 z-50 w-80 sm:w-96 bg-white shadow-2xl flex flex-col animate-slideInRight border-l border-slate-150">
          
          {/* Header */}
          <div className="bg-[#00B050] text-white px-4 py-3.5 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => setDrawerOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
                aria-label="Go back"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              
              {/* Apollo Logo Avatar Icon */}
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#00B050] overflow-hidden shadow-inner flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="45" fill="#00B050" />
                  <circle cx="50" cy="45" r="18" fill="white" />
                  <path d="M25 80 C 25 60, 75 60, 75 80" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" />
                </svg>
              </div>

              <div className="text-left leading-none">
                <h3 className="font-extrabold text-sm tracking-wide text-white">Apollo</h3>
                <p className="text-[10px] text-white/80 font-bold mt-0.5">LearnersKartBot</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-1 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center" aria-label="Support options menu">
                <Menu className="w-4.5 h-4.5" />
              </button>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
                aria-label="Close support panel"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Chat Feed Body */}
          <div className="flex-grow p-4 overflow-y-auto bg-slate-50/50 space-y-4">
            
            {/* Render Message Feed */}
            {chatMessages.map((msg, index) => {
              if (msg.sender === 'user') {
                return (
                  <div key={index} className="flex flex-col items-end text-right space-y-0.5">
                    <div className="bg-slate-200 text-slate-800 p-2.5 px-3.5 rounded-2xl rounded-tr-none text-xs font-semibold max-w-[80%] shadow-sm leading-relaxed text-justify">
                      {msg.text}
                    </div>
                    {msg.time && (
                      <span className="text-[8px] text-slate-400 font-bold px-1">{msg.time}</span>
                    )}
                  </div>
                );
              } else {
                return (
                  <div key={index} className="flex items-start gap-2.5 text-left">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 flex-shrink-0 bg-white flex items-center justify-center shadow-sm">
                      {msg.isApollo ? (
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <circle cx="50" cy="50" r="45" fill="#00B050" />
                          <circle cx="50" cy="45" r="18" fill="white" />
                          <path d="M25 80 C 25 60, 75 60, 75 80" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <img 
                          src={msg.avatar} 
                          alt={msg.name} 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    
                    {/* Message details */}
                    <div className="space-y-1 max-w-[75%]">
                      <p className="text-[9px] text-slate-400 font-extrabold tracking-wide uppercase px-0.5">{msg.name}</p>
                      <div className="bg-[#00B050] text-white p-2.5 px-3.5 rounded-2xl rounded-tl-none text-xs font-semibold shadow-sm leading-relaxed text-justify whitespace-pre-line">
                        {msg.text}
                      </div>

                      {msg.showContactButton && (
                        <div className="pt-1.5 text-left">
                          <a
                            href={`${whatsappBaseUrl}?text=${encodeURIComponent(msg.customText || 'Inquiry')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-[#25D366] text-white font-black px-3.5 py-2 rounded-xl text-[10px] uppercase tracking-wide transition-all shadow-md hover:bg-[#128C7E]"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-white stroke-[#25D366]" />
                            Chat on WhatsApp
                          </a>
                        </div>
                      )}

                      {msg.time && (
                        <span className="text-[8px] text-slate-400 font-bold px-0.5 block">{msg.time}</span>
                      )}
                    </div>
                  </div>
                );
              }
            })}

            {/* Clickable Quick Choice Buttons (Only show when user hasn't clicked an option yet) */}
            {chatMessages.filter(m => m.sender === 'user').length === 0 && (
              <div className="flex flex-col items-end gap-2.5 pt-2">
                <button
                  onClick={(e) => handleOptionClick(e, 'I have a question')}
                  className="bg-white border border-[#00B050] text-[#00B050] hover:bg-[#00B050]/5 font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-wide transition-all shadow-sm cursor-pointer"
                >
                  I have a question
                </button>
                <button
                  onClick={(e) => handleOptionClick(e, 'Tell me more')}
                  className="bg-white border border-[#00B050] text-[#00B050] hover:bg-[#00B050]/5 font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-wide transition-all shadow-sm cursor-pointer"
                >
                  Tell me more
                </button>
              </div>
            )}

          </div>

          {/* Footer Input Box */}
          <div className="p-4 bg-white border-t border-slate-150 shrink-0 relative">
            
            {/* Emoji Selection Picker Popover */}
            {showEmojiPicker && (
              <div className="absolute bottom-16 right-4 bg-white border border-slate-150 shadow-2xl rounded-2xl p-3 flex gap-2 flex-wrap max-w-56 z-55 animate-slideUp">
                {['👋', '👍', '😊', '❤️', '❓', '🎓', '💡', '🔥'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleEmojiClick(emoji)}
                    className="text-lg p-1.5 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSendText} className="flex items-center justify-between border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50">
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Type here and press enter.."
                className="w-full text-xs bg-transparent outline-none font-medium text-slate-700 placeholder-slate-400"
              />
              <div className="flex items-center gap-2.5 text-slate-400 pl-2 shrink-0">
                {/* Thumbs Up Button */}
                <button 
                  type="button" 
                  onClick={handleThumbsUpClick}
                  className="hover:text-[#00B050] transition-colors cursor-pointer p-0.5" 
                  aria-label="Send thumbs up"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                
                {/* Attach File Button */}
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current.click()}
                  className="hover:text-slate-600 transition-colors cursor-pointer p-0.5" 
                  aria-label="Attach file"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                </button>
                
                {/* Select Emoji Button */}
                <button 
                  type="button" 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`transition-colors cursor-pointer p-0.5 ${showEmojiPicker ? 'text-[#00B050]' : 'hover:text-slate-600'}`} 
                  aria-label="Select emoji"
                >
                  <Smile className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
            
            {/* Powered Branding */}
            <div className="flex items-center justify-center gap-1 text-[9px] text-slate-400 font-extrabold tracking-wider mt-2.5 uppercase select-none">
              <span className="w-1.5 h-1.5 bg-[#00B050] rounded-full animate-pulse"></span>
              Powered by <span className="text-slate-500">tawk.to</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default WhatsAppButton;
