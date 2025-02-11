import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Dashboard from './pages/Dashboard';
import StaffDetailsPage from './staffDetails/StaffDetails'; // Import StaffDetails component

function App() {
  return (
    <div className="App">
      <BrowserRouter basename="/admin">
        <div className="pages">
          <Routes>
            <Route path="/login" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/staff-details" element={<StaffDetailsPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
