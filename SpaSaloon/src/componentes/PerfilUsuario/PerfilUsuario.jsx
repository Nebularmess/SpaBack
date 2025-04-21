import React, { useState, useEffect } from 'react';
import Calendario from './Calendario.jsx';
import Boton from '../Formularios/boton.jsx';
import Etiqueta from '../Formularios/etiquetas.jsx';
import PopupConfirmacion from './popUp.jsx';
import PopupReprogramacion from './popUpReprogramacion.jsx';
import '../../styles/PerfilUsuario.css';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const PerfilUsuario = () => {
  const { user, loading: loadingAuth } = useAuth();
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarReprogramacion, setMostrarReprogramacion] = useState(false);
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
  const [cancelando, setCancelando] = useState(false);
  const [reprogramando, setReprogramando] = useState(false);

  // 🔄 Una vez que el contexto auth termine de cargar:
  useEffect(() => {
    if (loadingAuth) return;           // todavía estamos cargando el contexto
    if (!user || !user.id_cliente) {   // no hay usuario: cancelamos cualquier fetch y salimos
      setFechasConTurno([]);
      return setErrorTurnos('Por favor, inicia sesión para ver tus turnos');
    }

    // Hay usuario: traemos sus turnos
    cargarTurnos();
  }, [loadingAuth, user]);

  // Función para cargar los turnos del usuario
  const cargarTurnos = () => {
    if (!user || !user.id_cliente) return;
    
    setLoadingTurnos(true);
    setErrorTurnos(null);

    axios.get(`http://localhost:3001/api/turnos/${user.id_cliente}`)
      .then(res => {
        // Filtrar para mostrar solo los turnos no cancelados
        const turnosActivos = res.data.filter(turno => turno.estado !== 'Cancelado');
        setFechasConTurno(turnosActivos);
      })
      .catch(err => {
        console.error('Error al cargar turnos:', err);
        setErrorTurnos('No se pudieron cargar los turnos');
      })
      .finally(() => {
        setLoadingTurnos(false);
      });
  };

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
    
  // Manejadores para la reprogramación de turno
const handleReprogramar = () => {
  setMostrarReprogramacion(true);
};

const confirmarReprogramacion = (nuevosDatos) => {
  if (!turnoSeleccionado || !turnoSeleccionado.id_turno) {
    console.error('No hay turno seleccionado para reprogramar');
    setMostrarReprogramacion(false);
    return;
  }
  
  setReprogramando(true);
  
  console.log("Reprogramando turno con ID:", turnoSeleccionado.id_turno);
  console.log("Nuevos datos:", nuevosDatos);
  
  // La URL ahora está bien, usamos la ruta que añadimos al router
  axios.put(`http://localhost:3001/api/turnos/reprogramar/${turnoSeleccionado.id_turno}`, {
    fecha_hora: nuevosDatos.fechaCompleta
  })
    .then(response => {
      console.log('Reprogramación exitosa:', response.data);
      
      // Actualizamos el estado local de manera más segura
      // En lugar de intentar modificar el objeto directamente, mejor
      // recargamos todos los turnos para asegurar sincronización
      cargarTurnos();
      
      // Mostrar mensaje de éxito
      alert('El turno ha sido reprogramado exitosamente');
      
      // Cerrar el popup y la ventana de detalles
      setMostrarReprogramacion(false);
      setTurnoSeleccionado(null);
    })
    .catch(error => {
      console.error('Error al reprogramar el turno:', error.response?.data || error.message || error);
      
      // Mensaje de error más informativo si tenemos detalles específicos
      const errorMsg = error.response?.data?.error || 'No se pudo reprogramar el turno. Intente nuevamente más tarde.';
      alert(errorMsg);
    })
    .finally(() => {
      setReprogramando(false);
    });
};
  
  const cancelarReprogramacion = () => {
    setMostrarReprogramacion(false);
  };
  
  // Manejadores para la cancelación de turno
  const handleCancelar = () => {
    setMostrarConfirmacion(true);
  };
  
  const confirmarCancelacion = () => {
    if (!turnoSeleccionado || !turnoSeleccionado.id_turno) {
      console.error('No hay turno seleccionado para cancelar');
      setMostrarConfirmacion(false);
      return;
    }
    
    setCancelando(true);
    
    // Imprimimos información para depurar
    console.log("Cancelando turno con ID:", turnoSeleccionado.id_turno);
    
    // CORRECCIÓN: Ajustamos la URL para que coincida con la definición en el router
    // De '/id_turno/cancelar' a '/cancelar/id_turno'
    axios.put(`http://localhost:3001/api/turnos/cancelar/${turnoSeleccionado.id_turno}`)
      .then(response => {
        console.log('Respuesta exitosa:', response.data);
        
        // Quitar el turno cancelado del estado local de fechasConTurno
        setFechasConTurno(prevTurnos => 
          prevTurnos.filter(turno => turno.id_turno !== turnoSeleccionado.id_turno)
        );
        
        // Mostrar mensaje de éxito (opcional)
        alert('El turno ha sido cancelado exitosamente');
        
        // Cerrar el popup y la ventana de detalles
        setMostrarConfirmacion(false);
        setTurnoSeleccionado(null);
      })
      .catch(error => {
        console.error('Error al cancelar el turno:', error.response || error);
        // Mostrar un mensaje de error al usuario
        alert('No se pudo cancelar el turno. Intente nuevamente más tarde.');
      })
      .finally(() => {
        setCancelando(false);
      });
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
                text={reprogramando ? "Reprogramando..." : "Reprogramar"} 
                onClick={handleReprogramar}
                backgroundColor="#1565c0"
                hoverBackgroundColor="#0d47a1"
                disabled={reprogramando}
              />
              <Boton 
                text={cancelando ? "Cancelando..." : "Cancelar"} 
                onClick={handleCancelar}
                backgroundColor="#c62828"
                hoverBackgroundColor="#b71c1c"
                disabled={cancelando}
              />
              <button className="boton-cerrar" onClick={() => setTurnoSeleccionado(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Popup de confirmación para la cancelación */}
      {mostrarConfirmacion && turnoSeleccionado && (
        <PopupConfirmacion
          titulo="Confirmar Cancelación"
          mensaje={`¿Estás seguro que deseas cancelar el turno del ${turnoSeleccionado.fecha_hora.split('T')[0]} a las ${turnoSeleccionado.fecha_hora.split('T')[1].substring(0,5)}?`}
          submensaje="Esta acción no se puede deshacer."
          textoConfirmar="Sí, cancelar turno"
          textoCancelar="No, mantener turno"
          onConfirmar={confirmarCancelacion}
          onCancelar={cancelarConfirmacion}
          colorConfirmar="#c62828"
          hoverColorConfirmar="#b71c1c"
          colorCancelar="#757575"
          hoverColorCancelar="#616161"
        />
      )}
      
      {/* Popup de reprogramación */}
      {mostrarReprogramacion && turnoSeleccionado && (
        <PopupReprogramacion
          titulo="Reprogramar Turno"
          mensaje="Selecciona una nueva fecha y horario para tu turno:"
          turnoActual={turnoSeleccionado}
          onConfirmar={confirmarReprogramacion}
          onCancelar={cancelarReprogramacion}
          textoConfirmar="Confirmar nueva fecha"
          textoCancelar="Cancelar"
          colorConfirmar="#1565c0"
          hoverColorConfirmar="#0d47a1"
          colorCancelar="#757575"
          hoverColorCancelar="#616161"
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