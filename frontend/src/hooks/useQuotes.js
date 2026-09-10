import { useState, useEffect, useCallback } from 'react';
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

    // Modals state
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Theme palette state
    const [palette, setPalette] = useState(() => getRandomPalette());

    // Fetch a random quote from backend
    const fetchRandomQuote = useCallback(async () => {
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

    // Fetch all quotes from backend
    const fetchAllQuotes = useCallback(async (category = '') => {
        try {
            const url = category ? `${API_BASE_URL}/quotes?category=${category}` : `${API_BASE_URL}/quotes`;
            const response = await axios.get(url);
            setQuotesList(response.data);
        } catch (err) {
            console.error('Error fetching all quotes:', err);
        }
    }, []);

    // Add new quote to backend
    const addQuote = async (newQuoteData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/quotes`, newQuoteData);
            // Refresh current quote and quotes list
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
        isListModalOpen,
        isAddModalOpen,
        fetchRandomQuote,
        fetchAllQuotes,
        addQuote,
        deleteQuote,
        openListModal,
        closeListModal,
        openAddModal,
        closeAddModal
    };
}
