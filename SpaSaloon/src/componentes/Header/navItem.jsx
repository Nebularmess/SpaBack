const NavItem = ({ text, href }) => {
  const handleClick = (e) => {
    e.preventDefault();
    const section = document.getElementById(href.replace('#', ''));
    section ? section.scrollIntoView({ behavior: 'smooth' }) : null;
  };

  return (
    <li className="nav-item">
      <a href={href} onClick={handleClick}>
        {text}
      </a>
    </li>
  );
};

export default NavItem;