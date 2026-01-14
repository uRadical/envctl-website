// Site Navigation Component
class SiteNav extends HTMLElement {
    connectedCallback() {
        const isActive = (path) => window.location.pathname.startsWith(path) ? 'class="active"' : '';

        this.innerHTML = `
            <nav class="nav" role="navigation" aria-label="Main navigation">
                <a href="/" class="nav-logo" aria-label="envctl home">
                    <img src="/logo.svg" alt="" width="32" height="32" aria-hidden="true">
                    <span>envctl</span>
                </a>
                <div class="nav-links">
                    <a href="/#features">Features</a>
                    <a href="/#install">Install</a>
                    <a href="/docs/" ${isActive('/docs/')}>Docs</a>
                    <a href="/#pricing">Pricing</a>
                    <button class="docs-mobile-toggle" id="mobileMenuToggle" aria-label="Toggle navigation menu">
                        <svg class="icon-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                        <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </nav>
        `;
    }
}

// Site Footer Component
class SiteFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer class="footer" role="contentinfo">
                <div class="footer-content">
                    <div class="footer-sponsor">
                        <a href="https://uradical.io" target="_blank" rel="noopener">
                            <img src="/uradical.png" alt="uRadical" width="116" height="24">
                        </a>
                    </div>

                    <div class="footer-copy">
                        <p>© 2026 uRadical.</p>
                    </div>
                </div>
            </footer>
        `;
    }
}

// Register components
customElements.define('site-nav', SiteNav);
customElements.define('site-footer', SiteFooter);
