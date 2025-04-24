import React, { useState, useEffect } from "react";
import "../styles/modal.css";
import "../styles/modalReserva.css";
import CalendarioCustom from "./calendar.jsx";

const ModalReserva = ({
  servicio,
  opcionSeleccionada,
  onClose,
  onReservaConfirmada,
}) => {
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [profesional, setProfesional] = useState("");
  const [paso, setPaso] = useState(1); 
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);

  const profesionales = [
    { id: 1, nombre: "Ana García", especialidad: "Masajista" },
    { id: 2, nombre: "Carlos Rodríguez", especialidad: "Terapeuta facial" },
    { id: 3, nombre: "Lucía Fernández", especialidad: "Esteticista" },
    { id: 4, nombre: "Miguel López", especialidad: "Instructor de yoga" },
  ];

  const profesionalesFiltrados = profesionales.filter((prof) => {
    if (servicio.title === "Masajes") return prof.especialidad === "Masajista";
    if (servicio.title === "Tratamientos faciales")
      return prof.especialidad === "Terapeuta facial";
    if (servicio.title === "Belleza")
      return prof.especialidad === "Esteticista";
    if (servicio.title === "Yoga")
      return prof.especialidad === "Instructor de yoga";
    return true;
  });

  const handleFechaHoraSeleccionada = (nuevaFecha, nuevaHora) => {
    if (nuevaFecha) {
      const fechaStr = nuevaFecha.toISOString().split("T")[0];
      setFecha(fechaStr);
      setDiaSeleccionado(nuevaFecha);
    }

    if (nuevaHora) {
      setHora(nuevaHora);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (paso === 1) {
      if (!fecha || !hora) {
        alert("Por favor selecciona fecha y hora para continuar.");
        return;
      }
      setPaso(2);
    } else {
      if (!profesional) {
        alert("Por favor selecciona un profesional.");
        return;
      }

      const detallesReserva = {
        servicio: servicio.title,
        opcion: opcionSeleccionada ? opcionSeleccionada.nombre : null,
        fecha,
        hora,
        profesional,
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-reserva"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>

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
                    />
                  </div>
                </div>
              ) : (
                <div className="modal-paso modal-paso-2">
                  <div className="form-group">
                    <label>Selecciona un profesional:</label>
                    <div className="profesionales-grid">
                      {profesionalesFiltrados.map((prof) => (
                        <div
                          key={prof.id}
                          className={`profesional-card ${profesional === prof.nombre ? "seleccionado" : ""
                            }`}
                          onClick={() => setProfesional(prof.nombre)}
                        >
                          <div className="profesional-avatar">
                            {prof.nombre.charAt(0)}
                          </div>
                          <div className="profesional-info">
                            <h4>{prof.nombre}</h4>
                            <p>{prof.especialidad}</p>
                          </div>
                        </div>
                      ))}
                    </div>
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
                <button type="submit" className="modal-reservar-btn">
                  {paso === 1 ? (
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

    for (let i = 1; i <= totalDias; i++) {
      dias.push(new Date(año, mes, i));
    }

    return dias;
  };

  const cambiarMes = (offset) => {
    const nuevoMes = new Date(fechaActual);
    nuevoMes.setMonth(fechaActual.getMonth() + offset);
    setFechaActual(new Date(nuevoMes.getFullYear(), nuevoMes.getMonth(), 1));
  };

  const seleccionarDia = (dia) => {
    setDiaSeleccionado(dia);
    onSeleccionarFechaHora(dia, horaElegida);
  };

  const seleccionarHora = (hora) => {
    setHoraElegida(hora);
    onSeleccionarFechaHora(diaSeleccionado, hora);
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
            className={`dia ${diaSeleccionado?.toDateString() === dia.toDateString()
                ? "seleccionado"
                : ""
              }`}
            key={i}
            onClick={() => seleccionarDia(dia)}
          >
            {dia.getDate()}
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
                {horas.map((hora, i) => (
                  <button
                    type="button"
                    key={i}
                    className={`horario-btn ${horaElegida === hora ? "seleccionado" : ""
                      }`}
                    onClick={() => seleccionarHora(hora)}
                  >
                    {hora}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModalReserva;
