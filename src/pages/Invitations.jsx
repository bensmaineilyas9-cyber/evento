import { useEffect, useMemo, useState } from 'react';
import { useEventStore } from '../store/useEventStore';
import { useInvitationStore } from '../store/useInvitationStore';
import StatusBadge from '../components/StatusBadge';
import { ErrorMessage, Loading } from '../components/AsyncState';
import { RSVP_LABELS, formatShortDate } from '../utils/format';

const FILTERS = ['all', 'pending', 'accepted', 'declined'];

export default function Invitations() {
  const invitations = useInvitationStore((state) => state.invitations);
  const loading = useInvitationStore((state) => state.loading);
  const error = useInvitationStore((state) => state.error);
  const pendingIds = useInvitationStore((state) => state.pendingIds);
  const fetchInvitations = useInvitationStore((state) => state.fetchInvitations);
  const updateRsvp = useInvitationStore((state) => state.updateRsvp);

  const events = useEventStore((state) => state.events);
  const fetchEvents = useEventStore((state) => state.fetchEvents);

  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchInvitations();
    fetchEvents();
  }, [fetchInvitations, fetchEvents]);

  const eventTitles = useMemo(
    () => Object.fromEntries(events.map((event) => [event.id, event.title])),
    [events],
  );

  const counts = useMemo(() => {
    const result = { all: invitations.length, pending: 0, accepted: 0, declined: 0 };
    for (const { status } of invitations) result[status] += 1;
    return result;
  }, [invitations]);

  const visible = filter === 'all' ? invitations : invitations.filter((item) => item.status === filter);

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Invitations</h1>
          <p className="muted">Track who has responded to your invitations.</p>
        </div>
      </div>

      <div className="summary">
        {FILTERS.map((key) => (
          <button
            key={key}
            type="button"
            className={filter === key ? 'summary__item summary__item--active' : 'summary__item'}
            onClick={() => setFilter(key)}
          >
            <strong>{counts[key]}</strong>
            <span>{key === 'all' ? 'All' : RSVP_LABELS[key]}</span>
          </button>
        ))}
      </div>

      {error && <ErrorMessage message={error} onRetry={() => fetchInvitations({ force: true })} />}
      {loading && invitations.length === 0 && <Loading label="Loading invitations…" />}

      {visible.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Event</th>
                <th>Sent</th>
                <th>Status</th>
                <th>Update RSVP</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((invitation) => (
                <tr key={invitation.id}>
                  <td>
                    <div>{invitation.guestName}</div>
                    <div className="muted">{invitation.email}</div>
                  </td>
                  <td>{eventTitles[invitation.eventId] ?? 'Unknown event'}</td>
                  <td>{formatShortDate(invitation.sentAt)}</td>
                  <td>
                    <StatusBadge status={invitation.status} />
                  </td>
                  <td>
                    <select
                      value={invitation.status}
                      disabled={pendingIds.includes(invitation.id)}
                      onChange={(event) => updateRsvp(invitation.id, event.target.value)}
                      aria-label={`RSVP status for ${invitation.guestName}`}
                    >
                      {Object.entries(RSVP_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && visible.length === 0 && (
        <div className="state">No invitations match this filter.</div>
      )}
    </section>
  );
}
