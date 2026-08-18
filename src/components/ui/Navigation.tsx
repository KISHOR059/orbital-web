export function Navigation() {
  const scrollToProgress = (progress: number) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({
      top: maxScroll * progress,
      behavior: 'smooth',
    })
  }

  return (
    <header className="top-nav" role="banner">
      <div className="nav-container">
        <button
          type="button"
          onClick={() => scrollToProgress(0)}
          className="nav-logo"
          aria-label="Orbital Home - Scroll to top"
        >
          <span className="logo-indicator" aria-hidden="true" />
          <span className="logo-text">ORBITAL</span>
          <span className="logo-sub">SYS // 01</span>
        </button>

        <nav className="nav-links" aria-label="Main Navigation">
          <ul>
            <li>
              <button
                type="button"
                onClick={() => scrollToProgress(0.35)}
                className="nav-item"
                aria-label="Scroll to Earth and Humanity"
              >
                <span className="nav-index">01</span>
                <span>EARTH</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => scrollToProgress(0.77)}
                className="nav-item"
                aria-label="Scroll to About Kishor"
              >
                <span className="nav-index">02</span>
                <span>ABOUT</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => scrollToProgress(1.0)}
                className="nav-item"
                aria-label="Scroll to Contact"
              >
                <span className="nav-index">03</span>
                <span>CONTACT</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
