import { RSVP_LABELS } from '../utils/format';

export default function StatusBadge({ status }) {
  return <span className={`badge badge--${status}`}>{RSVP_LABELS[status] ?? status}</span>;
}
