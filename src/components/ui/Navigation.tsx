export function Navigation() {
  return (
    <header className="top-nav" role="banner">
      <div className="nav-container">
        <a href="#top" className="nav-logo" aria-label="Orbital Home">
          <span className="logo-indicator" aria-hidden="true" />
          <span className="logo-text">ORBITAL</span>
          <span className="logo-sub">SYS // 01</span>
        </a>

        <nav className="nav-links" aria-label="Main Navigation">
          <ul>
            <li>
              <a href="#work" className="nav-item">
                <span className="nav-index">01</span>
                <span>WORK</span>
              </a>
            </li>
            <li>
              <a href="#about" className="nav-item">
                <span className="nav-index">02</span>
                <span>ABOUT</span>
              </a>
            </li>
            <li>
              <a href="#contact" className="nav-item">
                <span className="nav-index">03</span>
                <span>CONTACT</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
