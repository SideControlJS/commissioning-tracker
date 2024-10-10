import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Upload from './components/Upload';
// Import other components as needed

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/upload" element={<Upload />} />
          {/* Define other routes */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

