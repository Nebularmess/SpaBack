import React, { useState, useEffect } from 'react';
import Calendario from './Calendario.jsx';
import Boton from '../Formularios/boton.jsx';
import Etiqueta from '../Formularios/etiquetas.jsx';
import '../../styles/PerfilUsuario.css';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const PerfilUsuario = () => {
  const { user, loading: loadingAuth } = useAuth();
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
        const fechas = res.data.map(t => t.fecha_hora.split('T')[0]);
        setFechasConTurno(fechas);
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
  const handleReprogramar = () => console.log('Reprogramando para:', fechaSeleccionada);
  const handleCancelar   = () => console.log('Cancelando turno');
  const handleEditar     = () => setEditando(v => !v);
  const handleGuardar    = () => {
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
              turnos={fechasConTurno}
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
          <div className="turnos-acciones">
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

