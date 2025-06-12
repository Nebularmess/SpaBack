import { useAdminAuth } from '../context/AdminAuthContext'; // Cambio aquí
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styles/AdminLogin.css'; 

const AdminLogin = () => {
  const { login } = useAdminAuth(); // Usar useAdminAuth en lugar de useAuth
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      alert('Error inesperado al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-section">
      <div className="admin-login-overlay"></div>
      <div className="admin-login-container">
        <div className="admin-login-content">
          <div className="admin-login-header">
            <div className="admin-login-icon">
              <i className="fas fa-lock"></i>
            </div>
            <h2 className="admin-login-title">Acceso de Administrador</h2>
            <p className="admin-login-subtitle">Ingrese sus credenciales para continuar</p>
          </div>
          
          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="admin-form-group">
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-form-input"
                style={{"--input-order": 1}}
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="admin-form-group">
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-form-input"
                style={{"--input-order": 2}}
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="admin-form-submit">
              <button 
                type="submit" 
                className="admin-login-button"
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;