import React, { useEffect, useState } from "react";
import ModalForm from "./ModalForm.jsx";

const ProfesionalesSection = () => {
    const [profesionales, setProfesionales] = useState([]);
    const [modo, setModo] = useState("crear");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [profesionalSeleccionado, setProfesionalSeleccionado] = useState(null);
    const [formulario, setFormulario] = useState({
        nombre: "",
        apellido: "",
        servicios: "",
        activo: "",
        email: "",
        telefono: "" ,
    });

    useEffect(() => {
               const fetchProfesionales = async () => {
                   try {
                       const response = await fetch("http://localhost:3001/api/profesionalesAdm"); // Cambia la URL si es necesario
                       if (!response.ok) {
                           throw new Error("Error al obtener los profesionales");
                       }
                       const data = await response.json();
                       setProfesionales(data); // Actualiza el estado con los pros obtenidos
                   } catch (error) {
                       console.error("Error al cargar los mas capos del rubro:", error);
                       alert("No se pudieron cargar la info de los cracks. Intenta nuevamente.");
                   }
               };
       
               fetchProfesionales();
           }, []);

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

    const handleGuardar = async () => {
        const nuevoProfesional = {
            nombre: formulario.nombre,
            apellido: formulario.apellido,
            servicio: formulario.servicios, // Asegúrate de enviar el ID del servicio
            activo: formulario.activo === "1" || formulario.activo === 1 ? 1 : 0,
            email: formulario.email,
            telefono: formulario.telefono,
        };
        
        console.log("Datos enviados al backend:", nuevoProfesional);

        try {
            let response;
            if (modo === "crear") {
                response = await fetch("http://localhost:3001/api/profesionalesAdm", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(nuevoProfesional),
                });
            } else {
                response = await fetch(`http://localhost:3001/api/profesionalesAdm/${formulario.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(nuevoProfesional),
                });
            }
    
            if (!response.ok) {
                throw new Error("Error al guardar el profesional");
            }
    
            const data = await response.json();
            if (modo === "crear") {
                setProfesionales([...profesionales, { ...nuevoProfesional, id: data.id }]); // Agrega el nuevo profesional
            } else {
                setProfesionales(
                    profesionales.map(p => (p.id === formulario.id ? { ...nuevoProfesional, id: formulario.id } : p))
                ); // Actualiza el profesional existente
            }
    
            setMostrarModal(false);
            setProfesionalSeleccionado(null);
        } catch (error) {
            console.error(error);
            alert("Hubo un error al guardar el profesional");
        }
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

            <ModalForm isOpen={mostrarModal} onClose={() => setMostrarModal(false)} onSave={handleGuardar} title={`${modo === "crear" ? "Agregar" : "Editar"} Profesional`}>
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