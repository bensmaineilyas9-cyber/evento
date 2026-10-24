import { create } from 'zustand';
import * as api from '../services/api';

const byDate = (a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`);

export const useEventStore = create((set, get) => ({
  events: [],
  loaded: false,
  loading: false,
  error: null,

  fetchEvents: async ({ force = false } = {}) => {
    if (get().loading || (get().loaded && !force)) return;
    set({ loading: true, error: null });
    try {
      const events = await api.fetchEvents();
      set({ events: events.sort(byDate), loaded: true, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addEvent: async (data) => {
    const event = await api.createEvent(data);
    set((state) => ({ events: [...state.events, event].sort(byDate) }));
    return event;
  },

  updateEvent: async (id, changes) => {
    const event = await api.updateEvent(id, changes);
    set((state) => ({
      events: state.events.map((item) => (item.id === id ? event : item)).sort(byDate),
    }));
    return event;
  },
}));
