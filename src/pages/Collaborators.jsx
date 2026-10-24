import { useEffect, useMemo } from 'react';
import { useCollaboratorStore } from '../store/useCollaboratorStore';
import { useEventStore } from '../store/useEventStore';
import { ErrorMessage, Loading } from '../components/AsyncState';

const initials = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

export default function Collaborators() {
  const collaborators = useCollaboratorStore((state) => state.collaborators);
  const loading = useCollaboratorStore((state) => state.loading);
  const error = useCollaboratorStore((state) => state.error);
  const fetchCollaborators = useCollaboratorStore((state) => state.fetchCollaborators);

  const events = useEventStore((state) => state.events);
  const fetchEvents = useEventStore((state) => state.fetchEvents);

  useEffect(() => {
    fetchCollaborators();
    fetchEvents();
  }, [fetchCollaborators, fetchEvents]);

  const eventTitles = useMemo(
    () => Object.fromEntries(events.map((event) => [event.id, event.title])),
    [events],
  );

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Collaborators</h1>
          <p className="muted">The people helping you bring events to life.</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={() => fetchCollaborators({ force: true })} />}
      {loading && collaborators.length === 0 && <Loading label="Loading collaborators…" />}

      <ul className="grid">
        {collaborators.map((person) => (
          <li key={person.id} className="card">
            <div className="card__body">
              <div className="person">
                <span className="avatar" aria-hidden="true">
                  {initials(person.name)}
                </span>
                <div>
                  <h2 className="card__title">{person.name}</h2>
                  <p className="card__meta">{person.role}</p>
                </div>
              </div>
              <p>
                <a href={`mailto:${person.email}`}>{person.email}</a>
              </p>
            </div>
            <div className="card__footer card__footer--wrap">
              {person.eventIds.map((id) => (
                <span key={id} className="tag">
                  {eventTitles[id] ?? id}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
