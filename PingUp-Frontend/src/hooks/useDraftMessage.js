import { useState, useEffect, useCallback, useRef } from 'react';
import { saveDraft, getDraft, removeDraft } from '../utils/draftStorage';

/**
 * Custom hook for managing draft messages in localStorage
 * Handles automatic save, restore, and clear operations
 * 
 * @param {string} draftType - Type of draft context ('channel' or 'dm')
 * @param {string|number} draftId - ID of the conversation/channel/user
 * @param {number} debounceMs - Milliseconds to wait before saving (default: 500)
 * @returns {object} { text, setText, clearDraft, restoreDraft }
 */
export function useDraftMessage(draftType, draftId, debounceMs = 500) {
  const [text, setText] = useState('');
  const debounceTimer = useRef(null);

  // Restore draft when component mounts or draftId changes
  const restoreDraft = useCallback(() => {
    if (!draftType || !draftId) {
      setText('');
      return;
    }
    
    const savedDraft = getDraft(draftType, draftId);
    setText(savedDraft || '');
  }, [draftType, draftId]);

  // Restore draft on mount and when conversation changes
  useEffect(() => {
    restoreDraft();
  }, [restoreDraft]);

  // Auto-save draft with debounce on text change
  const handleTextChange = useCallback((newText) => {
    setText(newText);
    
    // Clear existing timer
    if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
    }
    
    // Set new timer for debounced save
    debounceTimer.current = setTimeout(() => {
      if (draftType && draftId) {
        saveDraft(draftType, draftId, newText);
      }
    }, debounceMs);
    
  }, [draftType, draftId, debounceMs]);

  // Clear draft from storage
  const clearDraft = useCallback(() => {
    setText('');
    if (draftType && draftId) {
      removeDraft(draftType, draftId);
    }
  }, [draftType, draftId]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    text,
    setText: handleTextChange,
    clearDraft,
    restoreDraft,
  };
}
