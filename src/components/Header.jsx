import { Link } from 'react-router-dom';
import Navigation from './Navigation';

export default function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/events" className="header__brand">
          Evento
        </Link>
        <Navigation />
      </div>
    </header>
  );
}
