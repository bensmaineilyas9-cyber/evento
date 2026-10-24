import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Events from './pages/Events';
import Invitations from './pages/Invitations';
import Collaborators from './pages/Collaborators';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/events" replace />} />
          <Route path="events" element={<Events />} />
          <Route path="invitations" element={<Invitations />} />
          <Route path="collaborators" element={<Collaborators />} />
          <Route path="*" element={<Navigate to="/events" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
