import React from 'react';
import LockScreen from './components/LockScreen';
import Dashboard from './components/Dashboard';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      {isAuthenticated ? <Dashboard /> : <LockScreen />}
    </>
  );
}

export default App;
