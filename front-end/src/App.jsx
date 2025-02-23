import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DataEntry from './pages/DataEntry';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DataEntry />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;