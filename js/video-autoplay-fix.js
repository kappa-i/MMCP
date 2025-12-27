document.addEventListener('DOMContentLoaded', () => {
    const heroVideo = document.querySelector('#hero-video');
    
    if (!heroVideo) return;
    
    const playVideo = () => {
        heroVideo.play().catch(() => {
            setTimeout(() => heroVideo.play().catch(() => {}), 100);
        });
    };
    
    // Essayer dès que la vidéo est prête
    heroVideo.addEventListener('loadeddata', playVideo);
    
    // Forcer après le chargement complet
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (heroVideo.paused) playVideo();
        }, 500);
    });
    
    // Sur interaction utilisateur
    document.addEventListener('touchstart', playVideo, { once: true });
    document.addEventListener('scroll', playVideo, { once: true });
});