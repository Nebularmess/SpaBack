import React, { useEffect, useState } from "react";
import ModalForm from "./ModalForm.jsx";
import DropdownCategorias from "./dropDownCat.jsx";
import DropdownServicios from "./dropDownServicios.jsx";

const ProfesionalesSection = () => {
    const [profesionales, setProfesionales] = useState([]);
    const [modo, setModo] = useState("crear");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [profesionalSeleccionado, setProfesionalSeleccionado] = useState(null);
    const [formulario, setFormulario] = useState({
        nombre: "",
        apellido: "",
        categoria: "",
        servicio: "",
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
           const actualizarProfesional = async (profesionalEditado) => {
            try {
                const response = await fetch(`http://localhost:3001/api/profesionalesAdm/${profesionalEditado.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(profesionalEditado),
                });

                if (!response.ok) {
                    throw new Error('Error al actualizar el profesional');
                }

                return await response.json();
            } catch (error) {
                console.error('Error al actualizar el profesional:', error);
                throw error;
            }
        };
        const eliminarProfesional = async (id) => {
            try {
                const response = await fetch(`http://localhost:3001/api/profesionalesAdm/${id}`, {
                    method: 'DELETE',
                });
        
                if (!response.ok) {
                    throw new Error('Error al eliminar el profesional');
                }
        
                return await response.json();
            } catch (error) {
                console.error('Error al eliminar el profesional:', error);
                throw error;
            }
        };


    const handleAgregar = () => {
        setModo("crear");
        setFormulario({
            nombre: "",
            apellido: "",
            categoria: "",
            servicio: "",
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

    const handleGuardar = async () => {
        try {
            if (modo === "crear") {
                // Lógica para crear un nuevo profesional
                // Puedes implementar esto de manera similar a la función de actualizar
                const nuevo = { ...formulario, id: Date.now() };
                setProfesionales([...profesionales, nuevo]);
            } else {
                // Lógica para editar un profesional existente
                await actualizarProfesional(formulario);
                
                // Actualizar la lista de profesionales localmente
                setProfesionales(profesionales.map(p => (p.id === formulario.id ? formulario : p)));
            }
            setMostrarModal(false);
            setProfesionalSeleccionado(null);
        } catch (error) {
            alert("Error al guardar los cambios: " + error.message);
        }
    };
    const handleEliminar = async () => {
        if (!profesionalSeleccionado) return;
        
        if (window.confirm("¿Estás seguro de querer eliminar a este profesional?")) {
            try {
                await eliminarProfesional(profesionalSeleccionado.id);
                
                // Remover el profesional de la lista mostrada en UI
                setProfesionales(profesionales.filter(p => p.id !== profesionalSeleccionado.id));
                
                setProfesionalSeleccionado(null);
                alert("Profesional eliminado correctamente");
            } catch (error) {
                alert("Error al eliminar el profesional: " + error.message);
            }
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
                            <td>{p.servicio}</td>
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
                <DropdownCategorias 
                    value={formulario.categoria} 
                    onChange={(valor) => setFormulario({ ...formulario, categoria: valor, servicio: "" })}
                />
                <DropdownServicios
                    categoriaId={formulario.categoria}
                    value={formulario.servicio}
                    onChange={(valor) => setFormulario({ ...formulario, servicio: valor })}
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
                <button className="btn-guardar" onClick={handleGuardar}>
                    Guardar
                </button>
            </ModalForm>
        </div>
    );
};

export default ProfesionalesSection;