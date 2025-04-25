import React from 'react';
import '../../styles/sobre-nosotros.css';
import { Heart, Award, Users } from 'lucide-react';

const SobreNosotros = () => {
  return (
    <section className="sobre-nosotros-section" id="sobre-nosotros">
      <div className="sobre-nosotros-overlay"></div>

      <div className="sobre-nosotros-container">
        <div className="sobre-nosotros-content-wrapper">
          {/* Columna izquierda con texto */}
          <div className="sobre-nosotros-text">
            <h2 className="section-title">Sobre Nosotros</h2>

            <p className="section-description">
              En nuestro spa, nos dedicamos a proporcionar una experiencia de relajación
              y bienestar incomparable. Con más de 10 años de experiencia en el sector,
              nuestro equipo de profesionales está capacitado para ofrecer los mejores
              servicios de masajes, tratamientos faciales y corporales.
            </p>

            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">
                  <Heart size={24} />
                </div>
                <div className="feature-text">
                  <h3>Cuidado personalizado</h3>
                  <p>Tratamientos diseñados exclusivamente para tus necesidades</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <Award size={24} />
                </div>
                <div className="feature-text">
                  <h3>Profesionales certificados</h3>
                  <p>Expertos con años de experiencia y formación continua</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <Users size={24} />
                </div>
                <div className="feature-text">
                  <h3>Atención personalizada</h3>
                  <p>Servicio exclusivo con atención a los detalles</p>
                </div>
              </div>
            </div>

            <div className="sobre-nosotros-buttons">
              <a href="#servicios" className="hero-button primary">Nuestros servicios</a>
              <a href="#contacto" className="hero-button outline">Contactanos</a>
            </div>
          </div>

          {/* Columna derecha con imágenes */}
          <div className="sobre-nosotros-gallery">
            <div className="gallery-main">
              <img
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
                alt="Spa ambiente relajante"
                className="gallery-image main-image"
              />
            </div>
            <div className="gallery-secondary">
              <img
                src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
                alt="Tratamiento facial spa"
                className="gallery-image secondary-image"
              />
              <img
                src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
                alt="Masaje relajante con aceites"
                className="gallery-image secondary-image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SobreNosotros;