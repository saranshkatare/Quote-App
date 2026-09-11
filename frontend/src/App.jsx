import React from 'react';
import { useQuotes } from './hooks/useQuotes';
import HeaderDropdown from './components/HeaderDropdown';
import QuoteDisplay from './components/QuoteDisplay';
import ControlButtons from './components/ControlButtons';
import QuoteListModal from './components/QuoteListModal';
import AddQuoteModal from './components/AddQuoteModal';
import EditQuoteModal from './components/EditQuoteModal';

export default function App() {
  const {
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
  } = useQuotes();

  const isCurrentQuoteLiked = currentQuote ? likedQuoteIds.includes(currentQuote.id) : false;

  return (
    <div className={`relative min-h-screen w-full bg-gradient-to-br ${palette.bgGradient} transition-colors duration-1000 flex flex-col justify-between overflow-x-hidden selection:bg-white/20`}>

      {/* Subtle Background Glow Spheres */}
      <div 
        className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[140px] opacity-25 pointer-events-none transition-all duration-1000"
        style={{ backgroundColor: palette.accentGlow }}
      />
      <div 
        className="fixed bottom-10 right-10 w-[350px] h-[350px] rounded-full blur-[120px] opacity-15 pointer-events-none transition-all duration-1000"
        style={{ backgroundColor: palette.accentGlow }}
      />

      {/* Top Left Menu Dropdown Navigation */}
      <HeaderDropdown
        onOpenListModal={openListModal}
        onOpenAddModal={openAddModal}
        palette={palette}
      />

      {/* Main Center Content Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 pt-24 pb-16">
        {error && (
          <div className="mb-6 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono text-center">
            {error}
          </div>
        )}

        <QuoteDisplay
          quote={currentQuote}
          loading={loading}
          fetchingNext={fetchingNext}
          palette={palette}
          onLikeQuote={likeQuote}
          isLiked={isCurrentQuoteLiked}
          onPlayTTS={playPoetTTS}
          onStopTTS={stopPoetTTS}
          isPlayingTTS={isPlayingTTS}
          ttsLoading={ttsLoading}
          onShareQuote={shareQuote}
          onEditQuote={openEditModal}
        />

        <ControlButtons
          onNextQuote={fetchRandomQuote}
          fetchingNext={fetchingNext}
          palette={palette}
        />
      </main>

      {/* Minimalist Footer */}
      <footer className="relative z-10 py-6 text-center text-xs font-mono text-slate-300 border-t border-white/5">
        <p>Life ke Dohe , Khatri ke Pohe • Production Minimalist Quote App</p>
      </footer>

      {/* Modals */}
      <QuoteListModal
        isOpen={isListModalOpen}
        onClose={closeListModal}
        quotesList={quotesList}
        onDeleteQuote={deleteQuote}
        onEditQuote={openEditModal}
        onLikeQuote={likeQuote}
        likedQuoteIds={likedQuoteIds}
        onPlayTTS={playPoetTTS}
        palette={palette}
      />

      <AddQuoteModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onAddQuote={addQuote}
        palette={palette}
      />

      <EditQuoteModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        quoteToEdit={quoteToEdit}
        onUpdateQuote={updateQuote}
        palette={palette}
      />
    </div>
  );
}
