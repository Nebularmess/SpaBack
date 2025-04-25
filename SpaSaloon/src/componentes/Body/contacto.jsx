import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Input from '../Formularios/input.jsx';
import '../../styles/contacto.css';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulario enviado:', formData);
    setFormData({ nombre: '', email: '', mensaje: '' });
    alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
  };

  return (
    <section className="contacto-section" id="contacto">
      <div className="contacto-overlay"></div>
      <div className="contacto-container">
        <div className="contacto-content">
          <div className="contacto-info">
            <div className="contacto-header">
              <h2 className="contacto-title">Contacto</h2>
            </div>

            <div className="contacto-details">
              <div className="contacto-detail-item">
                <span className="contact-icon">
                  <Mail size={24} />
                </span>
                <div className="contact-text-group">
                  <span className="contacto-label">e-mail</span>
                  <span className="contacto-value">info@sparesistencia.com</span>
                </div>
              </div>

              <div className="contacto-detail-item">
                <span className="contact-icon">
                  <Phone size={24} />
                </span>
                <div className="contact-text-group">
                  <span className="contacto-label">teléfono</span>
                  <span className="contacto-value">+54 362 422-5555</span>
                </div>
              </div>

              <div className="contacto-detail-item">
                <span className="contact-icon">
                  <MapPin size={24} />
                </span>
                <div className="contact-text-group">
                  <span className="contacto-label">dirección</span>
                  <span className="contacto-value">Calle French 400, Resistencia, Chaco</span>
                </div>
              </div>
            </div>

            <div className="contacto-map-container">
              <iframe
                title="Ubicación del Spa"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-58.99749755859376%2C-27.46270794944356%2C-58.98720788002015%2C-27.45566772429961&amp;layer=mapnik&amp;marker=-27.459187861915857%2C-58.992352719306946"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="contacto-map"
              ></iframe>
            </div>

            <div className="contacto-footer">
              <p className="contacto-horarios">SPA "Sentirse Bien" © 2025</p>
            </div>
          </div>

          <div className="contacto-form-container">
            <div className="contacto-form-header">
              <h3 className="contacto-form-title">Envianos un mensaje</h3>
              <p className="contacto-form-subtitle">Nos contactaremos a tu mail en 24hs</p>
            </div>

            <form className="contacto-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <Input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required={true}
                  className="form-custom-input"
                />
              </div>

              <div className="form-group">
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required={true}
                  className="form-custom-input"
                />
              </div>

              <div className="form-group message-group">
                <Input
                  type="textarea"
                  name="mensaje"
                  placeholder="Mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required={true}
                  className="form-custom-input textarea"
                  rows="5"
                />
              </div>

              <div className="form-submit">
                <button type="submit" className="hero-button">Enviar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacto;