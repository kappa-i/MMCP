function disableScroll() {
  document.body.style.overflow = 'hidden';
  document.addEventListener('touchmove', preventDefault, { passive: false });
  document.addEventListener('wheel', preventDefault, { passive: false });
}

function enableScroll() {
  document.body.style.overflow = '';
  document.removeEventListener('touchmove', preventDefault);
  document.removeEventListener('wheel', preventDefault);
}

function preventDefault(e) {
  e.preventDefault();
}


// Gestion de l'apparition du bouton "Up" au scroll
document.addEventListener('DOMContentLoaded', () => {
    const upBtn = document.querySelector('.up-container');

    if (upBtn) {
        window.addEventListener('scroll', () => {
            // Affiche le bouton après 400px de défilement
            if (window.scrollY > 400) {
                upBtn.classList.add('visible');
            } else {
                upBtn.classList.remove('visible');
            }
        });

        // Retour en haut fluide
        upBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});


/* ============================================================
   SMART-HEADER.JS - Détection intelligente de couleur
   ============================================================ */

class SmartHeader {
    constructor() {
        this.header = document.querySelector('header');
        this.burger = document.querySelector('#smart-burger');
        this.navMenu = document.querySelector('.nav');
        
        if (!this.header || !this.burger) return;
        
        this.init();
    }

    init() {
        // Vérifier la couleur au chargement
        this.checkBackground();
        
        // Vérifier la couleur au scroll
        window.addEventListener('scroll', () => {
            this.checkBackground();
        });
        
        // Vérifier après le chargement complet (pour les images/vidéos)
        window.addEventListener('load', () => {
            this.checkBackground();
        });
    }

    checkBackground() {
        // Si le menu est ouvert, ne pas changer la couleur
        if (this.navMenu && this.navMenu.classList.contains('open')) {
            this.burger.classList.add('on-dark');
            this.burger.classList.remove('on-light');
            return;
        }

        // Récupérer la position du bouton
        const burgerRect = this.burger.getBoundingClientRect();
        const x = burgerRect.left + burgerRect.width / 2;
        const y = burgerRect.top + burgerRect.height / 2;

        // Masquer temporairement le header pour détecter ce qu'il y a derrière
        const originalPointerEvents = this.header.style.pointerEvents;
        this.header.style.pointerEvents = 'none';

        // Obtenir l'élément sous le bouton
        const elementBehind = document.elementFromPoint(x, y);

        // Restaurer les pointer-events
        this.header.style.pointerEvents = originalPointerEvents;

        if (!elementBehind) {
            this.setLightMode();
            return;
        }

        // Obtenir la couleur de fond de l'élément
        const bgColor = this.getBackgroundColor(elementBehind);
        
        // Calculer la luminosité
        const brightness = this.getBrightness(bgColor);

        // Appliquer la classe appropriée
        if (brightness > 128) {
            // Fond clair → bouton noir
            this.setLightMode();
        } else {
            // Fond sombre → bouton blanc
            this.setDarkMode();
        }
    }

    // Obtenir la couleur de fond réelle (en remontant les parents si transparent)
    getBackgroundColor(element) {
        let current = element;
        let bgColor = window.getComputedStyle(current).backgroundColor;

        // Remonter l'arbre DOM si la couleur est transparente
        while (this.isTransparent(bgColor) && current.parentElement) {
            current = current.parentElement;
            bgColor = window.getComputedStyle(current).backgroundColor;
        }

        return bgColor;
    }

    // Vérifier si une couleur est transparente
    isTransparent(color) {
        return color === 'transparent' || 
               color === 'rgba(0, 0, 0, 0)' || 
               color.includes('rgba') && color.includes(', 0)');
    }

    // Calculer la luminosité d'une couleur RGB/RGBA
    getBrightness(rgbaColor) {
        // Extraire les valeurs RGB
        const matches = rgbaColor.match(/\d+/g);
        
        if (!matches || matches.length < 3) {
            return 255; // Par défaut : considérer comme clair
        }

        const r = parseInt(matches[0]);
        const g = parseInt(matches[1]);
        const b = parseInt(matches[2]);

        // Formule de luminosité perçue (YIQ)
        return (r * 299 + g * 587 + b * 114) / 1000;
    }

    setLightMode() {
        this.burger.classList.remove('on-dark');
        this.burger.classList.add('on-light');
    }

    setDarkMode() {
        this.burger.classList.remove('on-light');
        this.burger.classList.add('on-dark');
    }
}

// Initialiser au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
    new SmartHeader();
});


/* ============================================================
   PAGE-TRANSITION.JS - WIPE DIAGONAL BIDIRECTIONNEL
   ============================================================ */

class PageTransition {
    constructor() {
        this.overlay = document.querySelector('.page-transition');
        this.duration = 1400; // Durée totale (ms)
        
        if (!this.overlay) return;
        
        this.init();
    }

    init() {
        // Animation d'entrée au chargement de la page
        this.showEnteringAnimation();
        
        // Intercepter tous les liens internes
        this.attachLinkListeners();
        
        // Gérer le bouton retour du navigateur
        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                this.showEnteringAnimation();
            }
        });
    }

    showEnteringAnimation() {
        // L'overlay commence par couvrir toute la page (vient de la droite)
        this.overlay.classList.add('entering');
        document.body.style.overflow = 'hidden';
        
        // Après un court délai, l'overlay sort vers la gauche
        setTimeout(() => {
            this.overlay.classList.remove('entering');
            this.overlay.classList.add('loaded');
            document.body.style.overflow = '';
            
            // Nettoyer après l'animation
            setTimeout(() => {
                this.overlay.classList.remove('loaded');
            }, 800);
        }, 100); // Petit délai pour que l'animation soit visible
    }

    attachLinkListeners() {
        // Sélectionner tous les liens internes
        const links = document.querySelectorAll('a[href]:not([href^="#"]):not([target="_blank"]):not([href^="http"]):not([href^="mailto"]):not([href^="tel"])');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Vérifier si c'est un lien interne valide
                if (this.isInternalLink(href)) {
                    e.preventDefault();
                    this.transitionToPage(href);
                }
            });
        });
    }

    isInternalLink(href) {
        // Vérifier si le lien est relatif ou vers une page HTML
        return href && 
               !href.startsWith('#') && 
               !href.startsWith('http') &&
               !href.startsWith('mailto') &&
               !href.startsWith('tel');
    }

    transitionToPage(url) {
        // Empêcher les doubles clics
        if (this.overlay.classList.contains('active')) return;
        
        // Afficher l'overlay (entre de la gauche)
        this.showOverlay();
        
        // Charger la nouvelle page après l'animation
        setTimeout(() => {
            window.location.href = url;
        }, 800); // Charger à mi-parcours
    }

    showOverlay() {
        // Nettoyer les classes précédentes
        this.overlay.classList.remove('entering', 'loaded', 'exit');
        
        // Activer l'overlay (entre de la gauche)
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Initialiser
window.addEventListener('DOMContentLoaded', () => {
    new PageTransition();
});

