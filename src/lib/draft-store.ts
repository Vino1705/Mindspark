'use client';

import {create} from 'zustand';

type DraftContentState = {
  draftContent: string | null;
  setDraftContent: (content: string | null) => void;
  consumeDraftContent: () => string | null;
};

export const useDraftStore = create<DraftContentState>(set => ({
  draftContent: null,
  setDraftContent: content => set({draftContent: content}),
  consumeDraftContent: () => {
    let content: string | null = null;
    set(state => {
      content = state.draftContent;
      return {draftContent: null};
    });
    return content;
  },
}));
