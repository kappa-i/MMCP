/* ============================================================
   SAFARI-FIX.JS - Calcul dynamique du viewport sur Safari
   ============================================================ */

// Fonction pour calculer et définir la vraie hauteur viewport
function setViewportHeight() {
    // Calculer 1% de la hauteur réelle du viewport
    const vh = window.innerHeight * 0.01;
    
    // Définir la variable CSS --vh
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Initialiser au chargement
setViewportHeight();

// Recalculer lors du resize (rotation, clavier iOS, etc.)
let resizeTimer;
window.addEventListener('resize', () => {
    // Debounce pour éviter trop de recalculs
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        setViewportHeight();
    }, 100);
});

// Recalculer lors du changement d'orientation
window.addEventListener('orientationchange', () => {
    setTimeout(setViewportHeight, 100);
});


/* ============================================================
   BLOQUER LE SCROLL PENDANT LES TRANSITIONS
   ============================================================ */

// Observer pour détecter quand le preloader/transition est actif
const preventScrollDuringOverlays = () => {
    const body = document.body;
    const preloader = document.querySelector('.preloader');
    const pageTransition = document.querySelector('.page-transition');
    const nav = document.querySelector('.nav');
    
    // Variable pour stocker la position de scroll
    let scrollPosition = 0;
    
    // Fonction pour bloquer le scroll
    const lockScroll = () => {
        scrollPosition = window.pageYOffset;
        body.style.position = 'fixed';
        body.style.top = `-${scrollPosition}px`;
        body.style.width = '100%';
        body.style.overflow = 'hidden';
    };
    
    // Fonction pour débloquer le scroll
    const unlockScroll = () => {
        body.style.position = '';
        body.style.top = '';
        body.style.width = '';
        body.style.overflow = '';
        window.scrollTo(0, scrollPosition);
    };
    
    // Observer le preloader
    if (preloader) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    if (preloader.classList.contains('hidden')) {
                        unlockScroll();
                    } else {
                        lockScroll();
                    }
                }
            });
        });
        
        observer.observe(preloader, { attributes: true });
        
        // Bloquer initialement si le preloader existe
        if (!preloader.classList.contains('hidden')) {
            lockScroll();
        }
    }
    
    // Observer la page transition
    if (pageTransition) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    if (pageTransition.classList.contains('active')) {
                        lockScroll();
                    } else if (!nav || !nav.classList.contains('open')) {
                        // Ne débloquer que si le menu n'est pas ouvert
                        unlockScroll();
                    }
                }
            });
        });
        
        observer.observe(pageTransition, { attributes: true });
    }
    
    // Observer le menu nav
    if (nav) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    if (nav.classList.contains('open')) {
                        lockScroll();
                    } else if (!pageTransition || !pageTransition.classList.contains('active')) {
                        // Ne débloquer que si la transition n'est pas active
                        unlockScroll();
                    }
                }
            });
        });
        
        observer.observe(nav, { attributes: true });
    }
};

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', preventScrollDuringOverlays);


/* ============================================================
   FIX SPÉCIAL INDEX.HTML - Page entière en 100vh
   ============================================================ */

// Détecter si on est sur index.html
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    document.body.classList.add('index-page');
    
    // Empêcher complètement le scroll sur index
    document.addEventListener('DOMContentLoaded', () => {
        const hero = document.querySelector('.hero');
        
        if (hero) {
            // Bloquer le scroll de la page
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            
            // Empêcher le scroll tactile
            let startY = 0;
            
            document.addEventListener('touchstart', (e) => {
                startY = e.touches[0].pageY;
            }, { passive: false });
            
            document.addEventListener('touchmove', (e) => {
                // Permettre le scroll SEULEMENT dans le menu nav quand il est ouvert
                const nav = document.querySelector('.nav');
                if (nav && nav.classList.contains('open')) {
                    // Laisser le menu scroller
                    if (e.target.closest('.nav-links')) {
                        return;
                    }
                }
                
                // Sinon, bloquer tous les mouvements
                e.preventDefault();
            }, { passive: false });
        }
    });
}


/* ============================================================
   FIX BOUNCE SAFARI (Rubber Band Effect)
   ============================================================ */

// Empêcher le "bounce" au défilement sur iOS
document.addEventListener('touchmove', (e) => {
    const nav = document.querySelector('.nav');
    const preloader = document.querySelector('.preloader');
    const pageTransition = document.querySelector('.page-transition');
    
    // Si preloader visible ou transition active ou menu ouvert
    if ((preloader && !preloader.classList.contains('hidden')) ||
        (pageTransition && pageTransition.classList.contains('active')) ||
        (nav && nav.classList.contains('open') && !e.target.closest('.nav-links'))) {
        e.preventDefault();
    }
}, { passive: false });


/* ============================================================
   DEBUG (à retirer en production)
   ============================================================ */

// Afficher la hauteur viewport dans la console (pour debug)
console.log('Viewport height:', window.innerHeight);
console.log('100vh in px:', getComputedStyle(document.documentElement).getPropertyValue('--vh'));