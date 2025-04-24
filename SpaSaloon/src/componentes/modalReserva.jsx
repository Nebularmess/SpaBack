import React, { useState, useEffect } from "react";
import "../styles/modal.css";
import "../styles/modalReserva.css";
import axios from "axios";

const ModalReserva = ({
  servicio,
  opcionSeleccionada,
  onClose,
  onReservaConfirmada,
  clienteId,
}) => {
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [profesional, setProfesional] = useState("");
  const [profesionalId, setProfesionalId] = useState(null);
  const [paso, setPaso] = useState(1);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [profesionales, setProfesionales] = useState([]);
  const [servicioId, setServicioId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [horariosCargados, setHorariosCargados] = useState([]);
  const [turnosOcupados, setTurnosOcupados] = useState([]);

  // Cargar servicios para obtener el ID del servicio
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3001/api/servicios");
        const serviciosData = response.data;
        
        // Encontrar el ID del servicio basado en su nombre
        const servicioEncontrado = serviciosData.find(
          s => s.nombre.toLowerCase() === servicio.title.toLowerCase()
        );
        
        if (servicioEncontrado) {
          setServicioId(servicioEncontrado.id_servicio);
        } else {
          setError("No se encontró el servicio seleccionado");
        }
      } catch (err) {
        console.error("Error al cargar servicios:", err);
        setError("No se pudieron cargar los servicios. Por favor, intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    if (servicio && servicio.title) {
      fetchServicios();
    }
  }, [servicio]);

  useEffect(() => {
    const fetchProfesionales = async () => {
      if (!servicioId) {
        console.log("No se proporcionó un servicioId");
        return;
      }
  
      setLoading(true);
      try {
        console.log(`Llamando a la API con servicioId: ${servicioId}`);
        const response = await axios.get(`http://localhost:3001/api/profesionales/servicio/${servicioId}`);
        
        console.log("Respuesta de la API:", response.data);
        
        if (response.data && response.data.length > 0) {
          setProfesionales(response.data);
          setError(null); // limpiamos errores anteriores
        } else {
          setError("No hay profesionales disponibles para este servicio");
          setProfesionales([]); // limpiamos la lista en caso de respuesta vacía
        }
      } catch (err) {
        console.error("Error al cargar profesionales:", err);
        setError("No se pudieron cargar los profesionales. Por favor, intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };
  
    if (servicioId) {
      fetchProfesionales();
    }
  }, [servicioId]);
  

  // Función para verificar disponibilidad de horarios
  const verificarDisponibilidad = async (fecha) => {
    if (!servicioId) return;
    
    try {
      // Ejemplo de endpoint para verificar turnos ocupados para la fecha seleccionada
      // Esta función debería implementarse en tu backend
      const fechaStr = fecha.toISOString().split("T")[0];
      const response = await axios.get(`http://localhost:3001/api/turnos/disponibilidad`, {
        params: {
          fecha: fechaStr,
          id_servicio: servicioId
        }
      });
      
      // Actualizar el estado con los turnos ya ocupados
      // Esto es solo un ejemplo, adapta a tu estructura de datos
      if (response.data && response.data.turnosOcupados) {
        setTurnosOcupados(response.data.turnosOcupados);
      }
      
      // Ejemplo: horarios base para este servicio
      setHorariosCargados(true);
    } catch (err) {
      console.error("Error al verificar disponibilidad:", err);
      // Si falla, permitir todos los horarios por defecto
      setHorariosCargados(true);
    }
  };

  const handleFechaHoraSeleccionada = (nuevaFecha, nuevaHora) => {
    if (nuevaFecha) {
      const fechaStr = nuevaFecha.toISOString().split("T")[0];
      setFecha(fechaStr);
      setDiaSeleccionado(nuevaFecha);
      verificarDisponibilidad(nuevaFecha);
    }

    if (nuevaHora) {
      setHora(nuevaHora);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (paso === 1) {
      if (!fecha || !hora) {
        alert("Por favor selecciona fecha y hora para continuar.");
        return;
      }
      setPaso(2);
    } else {
      if (!profesionalId) {
        alert("Por favor selecciona un profesional.");
        return;
      }

      if (!clienteId) {
        alert("Debes iniciar sesión para reservar un turno.");
        return;
      }

      // Crear objeto con datos para la API
      const fechaHoraCompleta = `${fecha}T${hora}:00`;
      const duracionPredeterminada = opcionSeleccionada?.duracion || 60; // Duración en minutos

      const datosTurno = {
        id_cliente: clienteId,
        id_servicio: servicioId,
        id_profesional: profesionalId,
        fecha_hora: fechaHoraCompleta,
        duracion_minutos: duracionPredeterminada,
        comentarios: `Reserva para ${servicio.title} ${opcionSeleccionada ? `- ${opcionSeleccionada.nombre}` : ""}`
      };

      try {
        setLoading(true);
        // Llamada a la API para crear el turno
        const response = await axios.post("http://localhost:3001/api/turnos", datosTurno);
        
        // Si llegamos aquí, la reserva fue exitosa
        const detallesReserva = {
          id_turno: response.data.id_turno,
          servicio: servicio.title,
          opcion: opcionSeleccionada ? opcionSeleccionada.nombre : null,
          fecha,
          hora,
          profesional: profesional,
        };

        if (onReservaConfirmada) {
          onReservaConfirmada(detallesReserva);
        }

        alert(
          `Tu reserva para ${servicio.title} ${opcionSeleccionada ? `- ${opcionSeleccionada.nombre}` : ""
          } ha sido confirmada para el ${formatearFecha(
            fecha
          )} a las ${hora} con ${profesional}.`
        );
        setTimeout(onClose, 1000);
      } catch (err) {
        console.error("Error al crear el turno:", err);
        if (err.response && err.response.data && err.response.data.error) {
          setError(`Error: ${err.response.data.error}`);
        } else {
          setError("Hubo un problema al realizar la reserva. Por favor, intenta de nuevo.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const formatearFecha = (fechaString) => {
    const [año, mes, dia] = fechaString.split("-");
    const fecha = new Date(parseInt(año), parseInt(mes) - 1, parseInt(dia));
    return fecha.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const volverPaso = () => {
    setPaso(1);
  };

  const seleccionarProfesional = (prof) => {
    setProfesional(`${prof.nombre} ${prof.apellido}`);
    setProfesionalId(prof.id_profesional);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-reserva"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>

        {error && (
          <div className="error-mensaje">
            {error}
            <button onClick={() => setError(null)}>Cerrar</button>
          </div>
        )}

        <div className="modal-body">
          <div className="modal-image-container">
            <img
              src={servicio.imageSrc}
              alt={servicio.title}
              className="modal-img"
            />
            <div className="modal-image-overlay">
              <h2 className="modal-reserva-title">Reservar Turno</h2>
              <div className="modal-servicio-info">
                <h3>{servicio.title}</h3>
                {opcionSeleccionada && (
                  <p className="modal-opcion-elegida">
                    {opcionSeleccionada.nombre}
                  </p>
                )}
                <p className="modal-precio">
                  $
                  {opcionSeleccionada
                    ? opcionSeleccionada.precio
                    : servicio.precio}
                </p>
              </div>
            </div>
          </div>

          <div className="modal-details modal-reserva-details">
            <div className="modal-pasos-indicador">
              <div className={`paso ${paso >= 1 ? "activo" : ""}`}>
                1. Fecha y Hora
              </div>
              <div className="paso-separador"></div>
              <div className={`paso ${paso >= 2 ? "activo" : ""}`}>
                2. Profesional
              </div>
            </div>

            <form onSubmit={handleSubmit} className="modal-reserva-form">
              {paso === 1 ? (
                <div className="modal-paso modal-paso-1">
                  <div className="calendario-container">
                    <CalendarioPersonalizado
                      onSeleccionarFechaHora={handleFechaHoraSeleccionada}
                      fechaSeleccionada={diaSeleccionado}
                      horaSeleccionada={hora}
                      turnosOcupados={turnosOcupados}
                    />
                  </div>
                </div>
              ) : (
                <div className="modal-paso modal-paso-2">
                  <div className="form-group">
                    <label>Selecciona un profesional:</label>
                    
                    {loading ? (
                      <p>Cargando profesionales...</p>
                    ) : (
                      <div className="profesionales-grid">
                        {profesionales.length > 0 ? (
                          profesionales.map((prof) => (
                            <div
                              key={prof.id_profesional}
                              className={`profesional-card ${profesionalId === prof.id_profesional ? "seleccionado" : ""}`}
                              onClick={() => seleccionarProfesional(prof)}
                            >
                              <div className="profesional-avatar">
                                {prof.nombre.charAt(0)}
                              </div>
                              <div className="profesional-info">
                                <h4>{`${prof.nombre} ${prof.apellido}`}</h4>
                                <p>{servicio.title}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>No hay profesionales disponibles para este servicio.</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="resumen-reserva">
                    <h4>Resumen de la reserva</h4>
                    <p>
                      <strong>Servicio:</strong> {servicio.title}
                    </p>
                    {opcionSeleccionada && (
                      <p>
                        <strong>Opción:</strong> {opcionSeleccionada.nombre}
                      </p>
                    )}
                    <p>
                      <strong>Fecha:</strong> {formatearFecha(fecha)}
                    </p>
                    <p>
                      <strong>Hora:</strong> {hora}
                    </p>
                  </div>
                </div>
              )}

              <div className="modal-button-container">
                {paso === 2 && (
                  <button
                    type="button"
                    className="modal-volver-btn"
                    onClick={volverPaso}
                  >
                    Volver
                  </button>
                )}
                <button 
                  type="submit" 
                  className="modal-reservar-btn"
                  disabled={loading}
                >
                  {loading ? (
                    "Procesando..."
                  ) : paso === 1 ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ marginRight: "8px" }}
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                      Continuar
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ marginRight: "8px" }}
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      Confirmar Reserva
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const CalendarioPersonalizado = ({
  onSeleccionarFechaHora,
  fechaSeleccionada,
  horaSeleccionada,
  turnosOcupados = []
}) => {
  const today = new Date();
  const [fechaActual, setFechaActual] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [diaSeleccionado, setDiaSeleccionado] = useState(
    fechaSeleccionada || null
  );
  const [horaElegida, setHoraElegida] = useState(horaSeleccionada || null);

  const obtenerDiasDelMes = (fecha) => {
    const dias = [];
    const año = fecha.getFullYear();
    const mes = fecha.getMonth();
    const totalDias = new Date(año, mes + 1, 0).getDate();
    
    // Obtenemos el día de inicio del mes (0-6, siendo 0 domingo)
    const primerDia = new Date(año, mes, 1).getDay();
    
    // Para completar la primera semana con días del mes anterior
    const diasAnteriorMes = new Date(año, mes, 0).getDate();
    for (let i = primerDia - 1; i >= 0; i--) {
      dias.push({
        fecha: new Date(año, mes - 1, diasAnteriorMes - i),
        esDelMesActual: false
      });
    }

    // Días del mes actual
    for (let i = 1; i <= totalDias; i++) {
      const fechaDia = new Date(año, mes, i);
      dias.push({
        fecha: fechaDia,
        esDelMesActual: true,
        esPasado: fechaDia < today
      });
    }

    return dias;
  };

  const cambiarMes = (offset) => {
    const nuevoMes = new Date(fechaActual);
    nuevoMes.setMonth(fechaActual.getMonth() + offset);
    setFechaActual(new Date(nuevoMes.getFullYear(), nuevoMes.getMonth(), 1));
  };

  const seleccionarDia = (dia) => {
    // No permitir seleccionar días en el pasado
    if (dia.getTime() < new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) {
      return;
    }
    
    setDiaSeleccionado(dia);
    onSeleccionarFechaHora(dia, horaElegida);
  };

  const seleccionarHora = (hora) => {
    setHoraElegida(hora);
    onSeleccionarFechaHora(diaSeleccionado, hora);
  };

  const estaHoraOcupada = (hora) => {
    // Verificar si la hora está en la lista de turnos ocupados
    if (!diaSeleccionado) return false;
    
    const fechaStr = diaSeleccionado.toISOString().split('T')[0];
    const horaStr = hora;
    
    return turnosOcupados.some(turno => {
      const turnoFecha = new Date(turno.fecha_hora).toISOString().split('T')[0];
      const turnoHora = new Date(turno.fecha_hora).toTimeString().substring(0, 5);
      return turnoFecha === fechaStr && turnoHora === horaStr;
    });
  };

  const dias = obtenerDiasDelMes(fechaActual);
  const nombreMes = fechaActual.toLocaleString("es-ES", {
    month: "long",
    year: "numeric",
  });

  const horarios = {
    mañana: ["08:00", "09:00", "10:00", "11:00", "12:00"],
    tarde: ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
    noche: ["19:00", "20:00", "21:00"],
  };

  return (
    <div className="calendario-custom">
      <h4 className="titulo-seleccion">
        Seleccioná fecha y hora de tu servicio
      </h4>
      <br />
      <div className="encabezado">
        <button type="button" onClick={() => cambiarMes(-1)}>
          ←
        </button>
        <h5>{nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)}</h5>
        <button type="button" onClick={() => cambiarMes(1)}>
          →
        </button>
      </div>

      <div className="dias-scroll">
        {dias.map((dia, i) => (
          <div
            className={`dia 
              ${!dia.esDelMesActual ? "otro-mes" : ""} 
              ${dia.esPasado ? "pasado" : ""} 
              ${diaSeleccionado?.toDateString() === dia.fecha.toDateString() ? "seleccionado" : ""}
            `}
            key={i}
            onClick={() => dia.esDelMesActual && !dia.esPasado && seleccionarDia(dia.fecha)}
          >
            {dia.fecha.getDate()}
          </div>
        ))}
      </div>
      <br />
      {diaSeleccionado && (
        <div className="horarios">
          <h5>
            Horarios disponibles para el{" "}
            {diaSeleccionado.toLocaleDateString("es-ES")}:
          </h5>

          {Object.entries(horarios).map(([turno, horas]) => (
            <div className="bloque-horario" key={turno}>
              <h6>{turno.charAt(0).toUpperCase() + turno.slice(1)}</h6>
              <div className="horarios-lista">
                {horas.map((hora, i) => {
                  const ocupado = estaHoraOcupada(hora);
                  return (
                    <button
                      type="button"
                      key={i}
                      className={`horario-btn 
                        ${horaElegida === hora ? "seleccionado" : ""}
                        ${ocupado ? "ocupado" : ""}
                      `}
                      onClick={() => !ocupado && seleccionarHora(hora)}
                      disabled={ocupado}
                    >
                      {hora}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModalReserva;