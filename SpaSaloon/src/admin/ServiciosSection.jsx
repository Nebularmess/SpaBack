import React, { useState, useEffect } from "react";
import ModalForm from "./ModalForm.jsx"; // Asegurate de tener este modal

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
        profesionales: "",
    });

    useEffect(() => {
            const fetchServicios = async () => {
                try {
                    const response = await fetch("http://localhost:3001/api/serviciosAdm"); // Cambia la URL si es necesario
                    if (!response.ok) {
                        throw new Error("Error al obtener los turnos");
                    }
                    const data = await response.json();
                    setServicios(data); // Actualiza el estado con los turnos obtenidos
                } catch (error) {
                    console.error("Error al cargar los servicios:", error);
                    alert("No se pudieron cargar los servicios. Intenta nuevamente.");
                }
            };
    
            fetchServicios();
        }, []);


    const handleAgregar = () => {
        setModo("crear");
        setFormulario({
            nombre: "",
            categoria: "",
            tipo: "",
            precio: "",
            descripcion: "",
            profesionales: "",
        });
        setMostrarModal(true);
    };

    const handleEditar = () => {
        if (servicioSeleccionado) {
            setModo("editar");
            setFormulario({ ...servicioSeleccionado });
            setMostrarModal(true);
        }
    };

    const handleEliminar = () => {
        if (servicioSeleccionado && window.confirm("¿Eliminar este servicio?")) {
            setServicios(servicios.filter(s => s.id !== servicioSeleccionado.id));
            setServicioSeleccionado(null);
        }
    };

    const handleGuardar = () => {
        if (modo === "crear") {
            const nuevo = { ...formulario, id: Date.now() };
            setServicios([...servicios, nuevo]);
        } else {
            setServicios(servicios.map(s => (s.id === formulario.id ? formulario : s)));
        }
        setMostrarModal(false);
        setServicioSeleccionado(null);
    };

    return (
        <div id="servicios">
            <h2>Servicios</h2>
            <button className="btn-agregar" onClick={handleAgregar}>
                Agregar Servicio
            </button>

            <table className="tabla">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Tipo</th>
                        <th>Precio</th>
                        <th>Profesionales</th>
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
                            <td>{servicio.profesionales}</td>
                            <td>{servicio.descripcion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="acciones-turno">
                <button
                    className="btn-editar"
                    disabled={!servicioSeleccionado}
                    onClick={handleEditar}
                >
                    Editar
                </button>
                <button
                    className="btn-eliminar"
                    disabled={!servicioSeleccionado}
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
                <input
                    type="text"
                    placeholder="Profesionales"
                    value={formulario.profesionales}
                    onChange={e => setFormulario({ ...formulario, profesionales: e.target.value })}
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