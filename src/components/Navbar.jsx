import { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    document.body.classList.toggle('no-scroll');
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.classList.remove('no-scroll');
  };

  return (
    <header className={`floating-navbar ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
      <a href="#" className="logo serif" onClick={closeMenu}>
        <img src="/logo.png" alt="Aparox AI Logo" id="site-logo" />
      </a>
      <nav className={`mono ${menuOpen ? 'active' : ''}`} id="main-nav">
        <a href="#about" className="nav-link" onClick={closeMenu}>About</a>
        <a href="#features" className="nav-link" onClick={closeMenu}>Features</a>
        <a href="#productivity" className="nav-link" onClick={closeMenu}>Build</a>
        <a href="#pricing" className="nav-link" onClick={closeMenu}>Pricing</a>
        <a href="#contact" className="nav-link" onClick={closeMenu}>Contact</a>
      </nav>
      <button
        className={`menu-toggle ${menuOpen ? 'active' : ''}`}
        id="menu-toggle"
        aria-label="Toggle Menu"
        onClick={toggleMenu}
      >
        <div className="line"></div>
        <div className="line"></div>
      </button>
    </header>
  );
};

export default Navbar;
