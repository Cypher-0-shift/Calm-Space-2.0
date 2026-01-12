// src/hooks/useUI.ts

// This file acts as a bridge. 
// It re-exports the hook from the Context engine so components 
// can import { useUI } from '@/hooks/useUI' without breaking.

export { useUI } from '@/context/UIContext';