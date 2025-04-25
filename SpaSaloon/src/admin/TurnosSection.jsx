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

    useEffect(() => {
        const fetchTurnos = async () => {
            try {
                const response = await fetch("http://localhost:3001/api/turnosAdmin"); // Cambia la URL si es necesario
                if (!response.ok) {
                    throw new Error("Error al obtener los turnos");
                }
                const data = await response.json();
                setTurnos(data); // Actualiza el estado con los turnos obtenidos
            } catch (error) {
                console.error("Error al cargar los turnos:", error);
                alert("No se pudieron cargar los turnos. Intenta nuevamente.");
            }
        };

        fetchTurnos();
    }, []);

    const handleAgregar = () => {
        setModo("crear");
        setFormulario({
            fecha: "",
            hora: "",
            profesional: "",
            cliente: "",
            servicio: "",
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

    const handleEliminar = () => {
        if (turnoSeleccionado && window.confirm("¿Eliminar este turno?")) {
            setTurnos(turnos.filter(t => t.id !== turnoSeleccionado.id));
            setTurnoSeleccionado(null);
        }
    };

    const handleGuardar = () => {
        if (modo === "crear") {
            const nuevo = { ...formulario, id: Date.now() };
            setTurnos([...turnos, nuevo]);
        } else {
            setTurnos(turnos.map(t => (t.id === formulario.id ? formulario : t)));
        }
        setMostrarModal(false);
        setTurnoSeleccionado(null);
    };

    const handleGenerarReporte = () => {
        alert("Generando reporte de turnos...");
        // lógica para generar el reporte
    };

    return (
        <div id="turnos">
            <h2>Turnos</h2>
            <button className="btn-agregar" onClick={handleAgregar}>
                Agregar Turno
            </button>

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
                    {turnos.map(t => (
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
                    ))}
                </tbody>
            </table>

            <div className="acciones-turno">
                <button className="btn-editar" disabled={!turnoSeleccionado} onClick={handleEditar}>
                    Editar
                </button>
                <button className="btn-eliminar" disabled={!turnoSeleccionado} onClick={handleEliminar}>
                    Eliminar
                </button>
                <div className="spacer"></div>
                <button className="btn-reporte" onClick={handleGenerarReporte}>
                    Generar Reporte
                </button>
            </div>

            <ModalForm 
                isOpen={mostrarModal} 
                onClose={() => setMostrarModal(false)} 
                title={`${modo === "crear" ? "Agregar" : "Editar"} Turno`}
                onSave={handleGuardar}
            >
                <input
                    type="date"
                    placeholder="Fecha"
                    value={formulario.fecha}
                    onChange={e => setFormulario({ ...formulario, fecha: e.target.value })}
                />
                <input
                    type="time"
                    placeholder="Hora"
                    value={formulario.hora}
                    onChange={e => setFormulario({ ...formulario, hora: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Profesional"
                    value={formulario.profesional}
                    onChange={e => setFormulario({ ...formulario, profesional: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Cliente"
                    value={formulario.cliente}
                    onChange={e => setFormulario({ ...formulario, cliente: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Servicio"
                    value={formulario.servicio}
                    onChange={e => setFormulario({ ...formulario, servicio: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Precio"
                    value={formulario.precio}
                    onChange={e => setFormulario({ ...formulario, precio: e.target.value })}
                />
            </ModalForm>
        </div>
    );
};

export default TurnosSection;