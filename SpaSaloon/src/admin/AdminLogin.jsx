import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [clave, setClave] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica de admin (reemplaza por backend real)
    if (nombre === 'admin' && clave === 'admin123') {
      login({ id_cliente: '0', nombre: 'admin' });
      navigate('/dashboard');
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login Admin</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        type="password"
        placeholder="Clave"
        value={clave}
        onChange={(e) => setClave(e.target.value)}
      />
      <button type="submit">Entrar</button>
    </form>
  );
};

export default AdminLogin;