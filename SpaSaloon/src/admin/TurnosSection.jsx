import React, { useState, useEffect } from "react";
import ModalForm from "./ModalForm.jsx"; 

const TurnosSection = () => {
    const [turnos, setTurnos] = useState([]);
    const [modo, setModo] = useState("crear");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
    const [formulario, setFormulario] = useState({
        fecha: "",
        hora: "",
        profesional: "",
        cliente: "",
        servicio: "",
        precio: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTurnos = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch("http://localhost:3001/api/turnosAdmin");
            if (!response.ok) {
                throw new Error("Error al obtener los turnos");
            }
            const data = await response.json();
            setTurnos(data);
        } catch (error) {
            console.error("Error al cargar los turnos:", error);
            setError("No se pudieron cargar los turnos. Intenta nuevamente.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTurnos();
    }, []);


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
            
            if (modo === "crear") {
                // Lógica para crear un nuevo turno
                alert("Funcionalidad de crear turno aún no implementada");
                setMostrarModal(false);
                return;
            } else {
                // Editar turno existente
                console.log(`Actualizando turno ID: ${formulario.id}`, formulario);
                
                const response = await fetch(`http://localhost:3001/api/turnosAdmin/${formulario.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formulario)
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

    const handleGenerarReporte = () => {
        alert("Generando reporte de turnos...");
        alert("reporte enviado por mail")
        // lógica para generar el reporte
    };

    return (
        <div id="turnos" className="turnos-container">
            <h2>Turnos</h2>
            
            {error && <div className="error-message">{error}</div>}

            {isLoading ? (
                <p>Cargando...</p>
            ) : (
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
                        </tr>
                    </thead>
                    <tbody>
                        {turnos.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center" }}>
                                    No hay turnos disponibles
                                </td>
                            </tr>
                        ) : (
                            turnos.map(t => (
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
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
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
                
                <div className="form-group">
                    <label htmlFor="profesional">Profesional:</label>
                    <input
                        id="profesional"
                        type="text"
                        value={formulario.profesional}
                        onChange={e => setFormulario({ ...formulario, profesional: e.target.value })}
                        disabled={isLoading}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="cliente">Cliente:</label>
                    <input
                        id="cliente"
                        type="text"
                        value={formulario.cliente}
                        onChange={e => setFormulario({ ...formulario, cliente: e.target.value })}
                        disabled={isLoading}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="servicio">Servicio:</label>
                    <input
                        id="servicio"
                        type="text"
                        value={formulario.servicio}
                        onChange={e => setFormulario({ ...formulario, servicio: e.target.value })}
                        disabled={isLoading}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="precio">Precio:</label>
                    <input
                        id="precio"
                        type="number"
                        value={formulario.precio}
                        onChange={e => setFormulario({ ...formulario, precio: e.target.value })}
                        disabled={isLoading}
                    />
                </div>
            </ModalForm>
        </div>
    );
};

export default TurnosSection;