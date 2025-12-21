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