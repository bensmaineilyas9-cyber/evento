import { useState } from 'react';

const emptyValues = { title: '', date: '', time: '', location: '', description: '' };

export default function EventForm({ initialValues, submitLabel, submitting, onSubmit, onCancel }) {
  const [values, setValues] = useState({ ...emptyValues, ...initialValues });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, value.trim()]),
    );
    const nextErrors = {};
    if (!trimmed.title) nextErrors.title = 'Title is required';
    if (!trimmed.date) nextErrors.date = 'Date is required';
    if (!trimmed.time) nextErrors.time = 'Time is required';
    if (!trimmed.location) nextErrors.location = 'Location is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onSubmit(trimmed);
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <label className="field">
        <span>Title</span>
        <input name="title" value={values.title} onChange={handleChange} autoFocus />
        {errors.title && <small className="field__error">{errors.title}</small>}
      </label>

      <div className="form__row">
        <label className="field">
          <span>Date</span>
          <input type="date" name="date" value={values.date} onChange={handleChange} />
          {errors.date && <small className="field__error">{errors.date}</small>}
        </label>
        <label className="field">
          <span>Time</span>
          <input type="time" name="time" value={values.time} onChange={handleChange} />
          {errors.time && <small className="field__error">{errors.time}</small>}
        </label>
      </div>

      <label className="field">
        <span>Location</span>
        <input name="location" value={values.location} onChange={handleChange} />
        {errors.location && <small className="field__error">{errors.location}</small>}
      </label>

      <label className="field">
        <span>Description</span>
        <textarea name="description" rows="3" value={values.description} onChange={handleChange} />
      </label>

      <div className="form__actions">
        <button type="button" className="button button--ghost" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
