import { useEffect, useMemo, useState } from 'react';
import { useEventStore } from '../store/useEventStore';
import { useInvitationStore } from '../store/useInvitationStore';
import EventForm from '../components/EventForm';
import Modal from '../components/Modal';
import { ErrorMessage, Loading } from '../components/AsyncState';
import { formatEventDate } from '../utils/format';

export default function Events() {
  const events = useEventStore((state) => state.events);
  const loading = useEventStore((state) => state.loading);
  const error = useEventStore((state) => state.error);
  const fetchEvents = useEventStore((state) => state.fetchEvents);
  const addEvent = useEventStore((state) => state.addEvent);
  const updateEvent = useEventStore((state) => state.updateEvent);

  const invitations = useInvitationStore((state) => state.invitations);
  const fetchInvitations = useInvitationStore((state) => state.fetchInvitations);

  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    fetchEvents();
    fetchInvitations();
  }, [fetchEvents, fetchInvitations]);

  const guestStats = useMemo(() => {
    const stats = {};
    for (const { eventId, status } of invitations) {
      stats[eventId] ??= { total: 0, accepted: 0 };
      stats[eventId].total += 1;
      if (status === 'accepted') stats[eventId].accepted += 1;
    }
    return stats;
  }, [invitations]);

  const closeModal = () => {
    setEditing(null);
    setSubmitError(null);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      if (editing === 'new') {
        await addEvent(values);
      } else {
        await updateEvent(editing.id, values);
      }
      closeModal();
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isNew = editing === 'new';

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Events</h1>
          <p className="muted">Plan and manage everything on your calendar.</p>
        </div>
        <button type="button" className="button" onClick={() => setEditing('new')}>
          New event
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={() => fetchEvents({ force: true })} />}
      {loading && events.length === 0 && <Loading label="Loading events…" />}

      {!loading && !error && events.length === 0 && (
        <div className="state">No events yet. Create your first one.</div>
      )}

      <ul className="grid">
        {events.map((event) => {
          const stats = guestStats[event.id] ?? { total: 0, accepted: 0 };
          return (
            <li key={event.id} className="card">
              <div className="card__body">
                <h2 className="card__title">{event.title}</h2>
                <p className="card__meta">{formatEventDate(event.date, event.time)}</p>
                <p className="card__meta">{event.location}</p>
                {event.description && <p>{event.description}</p>}
              </div>
              <div className="card__footer">
                <span className="muted">
                  {stats.accepted} of {stats.total} guests attending
                </span>
                <button type="button" className="button button--ghost" onClick={() => setEditing(event)}>
                  Edit
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {editing && (
        <Modal title={isNew ? 'Create event' : 'Edit event'} onClose={closeModal}>
          {submitError && <ErrorMessage message={submitError} />}
          <EventForm
            initialValues={isNew ? undefined : editing}
            submitLabel={isNew ? 'Create event' : 'Save changes'}
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </section>
  );
}
