import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AFAMDashboard from './components/AFAMDashboard';
import MasterData from './components/MasterData';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AFAMDashboard />} />
        <Route path="/dashboard" element={<AFAMDashboard />} />
        <Route path="/master-data" element={<MasterData />} />
        {/* Add other routes as necessary */}
      </Routes>
    </Router>
  );
}

export default App;
