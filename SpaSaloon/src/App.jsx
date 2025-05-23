import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

import Hero from './componentes/Body/hero.jsx';
import Servicios from './componentes/Body/servicios.jsx';
import SobreNosotros from './componentes/Body/sobre-nosotros.jsx';
import Contacto from './componentes/Body/contacto.jsx';
import Header from './componentes/Header/header.jsx';
import Galeria from './componentes/Body/galeria.jsx';
import PerfilUsuario from './componentes/PerfilUsuario/PerfilUsuario.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

const Home = () => {
  return (
    <div className="main-content">
      <section className="section hero-section" id="hero">
        <Hero />
      </section>
      <section className="section section-masajes" id="sobre-nosotros">
        <SobreNosotros />
      </section>
      <section className="section section-servicios" id="servicios">
        <Servicios />
      </section>
      <section className="section" id="fotos">
        <Galeria />
      </section>
      <section className="section section-contacto" id="contacto">
        <Contacto />
      </section>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/perfil" element={<PerfilUsuario />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

