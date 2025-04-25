import React from 'react'; 
import '../../styles/hero.css';
import img from '../../assets/fondoHero.jpg';

function Hero() {
  return (
    <section 
      className="hero-section" 
      id="inicio"
      style={{ backgroundImage: `url(${img})` }}	
    >
      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className="hero-title">Renueva tu cuerpo.<span className="highlight">Calma tu mente.</span></h1>
          <p className="hero-subtitle">Descubre el equilibrio perfecto entre<br/>bienestar y serenidad</p>
          <div className="hero-buttons">
            <a href="#servicios" className="hero-button primary">Explorar servicios</a>
            <a href="#contacto" className="hero-button outline">Contactanos</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;