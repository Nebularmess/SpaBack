import React, { useState, useEffect } from 'react';
import Card from '../cards';
import Etiqueta from '../Formularios/etiquetas.jsx';
import Modal from '../Modal.jsx';
import '../../styles/servicios.css';
import '../../styles/modal.css';

// Importación de imágenes por defecto (por si fallan las cargas)
import masagesImg from '../../assets/masajes.jpg';
import bellezaImg from '../../assets/belleza.jpg';
import facialesImg from '../../assets/faciales.jpg';
import saunaImg from '../../assets/sauna.jpg';
import hidromasajesImg from '../../assets/hidromasajes.jpg';
import yogaImg from '../../assets/yoga.jpg';

const Servicios = () => {
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [serviciosPorCategoria, setServiciosPorCategoria] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener una imagen predeterminada según el nombre de la categoría
  const getDefaultImage = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes('masaje')) return masagesImg;
    if (name.includes('belleza')) return bellezaImg;
    if (name.includes('facial')) return facialesImg;
    if (name.includes('corporal')) return saunaImg;
    if (name.includes('hidro')) return hidromasajesImg;
    if (name.includes('yoga')) return yogaImg;
    // Imagen por defecto si no hay coincidencia
    return masagesImg;
  };

  useEffect(() => {
    // Función para cargar categorías
    const fetchCategorias = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/servicios/categorias');
        if (!response.ok) throw new Error('Error al obtener categorías');
        const data = await response.json();
        setCategorias(data);
        
        // Para cada categoría, cargar sus servicios
        const serviciosData = {};
        await Promise.all(data.map(async (categoria) => {
          const servResponse = await fetch(`http://localhost:3001/api/servicios/por-categoria/${categoria.id_categoria}`);
          if (!servResponse.ok) throw new Error(`Error al obtener servicios para ${categoria.nombre}`);
          const servicios = await servResponse.json();
          serviciosData[categoria.id_categoria] = servicios;
        }));
        
        setServiciosPorCategoria(serviciosData);
        setLoading(false);
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  const handleCardClick = (servicio) => {
    // Si es un servicio individual (categoría), mantenemos la estructura pero identificamos que es una categoría
    if (servicio.options) {
      setServicioSeleccionado({
        ...servicio,
        esCategoria: true // Añadimos esta bandera para identificar que es una categoría
      });
    } else {
      // Si es un servicio grupal, lo pasamos directamente
      setServicioSeleccionado(servicio);
    }
  };

  const cerrarModal = () => {
    setServicioSeleccionado(null);
  };

  if (loading) return <div className="loading">Cargando servicios...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  // Separar categorías por tipo de servicio (Individual vs Grupal)
  const serviciosIndividuales = [];
  const serviciosGrupales = [];

  categorias.forEach(categoria => {
    const servicios = serviciosPorCategoria[categoria.id_categoria] || [];
    
    // Verificar si la categoría tiene servicios de tipo "Grupal"
    const tieneServiciosGrupales = servicios.some(s => s.tipo === 'Grupal');
    const tieneServiciosIndividuales = servicios.some(s => s.tipo === 'Individual');
    
    // Procesar servicios individuales
    if (tieneServiciosIndividuales) {
      const serviciosIndividualesData = servicios.filter(s => s.tipo === 'Individual').map(s => ({
        id_servicio: s.id_servicio, // Agregar ID del servicio explícitamente
        nombre: s.nombre,
        descripcion: s.descripcion,
        precio: s.precio
      }));
      
      serviciosIndividuales.push({
        id: categoria.id_categoria,
        id_categoria: categoria.id_categoria, // Explícitamente indicar que es una categoría
        title: categoria.nombre,
        imageSrc: getDefaultImage(categoria.nombre),
        options: serviciosIndividualesData
      });
    }
    
    // Procesar servicios grupales
    if (tieneServiciosGrupales) {
      servicios.filter(s => s.tipo === 'Grupal').forEach(s => {
        serviciosGrupales.push({
          id: s.id_servicio,
          id_servicio: s.id_servicio, // Explícitamente indicar ID del servicio
          title: s.nombre,
          imageSrc: getDefaultImage(categoria.nombre),
          descripcion: s.descripcion,
          precio: s.precio
        });
      });
    }
  });

  return (
    <section className="servicios-section">
      <div className="servicios-container">
        <div className="servicios-column">
          <Etiqueta
            text="Servicios Individuales"
            fontSize="40px"
            textColor="white"
            padding="10px 0"
            className="servicios-title"
          />
          <div className="servicios-cards-grid">
            {serviciosIndividuales.map((servicio) => (
              <div key={servicio.id} onClick={() => handleCardClick(servicio)}>
                <Card
                  title={servicio.title}
                  imageSrc={servicio.imageSrc}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="servicios-column">
          <Etiqueta
            text="Servicios Grupales"
            fontSize="40px"
            textColor="white"
            padding="10px 0"
            className="servicios-title"
          />
          <div className="servicios-cards-grid servicios-grid-grupales">
            {serviciosGrupales.map((servicio) => (
              <div key={servicio.id} onClick={() => handleCardClick(servicio)}>
                <Card
                  title={servicio.title}
                  imageSrc={servicio.imageSrc}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal servicio={servicioSeleccionado} onClose={cerrarModal} />
    </section>
  );
};

export default Servicios;
