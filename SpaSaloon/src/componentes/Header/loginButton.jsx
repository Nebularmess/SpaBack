import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import Formulario from '../Formularios/formulario.jsx';
import Boton from '../Formularios/boton.jsx';
import '../../styles/botonLogin.css';
import { UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoginButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const handleProfileClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <div className="login-container">
      {!isAuthenticated() ? (
        <>
          <Boton
            text="Log In"
            onClick={() => setIsOpen(true)}
            className="login-button"
          />
          {isOpen && <Formulario onClose={closeSidebar} />}
        </>
      ) : (
        <div className="profile-menu-container">
          <button className="profile-icon-button" onClick={handleProfileClick}>
            <UserCircle size={28} />
          </button>
          {menuOpen && (
            <div className="profile-dropdown">
              <Link to="/perfil" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                Mi Perfil
              </Link>
              <button onClick={handleLogout} className="dropdown-item">Log Out</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};// FALTA HACER QUE EL LOGOUT LO SAQUE DEL PERFIL PARA LLEVARLO AL INDEX DE NUEVO!!!111!!111!!
// EL QUE LEE ESTO ES UN CIRUJA

export default LoginButton;
