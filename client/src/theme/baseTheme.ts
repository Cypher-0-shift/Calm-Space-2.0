// client/src/theme/baseTheme.ts

export type ThemeTokens = {
  bgClasses: string;
  transitionClasses: string;
};

export const BASE_THEME = {
  bgClasses: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
  textPrimary: 'text-slate-100',
  textSecondary: 'text-slate-400',
  surface: 'bg-white/5 backdrop-blur-md',
  transitionClasses: 'transition-all duration-700 ease-in-out',
};

