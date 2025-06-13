import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import Formulario from '../Formularios/formulario.jsx';
import Boton from '../Formularios/boton.jsx';
import '../../styles/botonLogin.css';
import { UserCircle, LogOut, User, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const LoginButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout, user, userType, isCliente, isProfesional } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/'); // Redirige al usuario a la página principal después de cerrar sesión
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const getUserTypeText = () => {
    if (isCliente()) return 'Cliente';
    if (isProfesional()) return 'Profesional';
    return 'Usuario';
  };

  const getUserIcon = () => {
    if (isProfesional()) {
      return <Shield size={28} className="profile-icon professional" />;
    }
    return <UserCircle size={28} className="profile-icon client" />;
  };

  const getUserDisplayName = () => {
    return user?.nombre || 'Usuario';
  };

  return (
    <div className="login-container">
      {!isAuthenticated() ? (
        <>
          <Boton
            text="Iniciar sesión"
            onClick={() => setIsOpen(true)}
            className="login-button custom-button primary medium rounded"
          />
          {isOpen && <Formulario onClose={closeSidebar} />}
        </>
      ) : (
        <div className="profile-menu-container">
          <button 
            className={`profile-icon-button ${userType}`} 
            onClick={handleProfileClick} 
            aria-label="Menú de perfil"
            title={`${getUserDisplayName()} (${getUserTypeText()})`}
          >
            {getUserIcon()}
            <span className="user-type-indicator">{getUserTypeText()}</span>
          </button>
          {menuOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <div className="user-info">
                  <span className="user-name">{getUserDisplayName()}</span>
                  <span className="user-type-badge">{getUserTypeText()}</span>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <Link to="/perfil" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                <User size={18} />
                <span>Mi perfil</span>
              </Link>
              {/* Condicional para mostrar opciones específicas según el tipo de usuario */}
              {isProfesional() && (
                <Link to="/dashboard-profesional" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                  <Shield size={18} />
                  <span>Panel Profesional</span>
                </Link>
              )}
              <div className="dropdown-divider"></div>
              <button onClick={handleLogout} className="dropdown-item logout-item">
                <LogOut size={18} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoginButton;