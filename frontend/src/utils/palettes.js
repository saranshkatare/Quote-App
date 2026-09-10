// Curated dark mode color palettes for dynamic quote switching
export const PALETTES = [
    {
        id: 'emerald-dohe',
        name: 'Emerald Dohe',
        bgGradient: 'from-emerald-950/80 via-slate-950 to-teal-950/90',
        accentText: 'text-emerald-400',
        accentGlow: 'rgba(52, 211, 153, 0.25)',
        buttonBg: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950',
        buttonBorder: 'border-emerald-400/30',
        badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
        quoteMarkColor: 'text-emerald-500/20'
    },
    {
        id: 'violet-pohe',
        name: 'Violet Pohe',
        bgGradient: 'from-purple-950/80 via-slate-950 to-indigo-950/90',
        accentText: 'text-purple-400',
        accentGlow: 'rgba(192, 132, 252, 0.25)',
        buttonBg: 'bg-purple-500 hover:bg-purple-400 text-slate-950',
        buttonBorder: 'border-purple-400/30',
        badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
        quoteMarkColor: 'text-purple-500/20'
    },
    {
        id: 'amber-sunset',
        name: 'Amber Sunset',
        bgGradient: 'from-amber-950/80 via-slate-950 to-orange-950/90',
        accentText: 'text-amber-400',
        accentGlow: 'rgba(251, 191, 36, 0.25)',
        buttonBg: 'bg-amber-500 hover:bg-amber-400 text-slate-950',
        buttonBorder: 'border-amber-400/30',
        badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        quoteMarkColor: 'text-amber-500/20'
    },
    {
        id: 'cyan-breeze',
        name: 'Cyan Breeze',
        bgGradient: 'from-cyan-950/80 via-slate-950 to-blue-950/90',
        accentText: 'text-cyan-400',
        accentGlow: 'rgba(34, 211, 238, 0.25)',
        buttonBg: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950',
        buttonBorder: 'border-cyan-400/30',
        badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
        quoteMarkColor: 'text-cyan-500/20'
    },
    {
        id: 'rose-gold',
        name: 'Rose Gold',
        bgGradient: 'from-rose-950/80 via-slate-950 to-pink-950/90',
        accentText: 'text-rose-400',
        accentGlow: 'rgba(251, 113, 133, 0.25)',
        buttonBg: 'bg-rose-500 hover:bg-rose-400 text-slate-950',
        buttonBorder: 'border-rose-400/30',
        badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
        quoteMarkColor: 'text-rose-500/20'
    },
    {
        id: 'indigo-dusk',
        name: 'Indigo Dusk',
        bgGradient: 'from-indigo-950/80 via-slate-950 to-slate-900',
        accentText: 'text-indigo-400',
        accentGlow: 'rgba(129, 140, 248, 0.25)',
        buttonBg: 'bg-indigo-500 hover:bg-indigo-400 text-white',
        buttonBorder: 'border-indigo-400/30',
        badgeBg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
        quoteMarkColor: 'text-indigo-500/20'
    }
];

export function getRandomPalette(currentPaletteId = null) {
    const filtered = currentPaletteId
        ? PALETTES.filter(p => p.id !== currentPaletteId)
        : PALETTES;
    const randomIndex = Math.floor(Math.random() * filtered.length);
    return filtered[randomIndex];
}
