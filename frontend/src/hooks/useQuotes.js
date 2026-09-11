import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { getRandomPalette } from '../utils/palettes';

// API Base URL - auto adjusts between local proxy & production environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export function useQuotes() {
  const [currentQuote, setCurrentQuote] = useState(null);
  const [quotesList, setQuotesList] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Fetch a random quote from backend
  const fetchRandomQuote = useCallback(async () => {
    stopPoetTTS();
    setFetchingNext(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/quotes/random`);
      setCurrentQuote(response.data);
      // Switch to a new color palette on quote change
      setPalette(prev => getRandomPalette(prev.id));
    } catch (err) {
      console.error('Error fetching random quote:', err);
      setError('Failed to fetch quote. Please check your backend connection.');
    } finally {
      setLoading(false);
      setFetchingNext(false);
    }
  }, []);

  // Fetch all quotes from backend (with optional category or sort)
  const fetchAllQuotes = useCallback(async (category = '', sortBy = 'newest') => {
    try {
      let url = `${API_BASE_URL}/quotes?sort_by=${sortBy}`;
      if (category && category.upper() !== 'ALL') {
        url += `&category=${category}`;
      }
      const response = await axios.get(url);
      setQuotesList(response.data);
    } catch (err) {
      console.error('Error fetching all quotes:', err);
    }
  }, []);

  // Like Quote function
  const likeQuote = async (quoteId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/quotes/${quoteId}/like`);
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
      console.error('Error liking quote:', err);
      return { success: false, error: 'Failed to update like.' };
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

  // Deep Poet Text to Speech (Option 2: Edge Neural TTS with Option 1 Web Speech fallback)
  const playPoetTTS = async (quoteToSpeak = currentQuote) => {
    if (!quoteToSpeak) return;

    // Toggle stop if already playing
    if (isPlayingTTS) {
      stopPoetTTS();
      return;
    }

    setTtsLoading(true);

    try {
      // Option 2: Try Backend Neural Edge-TTS Stream
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
        console.warn('Backend Edge-TTS stream failed/unavailable. Falling back to tuned Web Speech API...');
        fallbackWebSpeechTTS(quoteToSpeak);
      };
    } catch (err) {
      console.warn('Edge-TTS error, executing Option 1 Web Speech fallback:', err);
      fallbackWebSpeechTTS(quoteToSpeak);
    }
  };

  // Option 1 Fallback: Tuned Web Speech API with deep baritone pitch (0.7) and poetic rate (0.85)
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

    // Deep poetic tuning
    utterance.pitch = 0.75; // Deeper baritone pitch
    utterance.rate = 0.84;  // Thoughtful, poetic cadence

    // Attempt to pick a deep male/narrator voice
    const voices = window.speechSynthesis.getVoices();
    const deepVoice = voices.find(v => 
      (v.name.includes('Male') || v.name.includes('David') || v.name.includes('Google UK English Male') || v.name.includes('Prabhat') || v.name.includes('Natural')) && v.lang.startsWith('en')
    ) || voices.find(v => v.lang.startsWith('en'));

    if (deepVoice) {
      utterance.voice = deepVoice;
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

    // Fallback: Copy to clipboard & Twitter intent URL
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${quoteToShare.text}" — ${quoteToShare.author}`)}`;
    window.open(twitterUrl, '_blank');
    navigator.clipboard.writeText(`"${quoteToShare.text}" — ${quoteToShare.author}`);
    return { copied: true };
  };

  // Add new quote to backend
  const addQuote = async (newQuoteData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/quotes`, newQuoteData);
      setCurrentQuote(response.data);
      setPalette(prev => getRandomPalette(prev.id));
      await fetchAllQuotes();
      setIsAddModalOpen(false);
      return { success: true };
    } catch (err) {
      console.error('Error adding quote:', err);
      return {
        success: false,
        error: err.response?.data?.detail || 'Failed to submit quote. Please check inputs.'
      };
    }
  };

  // Delete quote by ID
  const deleteQuote = async (quoteId) => {
    try {
      await axios.delete(`${API_BASE_URL}/quotes/${quoteId}`);
      setQuotesList(prev => prev.filter(q => q.id !== quoteId));
      if (currentQuote && currentQuote.id === quoteId) {
        fetchRandomQuote();
      }
      return { success: true };
    } catch (err) {
      console.error('Error deleting quote:', err);
      return { success: false, error: 'Failed to delete quote.' };
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
    fetchRandomQuote,
    fetchAllQuotes,
    likeQuote,
    playPoetTTS,
    stopPoetTTS,
    shareQuote,
    addQuote,
    deleteQuote,
    openListModal,
    closeListModal,
    openAddModal,
    closeAddModal
  };
}
