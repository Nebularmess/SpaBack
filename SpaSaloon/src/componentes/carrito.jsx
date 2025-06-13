import React, { useState, useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import FechaSelector from './fechaselector.jsx';
import '../styles/carrito.css';

const CarritoCompleto = ({ isOpen, onClose, idCliente }) => {
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
    const [vistaActual, setVistaActual] = useState('carrito');
    
    // Estados para datos del backend
    const [servicios, setServicios] = useState([]);
    const [carritoSeleccionado, setCarritoSeleccionado] = useState(null);
    const [carritosPorFecha, setCarritosPorFecha] = useState(new Map());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Estados para el formulario de tarjeta
    const [formData, setFormData] = useState({
        cardholderName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });
    //boton pagar actualiza estado de carrito
    const actualizarEstadoCarrito = async (idCarrito, nuevoEstado) => {
    try {
        const response = await fetch(`http://localhost:3001/api/carritos/estado/${idCarrito}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estado: nuevoEstado })
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error al actualizar estado del carrito:', error);
        throw error;
    }
};
    // Función para obtener carritos del cliente y organizarlos por fecha
    const obtenerCarritosPorFecha = async () => {
        if (!idCliente) return;

        try {
            const response = await fetch(`http://localhost:3001/api/carritos/cliente/${idCliente}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    setCarritosPorFecha(new Map());
                    return;
                }
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const carritos = await response.json();
            
            // Filtrar carritos pendientes y organizarlos por fecha
            const carritosPendientes = carritos.filter(carrito => 
                carrito.estado === 'Pendiente'
            );

            // Crear un Map con fecha como key y array de carritos como value
            const carritosPorFechaMap = new Map();
            carritosPendientes.forEach(carrito => {
                const fecha = carrito.fecha;
                if (!carritosPorFechaMap.has(fecha)) {
                    carritosPorFechaMap.set(fecha, []);
                }
                carritosPorFechaMap.get(fecha).push(carrito);
            });

            setCarritosPorFecha(carritosPorFechaMap);

        } catch (error) {
            console.error('Error al obtener carritos por fecha:', error);
            setError('Error al cargar carritos');
        }
    };

    // Función para obtener turnos de un carrito específico
    const obtenerTurnosCarrito = async (idCarrito) => {
        if (!idCarrito) return;

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`http://localhost:3001/api/carritos/${idCarrito}/turnos`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    setServicios([]);
                    return;
                }
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const turnos = await response.json();
            
            // Transformar los datos del backend al formato esperado por el frontend
            const serviciosFormateados = turnos.map(turno => ({
                id: turno.id_turno,
                tipo: turno.servicio_nombre,
                fecha: formatearFecha(turno.fecha_hora),
                hora: formatearHora(turno.fecha_hora),
                profesional: turno.profesional_nombre,
                precio: turno.servicio_precio || 0, // ✅ Cambiado aquí
                duracion: turno.duracion_minutos,
                estado: turno.estado,
                comentarios: turno.comentarios
            }));

            setServicios(serviciosFormateados);

        } catch (error) {
            console.error('Error al obtener turnos del carrito:', error);
            setError('Error al cargar los servicios del carrito');
            setServicios([]);
        } finally {
            setLoading(false);
        }
    };

    // Función para manejar cambio de fecha
    const handleFechaChange = (nuevaFecha) => {
        setFechaSeleccionada(nuevaFecha);
        console.log('Fecha seleccionada:', nuevaFecha);

        // Obtener carritos de esa fecha
        const carritosDeEsteFecha = carritosPorFecha.get(nuevaFecha) || [];
        
        if (carritosDeEsteFecha.length > 0) {
            // Por ahora tomamos el primer carrito de la fecha
            // Podrías implementar lógica para manejar múltiples carritos por fecha
            const primerCarrito = carritosDeEsteFecha[0];
            setCarritoSeleccionado(primerCarrito);
            obtenerTurnosCarrito(primerCarrito.id);
        } else {
            setCarritoSeleccionado(null);
            setServicios([]);
        }
    };

    // Función para formatear fecha desde timestamp a string
    const formatearFecha = (fechaHora) => {
        const fecha = new Date(fechaHora);
        const año = fecha.getFullYear();
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const dia = fecha.getDate().toString().padStart(2, '0');
        return `${año}/${mes}/${dia}`;
    };

    // Función para formatear hora desde timestamp
    const formatearHora = (fechaHora) => {
        const fecha = new Date(fechaHora);
        const horas = fecha.getHours().toString().padStart(2, '0');
        const minutos = fecha.getMinutes().toString().padStart(2, '0');
        return `${horas}:${minutos}`;
    };

    // Cargar carritos cuando se abre el modal o cambia el cliente
    useEffect(() => {
        if (isOpen && idCliente) {
            obtenerCarritosPorFecha();
        }
    }, [isOpen, idCliente]);

    // Limpiar estados cuando se cierra el modal
    useEffect(() => {
        if (!isOpen) {
            setFechaSeleccionada(null);
            setCarritoSeleccionado(null);
            setServicios([]);
            setVistaActual('carrito');
            setError(null);
        }
    }, [isOpen]);

    const calcularTotal = () => {
        if (!carritoSeleccionado || !carritoSeleccionado.subtotal) {
            return 0;
        }
        
        const subtotal = carritoSeleccionado.subtotal;
        const descuento = subtotal * 0.15; // 15% descuento
        return subtotal - descuento;
    };

    const obtenerSubtotal = () => {
        return carritoSeleccionado?.subtotal || 0;
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

const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        console.log('Procesando pago...', formData);
        console.log('Carrito seleccionado:', carritoSeleccionado);
        console.log('Fecha seleccionada para el pago:', fechaSeleccionada);
        
        // Aquí simularías el procesamiento del pago
        // Por ahora, asumimos que el pago fue exitoso
        
        // Actualizar el estado del carrito a "Pagado"
        if (carritoSeleccionado && carritoSeleccionado.id) {
            await actualizarEstadoCarrito(carritoSeleccionado.id, 'Pagado');
            console.log('Estado del carrito actualizado a "Pagado"');
            
            // Mostrar mensaje de éxito
            alert('¡Pago procesado exitosamente!');
            
            // Cerrar el modal
            onClose();
            
            // Opcional: Recargar los carritos para actualizar la vista
            // obtenerCarritosPorFecha();
        } else {
            throw new Error('No se pudo identificar el carrito para actualizar');
        }
        
    } catch (error) {
        console.error('Error al procesar el pago:', error);
        alert('Error al procesar el pago. Por favor, intenta nuevamente.');
    }
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

                        {/* Selector de Fecha */}
                        <FechaSelector
                            idCliente={idCliente}
                            fechaSeleccionada={fechaSeleccionada}
                            onFechaChange={handleFechaChange}
                        />

                        {/* Lista de Servicios */}
                        <div className="servicios-lista">
                            {error && (
                                <div style={{
                                    padding: '20px',
                                    textAlign: 'center',
                                    color: '#e74c3c',
                                    backgroundColor: '#ffeaea',
                                    border: '1px solid #f5c6cb',
                                    borderRadius: '4px',
                                    margin: '10px'
                                }}>
                                    {error}
                                </div>
                            )}

                            {loading && (
                                <div style={{
                                    padding: '20px',
                                    textAlign: 'center',
                                    color: '#666',
                                    fontStyle: 'italic'
                                }}>
                                    Cargando servicios...
                                </div>
                            )}

                            {!loading && !error && fechaSeleccionada && servicios.length > 0 ? (
                                servicios.map((servicio, index) => (
                                    <div key={servicio.id} className="servicio-item">
                                        <div className="servicio-numero">{index + 1}.</div>
                                        <div className="servicio-content">
                                            <div className="servicio-tipo">{servicio.tipo}</div>
                                            <div className="servicio-detalles">
                                                <div>Fecha: {servicio.fecha} - Hora: {servicio.hora}</div>
                                                <div>Profesional: {servicio.profesional}</div>
                                                {servicio.duracion && (
                                                    <div>Duración: {servicio.duracion} minutos</div>
                                                )}
                                                <div className="servicio-precio">
                                                    Precio: {formatearPrecio(servicio.precio)}
                                                </div>
                                                {servicio.comentarios && (
                                                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                                        Comentarios: {servicio.comentarios}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : !loading && !error && fechaSeleccionada && servicios.length === 0 ? (
                                <div style={{
                                    padding: '20px',
                                    textAlign: 'center',
                                    color: '#666',
                                    fontStyle: 'italic'
                                }}>
                                    No se encontraron servicios para esta fecha
                                </div>
                            ) : !loading && !error && !fechaSeleccionada ? (
                                <div style={{
                                    padding: '20px',
                                    textAlign: 'center',
                                    color: '#666',
                                    fontStyle: 'italic'
                                }}>
                                    Selecciona una fecha para ver los servicios
                                </div>
                            ) : null}
                        </div>
                        
                        <div className="separador"></div>

                        {/* Total y Botón */}
                        <div className="footer-section">
                            <div className="total-section">
                                <div className="total-text">
                                    SUBTOTAL: <span className="total-precio">
                                        {carritoSeleccionado ? formatearPrecio(obtenerSubtotal()) : '$0'}
                                    </span>
                                </div>
                                {carritoSeleccionado && obtenerSubtotal() > 0 && (
                                    <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                                        Total con descuento (15%): <span style={{ fontWeight: 'bold', color: '#4A3D3D' }}>
                                            {formatearPrecio(calcularTotal())}
                                        </span>
                                    </div>
                                )}
                                <div className='buttons-container'>
                                    <button 
                                        className="pago-efectivo-button"
                                        disabled={!carritoSeleccionado || obtenerSubtotal() === 0 || loading}
                                    >
                                        PAGO EN EFECTIVO
                                    </button>
                                    <button 
                                        className="pagar-button" 
                                        onClick={irAPagoTarjeta}
                                        disabled={!carritoSeleccionado || obtenerSubtotal() === 0 || loading}
                                    >
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
                                        TOTAL: {carritoSeleccionado ? formatearPrecio(calcularTotal()) : '$0'}
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

export default CarritoCompleto;