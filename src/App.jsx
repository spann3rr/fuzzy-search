import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Profile from './components/Profile';
import Table from './components/Table';

function App() {
  return (
    <BrowserRouter>
      <div className="bg-white-600 w-full h-screen p-14">
        <Routes>
          <Route exact path="/" element={<Table />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
