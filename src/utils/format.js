export const RSVP_LABELS = {
  pending: 'Pending',
  accepted: 'Accepted',
  declined: 'Declined',
};

export function formatEventDate(date, time) {
  const value = new Date(`${date}T${time || '00:00'}`);
  if (Number.isNaN(value.getTime())) return date;
  const day = value.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return time ? `${day} · ${time}` : day;
}

export function formatShortDate(date) {
  const value = new Date(`${date}T00:00`);
  if (Number.isNaN(value.getTime())) return date;
  return value.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
