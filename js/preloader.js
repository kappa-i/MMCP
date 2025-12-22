/* ============================================================
   PRELOADER.JS - Gestion du chargement
   ============================================================ */

// Configuration
const MINIMUM_LOADING_TIME = 2000; // Temps minimum d'affichage (ms) - augmenté pour profiter de l'animation
const SIMULATE_PROGRESS = true; // Simuler la progression si pas de vidéo

class PreloaderManager {
  constructor() {
    this.preloader = document.querySelector(".preloader");
    this.video = document.querySelector(".hero video");
    this.startTime = Date.now();
    this.isVideoLoaded = false;

    this.init();
  }

  init() {
    // Empêcher le scroll pendant le chargement
    document.body.style.overflow = "hidden";

    if (this.video) {
      this.loadVideo();
    } else if (SIMULATE_PROGRESS) {
      this.simulateLoading();
    } else {
      this.hide();
    }
  }

  // Chargement de la vidéo
  loadVideo() {
    // Écouter les événements de chargement de la vidéo
    this.video.addEventListener("loadeddata", () => {
      this.isVideoLoaded = true;
      this.checkMinimumTime();
    });

    this.video.addEventListener("canplaythrough", () => {
      this.isVideoLoaded = true;
      this.checkMinimumTime();
    });

    // Fallback : si la vidéo met trop de temps à charger
    setTimeout(() => {
      if (!this.isVideoLoaded) {
        console.warn("Vidéo prend trop de temps, fermeture du preloader");
        this.checkMinimumTime();
      }
    }, 8000);
  }

  // Simuler le chargement complet (sans vidéo)
  simulateLoading() {
    // Attendre simplement le temps minimum
    setTimeout(() => {
      this.checkMinimumTime();
    }, MINIMUM_LOADING_TIME);
  }

  // Vérifier que le temps minimum est écoulé
  checkMinimumTime() {
    const elapsedTime = Date.now() - this.startTime;
    const remainingTime = Math.max(0, MINIMUM_LOADING_TIME - elapsedTime);

    setTimeout(() => {
      this.hide();
    }, remainingTime);
  }

  // Masquer le preloader
  hide() {
    if (this.preloader) {
      this.preloader.classList.add("hidden");

      // Réactiver le scroll après l'animation
      setTimeout(() => {
        document.body.style.overflow = "";
        this.preloader.style.display = "none";
      }, 1200); // ← 1200ms = 1.2s (correspond au CSS)
    }
  }
}

// Initialiser au chargement de la page
window.addEventListener("DOMContentLoaded", () => {
  new PreloaderManager();
});

// Fallback : si le chargement prend plus de 10 secondes, forcer la fermeture
setTimeout(() => {
  const preloader = document.querySelector(".preloader");
  if (preloader && !preloader.classList.contains("hidden")) {
    console.warn("Preloader forcé à se fermer après 10 secondes");
    const manager = new PreloaderManager();
    manager.hide();
  }
}, 10000);
