import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Dashboard from './components/AFAMDashboard';  // Import Dashboard component
import Scenarios from './components/Scenarios';  // Import Scenarios component
import Instructor from './components/Instructor';  // Import Instructor component
import Support from './components/Support';  // Import Support component
import OM from './components/OM';  // Import O&M component
import Certification from './components/Certification';  // Import Certification component
import Export from './components/Export';  // Import Export component
import Login from './components/Login';  // Import Export component
import Master from './components/MasterData';  // Import Export component


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/AFAMDashboard" element={<Dashboard />} />

        <Route path="/scenarios" element={<Scenarios />} />
        <Route path="/instructor" element={<Instructor />} />
        <Route path="/support" element={<Support />} />
        <Route path="/om" element={<OM />} />
        <Route path="/certification" element={<Certification />} />
        <Route path="/export" element={<Export />} />
        <Route path="/master" element={<Master />} />
      </Routes>
    </Router>
  );
};

export default App;
