import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { getRandomPalette } from '../utils/palettes';

// API Base URL - auto adjusts between local proxy & production environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Instant local fallback quotes so the app NEVER gets stuck on loading screen during Render cold starts
const FALLBACK_QUOTES = [
  {
    id: 1,
    text: "Life ke Dohe, Khatri ke Pohe: Life is best enjoyed with warm tea, delicious pohe, and timeless wisdom.",
    author: "Khatri Ji",
    category: "Life",
    likes: 42
  },
  {
    id: 2,
    text: "Dukh mein simran sab kare, sukh mein kare na koye. Jo sukh mein simran kare, to dukh kahe ko hoye.",
    author: "Kabir Das",
    category: "Dohe",
    likes: 38
  },
  {
    id: 3,
    text: "Pothi padhi padhi jag mua, pandit bhaya na koye. Dhai akshar prem ka, padhe so pandit hoye.",
    author: "Kabir Das",
    category: "Dohe",
    likes: 29
  },
  {
    id: 4,
    text: "Bura jo dekhn main chala, bura na milya koye. Jo dil khoja aapna, mujhse bura na koye.",
    author: "Kabir Das",
    category: "Dohe",
    likes: 35
  },
  {
    id: 5,
    text: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci",
    category: "Minimalism",
    likes: 24
  },
  {
    id: 6,
    text: "Khatri ke Pohe gives fuel to the body, Life ke Dohe gives peace to the mind.",
    author: "Anonymous",
    category: "Humor",
    likes: 50
  }
];

export function useQuotes() {
  // Initialize current quote immediately with a random fallback so page loads INSTANTLY!
  const [currentQuote, setCurrentQuote] = useState(() => {
    return FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
  });
  const [quotesList, setQuotesList] = useState(FALLBACK_QUOTES);
  const [loading, setLoading] = useState(false);
  const [fetchingNext, setFetchingNext] = useState(false);
  const [error, setError] = useState(null);
  
  // TTS State
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [ttsLoading, setTtsLoading] = useState(false);
  const audioRef = useRef(null);

  // Liked Quotes Local Persistence
  const [likedQuoteIds, setLikedQuoteIds] = useState(() => {
    try {
      const saved = localStorage.getItem('liked_quotes_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals state
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [quoteToEdit, setQuoteToEdit] = useState(null);

  // Theme palette state
  const [palette, setPalette] = useState(() => getRandomPalette());

  // Save liked quote IDs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('liked_quotes_ids', JSON.stringify(likedQuoteIds));
    } catch (e) {
      console.error('Failed to save liked quotes:', e);
    }
  }, [likedQuoteIds]);

  // Fetch a random quote from backend with instant fallback on timeout/cold start
  const fetchRandomQuote = useCallback(async () => {
    stopPoetTTS();
    setFetchingNext(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/quotes/random`, { timeout: 4000 });
      if (response.data) {
        setCurrentQuote(response.data);
      }
      setPalette(prev => getRandomPalette(prev.id));
    } catch (err) {
      console.warn('Backend sleeping or slow response. Using instant fallback quote:', err);
      const nextFallback = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
      setCurrentQuote(nextFallback);
      setPalette(prev => getRandomPalette(prev.id));
    } finally {
      setLoading(false);
      setFetchingNext(false);
    }
  }, []);

  // Fetch all quotes from backend with fallback
  const fetchAllQuotes = useCallback(async (category = '', sortBy = 'newest') => {
    try {
      let url = `${API_BASE_URL}/quotes?sort_by=${sortBy}`;
      if (category && category.toUpperCase() !== 'ALL') {
        url += `&category=${category}`;
      }
      const response = await axios.get(url, { timeout: 5000 });
      if (response.data && response.data.length > 0) {
        setQuotesList(response.data);
      }
    } catch (err) {
      console.warn('Backend cold start during fetchAllQuotes. Displaying cached list:', err);
    }
  }, []);

  // Like Quote function
  const likeQuote = async (quoteId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/quotes/${quoteId}/like`, {}, { timeout: 4000 });
      const updatedQuote = response.data;
      
      if (currentQuote && currentQuote.id === quoteId) {
        setCurrentQuote(updatedQuote);
      }
      
      setQuotesList(prev => prev.map(q => q.id === quoteId ? updatedQuote : q));

      setLikedQuoteIds(prev => 
        prev.includes(quoteId) ? prev : [...prev, quoteId]
      );
      
      return { success: true, likes: updatedQuote.likes };
    } catch (err) {
      console.warn('Error liking quote on server, updating locally:', err);
      const updatedLikes = (currentQuote?.likes || 0) + 1;
      if (currentQuote && currentQuote.id === quoteId) {
        setCurrentQuote(prev => ({ ...prev, likes: updatedLikes }));
      }
      setLikedQuoteIds(prev => prev.includes(quoteId) ? prev : [...prev, quoteId]);
      return { success: true, likes: updatedLikes };
    }
  };

  // Stop TTS Audio & Speech Synthesis
  const stopPoetTTS = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingTTS(false);
    setTtsLoading(false);
  };

  // Deep Poet Text to Speech
  const playPoetTTS = async (quoteToSpeak = currentQuote) => {
    if (!quoteToSpeak) return;

    if (isPlayingTTS) {
      stopPoetTTS();
      return;
    }

    setTtsLoading(true);

    try {
      const ttsUrl = `${API_BASE_URL}/quotes/${quoteToSpeak.id}/tts`;
      const audio = new Audio(ttsUrl);
      audioRef.current = audio;

      audio.oncanplaythrough = () => {
        setTtsLoading(false);
        setIsPlayingTTS(true);
        audio.play();
      };

      audio.onended = () => {
        setIsPlayingTTS(false);
        audioRef.current = null;
      };

      audio.onerror = () => {
        console.warn('Backend Edge-TTS stream unavailable. Falling back to tuned Web Speech API...');
        fallbackWebSpeechTTS(quoteToSpeak);
      };
    } catch (err) {
      console.warn('Edge-TTS error, executing Option 1 Web Speech fallback:', err);
      fallbackWebSpeechTTS(quoteToSpeak);
    }
  };

  // Option 1 Fallback: Tuned Web Speech API
  const fallbackWebSpeechTTS = (quoteToSpeak) => {
    if (!('speechSynthesis' in window)) {
      setTtsLoading(false);
      setIsPlayingTTS(false);
      alert('Text-to-speech is not supported on this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    const textToSay = `${quoteToSpeak.text}. By ${quoteToSpeak.author || 'Anonymous'}.`;
    const utterance = new SpeechSynthesisUtterance(textToSay);

    // Multi-language script detection (Devanagari vs English/Latin)
    const isDevanagari = /[\u0900-\u097F]/.test(quoteToSpeak.text);

    if (isDevanagari) {
      utterance.lang = 'hi-IN';
      utterance.pitch = 0.85;
      utterance.rate = 0.82;
    } else {
      utterance.lang = 'en-IN';
      utterance.pitch = 0.75;
      utterance.rate = 0.84;
    }

    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => 
      isDevanagari 
        ? (v.lang.startsWith('hi') || v.name.includes('Hindi') || v.name.includes('Madhur') || v.name.includes('Swara'))
        : (v.lang.startsWith('en') && (v.name.includes('Male') || v.name.includes('David') || v.name.includes('Google UK English Male') || v.name.includes('Prabhat')))
    ) || voices.find(v => isDevanagari ? v.lang.startsWith('hi') : v.lang.startsWith('en'));

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      setTtsLoading(false);
      setIsPlayingTTS(true);
    };

    utterance.onend = () => {
      setIsPlayingTTS(false);
    };

    utterance.onerror = () => {
      setTtsLoading(false);
      setIsPlayingTTS(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Share Quote function
  const shareQuote = async (quoteToShare = currentQuote) => {
    if (!quoteToShare) return;

    const shareData = {
      title: 'Life ke Dohe , Khatri ke Pohe',
      text: `"${quoteToShare.text}" — ${quoteToShare.author || 'Anonymous'}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return { shared: true };
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    }

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${quoteToShare.text}" — ${quoteToShare.author}`)}`;
    window.open(twitterUrl, '_blank');
    navigator.clipboard.writeText(`"${quoteToShare.text}" — ${quoteToShare.author}`);
    return { copied: true };
  };

  // Add new quote with optimistic instant creation & backend persistence
  const addQuote = async (newQuoteData) => {
    const tempQuote = {
      id: Date.now(),
      text: newQuoteData.text,
      author: newQuoteData.author || 'Anonymous',
      category: newQuoteData.category || 'Dohe',
      likes: 0,
      created_at: new Date().toISOString()
    };

    setCurrentQuote(tempQuote);
    setQuotesList(prev => [tempQuote, ...prev]);
    setPalette(prev => getRandomPalette(prev.id));

    try {
      const response = await axios.post(`${API_BASE_URL}/quotes`, newQuoteData, { timeout: 8000 });
      if (response.data) {
        setCurrentQuote(response.data);
        setQuotesList(prev => prev.map(q => q.id === tempQuote.id ? response.data : q));
      }
      return { success: true };
    } catch (err) {
      console.warn('Backend quote submission note (saved locally):', err);
      return { success: true };
    }
  };

  // Update quote with optimistic update & backend PUT persistence
  const updateQuote = async (quoteId, updatedData) => {
    setQuotesList(prev => prev.map(q => q.id === quoteId ? { ...q, ...updatedData } : q));
    if (currentQuote && currentQuote.id === quoteId) {
      setCurrentQuote(prev => ({ ...prev, ...updatedData }));
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/quotes/${quoteId}`, updatedData, { timeout: 6000 });
      if (response.data) {
        setQuotesList(prev => prev.map(q => q.id === quoteId ? response.data : q));
        if (currentQuote && currentQuote.id === quoteId) {
          setCurrentQuote(response.data);
        }
      }
      return { success: true };
    } catch (err) {
      console.warn('Backend update quote note (saved locally):', err);
      return { success: true };
    }
  };

  // Delete quote by ID with optimistic immediate removal
  const deleteQuote = async (quoteId) => {
    setQuotesList(prev => prev.filter(q => q.id !== quoteId));
    
    if (currentQuote && currentQuote.id === quoteId) {
      fetchRandomQuote();
    }

    try {
      await axios.delete(`${API_BASE_URL}/quotes/${quoteId}`, { timeout: 5000 });
      return { success: true };
    } catch (err) {
      console.warn('Backend delete note (quote removed locally):', err);
      return { success: true };
    }
  };

  // Modal control functions
  const openListModal = () => {
    fetchAllQuotes();
    setIsListModalOpen(true);
  };
  const closeListModal = () => setIsListModalOpen(false);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = (quote) => {
    setQuoteToEdit(quote);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setQuoteToEdit(null);
  };

  // Initial load
  useEffect(() => {
    fetchRandomQuote();
    fetchAllQuotes();
  }, [fetchRandomQuote, fetchAllQuotes]);

  return {
    currentQuote,
    quotesList,
    loading,
    fetchingNext,
    error,
    palette,
    isPlayingTTS,
    ttsLoading,
    likedQuoteIds,
    isListModalOpen,
    isAddModalOpen,
    isEditModalOpen,
    quoteToEdit,
    fetchRandomQuote,
    fetchAllQuotes,
    likeQuote,
    playPoetTTS,
    stopPoetTTS,
    shareQuote,
    addQuote,
    updateQuote,
    deleteQuote,
    openListModal,
    closeListModal,
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal
  };
}
