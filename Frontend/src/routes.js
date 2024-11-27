import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Logon from './pages/Logon';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NewIncident from './pages/NewIncident';

export default function RoutesConfig() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Logon />} />
                <Route path="/register" element={<Register />} />
                
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:ongId" element={<Profile />} />
                
                <Route path="/incidents/new" element={<NewIncident />} />
            </Routes>
        </BrowserRouter>
    );
}
