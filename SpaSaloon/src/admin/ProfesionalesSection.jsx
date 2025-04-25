import React, { useState } from "react";
import ModalForm from "./ModalForm.jsx";

const ProfesionalesSection = () => {
    const [profesionales, setProfesionales] = useState([
        {
            id: 1,
            nombre: "Ana",
            apellido: "López",
            servicios: "Masajes relajantes, Reflexología",
            activo: "1",
            email: "ana@example.com",
            telefono: "123456789",
        },
    ]);

    const [modo, setModo] = useState("crear");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [profesionalSeleccionado, setProfesionalSeleccionado] = useState(null);
    const [formulario, setFormulario] = useState({
        nombre: "",
        apellido: "",
        servicios: "",
        activo: "",
        email: "",
        telefono: "",
    });

    const handleAgregar = () => {
        setModo("crear");
        setFormulario({
            nombre: "",
            apellido: "",
            servicios: "",
            activo: "",
            email: "",
            telefono: "",
        });
        setMostrarModal(true);
    };

    const handleEditar = () => {
        if (profesionalSeleccionado) {
            setModo("editar");
            setFormulario({ ...profesionalSeleccionado });
            setMostrarModal(true);
        }
    };

    const handleEliminar = () => {
        if (profesionalSeleccionado && window.confirm("¿Eliminar este profesional?")) {
            setProfesionales(profesionales.filter(p => p.id !== profesionalSeleccionado.id));
            setProfesionalSeleccionado(null);
        }
    };

    const handleGuardar = () => {
        if (modo === "crear") {
            const nuevo = { ...formulario, id: Date.now() };
            setProfesionales([...profesionales, nuevo]);
        } else {
            setProfesionales(profesionales.map(p => (p.id === formulario.id ? formulario : p)));
        }
        setMostrarModal(false);
        setProfesionalSeleccionado(null);
    };

    return (
        <div id="profesionales">
            <h2>Profesionales</h2>
            <button className="btn-agregar" onClick={handleAgregar}>
                Agregar Profesional
            </button>

            <table className="tabla">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Servicios</th>
                        <th>Activo</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                    </tr>
                </thead>
                <tbody>
                    {profesionales.map(p => (
                        <tr
                            key={p.id}
                            onClick={() => setProfesionalSeleccionado(p)}
                            style={{
                                backgroundColor: profesionalSeleccionado?.id === p.id ? "#f0f0f0" : "white",
                                cursor: "pointer",
                            }}
                        >
                            <td>{p.id}</td>
                            <td>{p.nombre}</td>
                            <td>{p.apellido}</td>
                            <td>{p.servicios}</td>
                            <td>{p.activo}</td>
                            <td>{p.email}</td>
                            <td>{p.telefono}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="acciones-turno">
                <button className="btn-editar" disabled={!profesionalSeleccionado} onClick={handleEditar}>
                    Editar
                </button>
                <button className="btn-eliminar" disabled={!profesionalSeleccionado} onClick={handleEliminar}>
                    Eliminar
                </button>
            </div>

            <ModalForm isOpen={mostrarModal} onClose={() => setMostrarModal(false)} title={`${modo === "crear" ? "Agregar" : "Editar"} Profesional`}>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={formulario.nombre}
                    onChange={e => setFormulario({ ...formulario, nombre: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Apellido"
                    value={formulario.apellido}
                    onChange={e => setFormulario({ ...formulario, apellido: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Servicios que ofrece"
                    value={formulario.servicios}
                    onChange={e => setFormulario({ ...formulario, servicios: e.target.value })}
                />
                <select
                    value={formulario.activo}
                    onChange={e => setFormulario({ ...formulario, activo: e.target.value })}
                >
                    <option value="1">1</option>
                    <option value="0">0</option>
                </select>
                <input
                    type="email"
                    placeholder="Email"
                    value={formulario.email}
                    onChange={e => setFormulario({ ...formulario, email: e.target.value })}
                />
                <input
                    type="tel"
                    placeholder="Teléfono"
                    value={formulario.telefono}
                    onChange={e => setFormulario({ ...formulario, telefono: e.target.value })}
                />
            </ModalForm>
        </div>
    );
};

export default ProfesionalesSection;