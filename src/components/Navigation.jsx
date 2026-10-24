import { NavLink } from 'react-router-dom';

const links = [
  { to: '/events', label: 'Events' },
  { to: '/invitations', label: 'Invitations' },
  { to: '/collaborators', label: 'Collaborators' },
];

export default function Navigation() {
  return (
    <nav className="nav" aria-label="Main navigation">
      {links.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => (isActive ? 'nav__link nav__link--active' : 'nav__link')}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
