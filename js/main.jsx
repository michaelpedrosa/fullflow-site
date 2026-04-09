import React from 'react';
import { createRoot } from 'react-dom/client';
import { MeshGradient } from '@paper-design/shaders-react';
import { animate, inView, scroll, stagger } from 'framer-motion';

console.log('FullFlow Engine: Initializing...');

// Initialize Lucide Icons
const updateIcons = () => {
    if (window.lucide) window.lucide.createIcons();
};

// 1. Mount the React background Shader
const ShaderBackground = () => (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: -1, background: '#080808' }}>
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <defs>
                <filter id="paper-grain" x="-50%" y="-50%" width="200%" height="200%">
                    <feTurbulence baseFrequency="0.012" numOctaves="3" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
                </filter>
            </defs>
        </svg>

        <MeshGradient 
            colors={["#3472f8", "#fa6e43", "#114bb8", "#000000", "#fa9472"]} 
            speed={0.25} 
            style={{ width: '100%', height: '100%', position: 'absolute' }}
        />

        <MeshGradient 
            colors={["#ffffff", "#fa6e43", "#3472f8"]} 
            speed={0.1} 
            wireframe="true"
            style={{ 
                width: '100%', height: '100%', position: 'absolute', 
                opacity: 0.12, filter: 'url(#paper-grain)'
            }}
        />
        
        <div style={{ 
            position: 'absolute', inset: 0, 
            background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.5) 100%)',
            pointerEvents: 'none' 
        }}></div>
    </div>
);

try {
    const bgRoot = document.getElementById('bg-root');
    if (bgRoot) {
        createRoot(bgRoot).render(<ShaderBackground />);
    }
} catch (err) {
    console.error('Shader mount failed:', err);
}

// 2. Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Helper: reveal an element
const revealElement = (el, delay = 0, duration = 0.9) => {
    try {
        animate(el, { opacity: 1, y: 0 }, { 
            duration, 
            delay,
            ease: [0.16, 1, 0.3, 1] 
        });
    } catch (e) {
        // Fallback: just set styles directly
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    }
};

// 3. Premium Animation System
const setupAnimations = () => {
    const allFadeEls = document.querySelectorAll('.fade-up');

    if (prefersReducedMotion) {
        allFadeEls.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }

    // ── SAFETY FALLBACK: Reveal everything after 4 seconds no matter what ──
    setTimeout(() => {
        allFadeEls.forEach(el => {
            if (el.style.opacity === '0' || getComputedStyle(el).opacity === '0') {
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    }, 4000);

    // ── Hero Section: Blur-to-sharp entrance ──
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');

    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(40px)';
        heroTitle.style.filter = 'blur(10px)';
        
        setTimeout(() => {
            try {
                animate(heroTitle, { opacity: 1, y: 0, filter: 'blur(0px)' }, { 
                    duration: 1.4, ease: [0.16, 1, 0.3, 1] 
                });
            } catch(e) {
                heroTitle.style.opacity = '1';
                heroTitle.style.transform = 'none';
                heroTitle.style.filter = 'none';
            }
        }, 300);
    }

    if (heroSubtitle) {
        heroSubtitle.style.opacity = '0';
        heroSubtitle.style.transform = 'translateY(25px)';
        setTimeout(() => revealElement(heroSubtitle, 0, 1.2), 700);
    }

    if (heroCta) {
        heroCta.style.opacity = '0';
        heroCta.style.transform = 'translateY(20px)';
        setTimeout(() => revealElement(heroCta, 0, 1.0), 1000);
    }

    // ── Scroll-triggered reveals for all .fade-up elements ──
    const grids = document.querySelectorAll('.pricing-grid, .cases-grid, .bento-grid, .solution-cards');
    
    grids.forEach(grid => {
        const items = grid.querySelectorAll('.fade-up');
        inView(grid, () => {
            animate(items, { opacity: 1, y: 0 }, { 
                delay: stagger(0.15), 
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1] 
            });
        }, { amount: 0.2 });
    });

    allFadeEls.forEach((el) => {
        // Skip elements inside grids (handled above)
        if (el.closest('.pricing-grid, .cases-grid, .bento-grid, .solution-cards')) return;
        // Skip hero
        if (el.closest('.hero-content')) return;

        // Set initial hidden state
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';

        inView(el, () => {
            revealElement(el, 0.05, 0.9);
        }, { amount: 0.1 });
    });

    // ── Premium "Text Reveal By Word" Engine ──
    const setupTextReveal = () => {
        const revealElements = document.querySelectorAll('.scroll-reveal-text');
        
        revealElements.forEach(container => {
            // Get text nodes for both languages
            const textSpans = container.querySelectorAll('span[data-lang]');
            
            textSpans.forEach(span => {
                const text = span.innerText;
                const words = text.split(/\s+/);
                
                // Clear and replace with word spans
                span.innerHTML = '';
                words.forEach((word, i) => {
                    const wordSpan = document.createElement('span');
                    wordSpan.innerText = word;
                    wordSpan.className = 'reveal-word';
                    wordSpan.style.opacity = '0.2'; // Base opacity
                    wordSpan.style.display = 'inline-block';
                    wordSpan.style.whiteSpace = 'pre'; // Preserve spaces
                    wordSpan.style.transition = 'opacity 0.3s ease';
                    span.appendChild(wordSpan);
                    
                    // Add a space after the word if it's not the last one
                    if (i < words.length - 1) {
                        span.appendChild(document.createTextNode(' '));
                    }
                });

                // Attach scroll animation to this specific span
                const wordEls = span.querySelectorAll('.reveal-word');
                scroll(
                    (progress) => {
                        // Spread the progress across all words
                        wordEls.forEach((w, i) => {
                            const start = i / wordEls.length;
                            const end = (i + 1) / wordEls.length;
                            // Map scroll 0-1 to word reveal
                            // We use a broader range for smoother reveal
                            const opacity = progress > start ? 1 : 0.2;
                            w.style.opacity = opacity;
                        });
                    },
                    { target: container, offset: ["start 0.8", "end 0.4"] }
                );
            });
        });
    };

    setupTextReveal();


    // ── Step Connectors: Draw-in animation ──
    document.querySelectorAll('.step-connector').forEach(conn => {
        conn.style.transform = 'scaleX(0)';
        conn.style.transformOrigin = 'left center';

        try {
            inView(conn, () => {
                animate(conn, { scaleX: 1 }, { duration: 0.6, ease: [0.16, 1, 0.3, 1] });
            }, { amount: 0.5 });
        } catch(e) {
            conn.style.transform = 'scaleX(1)';
        }
    });

    // ── Client Case Filtering ──
    const setupFilters = () => {
        const tabs = document.querySelectorAll('.client-tab');
        const items = document.querySelectorAll('.bento-item');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const filter = tab.getAttribute('data-client');
                
                // Update UI
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Filter items
                items.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-client') === filter) {
                        item.classList.remove('hidden');
                        animate(item, { opacity: 1, scale: 1 }, { duration: 0.4 });
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    };

    // ── Lightbox Logic ──
    const setupLightbox = () => {
        const lightbox = document.getElementById('lightbox');
        const container = document.getElementById('lightbox-container');
        const closeBtn = document.querySelector('.lightbox-close');
        const items = document.querySelectorAll('.bento-item');

        if (!lightbox || !container || !closeBtn) return;

        items.forEach(item => {
            item.addEventListener('click', () => {
                const media = item.querySelector('img, video');
                if (!media) return;

                container.innerHTML = '';
                const clone = media.cloneNode(true);
                clone.removeAttribute('style');
                clone.className = 'lightbox-content';
                
                if (clone.tagName === 'VIDEO') {
                    clone.controls = true;
                    clone.muted = false;
                    clone.autoplay = true;
                }

                container.appendChild(clone);
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scroll
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            container.innerHTML = '';
            document.body.style.overflow = '';
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === container) {
                closeLightbox();
            }
        });
        
        // ESC key to close
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    };

    setupFilters();
    setupLightbox();
};

// 4. Language Toggle
const setupLanguage = () => {
    const btnFR = document.getElementById('lang-fr');
    const btnEN = document.getElementById('lang-en');
    
    if (btnFR && btnEN) {
        const switchLang = (lang) => {
            document.documentElement.classList.remove('lang-en-active', 'lang-fr-active');
            document.documentElement.classList.add(`lang-${lang}-active`);
            document.documentElement.lang = lang;
            
            if (lang === 'fr') {
                btnFR.classList.add('active');
                btnEN.classList.remove('active');
            } else {
                btnEN.classList.add('active');
                btnFR.classList.remove('active');
            }
            localStorage.setItem('fullflow_lang', lang);
        };

        switchLang(localStorage.getItem('fullflow_lang') || 'en');
        btnFR.addEventListener('click', (e) => { e.preventDefault(); switchLang('fr'); });
        btnEN.addEventListener('click', (e) => { e.preventDefault(); switchLang('en'); });
    }
};

// 5. Navbar scroll effect
const setupNavbar = () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 100);
    }, { passive: true });
};

// 6. Mobile Menu Logic
const setupMobileMenu = () => {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggle && navLinks) {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.classList.toggle('active');
            
            const icon = toggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
                navLinks.style.display = 'flex';
            } else {
                icon.setAttribute('data-lucide', 'menu');
                navLinks.style.display = 'none';
            }
            updateIcons();
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                if (window.innerWidth <= 1024) {
                    navLinks.style.display = 'none';
                }
                const icon = toggle.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                updateIcons();
            });
        });

        // Handle resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024) {
                navLinks.style.display = 'flex';
            } else if (!navLinks.classList.contains('active')) {
                navLinks.style.display = 'none';
            }
        });
    }
};

// 7. Main initialization
const setupApp = () => {
    console.log('FullFlow: Initializing premium experience...');
    updateIcons();
    setupAnimations();
    setupLanguage();
    setupNavbar();
    setupMobileMenu();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupApp);
} else {
    setupApp();
}
