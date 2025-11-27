import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import useAuth from './context/useAuth';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import api from './services/api';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const [healthy, setHealthy] = useState(true);
  const [healthMsg, setHealthMsg] = useState('');

  useEffect(() => {
    let mounted = true;
    api.get('/health')
      .then((res) => {
        if (!mounted) return;
        const ok = res.data?.status === 'ok' && res.data?.database === 'connected';
        setHealthy(!!ok);
        if (!ok) setHealthMsg('Backend no disponible');
      })
      .catch(() => {
        if (!mounted) return;
        setHealthy(false);
        setHealthMsg('No se pudo contactar el backend');
      });
    return () => { mounted = false };
  }, []);

  return (
    <AuthProvider>
      <Router>
        {!healthy && (
          <div style={{background:'#cf6679', color:'#000', padding:'8px 12px', textAlign:'center'}}>
            {healthMsg} · Verifica VITE_API_URL y el estado del backend
          </div>
        )}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
