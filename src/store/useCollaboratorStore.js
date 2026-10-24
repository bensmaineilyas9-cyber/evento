import { create } from 'zustand';
import * as api from '../services/api';

export const useCollaboratorStore = create((set, get) => ({
  collaborators: [],
  loaded: false,
  loading: false,
  error: null,

  fetchCollaborators: async ({ force = false } = {}) => {
    if (get().loading || (get().loaded && !force)) return;
    set({ loading: true, error: null });
    try {
      const collaborators = await api.fetchCollaborators();
      set({ collaborators, loaded: true, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
