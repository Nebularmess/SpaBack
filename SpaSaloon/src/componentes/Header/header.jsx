import Logo from './logo';
import Navigation from './navBar';
import LoginButton from './loginButton';
import '../../styles/header.css';

const Header = () => {
  return (
    <header className="main-header">
      <div className="container">
        <Logo />
        <div className="right-content">
          <Navigation />
          <LoginButton />
        </div>
      </div>
    </header>
  );
};

export default Header;