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
    const [profesionalesFiltrados, setProfesionalesFiltrados] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formulario, setFormulario] = useState({
        fecha: "",
        hora: "",
        categoria: "",
        servicio: "",
        profesional_id: "", 
        profesional_nombre: "", 
        cliente_id: "", 
        cliente_nombre: "", 
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
            
            // Mostramos la estructura completa para analizar
            console.log("Profesionales cargados:", data);
            console.log("Estructura detallada de profesionales:");
            data.forEach(prof => {
                console.log(`ID: ${prof.id}, Nombre: ${prof.nombre}, ID Servicio: ${prof.id_servicio} (${typeof prof.id_servicio})`);
            });
            
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

    // Función para filtrar profesionales según el servicio seleccionado
    useEffect(() => {
        if (formulario.servicio) {
            // Primero identificamos el ID del servicio seleccionado
            const servicioEncontrado = servicios.find(s => s.nombre === formulario.servicio);
            
            if (servicioEncontrado) {
                // Debug para ver el servicio encontrado y su ID
                console.log("Servicio encontrado:", servicioEncontrado);
                
                // Convertimos a números para comparación segura
                const servicioId = parseInt(servicioEncontrado.id, 10);
                
                // Filtramos los profesionales que brindan este servicio
                // Aseguramos que ambos son números o strings para comparación
                const profsFiltrados = profesionales.filter(p => {
                    const profServicioId = parseInt(p.id_servicio, 10);
                    const match = profServicioId === servicioId;
                    console.log(`Profesional ${p.nombre} (ID: ${p.id}) tiene id_servicio=${p.id_servicio} (${typeof p.id_servicio}), comparando con servicioId=${servicioId} (${typeof servicioId}): ${match}`);
                    return match;
                });
                
                console.log(`Profesionales filtrados para servicio ${servicioEncontrado.nombre} (ID: ${servicioId}):`, profsFiltrados);
                setProfesionalesFiltrados(profsFiltrados);
                
                // Si hay un profesional seleccionado pero no está en la lista filtrada, lo limpiamos
                if (formulario.profesional_id && !profsFiltrados.some(p => parseInt(p.id, 10) === parseInt(formulario.profesional_id, 10))) {
                    setFormulario({
                        ...formulario,
                        profesional_id: "",
                        profesional_nombre: ""
                    });
                }
            } else {
                console.log("No se encontró el servicio:", formulario.servicio);
                setProfesionalesFiltrados([]);
            }
        } else {
            // Si no hay servicio seleccionado, limpiamos la lista de profesionales
            console.log("No hay servicio seleccionado, limpiando profesionales filtrados");
            setProfesionalesFiltrados([]);
            
            // También limpiamos el profesional seleccionado
            if (formulario.profesional_id) {
                setFormulario({
                    ...formulario,
                    profesional_id: "",
                    profesional_nombre: ""
                });
            }
        }
    }, [formulario.servicio, servicios, profesionales]);

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
            profesional_id: "",
            profesional_nombre: "",
            cliente_id: "",
            cliente_nombre: "",
            precio: "",
        });
        setProfesionalesFiltrados([]); // Limpiamos los profesionales filtrados
        setMostrarModal(true);
    };

    const handleEditar = () => {
        if (turnoSeleccionado) {
            setModo("editar");
            console.log("Editando turno:", turnoSeleccionado);
            
            // Aquí aseguramos que cliente_id, cliente_nombre, profesional_id y profesional_nombre se establezcan correctamente
            setFormulario({
                ...turnoSeleccionado,
                cliente_id: turnoSeleccionado.cliente_id || "",
                cliente_nombre: turnoSeleccionado.cliente || "",
                profesional_id: turnoSeleccionado.profesional_id || "",
                profesional_nombre: turnoSeleccionado.profesional || ""
            });
            
            // Filtrar profesionales según el servicio del turno seleccionado
            if (turnoSeleccionado.servicio) {
                console.log("Buscando servicio para filtrar profesionales:", turnoSeleccionado.servicio);
                const servicioEncontrado = servicios.find(s => s.nombre === turnoSeleccionado.servicio);
                
                if (servicioEncontrado) {
                    console.log("Servicio encontrado para filtrar:", servicioEncontrado);
                    const servicioId = parseInt(servicioEncontrado.id, 10);
                    
                    // Filtrar profesionales con conversión explícita de tipos
                    const profsFiltrados = profesionales.filter(p => {
                        const profServicioId = parseInt(p.id_servicio, 10);
                        return profServicioId === servicioId;
                    });
                    
                    console.log("Profesionales filtrados para edición:", profsFiltrados);
                    setProfesionalesFiltrados(profsFiltrados);
                } else {
                    console.log("No se encontró el servicio para el turno seleccionado");
                    setProfesionalesFiltrados([]);
                }
            } else {
                console.log("El turno no tiene servicio asociado");
                setProfesionalesFiltrados([]);
            }
            
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
            const camposRequeridos = ['fecha', 'hora', 'profesional_id', 'cliente_id', 'servicio'];
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
            
            // Asegurarnos de que id_cliente sea un número
            const id_cliente = parseInt(formulario.cliente_id, 10);
            
            if (isNaN(id_cliente)) {
                throw new Error("El ID del cliente no es válido. Por favor seleccione un cliente válido.");
            }
            
            // Asegurarnos de que id_profesional sea un número
            const id_profesional = parseInt(formulario.profesional_id, 10);
            
            if (isNaN(id_profesional)) {
                throw new Error("El ID del profesional no es válido. Por favor seleccione un profesional válido.");
            }
            
            // Preparar los datos para enviar al backend
            const datosFormateados = {
                id_cliente: id_cliente, // Aseguramos que es un número
                id_servicio: typeof id_servicio === 'object' ? id_servicio.id : id_servicio,
                id_profesional: id_profesional, // Aseguramos que es un número
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
        console.log("Servicio seleccionado:", servicio);
        
        // Actualizar el servicio y resetear profesional
        setFormulario({ 
            ...formulario, 
            servicio,
            profesional_id: "", 
            profesional_nombre: ""
        });
        setServicioSeleccionado(servicio);
        
        // Actualizar el precio automáticamente al seleccionar el servicio
        const servicioEncontrado = servicios.find(s => s.nombre === servicio);
        if (servicioEncontrado) {
            console.log("Servicio encontrado con precio:", servicioEncontrado.precio);
            setFormulario(prev => ({ 
                ...prev, 
                precio: servicioEncontrado.precio,
                profesional_id: "",
                profesional_nombre: ""
            }));
            
            // Filtrar profesionales directamente aquí para asegurar respuesta inmediata
            const servicioId = parseInt(servicioEncontrado.id, 10);
            const profesionalesPorServicio = profesionales.filter(p => 
                parseInt(p.id_servicio, 10) === servicioId
            );
            console.log("Profesionales filtrados por servicio inmediatamente:", profesionalesPorServicio);
            setProfesionalesFiltrados(profesionalesPorServicio);
        } else {
            console.log("No se encontró el servicio en la lista");
            setProfesionalesFiltrados([]);
        }
    }
    
    const handleClienteChange = (clienteId, nombreCompleto) => {
        // Aseguramos que el clienteId se almacena correctamente
        console.log("Cliente seleccionado - ID:", clienteId, "Nombre:", nombreCompleto);
        
        setFormulario({
            ...formulario,
            cliente_id: clienteId,
            cliente_nombre: nombreCompleto
        });
    }
    
    // Esta función se utilizará para actualizar el profesional cuando se integre el componente de dropdown de profesionales
    const handleProfesionalChange = (profesionalId, nombreProfesional) => {
        console.log("Profesional seleccionado - ID:", profesionalId, "Nombre:", nombreProfesional);
        
        setFormulario({
            ...formulario,
            profesional_id: profesionalId,
            profesional_nombre: nombreProfesional
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

                {/* Aquí irá el componente DropdownProfesionales en el futuro */}
                {/* <DropdownProfesionales 
                    servicioId={formulario.servicio ? servicioEncontrado?.id : null}
                    value={formulario.profesional_id}
                    onChange={handleProfesionalChange}
                    profesionales={profesionalesFiltrados}
                /> */}
                
                {/* Mostrar el nombre del profesional seleccionado */}
                {formulario.profesional_nombre && (
                    <div className="form-group">
                    <span className="profesional-seleccionado">
                        Profesional seleccionado: {formulario.profesional_nombre}
                    </span>
                    </div>
                )}

                <DropdownClientes
                value={formulario.cliente_id}
                onChange={handleClienteChange}
                />

                {/* Mostrar el nombre del cliente seleccionado */}
                {formulario.cliente_nombre && (
                    <div className="form-group">
                    <span className="cliente-seleccionado">
                        Cliente seleccionado: {formulario.cliente_nombre}
                    </span>
                    </div>
                )}
            </ModalForm>
        </div>
    );
};

export default TurnosSection;