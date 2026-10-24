const LATENCY_MS = 450;

const db = {
  events: [
    {
      id: 'evt-1',
      title: 'Annual Product Launch',
      date: '2026-11-12',
      time: '18:30',
      location: 'Grand Conference Center, Algiers',
      description: 'Unveiling the next release to customers, partners and press.',
    },
    {
      id: 'evt-2',
      title: 'Team Offsite',
      date: '2026-11-28',
      time: '09:00',
      location: 'Tipaza Coastal Retreat',
      description: 'Two days of planning, workshops and team building by the sea.',
    },
    {
      id: 'evt-3',
      title: 'Winter Gala Dinner',
      date: '2026-12-18',
      time: '20:00',
      location: 'El Aurassi Hotel',
      description: 'Black-tie dinner celebrating the year with sponsors and volunteers.',
    },
    {
      id: 'evt-4',
      title: 'Developer Meetup',
      date: '2026-10-30',
      time: '17:00',
      location: 'Digital Hub, Bab Ezzouar',
      description: 'Lightning talks and networking for the local developer community.',
    },
  ],
  invitations: [
    { id: 'inv-1', eventId: 'evt-1', guestName: 'Amina Benali', email: 'amina.benali@example.com', status: 'accepted', sentAt: '2026-10-01' },
    { id: 'inv-2', eventId: 'evt-1', guestName: 'Karim Haddad', email: 'karim.haddad@example.com', status: 'pending', sentAt: '2026-10-01' },
    { id: 'inv-3', eventId: 'evt-1', guestName: 'Lydia Merabet', email: 'lydia.merabet@example.com', status: 'declined', sentAt: '2026-10-02' },
    { id: 'inv-4', eventId: 'evt-2', guestName: 'Yacine Boudiaf', email: 'yacine.boudiaf@example.com', status: 'accepted', sentAt: '2026-10-05' },
    { id: 'inv-5', eventId: 'evt-2', guestName: 'Sara Khelifi', email: 'sara.khelifi@example.com', status: 'pending', sentAt: '2026-10-05' },
    { id: 'inv-6', eventId: 'evt-3', guestName: 'Nadir Cherif', email: 'nadir.cherif@example.com', status: 'pending', sentAt: '2026-10-12' },
    { id: 'inv-7', eventId: 'evt-3', guestName: 'Imane Zerrouki', email: 'imane.zerrouki@example.com', status: 'accepted', sentAt: '2026-10-12' },
    { id: 'inv-8', eventId: 'evt-4', guestName: 'Walid Saadi', email: 'walid.saadi@example.com', status: 'accepted', sentAt: '2026-10-15' },
  ],
  collaborators: [
    { id: 'col-1', name: 'Samira Ould Ali', role: 'Lead Organizer', email: 'samira@evento.example', eventIds: ['evt-1', 'evt-3'] },
    { id: 'col-2', name: 'Mehdi Brahimi', role: 'Logistics Manager', email: 'mehdi@evento.example', eventIds: ['evt-1', 'evt-2'] },
    { id: 'col-3', name: 'Nora Bensalem', role: 'Catering Coordinator', email: 'nora@evento.example', eventIds: ['evt-3'] },
    { id: 'col-4', name: 'Rachid Taleb', role: 'Community Manager', email: 'rachid@evento.example', eventIds: ['evt-4'] },
    { id: 'col-5', name: 'Fatima Belkacem', role: 'Venue Liaison', email: 'fatima@evento.example', eventIds: ['evt-2', 'evt-4'] },
  ],
};

const RSVP_STATUSES = ['pending', 'accepted', 'declined'];

let sequence = 100;

const respond = (action) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(structuredClone(action()));
      } catch (error) {
        reject(error);
      }
    }, LATENCY_MS);
  });

export const fetchEvents = () => respond(() => db.events);

export const createEvent = (data) =>
  respond(() => {
    const event = { id: `evt-${sequence++}`, ...data };
    db.events.push(event);
    return event;
  });

export const updateEvent = (id, changes) =>
  respond(() => {
    const index = db.events.findIndex((event) => event.id === id);
    if (index === -1) throw new Error('Event not found');
    db.events[index] = { ...db.events[index], ...changes, id };
    return db.events[index];
  });

export const fetchInvitations = () => respond(() => db.invitations);

export const updateRsvp = (id, status) =>
  respond(() => {
    if (!RSVP_STATUSES.includes(status)) throw new Error('Invalid RSVP status');
    const invitation = db.invitations.find((item) => item.id === id);
    if (!invitation) throw new Error('Invitation not found');
    invitation.status = status;
    return invitation;
  });

export const fetchCollaborators = () => respond(() => db.collaborators);
