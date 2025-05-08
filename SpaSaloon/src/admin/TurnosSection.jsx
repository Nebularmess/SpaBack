import React, { useState, useEffect } from "react";
import ModalForm from "./ModalForm.jsx"; 
import DropdownCategorias from "./DropdownCat.jsx";
import DropdownServicios from "./DropdownServicios.jsx";
import DropdownClientes from "./DropdownClientes.jsx";
import FilterComponent from "./FilterComponent.jsx";

const TurnosSection = () => {
    const [turnos, setTurnos] = useState([]);
    const [turnosFiltrados, setTurnosFiltrados] = useState([]);
    const [modo, setModo] = useState("crear");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
    const [profesionales, setProfesionales] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formulario, setFormulario] = useState({
        fecha: "",
        hora: "",
        categoria: "",
        servicio: "",
        profesional: "",
        cliente_id: "",
        cliente: "",
        precio: "",
    });
    const [categorias, setCategorias] = useState([]);
    
    // Estados de turnos disponibles para filtrar
    const estadosTurnos = ['Solicitado', 'Cancelado', 'Realizado'];
    
    const fetchServicios = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            // Usamos una marca de tiempo para evitar caché
            const timestamp = new Date().getTime();
            const response = await fetch(`http://localhost:3001/api/serviciosAdm?_=${timestamp}`);
            
            if (!response.ok) {
                throw new Error("Error al obtener los servicios");
            }
            
            const data = await response.json();
            console.log("Servicios actualizados:", data);
            setServicios(data);
        } catch (error) {
            console.error("Error al cargar los servicios:", error);
            setError("No se pudieron cargar los servicios. Intenta nuevamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTurnos = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch("http://localhost:3001/api/turnosAdmin");
            if (!response.ok) {
                throw new Error("Error al obtener los turnos");
            }
            const data = await response.json();
            console.log("Turnos recibidos:", data);
            setTurnos(data);
            setTurnosFiltrados(data); // Inicialmente, turnos filtrados = todos los turnos
        } catch (error) {
            console.error("Error al cargar los turnos:", error);
            setError("No se pudieron cargar los turnos. Intenta nuevamente.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const fetchProfesionales = async () => {
        try {
            const res = await fetch("http://localhost:3001/api/profesionalesAdm");
            if (!res.ok) throw new Error("Error al obtener profesionales");
            const data = await res.json();
            setProfesionales(data);
        } catch (err) {
            console.error("Error cargando profesionales:", err);
        }
    };
    
    const fetchCategorias = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/categoriasAdm");
            if (!response.ok) throw new Error("Error al obtener categorias");
            const data = await response.json();
            setCategorias(data);
        } catch (error) {
            console.log("Error cargando categorias:", error);
            setError("No se pudieron cargar las categorias");
        }
    }

    useEffect(() => {
        fetchCategorias();
        fetchServicios();
        fetchProfesionales();
        fetchTurnos();
    }, []);

    // Función para manejar el cambio en el filtro
    const handleFilterChange = (filteredData) => {
        setTurnosFiltrados(filteredData);
    };

    const handleAgregar = () => {
        setModo("crear");
        setFormulario({
            fecha: "",
            hora: "",
            categoria: "",
            servicio: "",
            profesional: "",
            cliente_id: "",
            cliente: "",
            precio: "",
        });
        setMostrarModal(true);
    };

    const handleEditar = () => {
        if (turnoSeleccionado) {
            setModo("editar");
            setFormulario({ ...turnoSeleccionado });
            setMostrarModal(true);
        }
    };

    const handleEliminar = async () => {
        if (turnoSeleccionado && window.confirm("¿Está seguro que desea cancelar este turno?")) {
            try {
                setIsLoading(true);
                setError(null);
                
                console.log(`Cancelando turno ID: ${turnoSeleccionado.id}`);
                
                const response = await fetch(
                    `http://localhost:3001/api/turnosAdmin/estado/${turnoSeleccionado.id}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ estado: 'Cancelado' }),
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Error al cancelar el turno");
                }

                // Mostrar mensaje de éxito
                alert("Turno cancelado correctamente");
                
                // Recargar los turnos
                await fetchTurnos();
                
                // Limpiar la selección
                setTurnoSeleccionado(null);
            } catch (error) {
                console.error("Error al cancelar el turno:", error);
                setError(`No se pudo cancelar el turno: ${error.message}`);
                alert(`No se pudo cancelar el turno: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleGuardar = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            // Validar que todos los campos estén completos
            const camposRequeridos = ['fecha', 'hora', 'profesional', 'cliente', 'servicio'];
            const faltanCampos = camposRequeridos.filter(campo => !formulario[campo]);
            
            if (faltanCampos.length > 0) {
                throw new Error(`Por favor complete todos los campos obligatorios: ${faltanCampos.join(', ')}`);
            }
            
            // Obtener el precio del servicio seleccionado (si existe)
            let precioServicio = "";
            let id_servicio = formulario.servicio;
            
            if (formulario.servicio) {
                const servicioEncontrado = servicios.find(s => s.nombre === formulario.servicio);
                if (servicioEncontrado) {
                    precioServicio = servicioEncontrado.precio;
                    id_servicio = servicioEncontrado.id; // Obtener el ID del servicio
                }
            }
            
            // Preparar los datos para enviar al backend
            // Asegúrate de que los IDs sean numéricos o como los espera tu backend
            const datosFormateados = {
                id_cliente: typeof formulario.cliente === 'object' ? formulario.cliente.id : formulario.cliente,
                id_servicio: typeof formulario.servicio === 'object' ? formulario.servicio.id : id_servicio,
                id_profesional: typeof formulario.profesional === 'object' ? formulario.profesional.id : formulario.profesional,
                fecha: formulario.fecha,
                hora: formulario.hora,
                estado: 'Solicitado',
                precio: precioServicio,
                comentarios: formulario.comentarios || ''
            };
            
            console.log("Datos a enviar al backend:", datosFormateados);
            
            if (modo === "crear") {
                // Implementación de la creación de un nuevo turno
                const response = await fetch('http://localhost:3001/api/turnosAdmin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosFormateados)
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Error al crear el turno");
                }
                
                alert("Turno creado correctamente");
                await fetchTurnos();
            } else {
                // Editar turno existente
                console.log(`Actualizando turno ID: ${formulario.id}`, formulario);
                
                const datosActualizados = {
                    ...datosFormateados,
                    id: formulario.id
                };
                
                const response = await fetch(`http://localhost:3001/api/turnosAdmin/${formulario.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosActualizados)
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Error al actualizar el turno");
                }
                
                alert("Turno actualizado correctamente");
                await fetchTurnos();
            }
            
            setMostrarModal(false);
            setTurnoSeleccionado(null);
            
        } catch (error) {
            console.error("Error al guardar el turno:", error);
            setError(`Error al guardar el turno: ${error.message}`);
            alert(`Error al guardar el turno: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCategoriaChange = (categoriaId) => {
        setFormulario({ ...formulario, categoria: categoriaId });
    }
    
    const handleServicioChange = (servicio) => {
        setFormulario({ ...formulario, servicio });
        setServicioSeleccionado(servicio);
        
        // Actualizar el precio automáticamente al seleccionar el servicio
        const servicioEncontrado = servicios.find(s => s.nombre === servicio);
        if (servicioEncontrado) {
            setFormulario(prev => ({ ...prev, precio: servicioEncontrado.precio }));
        }
    }
    
    const handleClienteChange = (clienteId, nombreCompleto) => {
        setFormulario({
            ...formulario,
            cliente_id: clienteId,
            cliente: nombreCompleto
        });
    }
    
    const handleGenerarReporte = () => {
        alert("Generando reporte de turnos...");
        // Implementación del reporte de turnos (pendiente)
    };

    // Función para dar estilo al estado según su valor
    const getEstadoClass = (estado) => {
        switch (estado) {
            case 'Solicitado':
                return 'estado-solicitado';
            case 'Cancelado':
                return 'estado-cancelado';
            case 'Realizado':
                return 'estado-realizado';
            default:
                return '';
        }
    };

    return (
        <div id="turnos" className="turnos-container">
            <h2>Turnos</h2>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="turnos-header">
                <button className="btn-agregar" onClick={handleAgregar} disabled={isLoading}>
                    Agregar Turno
                </button>
                
                {/* Implementación del componente de filtro con filtro de estado */}
                <FilterComponent 
                    data={turnos} 
                    onFilterChange={handleFilterChange} 
                    searchField="cliente"
                    placeholder="Buscar por cliente..."
                    title="Filtrar turnos"
                    showStatusFilter={true}  // Habilitamos el filtro por estado
                    availableStatuses={estadosTurnos}  // Pasamos los estados disponibles
                />
            </div>

            {isLoading ? (
                <p>Cargando...</p>
            ) : (
                <div className="tabla-container">
                    <table className="tabla">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Profesional</th>
                                <th>Cliente</th>
                                <th>Servicio</th>
                                <th>Precio</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {turnosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center" }}>
                                        No hay turnos disponibles
                                    </td>
                                </tr>
                            ) : (
                                turnosFiltrados.map(t => (
                                    <tr
                                        key={t.id}
                                        onClick={() => setTurnoSeleccionado(t)}
                                        style={{
                                            backgroundColor: turnoSeleccionado?.id === t.id ? "#f0f0f0" : "white",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <td>{t.id}</td>
                                        <td>{t.fecha}</td>
                                        <td>{t.hora}</td>
                                        <td>{t.profesional}</td>
                                        <td>{t.cliente}</td>
                                        <td>{t.servicio}</td>
                                        <td>${t.precio}</td>
                                        <td className={getEstadoClass(t.estado)}>{t.estado}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="acciones-turno">
                <button 
                    className="btn-editar" 
                    disabled={!turnoSeleccionado || isLoading} 
                    onClick={handleEditar}
                >
                    Editar
                </button>
                <button 
                    className="btn-eliminar" 
                    disabled={!turnoSeleccionado || isLoading} 
                    onClick={handleEliminar}
                >
                    Cancelar Turno
                </button>
                <div className="spacer"></div>
                <button 
                    className="btn-reporte" 
                    onClick={handleGenerarReporte}
                    disabled={isLoading}
                >
                    Generar Reporte
                </button>
            </div>

            <ModalForm 
                isOpen={mostrarModal} 
                onClose={() => setMostrarModal(false)} 
                title={`${modo === "crear" ? "Agregar" : "Editar"} Turno`}
                onSave={handleGuardar}
            >
                <div className="form-group">
                <label htmlFor="fecha">Fecha:</label>
                <input
                    id="fecha"
                    type="date"
                    value={formulario.fecha}
                    onChange={e => setFormulario({ ...formulario, fecha: e.target.value })}
                    disabled={isLoading}
                    required
                />
                </div>

                <div className="form-group">
                <label htmlFor="hora">Hora:</label>
                <input
                    id="hora"
                    type="time"
                    value={formulario.hora}
                    onChange={e => setFormulario({ ...formulario, hora: e.target.value })}
                    disabled={isLoading}
                    required
                />
                </div>

                <DropdownCategorias
                value={formulario.categoria}
                onChange={handleCategoriaChange}
                />

                <DropdownServicios
                categoriaId={formulario.categoria}
                value={formulario.servicio}
                onChange={(servicio, nombreServicio) => {
                    handleServicioChange(servicio);
                }}
                />

                <div className="form-group">
                <label htmlFor="profesional">Profesional:</label>
                <select
                    id="profesional"
                    value={formulario.profesional}
                    onChange={e => setFormulario({ ...formulario, profesional: e.target.value })}
                    disabled={isLoading}
                    required
                >
                    <option value="">Seleccione un profesional</option>
                        {profesionales.map(prof => (
                            <option key={prof.id} value={prof.nombre}>
                                {prof.nombre}
                            </option>
                        ))}
                </select>
                </div>

                <DropdownClientes
                value={formulario.cliente_id}
                onChange={handleClienteChange}
                />
            </ModalForm>
        </div>
    );
};

export default TurnosSection;
