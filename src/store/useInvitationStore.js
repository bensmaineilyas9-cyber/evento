import { create } from 'zustand';
import * as api from '../services/api';

export const useInvitationStore = create((set, get) => ({
  invitations: [],
  loaded: false,
  loading: false,
  error: null,
  pendingIds: [],

  fetchInvitations: async ({ force = false } = {}) => {
    if (get().loading || (get().loaded && !force)) return;
    set({ loading: true, error: null });
    try {
      const invitations = await api.fetchInvitations();
      set({ invitations, loaded: true, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateRsvp: async (id, status) => {
    set((state) => ({ pendingIds: [...state.pendingIds, id], error: null }));
    try {
      const updated = await api.updateRsvp(id, status);
      set((state) => ({
        invitations: state.invitations.map((item) => (item.id === id ? updated : item)),
      }));
    } catch (error) {
      set({ error: error.message });
    } finally {
      set((state) => ({ pendingIds: state.pendingIds.filter((item) => item !== id) }));
    }
  },
}));
