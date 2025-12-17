import React from 'react';

import { Routes, Route } from 'react-router-dom';
import SideBar from './SideBar';
import HierarchyPage from './HierarchyPage';
import RolesPage from './RolesPage';
import PermissionsPage from './PermissionsPage';
import UsersPage from './UsersPage';
import Login from './login'; 
import './App.css';


function App() {
  return (
    <div className="flex">
      {/* Sidebar on the left */}
      <SideBar />

      {/* Main content area */}
      <div className="flex-grow p-4">
        <Routes>
            <Route index element={<Login />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/permissions" element={<PermissionsPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/hierarchy" element={<HierarchyPage />} />
          <Route path="/login" element={<Login />} />
         
        </Routes>
      </div>
    </div>
  );
}

export default App;