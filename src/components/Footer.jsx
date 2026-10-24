import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>&copy; {new Date().getFullYear()} Evento. All rights reserved.</p>
        <ul className="footer__links">
          <li>
            <Link to="/events">Events</Link>
          </li>
          <li>
            <Link to="/invitations">Invitations</Link>
          </li>
          <li>
            <Link to="/collaborators">Collaborators</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
