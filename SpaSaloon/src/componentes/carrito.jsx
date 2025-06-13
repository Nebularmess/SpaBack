import React, { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import '../styles/carrito.css';

const CarritoCompleto = ({ isOpen, onClose }) => {
    const [fechaSeleccionada, setFechaSeleccionada] = useState("2024-01-15");
    const [vistaActual, setVistaActual] = useState('carrito'); // 'carrito' o 'tarjeta'
    
    // Estados para el formulario de tarjeta
    const [formData, setFormData] = useState({
        cardholderName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    const fechasDisponibles = [
        { valor: "2024-01-15", texto: "15/01/2024" },
        { valor: "2024-02-20", texto: "20/02/2024" },
        { valor: "2024-03-10", texto: "10/03/2024" },
    ];

    const servicios = [
        {
            id: 1,
            tipo: 'MASAJE ANTI-STRESS',
            fecha: '2025/08/02',
            hora: '11:00',
            profesional: 'Dra. Valeria Herrera',
            precio: 3000
        },
        {
            id: 2,
            tipo: 'FACIAL LIMPIEZA PROFUNDA',
            fecha: '2025/08/02',
            hora: '12:00',
            profesional: 'Dra. Ana Felicidad',
            precio: 2500
        },
    ];

    const calcularTotal = () => {
        const subtotal = servicios.reduce((sum, servicio) => sum + servicio.precio, 0);
        const descuento = subtotal * 0.15; // 15% descuento
        return subtotal - descuento;
    };

    const formatearPrecio = (precio) => {
        return `$${precio.toLocaleString()}`;
    };

    // Funciones de navegación
    const irAPagoTarjeta = () => {
        setVistaActual('tarjeta');
    };

    const volverACarrito = () => {
        setVistaActual('carrito');
    };

    // Funciones del formulario de tarjeta
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const formatExpiryDate = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    const handleCardNumberChange = (e) => {
        const formatted = formatCardNumber(e.target.value);
        handleInputChange('cardNumber', formatted);
    };

    const handleExpiryChange = (e) => {
        const formatted = formatExpiryDate(e.target.value);
        handleInputChange('expiryDate', formatted);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Procesando pago...', formData);
        // Aquí puedes agregar la lógica de procesamiento de pago
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="carrito-modal">
                {vistaActual === 'carrito' ? (
                    // VISTA DEL CARRITO
                    <>
                        {/* Header */}
                        <div className="modal-header">
                            <h2 className="modal-title">CARRITO DE RESERVAS</h2>
                            <button className="close-button" onClick={onClose}>
                                <X size={20} color="#F4F8E6" />
                            </button>
                        </div>

                        {/* Fecha Selector */}
                        <div className="fecha-selector">
                            <span className="fecha-label">Servicios reservados para:</span>
                            <div className="fecha-input-container">
                                <select
                                    value={fechaSeleccionada}
                                    onChange={(e) => setFechaSeleccionada(e.target.value)}
                                    className="fecha-input"
                                >
                                    {fechasDisponibles.map((fecha) => (
                                        <option key={fecha.valor} value={fecha.valor}>
                                            {fecha.texto}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Lista de Servicios */}
                        <div className="servicios-lista">
                            {servicios.map((servicio, index) => (
                                <div key={servicio.id} className="servicio-item">
                                    <div className="servicio-numero">{index + 1}.</div>
                                    <div className="servicio-content">
                                        <div className="servicio-tipo">{servicio.tipo}</div>
                                        <div className="servicio-detalles">
                                            <div>Fecha: {servicio.fecha} - Hora: {servicio.hora}</div>
                                            <div>Profesional: {servicio.profesional}</div>
                                            <div className="servicio-precio">Precio: {formatearPrecio(servicio.precio)}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="separador"></div>

                        {/* Total y Botón */}
                        <div className="footer-section">
                            <div className="total-section">
                                <div className="total-text">
                                    SUBTOTAL: <span className="total-precio">{formatearPrecio(calcularTotal())}</span>
                                </div>
                                <div className='buttons-container'>
                                    <button className="pago-efectivo-button">
                                        PAGO EN EFECTIVO
                                    </button>
                                    <button className="pagar-button" onClick={irAPagoTarjeta}>
                                        IR A PAGAR CON TARJETA
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    // VISTA DEL MODAL DE PAGO CON TARJETA
                    <>
                        {/* Header */}
                        <div className="modal-header" style={{background: '#4A3D3D', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 13px'}}>
                            <button
                                onClick={volverACarrito}
                                className="close-button"
                                aria-label="Volver atrás"
                                style={{color: '#F4F8E6'}}
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <h2 className="modal-title">AÑADIR TARJETA</h2>
                            <button
                                onClick={onClose}
                                className="close-button"
                                aria-label="Cerrar"
                            >
                                <X size={20} color="#F4F8E6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div style={{padding: '24px 26px', height: 'calc(100% - 50px)', display: 'flex', flexDirection: 'column'}}>
                            <p style={{fontWeight: 500, fontSize: '16px', lineHeight: '24px', color: '#4A3D3D', margin: '0 0 20px 0'}}>
                                Sólo tarjeta de débito en un solo pago.
                            </p>

                            <div style={{width: '100%', height: '1px', background: '#D8DEC3', marginBottom: '20px'}}></div>

                            <div>
                                {/* Nombre del titular */}
                                <div className="input-group">
                                    <label className="input-label">Nombre del titular:</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            value={formData.cardholderName}
                                            onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                                            placeholder="Como figura en la tarjeta."
                                            className="card-input full-width"
                                        />
                                    </div>
                                </div>

                                {/* Número de tarjeta */}
                                <div className="input-group">
                                    <label className="input-label">Número de la tarjeta:</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            value={formData.cardNumber}
                                            onChange={handleCardNumberChange}
                                            placeholder="0000 0000 0000 0000"
                                            maxLength="19"
                                            className="card-input full-width"
                                        />
                                    </div>
                                </div>

                                {/* Fecha y CVV */}
                                <div className="input-row">
                                    <div className="input-group half-width">
                                        <label className="input-label">Fecha de vencimiento:</label>
                                        <div className="input-wrapper">
                                            <input
                                                type="text"
                                                value={formData.expiryDate}
                                                onChange={handleExpiryChange}
                                                placeholder="MM/AA"
                                                maxLength="5"
                                                className="card-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="input-group half-width">
                                        <label className="input-label">CVV:</label>
                                        <div className="input-wrapper">
                                            <input
                                                type="text"
                                                value={formData.cvv}
                                                onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').substring(0, 3))}
                                                placeholder="***"
                                                maxLength="3"
                                                className="card-input"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Total y botón de pago */}
                                <div style={{marginTop: 'auto', paddingTop: '20px'}}>
                                    <div style={{fontWeight: 600, fontSize: '16px', lineHeight: '24px', textAlign: 'center', color: '#4A3D3D', marginBottom: '20px'}}>
                                        TOTAL: {formatearPrecio(calcularTotal())}
                                    </div>

                                    <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px'}}>
                                        <p style={{flex: 1, fontWeight: 600, fontSize: '10px', lineHeight: '16px', color: '#4A3D3D', margin: 0, textAlign: 'left'}}>
                                            *Descuento del 15% aplicado por pagar con más de 48 hs. de anticipación.
                                        </p>
                                        <button type="button" onClick={handleSubmit} className="pay-btn">
                                            PAGAR
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// Componente App para testing
const App = () => {
    const [modalOpen, setModalOpen] = useState(true);

    return (
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
            <button
                onClick={() => setModalOpen(true)}
                style={{ padding: '10px 20px', fontSize: '16px', marginBottom: '20px' }}
            >
                Abrir Carrito
            </button>
            <CarritoCompleto
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
};

export default CarritoCompleto;