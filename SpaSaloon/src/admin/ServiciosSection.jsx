import React, { useState, useEffect } from "react";
import ModalForm from "./ModalForm.jsx";

const ServiciosSection = () => {
    const [servicios, setServicios] = useState([]);
    const [modo, setModo] = useState("crear");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
    const [formulario, setFormulario] = useState({
        nombre: "",
        categoria: "",
        tipo: "Individual",
        precio: "",
        descripcion: "",
    });
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const fetchServicios = async () => {
        try {
            setCargando(true);
            setError(null);
            const response = await fetch("http://localhost:3001/api/serviciosAdm");
            if (!response.ok) {
                throw new Error("Error al obtener los servicios");
            }
            const data = await response.json();
            setServicios(data);
        } catch (error) {
            console.error("Error al cargar los servicios:", error);
            setError("No se pudieron cargar los servicios. Intenta nuevamente.");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        fetchServicios();
    }, []);



    const handleEditar = () => {
        if (servicioSeleccionado) {
            setModo("editar");
            // Creamos una copia del servicio seleccionado sin incluir profesionales
            const { ...servicioSinProfesionales } = servicioSeleccionado;
            setFormulario(servicioSinProfesionales);
            setMostrarModal(true);
        }
    };

    const handleEliminar = async () => {
        if (servicioSeleccionado && window.confirm("¿Eliminar este servicio?")) {
            try {
                setCargando(true);
                const response = await fetch(`http://localhost:3001/api/serviciosAdm/${servicioSeleccionado.id}`, {
                    method: 'DELETE',
                });
                
                if (!response.ok) {
                    throw new Error("Error al eliminar el servicio");
                }
                
                // Actualizar la lista de servicios
                await fetchServicios();
                setServicioSeleccionado(null);
                
            } catch (error) {
                console.error("Error al eliminar el servicio:", error);
                alert("No se pudo eliminar el servicio. Intenta nuevamente.");
            } finally {
                setCargando(false);
            }
        }
    };

    const handleGuardar = async () => {
        try {
            setCargando(true);
            
            if (modo === "crear") {
                // Implementar la creación si es necesario
                const nuevo = { ...formulario, id: Date.now() };
                setServicios([...servicios, nuevo]);
            } else {
                // Actualizar el servicio en la base de datos
                const response = await fetch(`http://localhost:3001/api/serviciosAdm/${formulario.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formulario),
                });
                
                if (!response.ok) {
                    throw new Error("Error al actualizar el servicio");
                }
                
                // Actualizar la lista de servicios
                await fetchServicios();
            }
            
            setMostrarModal(false);
            setServicioSeleccionado(null);
            
        } catch (error) {
            console.error("Error al guardar el servicio:", error);
            alert("No se pudo guardar el servicio. Intenta nuevamente.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div id="servicios">
            <h2>Servicios</h2>

            {error && <div className="error-message">{error}</div>}
            {cargando && <div className="loading">Cargando...</div>}

            <table className="tabla">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Tipo</th>
                        <th>Precio</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    {servicios.map(servicio => (
                        <tr
                            key={servicio.id}
                            onClick={() => setServicioSeleccionado(servicio)}
                            style={{
                                backgroundColor:
                                    servicioSeleccionado?.id === servicio.id ? "#f0f0f0" : "white",
                                cursor: "pointer",
                            }}
                        >
                            <td>{servicio.id}</td>
                            <td>{servicio.nombre}</td>
                            <td>{servicio.categoria}</td>
                            <td>{servicio.tipo}</td>
                            <td>${servicio.precio}</td>
                            <td>{servicio.descripcion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="acciones-turno">
                <button
                    className="btn-editar"
                    disabled={!servicioSeleccionado || cargando}
                    onClick={handleEditar}
                >
                    Editar
                </button>
                <button
                    className="btn-eliminar"
                    disabled={!servicioSeleccionado || cargando}
                    onClick={handleEliminar}
                >
                    Eliminar
                </button>
            </div>

            <ModalForm isOpen={mostrarModal} onClose={() => setMostrarModal(false)} title={`${modo === "crear" ? "Agregar" : "Editar"} Servicio`}>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={formulario.nombre}
                    onChange={e => setFormulario({ ...formulario, nombre: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Categoría"
                    value={formulario.categoria}
                    onChange={e => setFormulario({ ...formulario, categoria: e.target.value })}
                />
                <select
                    value={formulario.tipo}
                    onChange={e => setFormulario({ ...formulario, tipo: e.target.value })}
                >
                    <option value="Individual">Individual</option>
                    <option value="Grupal">Grupal</option>
                </select>
                <input
                    type="number"
                    placeholder="Precio"
                    value={formulario.precio}
                    onChange={e => setFormulario({ ...formulario, precio: e.target.value })}
                />
                <textarea
                    placeholder="Descripción"
                    value={formulario.descripcion}
                    onChange={e => setFormulario({ ...formulario, descripcion: e.target.value })}
                ></textarea>
                <button className="btn-guardar" onClick={handleGuardar}>
                    Guardar
                </button>
            </ModalForm>
        </div>
    );
};

export default ServiciosSection;