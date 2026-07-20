import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Assignments from './pages/Assignments';
import Purchases from './pages/Purchases';
import Transfers from './pages/Transfers';
import Navbar from './components/Navbar';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { api } from './utils/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    api.auth.verify()
      .then(() => setIsAuthenticated(true))
      .catch((err) => {
        console.error("Session verification failed:", err.message);
        setIsAuthenticated(false);
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {isAuthenticated && <Navbar onLogout={handleLogout} />}
      <Box component="main" sx={{ flexGrow: 1, p: isAuthenticated ? 3 : 0 }}>
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/assignments" element={isAuthenticated ? <Assignments /> : <Navigate to="/login" />} />
          <Route path="/purchases" element={isAuthenticated ? <Purchases /> : <Navigate to="/login" />} />
          <Route path="/transfers" element={isAuthenticated ? <Transfers /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;