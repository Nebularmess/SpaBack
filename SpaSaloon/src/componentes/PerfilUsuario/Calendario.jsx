import React, { useState } from 'react';
import Calendar from 'react-calendar';
import '../../styles/Calendario.css';

const Calendario = ({
  turnos = [],
  ...otrosProps // resto de las props que ya tenías
}) => {
  const [value, setValue] = useState(otrosProps.initialValue || new Date());

  const handleChange = (newValue) => {
    setValue(newValue);
    if (otrosProps.onDateChange) {
      otrosProps.onDateChange(newValue);
    }
  };

  // Formatear fechas para comparar
  const formatDate = (date) => {
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return offsetDate.toISOString().split('T')[0];
  };

  // Verificar si hay turno en una fecha
  const hasTurno = (date) => {
    const formatted = formatDate(date);
    return turnos.includes(formatted);
  };
  console.log('Turnos en el calendario:', turnos);

  return (
    <div className="custom-calendar-container" style={{ '--background-color': otrosProps.backgroundColor }}>
      <Calendar
        onChange={handleChange}
        value={value}
        tileClassName={({ date, view }) => {
          if (view === 'month') {
            return hasTurno(date) ? 'dia-con-turno' : null;
          }
          return null;
        }}        
        {...otrosProps}
      />
    </div>
  );
};


export default Calendario;
