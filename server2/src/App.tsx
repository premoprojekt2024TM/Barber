import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './layouts/Dashboard'; 
import Bubble from './layouts/Bubble';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dash" element={<Dashboard />} />
         <Route path="/bubble" element={<Bubble />} />
      </Routes>
    </Router>
  );
}

export default App;
