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
import Tacits from './components/TACITSDashboard';  // Import Export component
import ReserveComponentSchool from './components/ReserveComponentSchool';  // Import the new component
import QuotaSourceManager from './components/QuotaSourceManager'; // Import the Quota Source Manager page
import MasterT from './components/MasterT'; // Import the Master page component
import ChangeRequirements from './components/ChangeRequirements';
import AddNewRequirements from './components/AddNewRequirements';
import CourseDetails from './components/CourseDetails';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/AFAMDashboard" element={<Dashboard />} />

        <Route path="/scenarios" element={<Scenarios />} />
        <Route path="/instructor" element={<Instructor />} />
        <Route path="/support" element={<Support />} />
        <Route path="/om" element={<OM />} />
        <Route path="/certification" element={<Certification />} />
        <Route path="/export" element={<Export />} />
        <Route path="/master" element={<Master />} />
        <Route path="/TACITSDashboard" element={<Tacits />} />

        <Route path="/reserve-component-school" element={<ReserveComponentSchool />} />
        <Route path="/quota-source-manager" element={<QuotaSourceManager />} />
        <Route path="/mastert" element={<MasterT />} /> {/* Route for Master page */}
        <Route path="/change-requirements" element={<ChangeRequirements />} /> {/* Route for Master page */}
        <Route path="/add-new-requirements" element={<AddNewRequirements />} />
        <Route path="/CourseDetails" element={<CourseDetails />} /> {/* Route for Master page */}
      </Routes>
    </Router>
  );
};

export default App;
