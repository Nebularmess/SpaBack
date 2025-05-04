import React, { useEffect, useState } from 'react';

const DropdownServicios = ({ onChange, value, categoriaId }) => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener los servicios según la categoría seleccionada
  useEffect(() => {
    // Solo cargar servicios si hay una categoría seleccionada
    if (!categoriaId) {
      setServicios([]);
      return;
    }

    const fetchServicios = async () => {
      setLoading(true);
      try {
        console.log(`Intentando cargar servicios para categoría: ${categoriaId}`);
        const response = await fetch(`http://localhost:3001/api/serviciosAdm/servicios/categoria/${categoriaId}`);
        
        if (!response.ok) {
          // Mostrar detalles del error para ayudar en el diagnóstico
          const errorText = await response.text();
          console.error(`Error HTTP ${response.status}: ${errorText}`);
          throw new Error(`Error al cargar los servicios (${response.status})`);
        }
        
        const data = await response.json();
        console.log('Servicios cargados:', data);
        setServicios(data);
      } catch (err) {
        console.error('Error al cargar servicios:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServicios();
  }, [categoriaId]); // Se ejecuta cuando cambia la categoría seleccionada

  // Cuando cambia la categoría, resetear el valor del servicio seleccionado
  useEffect(() => {
    // Solo resetear si:
    // 1. hay una función onChange disponible
    // 2. hay una categoría seleccionada
    // 3. hay un valor actualmente seleccionado (evita actualizaciones innecesarias)
    if (onChange && categoriaId && value) {
      onChange('');
    }
  }, [categoriaId]); // Solo se ejecuta cuando cambia la categoría, NO incluir onChange o value en las dependencias

  if (loading) return <div>Cargando servicios...</div>;
  if (error) return <div>Error: {error} - Por favor revisa la consola para más detalles.</div>;
  if (!categoriaId) return <div className="dropdown-placeholder">Seleccione una categoría primero</div>;

  return (
    <div>
      <label htmlFor="servicio">Selecciona un servicio</label>
      <select
        id="servicio"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={servicios.length === 0}
      >
        <option value="">Seleccione un servicio</option>
        {servicios.map((servicio) => (
          <option 
            // Aseguramos que la key sea única y esté siempre definida
            key={servicio.id_servicio || `servicio-${servicio.nombre}`} 
            value={servicio.id_servicio || servicio.id}
          >
            {servicio.nombre}
          </option>
        ))}
      </select>
      {servicios.length === 0 && !loading && <div className="no-servicios">No hay servicios disponibles para esta categoría</div>}
    </div>
  );
};

export default DropdownServicios;