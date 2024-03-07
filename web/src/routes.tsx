import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Certifique-se de importar o Routes também

import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Defina suas rotas aqui */}
                <Route path="/" element={<Home />} />
                <Route path="/create-point" element={<CreatePoint/>} />
                {/* Adicione outras rotas conforme necessário */}
            </Routes>
        </Router>

    );
}

export default AppRoutes;
