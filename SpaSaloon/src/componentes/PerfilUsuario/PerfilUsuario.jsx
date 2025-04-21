import React, { useState, useEffect } from 'react';
import Calendario from './Calendario.jsx';
import Boton from '../Formularios/boton.jsx';
import Etiqueta from '../Formularios/etiquetas.jsx';
import PopupConfirmacion from './popUp.jsx'; // Importamos el componente de popup
import '../../styles/PerfilUsuario.css';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const PerfilUsuario = () => {
  const { user, loading: loadingAuth } = useAuth();
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [datosUsuario, setDatosUsuario] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
  });
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [editando, setEditando] = useState(false);
  const [fechasConTurno, setFechasConTurno] = useState([]);
  const [loadingTurnos, setLoadingTurnos] = useState(false);
  const [errorTurnos, setErrorTurnos] = useState(null);

  // 🔄 Una vez que el contexto auth termine de cargar:
  useEffect(() => {
    if (loadingAuth) return;           // todavía estamos cargando el contexto
    if (!user || !user.id_cliente) {   // no hay usuario: cancelamos cualquier fetch y salimos
      setFechasConTurno([]);
      return setErrorTurnos('Por favor, inicia sesión para ver tus turnos');
    }

    // Hay usuario: traemos sus turnos
    setLoadingTurnos(true);
    setErrorTurnos(null);

    axios.get(`http://localhost:3001/api/turnos/${user.id_cliente}`)
      .then(res => {
        setFechasConTurno(res.data);
      })
      .catch(err => {
        console.error('Error al cargar turnos:', err);
        setErrorTurnos('No se pudieron cargar los turnos');
      })
      .finally(() => {
        setLoadingTurnos(false);
      });
  }, [loadingAuth, user]);

  // Carga de datos estáticos del usuario (si vienen de otra parte)
  useEffect(() => {
    if (user && user.nombre) {
      setDatosUsuario(prev => ({
        ...prev,
        nombre: user.nombre,
        // email, teléfono, dirección podrías traerlos de una API similar
      }));
    }
  }, [user]);

  // Handlers
  const handleDateChange = date => setFechaSeleccionada(date);
  const handleTurnoClick = (fecha) => {
    const turno = fechasConTurno.find(t => t.fecha_hora.startsWith(fecha));
    if (turno) {
      setTurnoSeleccionado(turno);
    }
  };
  const handleReprogramar = () => console.log('Reprogramando para:', fechaSeleccionada);
  
  // Manejadores para la cancelación de turno
  const handleCancelar = () => {
    setMostrarConfirmacion(true);
  };
  
  const confirmarCancelacion = () => {
    console.log('Cancelando turno:', turnoSeleccionado.id);
    // Aquí iría la lógica para cancelar el turno en la API
    // axios.delete(`http://localhost:3001/api/turnos/${turnoSeleccionado.id}`)
    //   .then(() => {
    //     // Actualizar la lista de turnos
    //     setFechasConTurno(fechasConTurno.filter(t => t.id !== turnoSeleccionado.id));
    //   })
    //   .catch(err => console.error('Error al cancelar turno:', err));
    
    setMostrarConfirmacion(false);
    setTurnoSeleccionado(null); // Cierra la ventana de detalles
  };
  
  const cancelarConfirmacion = () => {
    setMostrarConfirmacion(false);
  };
  
  const handleEditar = () => setEditando(v => !v);
  const handleGuardar = () => {
    setEditando(false);
    console.log('Guardando datos:', datosUsuario);
  };
  const handleInputChange = e => {
    const { name, value } = e.target;
    setDatosUsuario(prev => ({ ...prev, [name]: value }));
  };

  // 🚦 Renders según estado
  if (loadingAuth) {
    return <div className="perfil-container">Cargando información de usuario…</div>;
  }

  if (errorTurnos && !user) {
    return <div className="perfil-container">{errorTurnos}</div>;
  }

  if (loadingTurnos) {
    return <div className="perfil-container">Cargando tus turnos…</div>;
  }
  
  return (
    <div className="perfil-container">
      {turnoSeleccionado && (
        <div className="modal-turno">
          <div className="modal-contenido">
            <h3>Detalle del Turno</h3>
            <p><strong>Fecha:</strong> {turnoSeleccionado.fecha_hora.split('T')[0]}</p>
            <p><strong>Hora:</strong> {turnoSeleccionado.fecha_hora.split('T')[1].substring(0,5)}</p>
            <p><strong>Servicio:</strong> {turnoSeleccionado.nombre_servicio || 'N/A'}</p>
            <p><strong>Profesional:</strong> {turnoSeleccionado.nombre_profesional || 'N/A'}</p>
            <div className="modal-botones">
              <Boton 
                text="Reprogramar" 
                onClick={handleReprogramar}
                backgroundColor="#1565c0"
                hoverBackgroundColor="#0d47a1"
              />
              <Boton 
                text="Cancelar" 
                onClick={handleCancelar}
                backgroundColor="#c62828"
                hoverBackgroundColor="#b71c1c"
              />
              <button className="boton-cerrar" onClick={() => setTurnoSeleccionado(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Usamos el componente PopupConfirmacion importado */}
      {mostrarConfirmacion && turnoSeleccionado && (
        <PopupConfirmacion
          titulo="Confirmar Cancelación"
          mensaje={`¿Estás seguro que deseas cancelar el turno del ${turnoSeleccionado.fecha_hora.split('T')[0]} a las ${turnoSeleccionado.fecha_hora.split('T')[1].substring(0,5)}?`}
          submensaje="Esta acción no se puede deshacer."
          textoConfirmar="Sí, cancelar turno"
          textoCancelar="No, mantener turno"
          onConfirmar={confirmarCancelacion}
          onCancelar={cancelarConfirmacion}
        />
      )}
      
      <div className="perfil-seccion turnos-seccion">
        <Etiqueta 
          text="Tus turnos" 
          fontSize="22px" 
          textColor="white" 
          padding="10px 0" 
          className="seccion-titulo"
        />

        {errorTurnos && <div className="error-turnos">{errorTurnos}</div>}

        <div className="turnos-contenido">
          <div className="turnos-calendario">
            <Calendario
              onDateChange={handleDateChange}
              onTurnoClick={handleTurnoClick}
              turnos={fechasConTurno.map(t => t.fecha_hora.split('T')[0])}
              backgroundColor="#0c3c6e"
              borderColor="#2a5f8f"
              headerBackgroundColor="#0a325d"
              headerTextColor="#ffffff"
              dayColor="#e0e0e0"
              selectedDayBackground="#1976d2"
              selectedDayColor="#ffffff"
              todayBackground="#2c5282"
              todayColor="#ffffff"
              weekendColor="#90caf9"
              disabledDayColor="#546e7a"
              fontSize="14px"
              borderRadius="8px"
            />
          </div>
        </div>
      </div>

      <div className="perfil-seccion datos-seccion">
        <Etiqueta 
          text="Datos personales" 
          fontSize="22px" 
          textColor="white" 
          padding="10px 0" 
          className="seccion-titulo"
        />
        <div className="datos-contenido">
          {editando ? (
            <div className="datos-formulario">
              {['nombre','email','telefono','direccion'].map(field => (
                <div key={field} className="dato-grupo">
                  <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                  <input 
                    type={field === 'email' ? 'email' : 'text'}
                    name={field}
                    value={datosUsuario[field] || ''}
                    onChange={handleInputChange}
                  />
                </div>
              ))}
              <Boton 
                text="Guardar" 
                onClick={handleGuardar}
                backgroundColor="#00897b"
                hoverBackgroundColor="#00796b"
              />
            </div>
          ) : (
            <div className="datos-visualizacion">
              {Object.entries(datosUsuario).map(([key, val]) => (
                <div key={key} className="dato-item">
                  <Etiqueta text={key.charAt(0).toUpperCase()+key.slice(1)} 
                           textColor="#90caf9" 
                           padding="4px 8px" 
                  />
                  <span>{val}</span>
                </div>
              ))}
            </div>
          )}
          {!editando && (
            <div className="datos-acciones">
              <Boton 
                text="Editar" 
                onClick={handleEditar}
                backgroundColor="#1565c0"
                hoverBackgroundColor="#0d47a1"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerfilUsuario;