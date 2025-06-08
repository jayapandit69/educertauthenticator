import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BlockchainProvider } from './contexts/BlockchainContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import IssueCertificate from './pages/IssueCertificate';
import VerifyCertificate from './pages/VerifyCertificate';
import FreeCertifications from './pages/FreeCertifications';
import StudentPortal from './pages/StudentPortal';

function App() {
  return (
    <AuthProvider>
      <BlockchainProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/issue" element={<IssueCertificate />} />
              <Route path="/verify" element={<VerifyCertificate />} />
              <Route path="/verify/:certificateId" element={<VerifyCertificate />} />
              <Route path="/certifications" element={<FreeCertifications />} />
              <Route path="/student" element={<StudentPortal />} />
            </Routes>
          </div>
        </Router>
      </BlockchainProvider>
    </AuthProvider>
  );
}

export default App;