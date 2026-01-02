/* ============================================
   envctl.dev — Vanilla JS + Web Components
   ============================================ */

/**
 * <code-block> Web Component
 * 
 * A code block with optional copy-to-clipboard functionality.
 * Add the "copyable" attribute to enable clicking to copy.
 * 
 * Usage:
 *   <code-block copyable>
 *     <pre>npm install envctl</pre>
 *   </code-block>
 */
class CodeBlock extends HTMLElement {
    constructor() {
        super();
        this.copyTimeout = null;
    }

    connectedCallback() {
        if (this.hasAttribute('copyable')) {
            this.addEventListener('click', this.handleCopy.bind(this));
        }
    }

    disconnectedCallback() {
        if (this.copyTimeout) {
            clearTimeout(this.copyTimeout);
        }
    }

    async handleCopy() {
        const pre = this.querySelector('pre');
        if (!pre) return;

        // Get text content, stripping any prompt characters
        let text = pre.textContent || '';
        
        // Remove common prompt patterns ($ or >) at line starts
        text = text.split('\n')
            .map(line => line.replace(/^\s*[$>]\s*/, ''))
            .join('\n')
            .trim();

        try {
            await navigator.clipboard.writeText(text);
            
            // Show copied state
            this.classList.add('copied');
            
            // Reset after delay
            if (this.copyTimeout) {
                clearTimeout(this.copyTimeout);
            }
            this.copyTimeout = setTimeout(() => {
                this.classList.remove('copied');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }
}

// Register the component
customElements.define('code-block', CodeBlock);


/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});


/**
 * Add active state to nav links on scroll
 */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveNav() {
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        
        if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Throttle scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) return;
    scrollTimeout = setTimeout(() => {
        updateActiveNav();
        scrollTimeout = null;
    }, 100);
});


/**
 * Intersection Observer for fade-in animations
 */
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe feature cards and steps
document.querySelectorAll('.feature, .docs-step, .install-option').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    fadeInObserver.observe(el);
});

// Add visible styles
const style = document.createElement('style');
style.textContent = `
    .feature.visible,
    .docs-step.visible,
    .install-option.visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);


/**
 * Relay Status Checker
 * Fetches live status from relay.envctl.dev/health
 */
async function checkRelayStatus() {
    const dot = document.getElementById('relay-status-dot');
    const text = document.getElementById('relay-status-text');

    if (!dot || !text) return;

    try {
        const response = await fetch('https://relay.envctl.dev/health', {
            method: 'GET',
            mode: 'cors',
        });

        if (response.ok) {
            const data = await response.json();
            if (data.status === 'ok') {
                dot.className = 'status-dot operational';
                text.textContent = 'Relay operational';
            } else {
                dot.className = 'status-dot degraded';
                text.textContent = 'Relay degraded';
            }
        } else {
            dot.className = 'status-dot down';
            text.textContent = 'Relay unavailable';
        }
    } catch (error) {
        // Network error or CORS issue - fall back gracefully
        dot.className = 'status-dot';
        text.textContent = 'Unable to check status';
    }
}

// Check status on page load
checkRelayStatus();

// Refresh status every 60 seconds
setInterval(checkRelayStatus, 60000);